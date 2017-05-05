this.WbstChart = this.WbstChart || {};
(function() {
	var Chart7 = function(dom) {
		this._dom = dom;

		this.numScale = 1;
		this.EventDispatcher = $({});
		this.numData = [];
		this.init();
	};

	var p = Chart7.prototype;

	p.init = function() {
		this._myChart = echarts.init(this._dom);

		var _this = this;

		_this._myChart.on('mouseover', function(param) {
			var item = {};
			item.seriesName = param.name;
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

		var data = [];
		var titleData = [];
		var maxNum = 0;

		this.numData = [];
		this._dataProvider.sort(function(a,b){
			return b.num - a.num;
		})
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			if (maxNum<1*this._dataProvider[i].num) {
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
			var item = {};
			item.name = this._dataProvider[i].name;
			item.value = this._dataProvider[i].num/this.numScale;
			this.numData.push(this._dataProvider[i].num);
			data.push(item);
			titleData.push(item.name);
		}
		var xAxis = {
			type: 'category',
			data: titleData,
			axisLabel: {
				interval: 0,
				textStyle: {
					color: '#3fc0ff',
					fontSize: 12
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
			animationDuration: 2000,
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
				name: '单位/' + ['条', '千', '万', '十万', '百万', '千万', '亿', '十亿', '百亿', '千亿', '万亿'][numLen] + ' ',
				nameGap: 8,
				splitNumber: 5,
				nameTextStyle: {
					color: '#3fc0ff'
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
				barMinHeight:10,
				itemStyle: {
					emphasis: {
						color: '#fffc00'
					}
				}
			}]
		};

		this._myChart.setOption(option);
	};

	WbstChart.Chart7 = Chart7;
})();