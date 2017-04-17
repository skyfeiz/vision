this.WbstChart = this.WbstChart || {};
(function() {
	var Chart9 = function(dom) {
		this._dom = dom;

		this.wid = $(this._dom).width();
		this.heig = $(this._dom).height();

		this.EventDispatcher = $({});

		this.init();
	};

	var p = Chart9.prototype;

	p.init = function() {


		$(this._dom).css({
			width: 390,
			height: 308
		})

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
		})

		_this._myChart.on('click', function(param) {
			console.log(param);
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
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			data.push({
				name: this._dataProvider[i].name,
				value: 1000 - this._dataProvider[i].weight
			})
		}

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
			sizeRange: [12, 32],
			rotationRange: [0, 0],
			rotationStep: 45,
			gridSize: 1,
			textStyle: {
				normal: {
					fontFamily: 'sans-serif',
					fontWeight: 'bold',
					color: function() {
						return ['#00c6ff', '#0084ff', '#5999e2', '#67ffe1', '#3fc0ff', '#034dbd'][Math.round(Math.random() * 6)];
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

		this.toScalc();
	}

	p.toScalc = function() {
		this.scalcW = this.wid/390;
		this.scalcH = this.heig/308

		$(this._dom).css({
			transform:'translate('+(this.wid-390)/2+'px,'+(this.heig - 308)/2+'px) scale('+this.scalcW+','+this.scalcH+')'
		})

	}


	WbstChart.Chart9 = Chart9;
})();