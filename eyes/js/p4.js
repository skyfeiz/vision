this.EE = this.EE || {};
(function(win, doc) {
	var P4Chart = function() {
		this.c = new EE.Controller();

		this._mapKIdVChart = {};

		this.ready();
	};

	var p = P4Chart.prototype;

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
		_this.c.getChartConfig('', function(data) {
			_this._config = data;
			_this.initChart();
			_this.changeData();
		})

	};

	p.initDom = function() {
		this.$op = $('#tooltip');
	}

	p.initChart = function() {
		var _this = this;

		// battery bar
		_this._P4Chart1 = new WbstChart.P4Chart1(doc.getElementById('p4chart1'));
		_this._P4Chart1.setConfig(_this._config.p4chart1.config);
		_this._mapKIdVChart['p4chart1'] = _this._P4Chart1;

		// 折线图
		_this._P4Chart2 = new WbstChart.P4Chart2(doc.getElementById('p4chart2'));
		_this._P4Chart2.setConfig(_this._config.p4chart2.config);
		_this._mapKIdVChart['p4chart2'] = _this._P4Chart2;
		_this._P4Chart2 .EventDispatcher.on('chartmouseover',function(vet,item){
			var str = '<p class="tooltiptext"><span class="valuename">'+item.item.seriesName+' :</span><span class="valuenum">'+item.item.xAxisValue*10000+'</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		})
		_this._P4Chart2 .EventDispatcher.on('chartmouseout',function(){
			_this.hideToolTip();
		})

		// event list
		_this._P4List = new WbstChart.P4List();
		_this._P4List.setConfig(_this._config.p4list.config);
		_this._mapKIdVChart['p4list'] = _this._P4List;

	}

	p.changeData = function() {
		var _this = this;

		// battery bar
		_this.c.getP4Chart1Data({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate
		}, function(result) {
			_this._mapKIdVChart['p4chart1'].setDataProvider(result.data);
		})

		// 折线图
		_this.c.getP4Chart2Data({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate
		}, function(result) {
			_this._mapKIdVChart['p4chart2'].setDataProvider(result.data);
		})

		// event list
		_this.c.getP4ListData({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate
		}, function(result) {
			_this._mapKIdVChart['p4list'].setDataProvider(result.data);
		})

	}

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
	}

	p.hideToolTip = function() {
		this.$op.css({
			opacity: 0,
			left: -100,
			top: -100
		});
	}



	EE.P4Chart = P4Chart;
})(window, document);