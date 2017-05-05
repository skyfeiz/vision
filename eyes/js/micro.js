this.EE = this.EE || {};
(function(win, doc) {
	// var hostUrl = "http://" + win.location.host + "/eems/opinionStudy/";
	var hostUrl = "http://" + win.location.host + "/vision/eyes/";

	var Micro = function() {
		this.c = new EE.Controller();

		this._mapKIdVChart = {};

		this.eventNum = 5;

		this.rankNum = 8;

		this.originNum = 10;

		this.emotion = 2;

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
			_this.init();
			_this.initDom();
			_this.baseEvent();
		});
	};

	p.init = function() {
		var _this = this;
		_this.t = new WbstChart.TimeLine({
			start: '2008-08-08'
		});
		_this.t.silent = true;

		_this.c.getChartConfig('', function(data) {
			_this._config = data;
			_this.initChart();
		});

		_this.t.toChange = function(json) {
			_this.date = json.date;
			_this.type = json.type;
			_this.changeData();
		};
		$(document).trigger('mouseup');
	};

	p.initDom = function() {

		this.$op = $('#tooltip');

		this.$medias = $('#mediabox span');

		this.$micro7 = $('#micro7');
		this.$commentUl = $('#commentUl');
	};

	p.initChart = function() {
		var _this = this;
		// 舆情头条 chart4
		_this._micro4 = new WbstChart.Chart4(doc.getElementById('micro4'));
		_this._micro4.setConfig(_this._config.micro4.config);
		_this._mapKIdVChart['micro4'] = _this._micro4;

		_this._micro4.EventDispatcher.on('click', function(evt, item) {
			// 需要的参数 事件id，视角，视角区域id，情感
			win.location.href = encodeURI(hostUrl + 'p3.html?eventId=' + item + '&emotion=' + _this.emotion);

		});

		// 舆情走势 chart6
		_this._micro6 = new WbstChart.Chart6(doc.getElementById('micro6'));
		_this._micro6.setConfig(_this._config.micro6.config);
		_this._mapKIdVChart['micro6'] = _this._micro6;
		_this._micro6.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<p class="tooltiptext"><span class="valuename">' + item.item.seriesName + ' :</span><span class="valuenum">' + item.item.xAxisValue + '</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
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
					_this.emotion = 1;
					break;
				case '中立':
					_this.emotion = 0;
					break;
				case '负方':
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
			win.location.href = encodeURI(hostUrl + 'details.html?type=4&eventName=' + item + '&emotion=' + _this.emotion);
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

		_this.c.getMicro8Data({
			type: _this.type,
			date: _this.startDate,
			batchFlag: _this.nRandom
		}, function(result) {
			_this._mapKIdVChart['micro8'].setDataProvider(result.data);
		});

		_this.c.getMicro9Data({
			num: '30',
			dateType: _this.type,
			date: _this.date,
			articleEmotion: _this.emotion,
			batchFlag: _this.nRandom
		}, function(result) {
			_this._mapKIdVChart['micro9'].setDataProvider(result.data);
		});

		_this.changeData2();
	};

	p.changeData2 = function() {
		var _this = this;
		_this.c.getMicro4Data({
			dateType: _this.type,
			date: _this.date,
			articleEmotion: _this.emotion,
			batchFlag: _this.nRandom
		}, function(result) {
			_this._mapKIdVChart['micro4'].setDataProvider(result.data);
		});

		_this.c.getMicro5Data({
			dateType: _this.type,
			date: _this.date,
			articleEmotion: _this.emotion,
			num: _this.rankNum,
			batchFlag: _this.nRandom
		}, function(result) {
			_this._mapKIdVChart['micro5'].setDataProvider(result.data);
		});

		_this.c.getMicro6Data({
			dateType: _this.type,
			date: _this.date,
			articleEmotion: _this.emotion,
			batchFlag: _this.nRandom
		}, function(result) {
			_this._mapKIdVChart['micro6'].setDataProvider(result.data);
		});

		_this.c.getMicro7Data({
			dateType: _this.type,
			date: _this.date,
			articleEmotion: _this.emotion,
			num: _this.originNum,
			batchFlag: _this.nRandom
		}, function(result) {
			_this.createComment(result.data);
		});
	};

	p.baseEvent = function() {
		var _this = this;

		_this.$medias.click(function(){
			$(this).addClass('active').siblings().removeClass('active');
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
			return;
		}else if (len>2) {
			this.bAuto = true;
		}else {
			this.bAuto = false;
		}
		for (var i = 0; i < data.length; i++) {
			var timeObj = this.getByTimes(data[i][config['time']]);

			strHtml += '<li><h4 class="p_title">' + data[i][config['title']] + '</h4>' + '<p class="p_time">' + timeObj.Y + '-' + timeObj.M + '-' + timeObj.D + ' ' + timeObj.h + ':' + timeObj.m + '</p>' + '<p class="p_content">' + data[i][config['content']] + '</p></li>';
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
			_this.aTimer = setTimeout(fn,30)
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
	}

	EE.Micro = Micro;
})(window, document);