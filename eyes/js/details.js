this.EE = this.EE || {};
(function(doc) {
	var Details = function() {
		this.c = new EE.Controller();
		
		this.word1 = '';
		this.word2 = '';

		this.area1 = '';
		this.area2 = '';
		// 总页数
		this.pageTotal = 0;
		// 当前页码
		this.iNow = 1;
		// 当前起始页码  第一个li的值
		this.startNum = 1;
		// 选中的li的索引
		this.nIndex = 0;

		this.ready();
	};

	var p = Details.prototype;

	p.ready = function() {
		var _this = this;

		_this.c.ready(function(region) {
			_this.region = region;
			_this.getStatus();
			_this.init();
			if (_this.eventName !== undefined) {
				_this.$wordinput.val(_this.eventName);
			}
		});
	};

	p.init = function() {
		this.initDom();
		this.baseEvent();

		this.timeChoose();

		this.pageEvent();

		$(doc).trigger('click');

		this.getListData();

		this.getWordsData();

		this.getAreaData();
	};

	p.initDom = function() {
		// 大输入框
		this.$wordinput = $('#wordinput');
		this.$search = $('#wordsearch');


		// 时间选择
		this.$start = $('#start');
		this.$end = $('#end');

		// 关键词
		this.$keyword1 = $('#keyword1');
		this.$keyword2 = $('#keyword2');

		// 下拉框
		this.$droplist = $('.droplist');
		this.$dropbox = $('.dropbox');

		// 省下拉框
		this.$province = $('#province');
		// 省显示的文字
		this.$provinceText = $('#province').find('span');
		this.$provinceList = this.$province.find('.droplist');
		this.$provinceUl = this.$provinceList.find('ul');

		// 市下拉框
		this.$city = $('#city');
		// city显示的文字
		this.$cityText = $('#city').find('span');
		this.$cityList = this.$city.find('.droplist');
		this.$cityUl = this.$city.find('ul');

		// 提交筛选按钮
		this.$submsg = $("#submsg");

		//找到相关结果总数 
		this.$resultnum = $('#resultnum');

		// 内容列表
		this.$ullist = $('#ullist');

		// ul 页码列表
		this.$pageList = $("#pagelist");
		// 下一页
		this.$nextpage = $("#nextpage");
		this.$prevpage = $("#prevpage");

		this.$totalnum = $("#totalnum");

		this.$gotopage = $("#gotopage");
		// input 输入框
		this.$pagenum = $("#pagenum");
		// 跳转按钮
		this.$gotobtn = $("#gotobtn");

	};

	p.createPageList = function() {
		var htmlStr = '';
		var n = this.pageTotal > 10 ? 10 : this.pageTotal;

		for (var i = 0; i < n; i++) {
			htmlStr += '<li>' + (i + this.startNum) + '</li>';
		}

		this.$pageList.html(htmlStr);
		this.$pageLi = this.$pageList.children();

		this.$pageLi.eq(this.nIndex).addClass('active');
	};

	p.pageEvent = function() {
		var _this = this;

		_this.$pageList.on('click', 'li', function(ev) {
			var index = $(this).index();
			var html = $(this).html();
			if (!$(this).hasClass('active')) {
				getDistance(html);
			}
		});

		_this.$prevpage.click(function() {
			_this.$pageList.find('.active').prev().trigger('click');
		});

		_this.$nextpage.click(function() {
			_this.$pageList.find('.active').next().trigger('click');
		});

		_this.$gotobtn.click(function() {
			var val = _this.$pagenum.val();
			if (!isNaN(Number(val)) && val != _this.iNow) {
				if (val >= 1 && val <= _this.pageTotal) {
					getDistance(Math.floor(val));
					_this.$pagenum.val('');
				}
			}
		});

		function numChange(html, n) {
			_this.nIndex = 0;
			var add = _this.startNum = _this.startNum + n;
			var iii = 0;
			_this.$pageLi.removeClass('active');
			_this.$pageLi.each(function(i, ele) {
				if (add == html) {
					$(ele).addClass('active');
					_this.nIndex = iii;
				}
				iii++
				$(ele).html(add++);
			});
			// 获取列表数据生成列表
			_this.getListData();
		};

		function getDistance(html) {
			var n = html - _this.startNum - 5;
			if (n < 0) {
				n = _this.startNum > 1 - n ? n : 1 - _this.startNum;
			}
			if (n > 0) {
				n = _this.startNum < _this.pageTotal - 9 - n ? n : _this.pageTotal - 9 - _this.startNum;
			}
			_this.iNow = html;
			numChange(html, n)
		};

	};


	p.getListData = function() {
		var _this = this;
		this.c.getDetailsListData({
			keyWord: _this.eventName, //名称	
			startTime: _this.$start.html(), //时间段：开始时间
			// startTime: '2017-05-01', //时间段：开始时间
			endTime: _this.$end.html(), //时间段：结束时间
			// endTime: '2017-05-18', //时间段：结束时间
			primaryClassification: _this.word1,
			twoStageClassification: _this.word2,
			province: _this.area1,
			city: _this.area2,
			pages: '5', //每页显示点条数
			pageNumber: _this.iNow //页数
		}, function(result) {
			_this.createList(result.data);
			_this.$resultnum.html(result.total);
			var number = Math.ceil(result.total / 5) || 0;
			_this.pageTotal = number;
			_this.$totalnum.html('共 ' + number + ' 页');
			_this.createPageList();
		});
	};

	p.createList = function(data) {
		var htmlStr = '';
		if (data instanceof Object && data.length) {
			for (var i = 0; i < data.length; i++) {
				var urlArr = data[i].articleUrl.split('?');
				var content = data[i].articleAbstract;
				if (content.length > 200) {
					content = content.substring(0, 200) + '...';
				}
				htmlStr += '<li>' + '<a href="' + data[i].articleUrl + '" class="atitle">' + data[i].articleTitle + '</a>' + '<p class="textinfo">' + '<a href="javascript:;">来源：' + data[i].articleSource + '</a>' + '<a href="javascript:;">用户：' + data[i].articleAuthor + '</a>' + '<a>发布时间：' + data[i].articlePubtime + '</a>' + '<a class="hashref" href="' + data[i].articleUrl + '">' + urlArr[0] + '</a>' + '</p>' + '<span class="textline"></span>' + '<p class="listcontent">' + content + '</p>' + '</li>';
			}
		}else{
			console.warn('返回的数据data: '+data+' 不是数组或者数据为空');
		}
		this.$ullist.html(htmlStr);
	};

	p.baseEvent = function() {

		var _this = this;
		// 大搜索框
		_this.$search.click(function() {
			var val = _this.$wordinput.val();
			_this.eventName = val;
			_this.iNow = 1;
			_this.startNum = 1;
			_this.nIndex = 0;
			if (val != '') {
				_this.getListData();
			}
		})

		_this.$submsg.click(function() {
			_this.getListData();
		})

		// 所有的下拉框点显示隐藏事件
		_this.$dropbox.click(function(ev) {

			var silent = $(this).attr('silent');
			if (silent == 'yes') {
				return
			}
			_this.$droplist.hide();
			$(this).find('.droplist').show();
			ev.stopPropagation();
		});

		// 所有的下拉框的选择事件
		_this.$droplist.on('click', 'ul li', function(ev) {
			var str = $(this).html();
			var $oPar = $(this).parents('.dropbox');
			$oPar.find('span').html(str);
			$oPar.find('.droplist').hide();
			// ev.stopPropagation();
		});

		_this.$provinceList.on('click', 'ul li', function(ev) {
			var bAll = false;
			var json = {
				'data-name': $(this).attr('title'),
				'data-id': $(this).attr('data-id')
			}

			json.title = json['data-name'];
			_this.area1 = json['data-id'];
			_this.$provinceText.attr(json);
			if (json['data-id'] == 101) {
				bAll = true;
			}
			_this.createCity(json['data-id'],bAll);

			ev.stopPropagation();
		});

		_this.$cityList.on('click', 'ul li', function(ev) {
			var json = {
				'data-name': $(this).attr('data-name'),
				'data-id': $(this).attr('data-id')
			}
			_this.area2 = json['data-id'];
			json.title = json['data-name'];
			_this.$cityText.attr(json);

			ev.stopPropagation();
		});

		_this.$keyword1.on('click', 'ul li', function(ev) {
			var id = $(this).attr('data-id');
			_this.word1 = id;
			_this.creatrWord2(id);
			ev.stopPropagation();
		})

		_this.$keyword2.on('click', 'ul li', function(ev) {
			_this.word2 = $(this).attr('data-id');
			ev.stopPropagation();
		})

		$(doc).click(function() {
			_this.$droplist.hide();
		});
	};

	p.timeChoose = function() {
		var _this = this;
		var start = {
			elem: '#start',
			max: '2099-06-16 23:59:59', //最大日期
			istoday: false,
			choose: function(datas) {
				end.min = datas; //开始日选好后，重置结束日的最小日期
				end.start = datas //将结束日的初始值设定为开始日
			}
		};
		var end = {
			elem: '#end',
			min: laydate.now(),
			istoday: false,
			choose: function(datas) {
				start.max = datas; //结束日选好后，重置开始日的最大日期
			}
		};

		laydate(start);
		laydate(end);
	};

	p.getWordsData = function() {
		var _this = this;
		_this.c.getWordsData({

		}, function(result) {
			_this.wordData = _this.data2Relation(result.data, 'parentSubjectCategoryId', 'subjectCategoryId',0);
			_this.createWord1();
		});
	};

	p.getAreaData = function() {
		var _this = this;
		_this.c.getAreaData({

		}, function(result) {
			_this.areaData = _this.data2Relation(result.data, 'C0014_ORG_UPID', 'C0014_ORG_NO',101);
			for (var i = 0; i < result.data.length; i++) {
				if (result.data[i].C0014_ORG_LEVEL_TYPE == 0) {
					_this.areaData.unshift({
						 C0014_ORG_LEVEL_TYPE:1,
						 C0014_ORG_NAME:'全国',
						 C0014_ORG_NO:101,
						 C0014_ORG_UPID:0
					})
					break;
				}
			}
			_this.createProvince();
		});
	};

	p.createWord1 = function() {
		var data = this.wordData;
		var nLis = 0;
		var htmlStr = '<ul>';
		for (var i = 0; i < data.length; i++) {
			if (data[i].parentSubjectCategoryId == 0) {
				nLis++;
				htmlStr += '<li data-id="' + data[i].subjectCategoryId + '" title="' + data[i].subjectCategoryName + '">' + data[i].subjectCategoryName + '</li>';
			}
		}
		htmlStr += '</ul>';

		var $obj = this.$keyword1.find('.droplist');
		$obj.html(htmlStr);
		$obj.find('ul').css('height',24*nLis);
		$obj.buildScrollBar();
	};

	// 根据父级id获取子集的关键词
	p.creatrWord2 = function(id) {
		var data = this.wordData;
		var nLis = 0;
		var htmlStr = '<ul>';
		for (var i = 0; i < data.length; i++) {
			if (data[i].subjectCategoryId == id) {
				for (var j = 0; j < data[i].sub.length; j++) {
					nLis++;
					htmlStr += '<li data-id="' + data[i].sub[j].subjectCategoryId + '" title="' + data[i].sub[j].subjectCategoryName + '">' + data[i].sub[j].subjectCategoryName + '</li>';
				}
			}
		}
		htmlStr += '</ul>';
		var $obj = this.$keyword2.find('.droplist');
		$obj.html(htmlStr);
		$obj.find('ul').css('height',24*nLis);
		$obj.buildScrollBar();
		this.area2 = '';
		this.$keyword2.find('span').html('请选择');
	};

	p.createProvince = function() {
		var data = this.areaData;
		var htmlStr = '<ul>';
		var nLis = 0; 
		for (var i = 0; i < data.length; i++) {
			if (data[i].C0014_ORG_LEVEL_TYPE == 1 ) {
				nLis++;
				htmlStr += '<li data-id="' + data[i].C0014_ORG_NO + '" title="' + data[i].C0014_ORG_NAME + '">' + data[i].C0014_ORG_NAME + '</li>';
			}
			if (data[i].C0014_ORG_LEVEL_TYPE == 0) {
				isAll = true;
			}

		}
		htmlStr += '</ul>';
		var $obj = this.$province.find('.droplist');
		$obj.html(htmlStr);
		$obj.find('ul').css('height',24*nLis);
		$obj.buildScrollBar();
	};

	p.createCity = function(id,allCity) {
		var data = this.areaData;
		var htmlStr = '<ul>';
		var nLis = 0;
		for (var i = 0; i < data.length; i++) {
			if (allCity) {
				if (data[i].sub){
					for (var j = 0; j < data[i].sub.length; j++) {
						nLis++;
						htmlStr += '<li data-id="' + data[i].sub[j].C0014_ORG_NO + '" title="' + data[i].sub[j].C0014_ORG_NAME + '">' + data[i].sub[j].C0014_ORG_NAME + '</li>';
					}
				}
				
			}else{
				if (data[i].C0014_ORG_NO == id) {
					for (var j = 0; j < data[i].sub.length; j++) {
						nLis++
						htmlStr += '<li data-id="' + data[i].sub[j].C0014_ORG_NO + '" title="' + data[i].sub[j].C0014_ORG_NAME + '">' + data[i].sub[j].C0014_ORG_NAME + '</li>';
					}
				}
			}
			
		}
		htmlStr += '</ul>';
		var $obj = this.$city.find('.droplist');
		$obj.html(htmlStr);
		$obj.find('ul').css('height',24*nLis);
		$obj.buildScrollBar();
		this.$city.find('span').html('请选择');
	};

	p.data2Relation = function(data, pIdName, idName ,noPid) {
		var arr = [];
		for (var i = 0; i < data.length; i++) {
			if (data[i][pIdName] == noPid) {
				var json = {};
				json = data[i];
				json.sub = [];
				for (var j = 0; j < data.length; j++) {
					if (data[j][pIdName] == data[i][idName]) {
						json.sub.push(data[j]);
					}
				}
				arr.push(json)
			}

		}
		return arr;
	}

	/*p.changeData = function() {
		var _this = this;
	};*/

	p.getStatus = function() {
		var search = decodeURI(window.location.search).substring(1);
		var arr = search.split('&');

		if (!arr.length) {
			return;
		}

		var json = {}
		for (var i = 0; i < arr.length; i++) {
			var item = arr[i].split('=');
			json[item[0]] = item[1];
		}


		this.eventId = json.eventId;
		this.eventName = json.eventName;

	};

	EE.Details = Details;
})(document);