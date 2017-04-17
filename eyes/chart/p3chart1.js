this.WbstChart = this.WbstChart || {};
(function() {
	var P3chart1 = function(dom) {
		this._dom = dom;

		this.EventDispatcher = $({});

		this.init();
	};

	var p = P3chart1.prototype;

	p.init = function() {
		this._myChart = echarts.init(this._dom);

		var _this = this;

		_this._myChart.on('mouseover', function(param) {
			var item = {};
			item.seriesName = param.name;
			item.xAxisValue = param.value;
			var evt = param.event.event;
			_this.EventDispatcher.trigger('chartmouseover', {
				item: item,
				event: evt
			});
		});

		_this._myChart.on('mouseout',function(){
			_this.EventDispatcher.trigger('chartmouseout');
		})


		this.initDom();
	};

	p.initDom = function() {}

	p.setConfig = function(value) {
		this._config = value;
	};

	p.setDataProvider = function(value) {
		this._dataProvider = value;
		this.creationContent();
	};

	p.creationContent = function() {

		if (this._config == null || this._dataProvider == null) {
			return;
		}
		var data = [];
		
		
		// this._myChart.setOption(option);
	}
	WbstChart.P3chart1 = P3chart1;
})();