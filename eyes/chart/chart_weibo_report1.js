this.WbstChart = this.WbstChart || {};
(function() {
	var ChartP3_1 = function(dom) {
		this._dom = dom;
		this.EventDispatcher = $({});

		this.numData = [];
		this.init();
	};

	var p = ChartP3_1.prototype;

	p.init = function() {
		var _this = this;
		_this._myChart = echarts.init(this._dom);

		_this._myChart.on('mouseover', function(param) {
			var item = {};
			item.seriesName = param.name + '时';
			item.xAxisValue = _this.numData[param.dataIndex];
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

		
		var series = [];
		var m = 0;
		
		var color = "rgba(0,198,255,0.2)";
		var json = {
			type: 'line',
			name: this._dataProvider[0].seriesTitle,
			data: [],
			symbolSize: 6,
			symbol:'image://images/weibo/point4.png',
			areaStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: color
					}, {
						offset: 0.8,
						color: color.substring(0, color.lastIndexOf('.')) + ')'
					}], false),
					shadowColor: 'rgba(0,0,0,0.1)',
					shadowBlur: 10
				}
			},
			smooth: true
		};
		this.numData = [];
		var cateData = [];

		var maxNum = 0;
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			if (1*this._dataProvider[i].num > maxNum) {
				maxNum = 1*this._dataProvider[i].num;
			}
		}
		var numLen = (maxNum / 1000 | 0).toString().length;
		if (maxNum < 1000) {
			numLen = 0;
			this.numScale = 1;
		}else if(numLen<4){
			numLen = 1;
			this.numScale = 1000;
		}else{
			this.numScale = Math.pow(10,numLen);
			numLen-=2;
		}
		
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			json.data.push(this._dataProvider[i].num/this.numScale);
			this.numData.push(this._dataProvider[i].num);
			cateData.push(this._dataProvider[i].name);

			if (1*this._dataProvider[i].num > maxNum) {
				maxNum = 1*this._dataProvider[i].num;
			}
		}

		

		series.push(json);
		

		var option = {
			animationDuration: 3000,
			color: ['#fffc00'],
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
			grid: {
				left: '3%',
				right: '4%',
				top: '14%',
				bottom: '5%',
				containLabel: true
			},
			xAxis: {
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
						color: '#1c4581',
					}
				},
				axisLabel: {
					interval: 3,
					textStyle: {
						color: '#3fc0ff',
						fontSize: 10,
						fontFamily:'DIN Medium'
					},
					formatter:function(n){
						return n.split(' ')[1];
					}
				},
				splitLine: {
					show: false,
				}
			},
			yAxis: {
				name: '单位/' + ['条', '千', '万', '十万', '百万', '千万', '亿', '十亿', '百亿', '千亿', '万亿'][numLen] + ' ',
				nameGap: 10,
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
						color: '#1c4581'
					}
				},
				axisLabel: {
					textStyle: {
						color: '#3fc0ff',
						fontFamily:'DIN Medium'
					}
				},
				splitLine: {
					lineStyle: {
						color: ['rgba(28,69,129,0.3)']
					}
				}
			},
			series: series
		};

		this._myChart.setOption(option);
	};

	WbstChart.ChartP3_1 = ChartP3_1;
})();