this.WbstChart = this.WbstChart || {};
(function() {
	var P4Chart1 = function(dom) {
		this._dom = dom;

		this.duration = 120000;

		this.numScale = 1;
		this.numLen = 1;

		this.numData = [];

		this.warning = [];

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
			item.xAxisValue = param.value * _this.numScale;
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

		if (this._config == null || this._dataProvider == null || !Array.isArray(this.warning)) {
			return;
		}

		var warnObj = {};
		for (var i = 0; i < this.warning.length; i++) {
			var item = this.warning[i];
			switch (item.name) {
				case '紧急':
					warnObj.s1 = item.num;
					break;
				case '高':
					warnObj.s2 = item.num;
					break;
				case '中':
					warnObj.s3 = item.num;
					break;
				default:
					console.log('低');
					break;
			}
		}

		var _this = this;
		var data1 = [];
		var data2 = [];
		var titleData = [];
		var cityData = [];
		this.numData = [];
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
		}, {
			normal: {
				color: 'rgba(1,176,87,0.3)',
				borderWidth: 1,
				borderColor: '#01b057'
			}
		}];

		var colorArr = ['#e12b3e', '#f1b420', '#00a6f5', '#01b057'];

		var maxNum = 0;
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			if (maxNum < 1 * this._dataProvider[i].num) {
				maxNum = 1 * this._dataProvider[i].num;
			}
		}
		var numLen = (maxNum / 1000 | 0).toString().length;
		if (maxNum < 1000) {
			numLen = 0;
			this.numScale = 1;
		} else if (numLen < 4) {
			numLen = 1;
			this.numScale = 1000;
		} else {
			this.numScale = Math.pow(10, numLen);
			numLen -= 2;
		}
		this.numLen = numLen;

		// 表现数据
		this.mark1 = warnObj.s3 / this.numScale;
		this.mark2 = warnObj.s2 / this.numScale;
		this.mark3 = warnObj.s1 / this.numScale;
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			var realNum = 1 * this._dataProvider[i].num;
			var index;
			if (realNum < warnObj.s3) {
				index = 3;
			} else if (realNum < warnObj.s2) {
				index = 2
			} else if (realNum < warnObj.s1) {
				index = 1
			} else {
				index = 0;
			}
			var num = realNum / this.numScale;
			this.numData.push(realNum);
			data1.push({
				value: num,
				itemStyle: item1Arr[index],
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
						color: colorArr[index]
					}
				}
			});
			titleData.push(this._dataProvider[i].eventName);
			cityData.push(this._dataProvider[i].regionName);
		}

		this.titleData = titleData;
		this.data1 = data1;
		this.data2 = data2;
		this.cityData = cityData;
		this.setOption();
	};

	p.setOption = function() {
		var _this = this;
		clearTimeout(this.timer);
		var colorData = ['rgba(255,42,62,0.8)', 'rgba(241,180,32,0.8)', 'rgba(0,166,245,0.8)', 'rgba(1,176,87,0.8)'];
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
						if (params.length < 10) {
							return params;
						}
						var mid = Math.floor(params.length / 2);
						return params.substring(0, mid);
					}
				}
			}, {
				type: 'category',
				position: 'bottom',
				data: this.titleData,
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
						color: "#fff",
						fontSize: 16
					},
					margin: 30,
					formatter: function(params) {
						if (params.length < 10) {
							return '';
						}
						var mid = Math.floor(params.length / 2);
						return params.substring(mid);
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
					margin: 55
				}
			}],
			yAxis: [{
				type: 'value',
				name: '单位/' + ['条', '千', '万', '十万', '百万', '千万', '亿', '十亿', '百亿', '千亿', '万亿'][_this.numLen] + ' ',
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
					show: false
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
							return _this.numData[params.dataIndex].toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
						},
						offset: [0, -10],
						textStyle: {
							color: '#fff',
							fontSize: 26
						}
					}
				},
				markLine: {
					silent: true,
					symbolSize: 0,

					label: {
						normal: {
							show: false
						}
					},
					data: [{
						name: '标线1',
						yAxis: this.mark1,
						lineStyle: {
							normal: {
								color: colorData[2]
							}
						},
					}, {
						name: '标线2',
						yAxis: this.mark2,
						lineStyle: {
							normal: {
								color: colorData[1]
							}
						},
					}, {
						name: '标线3',
						yAxis: this.mark3,
						lineStyle: {
							normal: {
								color: colorData[0]
							}
						},
					}]
				},
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