this.WbstChart = this.WbstChart || {};
(function() {
	var Chart7 = function(dom) {
		this._dom = dom;

		this.EventDispatcher = $({});

		this.init();
	};

	var p = Chart7.prototype;

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
		var titleData = [];
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			var item = {};
			item.name = this._dataProvider[i].name;
			item.value = this._dataProvider[i].num;
			data.push(item);
			titleData.push(item.name);
		}
		var xAxis = {
			type: 'category',
			data: titleData,
			axisLabel: {
				interval:0,
				textStyle: {
					color: '#00c6ff',
					fontSize:12
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
				top: '10%',
				bottom: '8%',
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
				barWidth: 32,
				name: '来源媒体',
				data: data,
				itemStyle: {
					emphasis: {
						color: '#fffc00'
					}
				}
			}]
		}

		this._myChart.setOption(option);
	}

	WbstChart.Chart7 = Chart7;
})();