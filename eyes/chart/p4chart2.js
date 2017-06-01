this.WbstChart = this.WbstChart || {};
(function() {
	var P4Chart2 = function(dom) {
		this._dom = dom;
		this.numScale = 1;
		this.numData = {};
		this.warning = [];
		this.EventDispatcher = $({});
		this.init();
	};

	var p = P4Chart2.prototype;

	p.init = function() {
		var _this = this;
		_this._myChart = echarts.init(this._dom);

		_this._myChart.on('mouseover', function(param) {
			var item = {};
			item.seriesName = param.name + '日';
			item.xAxisValue = _this.numData[param.seriesName][param.dataIndex];
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

		var legendJson = {};
		var cateJson = {};
		var cateData = [];

		var maxNum = 0;
		this.numData = {};
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			legendJson[this._dataProvider[i].eventName] = 1;
			
			if (cateJson[this._dataProvider[i].eventTime] != 1) {
				cateJson[this._dataProvider[i].eventTime] = 1;
				var arr = this._dataProvider[i].eventTime.split('-');
				cateData.push(arr[arr.length - 1]);
			}
			this.numData[this._dataProvider[i].eventName] = [];
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

		// 表现数据
		var mark1 = warnObj.s3 / this.numScale;
		var mark2 = warnObj.s2 / this.numScale;
		var mark3 = warnObj.s1 / this.numScale;

		var series = [];
		var legendData = [];
		var colorData = ['rgba(255,42,62,0.8)', 'rgba(241,180,32,0.8)', 'rgba(0,166,245,0.8)', 'rgba(1,176,87,0.8)'];
		var itemColor = ['#e12b3e', '#f1b420', '#00a6f5', '#01b057'];

		for (var item in legendJson) {
			var lastNum = 0;
			var json = {
				type: 'line',
				name: item,
				data: [],
				symbolSize: 0.1,
				markLine: {
					silent: true,
					symbolSize: 0,
					
					label: {
						normal: {
							show: false
						}
					},
					data: [{
						name: '标线1起点',
						yAxis: mark1,
						lineStyle: {
							normal:{
								color: colorData[2]
							}
						},
					}, {
						name: '标线1终点',
						yAxis: mark2,
						lineStyle: {
							normal:{
								color: colorData[1]
							}
						},
					}, {
						name: '标线1终点',
						yAxis: mark3,
						lineStyle: {
							normal:{
								color: colorData[0]
							}
						},
					}]
				},
				smooth: true,
				legendHoverLink: false
			};

			legendData.push({
				name: item,
				icon: 'rect'
			});
			for (var i = 0, len = this._dataProvider.length; i < len; i++) {
				if (this._dataProvider[i].eventName == item) {
					lastNum = this._dataProvider[i].num;
					this.numData[item].push(lastNum);
					json.data.push(lastNum / this.numScale)
				}
			}
			var index;
			if (lastNum < warnObj.s3) {
				index = 3;
			} else if (lastNum < warnObj.s2) {
				index = 2
			} else if (lastNum < warnObj.s1) {
				index = 1
			} else {
				index = 0;
			}
			json.itemStyle = {
				normal: {
					color: itemColor[index]
				}
			};
			var color = colorData[index];
			json.areaStyle = {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: color
					}, {
						offset: 1,
						color: color.substring(0, color.lastIndexOf('.')) + ')'
					}], false),
					shadowColor: 'rgba(0,0,0,0.1)',
					shadowBlur: 10
				}
			};
			series.push(json);
		}

		var option = {
			animationDuration: 3000,
			tooltip: {
				trigger: 'axis',
				showContent: false,
				axisPointer: {
					type: 'line',
					lineStyle: {
						color: 'rgba(63,192,255,0.5)'
					}
				}
			},
			legend: {
				bottom: '15%',
				textStyle: {
					color: '#81d6ff'
				},
				itemWidth: 7,
				itemHeight: 3,
				data: legendData,
				padding: 2
			},
			grid: {
				left: '1%',
				right: '3%',
				bottom: '0%',
				containLabel: true
			},
			xAxis: [{
				data: cateData,
				splitNumber: 0,
				boundaryGap: false,
				axisTick: {
					length: 1.1,
					lineStyle: {
						color: '#fffe00'
					},
					alignWithLabel: true
				},
				axisLine: {
					lineStyle: {
						color: 'rgba(28,69,129,0)',
					}
				},
				axisLabel: {
					textStyle: {
						color: '#00c6ff'
					},
					interval: 0
				},
				splitLine: {
					show: false,
				}
			}, {
				position: 'bottom',
				axisLabel: {
					textStyle: {
						color: '#00c6ff'
					},
					margin: 110
				},
				axisLine: {
					lineStyle: {
						color: '#1c4581',
					}
				},
			}],
			yAxis: {
				name: '单位/' + ['条', '千', '万', '十万', '百万', '千万', '亿', '十亿', '百亿', '千亿', '万亿'][numLen] + ' ',
				nameGap: 20,
				splitNumber: 5,
				nameTextStyle: {
					color: '#00c6ff'
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
						color: '#00c6ff'
					}
				},
				splitLine: {
					show: false,
				}
			},
			series: series
		};

		this._myChart.setOption(option);
	};

	WbstChart.P4Chart2 = P4Chart2;
})();