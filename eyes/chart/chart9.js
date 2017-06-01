this.WbstChart = this.WbstChart || {};
(function() {
	var Chart9 = function(dom) {
		this._dom = dom;

		this.wid = $(this._dom).width()/SCALE;
		this.heig = $(this._dom).height()/SCALE;

		this.EventDispatcher = $({});

		this.init();
	};

	var p = Chart9.prototype;

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

		_this._myChart.on('mouseout', function() {
			_this.EventDispatcher.trigger('chartmouseout');
		});

		_this._myChart.on('click', function(param) {
			_this.EventDispatcher.trigger('click', param.name);
		});
	};

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
		if (this._dataProvider.length == 0) {
			this._myChart.clear();
			return;
		}
		this._dataProvider = this._dataProvider.splice(0,24);
		var data = [];
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			data.push({
				name: this._dataProvider[i].name,
				value: this._dataProvider[i].weight
			})
		}
		var size = 1;
		
		if (len<=20) {
			size = 8;
		}else if (len<=25) {
			size = 6
		}else if (len<=30) {
			size = 4
		}else if (len<=35) {
			size = 2
		}
		console.log(size);
		var json = {
			type: 'wordCloud',
			shape: 'circle',
			maskImage: null,
			left: 'center',
			top: 'center',
			width: '90%',
			height: '90%',
			right: null,
			bottom: null,
			sizeRange: [12, 24],
			rotationRange: [0, 0],
			rotationStep: 45,
			gridSize: size,
			textStyle: {
				normal: {
					fontFamily: 'Microsoft yahei',
					color: function() {
						return ['#00c6ff', '#0084ff', '#5999e2', '#67ffe1', '#3fc0ff', '#034dbd'][Math.round(Math.random() * 5)];
					}
				},
				emphasis: {
					color: '#fffe00'
				}
			}
		};
		json.data = data;
		var option = {
			series: [json]
		};

		this._myChart.setOption(option);

		// this.toScalc();
	};

	p.toScalc = function() {
		this.scalcW = this.wid / 390;
		this.scalcH = this.heig / 308

		$(this._dom).css({
			transform: 'translate(' + (this.wid - 390) / 2 + 'px,' + (this.heig - 308) / 2 + 'px) scale(' + this.scalcW * 1.4 + ',' + this.scalcH * 1.4 + ')'
		});

	};


	WbstChart.Chart9 = Chart9;
})();