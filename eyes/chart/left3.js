this.WbstChart = this.WbstChart || {};
(function() {
	var Bar3d = function(dom) {
		this._dom = dom;

		this.EventDispatcher = $({});

		this.init();
	};

	var p = Bar3d.prototype;

	p.init = function() {
		this._Bar3dchart = echarts.init(this._dom);

		var _this = this;

		_this._Bar3dchart.on('mouseover', function(param) {
			var item = {};
			item.seriesName = param.name;
			item.xAxisValue = param.value;
			var evt = param.event.event;
			_this.EventDispatcher.trigger('chartmouseover', {
				item: item,
				event: evt
			});
		});

		_this._Bar3dchart.on('mouseout',function(){
			_this.EventDispatcher.trigger('chartmouseout');
		})


		this.initDom();
	};

	p.initDom = function() {}

	p.setConfig = function(value) {
		this._config = value;
		this.creationContent();
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
		var titleData = [];
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			var item = {};
			item.name = this._dataProvider[i][this._config.labelField];
			item.value = this._dataProvider[i][this._config.valueField];
			data.push(item);
			titleData.push(item.name);
		}
		var xAxis = {
			type: 'category',
			data: titleData,
			axisLabel: {
				textStyle: {
					color: '#00c6ff'
				},
				formatter: function(param) {
					var arr = param.split('');
					return arr.join('\n');
				}
			},
			axisTick: {
				length: 1.1,
				lineStyle: {
					color: '#fffe00'
				},
				alignWithLabel: true
			},
			axisLine: {
				lineStyle: {
					color: '#1c4581',
				}
			}
		}
		var option = {
			animationDuration:2000,
			color: ['#00c6ff'],
			xAxis: xAxis,
			grid: {
				left: '2%',
				right: '5%',
				top: '15%',
				bottom: '5%',
				containLabel: true,
			},
			yAxis: {
				type: 'value',
				name: '单位/万  ',
				nameGap: 8,
				splitNumber: 5,
				nameTextStyle: {
					color: '#00c6ff'
				},
				axisLine: {
					lineStyle: {
						color: '#1c4581',
					}
				},
				axisLabel: {
					textStyle: {
						color: '#00c6ff'
					}
				},
				axisTick: {
					length: 1.1,
					lineStyle: {
						color: '#fffe00'
					}
				},
				splitLine: {
					show: false,
				}
			},
			series: [{
				type: 'bar',
				barWidth: 14,
				name: '来源媒体',
				data: data,
				itemStyle: {
					emphasis: {
						color: '#fffc00'
					}
				}
			}]
		}

		this._Bar3dchart.setOption(option);
	}

	WbstChart.Bar3d = Bar3d;
})();