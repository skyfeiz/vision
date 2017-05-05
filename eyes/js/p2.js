this.EE = this.EE || {};
(function(win, doc) {
	// var hostUrl = "http://" + win.location.host + "/eems/opinionStudy/";
	var hostUrl = "http://" + win.location.host + "/vision/eyes/";

	var P2Chart = function() {
		this.c = new EE.Controller();

		this._mapKIdVChart = {};

		this.eventNum = 5;

		this.rankNum = 8;

		this.originNum = 10;

		this.emotion = 2;

		this.nRandom = new Date().getTime();

		this.ready();
	};

	var p = P2Chart.prototype;

	p.ready = function() {
		var _this = this;
		_this.c.ready(function(region) {
			_this.region = region;
			_this.init();
			_this.initDom();
		});
	};

	p.init = function() {
		var _this = this;
		_this.t = new WbstChart.TimeLine({start:'2008-08-08'});
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

		_this.c.getChart9Data({
			num: '30',
			dateType: _this.type,
			date: _this.date,
			articleEmotion: _this.emotion,
			batchFlag: _this.nRandom
		}, function(result) {
			_this._mapKIdVChart['chart9'].setDataProvider(result.data);
		});

		$(document).trigger('mouseup');
	};

	p.initDom = function() {

		this.$op = $('#tooltip');
	};

	p.initChart = function() {
		var _this = this;
		// 舆情头条 chart4
		_this._Chart4 = new WbstChart.Chart4(doc.getElementById('chart4'));
		_this._Chart4.setConfig(_this._config.chart4.config);
		_this._mapKIdVChart['chart4'] = _this._Chart4;

		_this._Chart4.EventDispatcher.on('click', function(evt, item) {
			// 需要的参数 事件id，视角，视角区域id，情感
			win.location.href = encodeURI(hostUrl + 'p3.html?eventId=' + item + '&emotion=' + _this.emotion);

		});

		// 事件省份排名 chart5
		_this._Chart5 = new WbstChart.Chart5(doc.getElementById('chart5'));
		_this._Chart5.setConfig(_this._config.chart5.config);
		_this._mapKIdVChart['chart5'] = _this._Chart5;
		_this._Chart5.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<p class="tooltiptext"><span class="valuenum">' + item.item.xAxisValue + '</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this._Chart5.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});

		// 舆情走势 chart6
		_this._Chart6 = new WbstChart.Chart6(doc.getElementById('chart6'));
		_this._Chart6.setConfig(_this._config.chart6.config);
		_this._mapKIdVChart['chart6'] = _this._Chart6;
		_this._Chart6.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<p class="tooltiptext"><span class="valuename">' + item.item.seriesName + ' :</span><span class="valuenum">' + item.item.xAxisValue + '</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this._Chart6.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});

		// 来源媒体分布 chart8
		_this._Chart8 = new WbstChart.Chart8(doc.getElementById('chart8'));
		_this._Chart8.setConfig(_this._config.chart8.config);
		_this._mapKIdVChart['chart8'] = _this._Chart8;
		_this._Chart8.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<p class="tooltiptext"><span class="valuenum">' + item.item.xAxisValue + '</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this._Chart8.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});
		_this._Chart8.EventDispatcher.on('click', function(evt, item) {
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
		_this._Chart9 = new WbstChart.Chart9(doc.getElementById('chart9'));
		_this._Chart9.setConfig(_this._config.chart9.config);
		_this._mapKIdVChart['chart9'] = _this._Chart9;
		_this._Chart9.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<p class="tooltiptext"><span class="valuenum">' + item.item.xAxisValue + '</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this._Chart9.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});

		_this._Chart9.EventDispatcher.on('click', function(evt, item) {
			win.location.href = encodeURI(hostUrl + 'details.html?type=4&eventName=' + item + '&emotion=' + _this.emotion);
		});


		// 来源媒体分布 chart7  3d柱图必须最后加载
		_this._Chart7 = new WbstChart.Chart7(doc.getElementById('chart7'));
		_this._Chart7.setConfig(_this._config.chart7.config);
		_this._mapKIdVChart['chart7'] = _this._Chart7;
		_this._Chart7.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<div class="tooltip_left3">' +
				'<p class="blockyellow">' + item.item.seriesName + '</p>' +
				'<p class="tooltiptext">' + item.item.xAxisValue +
				'<span class="fffpoint_lt"></span>' +
				'<span class="fffpoint_rb"></span>' +
				'</p>' +
				'</div>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this._Chart7.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});
	};

	p.changeData = function() {
		var _this = this;

		_this.c.getChart8Data({
			type: _this.type,
			date: _this.startDate,
			batchFlag: _this.nRandom
		}, function(result) {
			_this._mapKIdVChart['chart8'].setDataProvider(result.data);
		});

		_this.changeData2();
	};

	p.changeData2 = function() {
		var _this = this;
		_this.c.getChart4Data({
			dateType: _this.type,
			date: _this.date,
			articleEmotion: _this.emotion,
			batchFlag: _this.nRandom
		}, function(result) {
			_this._mapKIdVChart['chart4'].setDataProvider(result.data);
		});

		_this.c.getChart5Data({
			dateType: _this.type,
			date: _this.date,
			articleEmotion: _this.emotion,
			num: _this.rankNum,
			batchFlag: _this.nRandom
		}, function(result) {
			_this._mapKIdVChart['chart5'].setDataProvider(result.data);
		});

		_this.c.getChart6Data({
			dateType: _this.type,
			date: _this.date,
			articleEmotion: _this.emotion,
			batchFlag: _this.nRandom
		}, function(result) {
			_this._mapKIdVChart['chart6'].setDataProvider(result.data);
		});

		_this.c.getChart7Data({
			dateType: _this.type,
			date: _this.date,
			articleEmotion: _this.emotion,
			num: _this.originNum,
			batchFlag: _this.nRandom
		}, function(result) {
			_this._mapKIdVChart['chart7'].setDataProvider(result.data);
		});
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

	EE.P2Chart = P2Chart;
})(window, document);