this.EE = this.EE || {};
(function(win, doc) {
	var hostUrl = "http://" + win.location.host + "/eems/eyes/"; 
	// var hostUrl = "http://" + win.location.host + "/eems/sys/jsp/eyes/"; 

	var Micro = function() {
		this.c = new EE.Controller();

		this._mapKIdVChart = {};

		this.eventNum = 5;

		this.rankNum = 8;

		// 评论条数
		this.commentNum = 10;

		this.emotion = 2;
		this.startDate = '2008-08-08';

		// 默认为 微博 1
		this.sourceType = 1;
		this.type = 1;

		this.t = 0;
		this.bAuto = false;
		this.auTimer = null;

		this.nRandom = new Date().getTime();

		this.ready();
	};

	var p = Micro.prototype;

	p.ready = function() {
		var _this = this;
		_this.c.ready(function(region) {
			_this.region = region;
			_this.c.getNowTime({},function(result){
				console.log("系统时间: "+result);
				_this.endDate = result;
				_this.init();
				_this.initDom();
				_this.baseEvent();
			});
		});
	};

	p.init = function() {
		var _this = this;
		_this.t = new WbstChart.TimeLine(_this.startDate,_this.endDate);
		_this.t.silent = true;

		_this.c.getChartConfig('', function(data) {
			_this._config = data;
			_this.initChart();
			// $(document).trigger('mouseup');
			$('.timebtns').find('li').eq(1).trigger('click');
		});

		_this.t.toChange = function(json) {
			_this.date = json.startDate;
			_this.type = json.type;
			_this.nRandom = new Date().getTime();
			_this._micro8.EventDispatcher.trigger('click', {type:'全部'});
			_this.changeData();
		};
	};

	p.initDom = function() {

		this.$op = $('#tooltip');

		this.$medias = $('#mediabox span');

		this.$micro7 = $('#micro7');
		this.$commentUl = $('#commentUl');

		this.$noData5 = $('#noData5');
		this.$noData7 = $('#noData7');
		this.$noData9 = $('#noData9');
	};

	p.initChart = function() {
		var _this = this;
		// 舆情头条 chart4
		_this._micro4 = new WbstChart.Chart4(doc.getElementById('micro4'));
		_this._micro4.setConfig(_this._config.micro4.config);
		_this._mapKIdVChart['micro4'] = _this._micro4;

		_this._micro4.EventDispatcher.on('click', function(evt, item) {
			// 需要的参数 事件id，视角，视角区域id，情感
			return;
			win.location.href = encodeURI(hostUrl + 'anreport.html?eventId=' + item + '&emotion=' + _this.emotion);

		});

		// 舆情走势 chart6
		_this._micro6 = new WbstChart.Chart6(doc.getElementById('micro6'));
		_this._micro6.setConfig(_this._config.micro6.config);
		_this._mapKIdVChart['micro6'] = _this._micro6;
		_this._micro6.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<p class="tooltiptext"><span class="valuename">' + (_this.type==1?item.item.seriesName.replace(/日/,'时'):item.item.seriesName) + ' :</span><span class="valuenum">' + item.item.xAxisValue + '</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this._micro6.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});

		// 来源媒体分布 chart8
		_this._micro8 = new WbstChart.Chart8(doc.getElementById('micro8'));
		_this._micro8.setConfig(_this._config.micro8.config);
		_this._mapKIdVChart['micro8'] = _this._micro8;
		_this._micro8.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<p class="tooltiptext"><span class="valuenum">' + item.item.xAxisValue + '</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this._micro8.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});
		_this._micro8.EventDispatcher.on('click', function(evt, item) {
			var str = item.name;
			switch (str) {
				case '正方':
				case '正面':
					_this.emotion = 1;
					break;
				case '中立':
					_this.emotion = 0;
					break;
				case '负方':
				case '负面':
					_this.emotion = -1;
					break;
				default:
					_this.emotion = 2;
					break;
			}

			_this.changeData2();
		});

		// 词云 chart9
		_this._micro9 = new WbstChart.Chart9(doc.getElementById('micro9'));
		_this._micro9.setConfig(_this._config.micro9.config);
		_this._mapKIdVChart['micro9'] = _this._micro9;
		_this._micro9.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<p class="tooltiptext"><span class="valuenum">' + item.item.xAxisValue + '</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this._micro9.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});

		_this._micro9.EventDispatcher.on('click', function(evt, item) {
			// win.location.href = encodeURI(hostUrl + 'details.html?type=4&eventName=' + item + '&emotion=' + _this.emotion);
		});



		// 事件省份排名 chart5
		_this._micro5 = new WbstChart.Bar3d(doc.getElementById('micro5'));
		_this._micro5.setConfig(_this._config.micro5.config);
		_this._mapKIdVChart['micro5'] = _this._micro5;
		_this._micro5.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<div class="tooltip_left3">' +
				'<p class="blockyellow">' + item.item.seriesName + '</p>' +
				'<p class="tooltiptext">' + item.item.xAxisValue +
				'<span class="fffpoint_lt"></span>' +
				'<span class="fffpoint_rb"></span>' +
				'</p>' +
				'</div>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this._micro5.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});
	};

	p.changeData = function() {
		var _this = this;

		// 情感类型 请求数据
		_this.c.getMicro8Data({
			sourceType:_this.sourceType,
			dateType: _this.type,
			date: _this.date,
			batchFlag: _this.nRandom
		}, function(result) {
			console.log("刷新情感类型");
			_this._mapKIdVChart['micro8'].setDataProvider(result.data);
		});

		// 词云 请求数据
		_this.c.getMicro9Data({
			sourceType:_this.sourceType,
			num: 30,
			dateType: _this.type,
			date: _this.date,
			// articleEmotion: _this.emotion,
			batchFlag: _this.nRandom
		}, function(result) {
			_this.$noData9.show();
			_this._mapKIdVChart['micro9'].setDataProvider(result.data);
			if (result.data && result.data.length) {
				_this.$noData9.hide();
			}
		});

		// 发热度排名 请求数据
		_this.c.getMicro5Data({
			sourceType:_this.sourceType,
			dateType: _this.type,
			date: _this.date,
			articleEmotion: _this.emotion,
			num: _this.rankNum,
			batchFlag: _this.nRandom
		}, function(result) {
			_this.$noData5.show();
			_this._mapKIdVChart['micro5'].setDataProvider(result.data);
			if (result.data && result.data.length) {
				_this.$noData5.hide();
			}
		});

		// _this.changeData2();  // 触发了点击情感事件  从而 执行 changeData2
	};

	p.changeData2 = function() {
		var _this = this;

		// 头条 请求数据
		_this.c.getMicro4Data({
			sourceType:_this.sourceType,
			dateType: _this.type,
			date: _this.date,
			articleEmotion: _this.emotion,
			batchFlag: _this.nRandom
		}, function(result) {
			_this._mapKIdVChart['micro4'].setDataProvider(result.data);
		});

		

		// 走势曲线 请求数据
		_this.c.getMicro6Data({
			sourceType:_this.sourceType,
			dateType: _this.type,
			date: _this.date,
			articleEmotion: _this.emotion,
			batchFlag: _this.nRandom
		}, function(result) {
			_this._mapKIdVChart['micro6'].setDataProvider(result.data);
		});

		// 用户评论 请求数据
		_this.c.getMicro7Data({
			sourceType:_this.sourceType,
			dateType: _this.type,
			date: _this.date,
			num: _this.commentNum,
			articleEmotion: _this.emotion,
			batchFlag: _this.nRandom
		}, function(result) {
			_this.$noData7.show();
			_this.createComment(result.data);
			if (result.data && result.data.length) {
				_this.$noData7.hide();
			}
		});
	};

	p.baseEvent = function() {
		var _this = this;
		var	isBlog = _this.getCookie('microBlog');
		var	isWeChat = _this.getCookie('weChat');

		if (!isBlog) {
			_this.$medias.eq(0).addClass('btnsilent');
		}
		if (!isWeChat) {
			_this.$medias.eq(1).addClass('btnsilent');
		}

		_this.$medias.click(function(){
			// 重复点自己时不刷新
			if ($(this).hasClass('active') || $(this).hasClass('btnsilent')) {return;}
			var href = $(this).attr('go');
			window.location.href=href;
		})

		_this.$commentUl.mouseenter(function(){
			_this.bOk = false;
		});

		_this.$commentUl.mouseleave(function(){
			_this.bOk = true;
		});
	};

	p.createComment = function(data) {
		var strHtml = '';
		var config = this._config.micro7.config;
		var len = data.length;
		if (!len) {
			this.$commentUl.html('');
			return;
		}else if (len>2) {
			this.bAuto = true;
		}else {
			this.bAuto = false;
		}
		for (var i = 0; i < data.length; i++) {
			// var timeObj = this.getByTimes(data[i][config['time']]);

			strHtml += '<li><h4 class="p_title">' + data[i][config['title']] + '</h4>' + '<p class="p_time">' +data[i][config['time']]+ '</p>' + '<p class="p_content">' + data[i][config['content']] + '</p></li>';
		}
		this.$commentUl.html(strHtml);
		this.t = 0;
		this.bAuto && this.toAutoPlay();
	};

	p.showToolTip = function(text, x, y) {
		this.$op.html(text);
		var w = this.$op.width() + 20;
		var h = this.$op.height() + 20;
		// if (x + w > $(window).innerWidth()) x = $(window).innerWidth() - w;
		// if (y + h > $(window).innerHeight()) y = $(window).innerHeight() - h;
		this.$op.css({
			opacity: 1,
			left: x + 20,
			top: y - 20
		});
	};

	p.hideToolTip = function() {
		this.$op.css({
			opacity: 0,
			left: -100,
			top: -100
		});
	};

	p.toAutoPlay = function() {
		var _this = this;
		if (!_this.bAuto) {return;}
		clearTimeout(_this.aTimer);
		var _this = this;
		var html = _this.$commentUl.html();
		var h = _this.$commentUl.height();
		_this.$commentUl.append(html);
		_this.bOk = true;
		function fn(){
			if (_this.bOk) {
				_this.t--;
				_this.$commentUl.css("top", _this.t);
				if (_this.t <= -h) {
					_this.t = 0;
				}
			}
			_this.aTimer = setTimeout(fn,30);
		}
		fn();
	}

	// 根据时间戳获取时间
	p.getByTimes = function(times) {
		var oDate = new Date();
		oDate.setTime(times)
		var Y = oDate.getFullYear();
		var M = oDate.getMonth() + 1;
		var D = oDate.getDate();
		var h = oDate.getHours();
		var m = oDate.getMinutes();
		var s = oDate.getSeconds();
		return {
			Y: Y,
			M: this.n2d(M),
			D: this.n2d(D),
			h: this.n2d(h),
			m: this.n2d(m),
			s: this.n2d(s)
		}
	};

	p.n2d = function(n) {
		return n < 10 ? '0' + n : '' + n;
	};

	p.getCookie = function(name){
		var arr = document.cookie.split('; ');
		for (var i = 0; i < arr.length; i++) {
			arr2 = arr[i].split('=');
			if (name==arr2[0]){
				return arr2[1];
			}
		}
	};

	EE.Micro = Micro;
})(window, document);