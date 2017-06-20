this.EE = this.EE || {};
(function(doc) {
	var Details = function() {
		this.c = new EE.Controller();

		this.sTime = '';
		this.eTime = '';
		
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
		// 页码点击事件的开关
		this.bStop = false;
		// 判定点击的是大搜索框按钮，还是筛选按钮
		this.sStr = '';
		// 情感初始化为全部 ''
		this.emotion = '';

		this.ready();
	};

	var p = Details.prototype;

	p.ready = function() {
		var _this = this;
		//region 权限  regin视角
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

		// 情感
		this.$emotion = $('#emotion');

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
		// 首页
		this.$firstpage = $('#firstpage');
		//尾页
		this.$lastpage = $('#lastpage');
		// 下一页
		this.$nextpage = $("#nextpage");
		this.$prevpage = $("#prevpage");

		this.$totalnum = $("#totalnum");

		this.$gotopage = $("#gotopage");
		// input 输入框
		this.$pagenum = $("#pagenum");
		// 跳转按钮
		this.$gotobtn = $("#gotobtn");

		//弹出框
		this.$dialogbox = $('#dialogbox');
		this.$diacontent = $('#diacontent');
		this.$diabtn = $('#diabtn');
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
			if (_this.bStop) {return;}
			var index = $(this).index();
			var html = $(this).html();
			if (!$(this).hasClass('active')) {
				getDistance(html);
			}
		});

		_this.$firstpage.click(function(){
			getDistance(1);
		});

		_this.$lastpage.click(function(){
			getDistance(_this.pageTotal);
		});

		_this.$prevpage.click(function() {
			_this.$pageList.find('.active').prev().trigger('click');
		});

		_this.$nextpage.click(function() {
			_this.$pageList.find('.active').next().trigger('click');
		});

		_this.$pagenum.on('keypress',function(ev){
			if (ev.keyCode == 13) {
				_this.$gotobtn.trigger('click');
			}
		})

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
				if (n<0) {
					n = 0;
				}
			}
			_this.iNow = html;
			numChange(html, n)
		};

	};


	p.getListData = function() {
		var _this = this;
		_this.bStop = true;
		_this.sTime = _this.$start.html() || _this.sTime;
		_this.eTime = _this.$end.html() || _this.eTime;
		if (_this.area1 == '') {
			_this.setAreaById(_this.region);
		}
		console.log(_this.region);
		this.c.getDetailsListData({
			keyWord: _this.eventName, //名称	
			startTime: _this.sTime, //时间段：开始时间
			// startTime: '2017-05-01', //时间段：开始时间
			endTime:_this.eTime, //时间段：结束时间
			// endTime: '2017-05-18', //时间段：结束时间
			primaryClassification: _this.word1,
			twoStageClassification: _this.word2,
			province: _this.area1!='101'?_this.area1:'',
			city: _this.area2,
			pages: '5', //每页显示点条数
			pageNumber: _this.iNow, //页数
			articleEmotion:_this.emotion, 	//情感类型 1-，0，1，''
			region:_this.region!='101'?_this.region:''
		}, function(result) {
			var str = '';
			if (result.leader) {
				var item = result.leader;
				var reg = new RegExp(item.name,'g');
				str += '<li class="leaderli">'
                    +'<img src="'+item.img+'" alt="" />'
                    +'<div class="infobox">'
                    +    '<p class="leaderinfo"><a onClick="util.jumpUrl(\''+item.jumpUrl+'\')">'+item.name+'</a> '+(item.position||'')+'</p>'
                    +    '<p class="leaderdetails">'+item.briefIntroduction.replace(reg,'<a onClick="util.jumpUrl(\''+item.jumpUrl+'\')">'+item.name+'</a>')+'</p>'
                    +	 '<p class="leaderaddress clearfix">'
                    +	 	'<span class="leaderphone fl">电话 : '+(item.telephone || '')+'</span>'
                    +	 	(item.address!=undefined?('<span class="leaderin fl">办公地点 : '+item.address+'</span>'):'')
                    +	 '</p>'
                    +'</div>'
                +'</li>';
			}
			// return;
			_this.bStop = false;
			_this.createList(result.data,str);
			_this.$resultnum.html(result.total);
			var number = Math.ceil(result.total / 5) || 0;
			_this.pageTotal = number;
			_this.$totalnum.html('共 <b>' + number + '</b> 页');
			_this.createPageList(str);
		});
	};

	p.createList = function(data,str) {
		var htmlStr = str || '';
		var lenLimit = 5;
		if (htmlStr !== '') {
			lenLimit = 3;
		}
		if (data instanceof Object && data.length) {
			for (var i = 0; i < data.length; i++) {
				if (i == lenLimit) {break;}
				var urlArr = data[i].articleUrl.split('?');
				var content = data[i].articleAbstract || '';
				content = content.trim();
				if (content.length > 190) {
					content = content.substring(0,190);
					var nLast = content.lastIndexOf('。');
					if (nLast != -1) {
						content = content.substring(0, nLast+1);
					}
				}
				htmlStr += '<li>' + '<a onClick="util.jumpUrl(\''+data[i].articleUrl+'\')" class="atitle">' + data[i].articleTitle.replace(/\<BR\/\>/,' ') + '</a>' + '<p class="textinfo">'+(data[i].articleSource==undefined?'':('<a href="javascript:;">来源：' + data[i].articleSource + '</a>') )+(data[i].articleAuthor==undefined?'':('<a href="javascript:;">用户：' + data[i].articleAuthor + '</a>')) + '<a>发布时间：' + data[i].articlePubtime + '</a>' + '<a class="hashref" onClick="util.jumpUrl(\''+data[i].articleUrl+'\')">' + urlArr[0] + '</a>' + '</p>' + '<span class="textline"></span>' + '<p class="listcontent">' + content + '</p>' + '</li>';
			}
		}else{
			switch(this.sStr ){
				case '筛选':
					htmlStr += '<li class="noInfo">没有筛选出您要查看的文章列表，请重新修改筛选条件</li>';
					break;
				default:
					htmlStr += '<li class="noInfo">没有搜到相关舆情信息</li>';
					break;
			}
			console.warn('返回的数据data: '+data+' 不是数组或者数据为空');
		}
		this.$ullist.html(htmlStr);
	};

	p.baseEvent = function() {

		var _this = this;
		// 大搜索框
		_this.$search.click(function() {
			if (_this.bStop) {return;}
			_this.sStr = '搜索';
			var val = _this.$wordinput.val().trim();
			_this.eventName = val;
			_this.iNow = 1;
			_this.startNum = 1;
			_this.nIndex = 0;
			if (val != '') {
				_this.$keyword1.find('.textname').html('请选择');
				_this.$keyword2.find('.textname').html('请选择');
				_this.$emotion.find('.textname').html('请选择');
				$('#start').html('');
				$('#end').html('');
				_this.sTime = _this.eTime = '';
				_this.creatrWord2('无');
				_this.emotion = '';
				_this.$provinceList.find('li').eq(0).trigger('click');
				_this.setAreaById(_this.region);
				_this.getListData();
			}else{
				alert('请输入要搜索的词');
			}
		})

		_this.$wordinput.on('keypress',function(ev){
			if (ev.keyCode == 13) {
				_this.$search.trigger('click');
			}
		})

		_this.$submsg.click(function() {
			if (_this.bStop) {return;}
			var val = _this.$wordinput.val().trim();
			if (val == '') {
				alert('请输入要搜索的词');
				return;
			}
			_this.eventName = val;
			_this.sStr = '筛选';
			_this.iNow = 1;
			_this.startNum = 1;
			_this.nIndex = 0;
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
			var provinceId = $(this).attr('data-id');
			var json = {
				'data-name': $(this).attr('title'),
				'data-id': provinceId
			}

			_this.$provinceText.attr(json);
			if ( provinceId == 101) {
				provinceId = '';
				bAll = true;
			}
			_this.area1 = provinceId;
			json.title = json['data-name'];
			_this.createCity(provinceId,bAll);

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

		_this.$emotion.on('click','ul li',function(ev){
			_this.emotion = $(this).attr('data-id');
			ev.stopPropagation();
		})

		$(doc).click(function() {
			_this.$droplist.hide();
		});


		//列表点击 显示弹出框
		_this.$ullist.on('click','.leaderdetails',function(ev){
			ev.stopPropagation();
			var height = $(this).height();
			if (height<90) {
				return;
			}
			var html = $(this).html();
			_this.$diacontent.html(html);
			_this.$dialogbox.show();
 	
		});
		_this.$diabtn.click(function(ev){
			_this.$dialogbox.hide();
			ev.stopPropagation();
		});
		$(doc).on('keypress',function(ev){
			if (ev.keyCode == 13) {
				_this.$diabtn.trigger('click');
			}
		});
	};

	p.timeChoose = function() {
		var _this = this;
		$('#start').html(_this.sTime||'');
		$('#end').html(_this.eTime||'');
		var start = {
			elem: '#start',
			max: '2099-06-16 23:59:59', //最大日期
			start:_this.sTime||'',
			istoday: false,
			choose: function(datas) {
				end.min = datas; //开始日选好后，重置结束日的最小日期
				end.start = datas //将结束日的初始值设定为开始日
			}
		};
		var end = {
			elem: '#end',
			min: laydate.now(),
			start:_this.eTime||'',
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
			//判断视角 显示视角
			if (_this.regin) {
				var arr =  _this.regin.split('_');
				switch(arr.length){
					case 3:
						_this.$province.find('li[data-id="'+arr[0]+'_'+arr[1]+'"]').trigger('click');
						_this.$city.find('.textname').html(_this.getAreaName(_this.regin));
						break;
					default:
						_this.$province.find('li[data-id="'+_this.regin+'"]').trigger('click');
						break;
				}
			}
		});
	};

	p.createWord1 = function() {
		var data = this.wordData;
		var nLis = 1;
		var htmlStr = '<ul><li data-id="">全部</li>';
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
		if (id!='') {
			nLis++;
			htmlStr = '<ul><li data-id="">全部</li>';
		}
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
		this.word2 = '';
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
		}
		htmlStr += '</ul>';
		var $obj = this.$province.find('.droplist');
		$obj.html(htmlStr);
		$obj.find('ul').css('height',24*nLis);
		$obj.buildScrollBar();
		if (nLis == 1) {
			$obj.find('li').eq(0).trigger('click');
			this.$province.attr('silent','yes');
		}else{
			this.$province.attr('silent','no');
		}
	};

	p.createCity = function(id,allCity) {
		var data = this.areaData;
		var htmlStr = '<ul><li data-id="">全部</li>';
		var nLis = 1;
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
		if (this.region.split('_').length == 3) {
			$obj.find('li').eq(1).trigger('click');
			this.$city.attr('silent','yes');
		}else{
			this.$city.attr('silent','no');
			this.$city.find('span').html('请选择');
			this.area2 = '';
		}
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
		var href = decodeURI(window.location.href);
		var arr = search.split('&');	

		if (!arr.length) {
			return;
		}

		var json = {}
		for (var i = 0; i < arr.length; i++) {
			var item = arr[i].split('=');
			json[item[0]] = item[1];
		}
		this.eventName = json.eventName.replace(/\[\~%23\~\]/g,'#');
		if (json.emotion == 2) {
			json.emotion ='';
		}
		this.emotion = json.emotion;
		if (this.emotion!== undefined) {
			var str = '';
			switch(this.emotion){
				case '1':
					str = '正面';
					break;
				case '0':
					str = '中立';
					break;
				case '-1':
					str = '负面';
					break;
				default:
					str = '全部';
					break;
			}
			$('#emotion .textname').html(str);
		}
		if (json.regin) {
			//视角
			this.regin = json.regin;
			// 判断视角为省还是市
			this.setAreaById(this.regin);
		}

		this.sTime = json.startDate;
		this.eTime = json.endDate;
	};

	//通过id设置 筛选条件
	p.setAreaById = function(id){
		if (id == '101') {
			id = '';
		};
		var arr = id.split('_');
		if (arr.length == 3) {
			this.area2 = id;
			this.area1 = arr[0]+'_'+arr[1];
		}else{
			this.area1 = id;
		}
	};

	// 根据id获取name; 是否简写
	p.getAreaName = function(id,isSimple){
		var arr = id.split('_');
		switch(arr.length){
			case 1:
				return isSimple?'country':"全国";
				break;
			case 2:
				return isSimple?'province':province[id].name;
				break;
			case 3:
				return isSimple?'city':(province[arr[0]+'_'+arr[1]].sub[id].name);
				break;
			default :
				console.log('城市id:'+id+',不正确');
				break;
		}
	};

	EE.Details = Details;
})(document);