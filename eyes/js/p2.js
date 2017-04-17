this.EE = this.EE || {};
(function(win, doc) {
	var P2Chart = function() {
		this.c = new EE.Controller();

		this._mapKIdVChart = {};

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
		_this.t = new WbstChart.TimeLine('2014-08-08');
		_this.t.silent = true;
		
		_this.c.getChartConfig('', function(data) {
			_this._config = data;
			_this.initChart();
		})

		_this.t.toChange = function(json) {
			_this.startDate = json.startDate;
			_this.endDate = json.endDate;
			_this.changeData();
		}

		$(document).trigger('mouseup');
	};

	p.initDom = function() {
		this.$op = $('#tooltip');
	}

	p.initChart = function() {
		var _this = this;
		// 舆情头条 chart4
		_this._Chart4 = new WbstChart.Chart4(doc.getElementById('chart4'));
		_this._Chart4.setConfig(_this._config.chart4.config);
		_this._mapKIdVChart['chart4'] = _this._Chart4;

		// 事件省份排名 chart5
		_this._Chart5 = new WbstChart.Chart5(doc.getElementById('chart5'));
		_this._Chart5.setConfig(_this._config.chart5.config);
		_this._mapKIdVChart['chart5'] = _this._Chart5;
		_this._Chart5.EventDispatcher.on('chartmouseover',function(vet,item){
			var str = '<p class="tooltiptext"><span class="valuenum">'+item.item.xAxisValue*10000+'</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		})
		_this._Chart5.EventDispatcher.on('chartmouseout',function(){
			_this.hideToolTip();
		})

		// 舆情走势 chart6
		_this._Chart6 = new WbstChart.Chart6(doc.getElementById('chart6'));
		_this._Chart6.setConfig(_this._config.chart6.config);
		_this._mapKIdVChart['chart6'] = _this._Chart6;
		_this._Chart6.EventDispatcher.on('chartmouseover',function(vet,item){
			var str = '<p class="tooltiptext"><span class="valuename">'+item.item.seriesName+' :</span><span class="valuenum">'+item.item.xAxisValue*10000+'</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		})
		_this._Chart6.EventDispatcher.on('chartmouseout',function(){
			_this.hideToolTip();
		})

		// 来源媒体分布 chart8
		_this._Chart8 = new WbstChart.Chart8(doc.getElementById('chart8'));
		_this._Chart8.setConfig(_this._config.chart8.config);
		_this._mapKIdVChart['chart8'] = _this._Chart8;
		_this._Chart8.EventDispatcher.on('chartmouseover',function(vet,item){
			var str = '<p class="tooltiptext"><span class="valuenum">'+item.item.xAxisValue+'</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		})
		_this._Chart8.EventDispatcher.on('chartmouseout',function(){
			_this.hideToolTip();
		})

		// 词云 chart9
		_this._Chart9 = new WbstChart.Chart9(doc.getElementById('chart9'));
		_this._Chart9.setConfig(_this._config.chart9.config);
		_this._mapKIdVChart['chart9'] = _this._Chart9;
		_this._Chart9.EventDispatcher.on('chartmouseover',function(vet,item){
			var str = '<p class="tooltiptext"><span class="valuenum">'+item.item.xAxisValue+'</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		})
		_this._Chart9.EventDispatcher.on('chartmouseout',function(){
			_this.hideToolTip();
		})

		// 来源媒体分布 chart7  3d柱图必须最后加载
		_this._Chart7 = new WbstChart.Chart7(doc.getElementById('chart7'));
		_this._Chart7.setConfig(_this._config.chart7.config);
		_this._mapKIdVChart['chart7'] = _this._Chart7;
		_this._Chart7.EventDispatcher.on('chartmouseover',function(vet,item){
			var str = '<p class="tooltiptext"><span class="valuenum">'+item.item.xAxisValue*10000+'</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		})
		_this._Chart7.EventDispatcher.on('chartmouseout',function(){
			_this.hideToolTip();
		})
	}

	p.changeData = function() {
		var _this = this;

		_this.c.getChart4Data({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate
		},function(result){
			_this._mapKIdVChart['chart4'].setDataProvider(result.data);
		})

		_this.c.getChart5Data({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate
		},function(result){
			_this._mapKIdVChart['chart5'].setDataProvider(result.data);
		})

		_this.c.getChart6Data({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate
		},function(result){
			_this._mapKIdVChart['chart6'].setDataProvider(result.data);
		})

		_this.c.getChart7Data({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate
		},function(result){
			_this._mapKIdVChart['chart7'].setDataProvider(result.data);
		})

		_this.c.getChart8Data({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate
		},function(result){
			_this._mapKIdVChart['chart8'].setDataProvider(result.data);
		})

		_this.c.getChart9Data({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate
		},function(result){
			_this._mapKIdVChart['chart9'].setDataProvider(result.data);
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
			left: x+20,
			top: y-20
		});
	}

	p.hideToolTip = function() {
		this.$op.css({
			opacity: 0,
			left: -100,
			top: -100
		});
	}



	EE.P2Chart = P2Chart;
})(window, document);