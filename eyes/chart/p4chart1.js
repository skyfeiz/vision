this.WbstChart = this.WbstChart || {};
(function() {
	var P4Chart1 = function(dom) {
		this._dom = dom;

		this.duration = 120000;

		this.EventDispatcher = $({});

		this.init();
	};

	var p = P4Chart1.prototype;

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
		var _this = this;
		var data1 = [];
		var data2 = [];
		var titleData = [];
		var cityData = [];

		var item1Arr = [{
			normal: {
				color: 'rgba(255,43,62,0.3)',
				borderWidth: 1,
				borderColor: '#e12b3e'
			}
		}, {
			normal: {
				color: 'rgba(241,180,32,0.3)',
				borderWidth: 1,
				borderColor: '#f1b420'
			}
		}, {
			normal: {
				color: 'rgba(0,166,245,0.3)',
				borderWidth: 1,
				borderColor: '#00a6f5'
			}
		}];

		var colorArr = ['#e12b3e', '#f1b420', '#00a6f5'];
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {

			var num = this._dataProvider[i].eventSum / 1e4;
			data1.push({
				value: num,
				itemStyle: item1Arr[i],
			})
			data2.push({
				value: num,
				symbol: 'rect',
				symbolRepeat: true,
				symbolSize: ['98%', '15'],
				symbolOffset: [0, 0],
				symbolMargin: '1',
				symbolBoundingData: num,
				animationEasing: 'line',
				animationDelay: function(dataIndex, params) {
					return params.index * 200;
				},
				itemStyle: {
					normal: {
						color: colorArr[i]
					}
				}
			});
			titleData.push(this._dataProvider[i].title);
			cityData.push(this._dataProvider[i].eventArea);
		}

		this.titleData = titleData;
		this.data1 = data1;
		this.data2 = data2;
		this.cityData = cityData;
		this.setOption();
	};

	p.setOption = function() {
		clearTimeout(this.timer);
		var option = {
			grid: {
				left: '0%',
				right: '4%',
				bottom: '0%',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				data: this.titleData,
				axisTick: {
					show: false,
					alignWithLabel: true
				},
				axisLine: {
					lineStyle: {
						color: '#1c4581',
					}
				},
				axisLabel: {
					textStyle: {
						color: '#fff',
						fontSize: 14
					},
					margin: 15,
					formatter: function(params) {
						var mid = Math.floor(params.length / 2);
						return params.substring(0, mid) + '\n ' + params.substring(mid);
					}
				}
			}, {
				type: 'category',
				position: 'bottom',
				data: this.cityData,
				axisLine: {
					lineStyle: {
						color: '#1c4581',
					}
				},
				axisTick: {
					show: false,
					alignWithLabel: true
				},
				axisLabel: {
					textStyle: {
						color: "#3fc0ff",
						fontSize: 16
					},
					margin: 50
				}
			}],
			yAxis: [{
				type: 'value',
				name: '单位/万 ',
				nameGap: 20,
				nameTextStyle: {
					color: '#3fc0ff'
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
				},
				axisLabel: {
					textStyle: {
						color: '#3fc0ff'
					}
				},
				splitLine: {
					lineStyle: {
						color: '#1c4581'
					}
				}
			}],
			series: [{
				name: '直接访问',
				type: 'bar',
				barMaxWidth: 80,
				data: this.data1,
				label: {
					normal: {
						show: true,
						position: 'top',
						formatter: function(params) {
							// 12345 转 12,345
							return (params.value * 1e4).toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
						},
						offset: [0, -10],
						textStyle: {
							color: '#fff',
							fontSize: 26
						}
					}
				}
			}, {
				name: '直接访问2',
				type: 'pictorialBar',
				barMaxWidth: 80,
				data: this.data2
			}]
		};
		this._myChart.setOption(option);
		this.autoReplay();
	};

	p.autoReplay = function() {
		var _this = this;
		var oldData = null;
		this.timer = setTimeout(function() {
			oldData = _this.data2;
			_this.data2 = [];
			_this.setOption();
			_this.data2 = oldData;
			_this.setOption();
		}, this.duration);
	};



	WbstChart.P4Chart1 = P4Chart1;
})();