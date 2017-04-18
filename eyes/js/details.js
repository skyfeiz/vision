this.EE = this.EE || {};
(function(doc) {
	var Details = function() {
		this.c = new EE.Controller();

		this.pageTotal = 100;

		this.iNow = 1;

		this.ready();
	};

	var p = Details.prototype;

	p.ready = function() {
		var _this = this;

		_this.c.ready(function(region) {
			_this.region = region;
			_this.init();
		});
	};

	p.init = function() {
		var _this = this;
		_this.initDom();
		_this.baseEvent();

		_this.timeChoose();

		// _this.c.getChartConfig('', function(data) {
		// 	_this._config = data;
		// 	_this.changeData();
		// });

		_this.createCityList();

		_this.createPageList();

		_this.pageEvent();

		$(doc).trigger('click');

		_this.getData();
	};

	p.initDom = function() {
		// 时间轴的input隐藏域
		this.$startInput = $('#startinput');
		this.$endInput = $('#endinput');

		// 关键词
		this.$keyword1 = $('#keyword1');

		// 下拉框
		this.$droplist = $('.droplist');
		this.$dropbox = $('.dropbox');

		// 省下拉框
		this.$province = $('#province');
		this.$pInput = $('#pinput');
		// 省显示的文字
		this.$provinceText = $('#province').find('span');
		this.$provinceList = this.$province.find('.droplist');
		this.$provinceUl = this.$provinceList.find('ul');

		// 市下拉框
		this.$city = $('#city');
		this.$cInput = $('#cinput');
		// city显示的文字
		this.$cityText = $('#city').find('span');
		this.$cityList = this.$city.find('.droplist');
		this.$cityUl = this.$city.find('ul');

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
			htmlStr += '<li>' + (i + 1) + '</li>';
		}

		this.$pageList.html(htmlStr);
		this.$pageLi = this.$pageList.children();

		this.$pageLi.eq(0).addClass('active');
	};

	p.pageEvent = function() {
		var _this = this;
		var start = 1;

		_this.$pageList.on('click', 'li', function(ev) {
			var index = $(this).index();
			var html = $(this).html();

			getDistance(html);

		});

		_this.$prevpage.click(function() {
			_this.$pageList.find('.active').prev().trigger('click');
		});

		_this.$nextpage.click(function() {
			_this.$pageList.find('.active').next().trigger('click');
		});

		_this.$gotobtn.click(function() {
			var val = _this.$pagenum.val();
			if (!isNaN(Number(val))) {
				if (val >= 1 && val <= _this.pageTotal) {
					getDistance(Math.floor(val));
					_this.$pagenum.val('');
				}
			}
		});

		function numChange(html, n) {
			var add = start = start + n;
			_this.$pageLi.removeClass('active');
			_this.$pageLi.each(function(i, ele) {
				if (add == html) {
					$(ele).addClass('active');
				}
				$(ele).html(add++);
			});
		};

		function getDistance(html) {
			var n = html - start - 5;
			if (n < 0) {
				n = start > 1 - n ? n : 1 - start;
			}
			if (n > 0) {
				n = start < _this.pageTotal - 9 - n ? n : _this.pageTotal - 9 - start;
			}
			_this.iNow = html;
			numChange(html, n)
		};

	};

	p.getData = function() {
		var _this = this;
		this.c.getDetailsListData({
			type: 1, //类型(1,2,3,4,5)
			eventName: '', //名称	
			startTime: '', //时间段：开始时间
			endTime: '', //时间段：结束时间
			nowNo: '', //用户当前视角
			websiteName: '', //舆情来源
			mediaTypeC: '', //舆情媒体
			articleEmotio: '', //舆情情感类型(正中负)
			pages: '', //每页显示点条数
			rows: '' //页数
		}, function(result) {
			console.log(result);
			_this.createList(result.data);

		});
	};

	p.createList = function(data) {
		var htmlStr = '';
		for (var i = 0; i < 5; i++) {
			htmlStr += '<li>' + '<a href="javascript:;" class="atitle">' + data[i].articleTitle + '</a>' + '<p class="textinfo">' + '<a href="javascript:;">来源：' + data[i].articleSource + '</a>' + '<a href="javascript:;">用户：' + data[i].articleAuthor + '</a>' + '<a>发布时间：' + data[i].articlePubtime + '</a>' + '<a href="' + data[i].articleUrl + '">' + data[i].articleUrl + '</a>' + '</p>' + '<span class="textline"></span>' + '<p class="listcontent">' + data[i].articleAbstract + '</p>' + '</li>';
		}
		this.$ullist.html(htmlStr);
	};

	p.baseEvent = function() {

		var _this = this;

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
			ev.stopPropagation();
		});

		_this.$provinceList.on('click', 'ul li', function(ev) {
			var json = {
				'data-name': $(this).attr('data-name'),
				'data-id': $(this).attr('data-id')
			}

			_this.$pInput.val(name).attr(json);

			json.title = json['data-name'];
			_this.$provinceText.attr(json);

			_this.createThisCity(json['data-id']);

			ev.stopPropagation();
		});

		_this.$cityList.on('click', 'ul li', function(ev) {
			var json = {
				'data-name': $(this).attr('data-name'),
				'data-id': $(this).attr('data-id')
			}

			_this.$cInput.val(name).attr(json);

			json.title = json['data-name'];
			_this.$cityText.attr(json)

			ev.stopPropagation();
		});

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
				console.log(datas);
				end.min = datas; //开始日选好后，重置结束日的最小日期
				end.start = datas //将结束日的初始值设定为开始日
				_this.$startInput.val(datas);
			}
		};
		var end = {
			elem: '#end',
			min: laydate.now(),
			istoday: false,
			choose: function(datas) {
				start.max = datas; //结束日选好后，重置开始日的最大日期
				_this.$endInput.val(datas);
			}
		};

		laydate(start);
		laydate(end);
	};

	p.createCityList = function() {
		// 判断权限显示城市列表
		this.province = province;
		var arr = this.region.split('_');
		switch (arr.length) {
			case 1:
				// 全国权限	，都可以选择  省下拉框默认为全国
				this.createProvince();
				this.createThisCity();
				break;
			case 2:
				this.$province.attr('silent', 'yes');
				// 省级权限 ，只能选择当前省的城市名
				this.createProvince(this.region);
				this.createThisCity(this.region);
				break;
			case 3:
				this.$city.attr('silent', 'yes');
				// 市级权限 ，只显示城市， 下拉框不能点开
				break;
		};
	};

	// 获取当前省的所有市
	p.createThisCity = function(id) {
		this.$cityText.html('请选择');
		var json = {};
		var n = 0;
		if (id) {
			json = this.province[id].sub;
		} else {
			for (var item in this.province) {
				json = $.extend({}, json, this.province[item].sub);
			}
		}
		var strHtml = '';
		for (var item in json) {
			n++;
			strHtml += '<li data-id="' + json[item].id + '" data-name="' + json[item].name + '" data-pid="' + json[item].pid + '" data-pname="' + json[item].pname + '" title="' + json[item].name + '">' + json[item].name + '</li>';
		}


		this.$cityList.html('<ul style="height:' + 24 * n + 'px;">' + strHtml + '</ul>');

		this.$cityList.buildScrollBar();

	};

	// 根据权限来
	p.createProvince = function(id) {
		var province = this.province;
		var strHtml = '';
		if (id) {
			strHtml += '<li data-id="' + id + '" data-name="' + province[id].name + '" title="' + province[id].name + '">' + province[id].name + '</li>';
			this.$provinceText.html(province[id].name).attr('title', province[id].name);
			this.$provinceText.attr({
				'data-id': id,
				'data-name': province[id].name
			});
		} else {
			for (var item in province) {
				strHtml += '<li data-id="' + province[item].id + '" data-name="' + province[item].name + '" title="' + province[item].name + '">' + province[item].name + '</li>'
			}
		}
		this.$provinceUl.html(strHtml);
		this.$provinceList.buildScrollBar();
	};

	/*p.changeData = function() {
		var _this = this;
	};*/

	EE.Details = Details;
})(document);