this.WbstChart = this.WbstChart || {};
(function() {
	var Bar3d = function(dom) {
		this._dom = dom;

		this.numScale = 1;

		this.numData = [];

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
			item.xAxisValue = _this.numData[param.dataIndex];
			var evt = param.event.event;
			_this.EventDispatcher.trigger('chartmouseover', {
				item: item,
				event: evt
			});
		});

		_this._Bar3dchart.on('mouseout', function() {
			_this.EventDispatcher.trigger('chartmouseout');
		});
	};

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
		if (this._dataProvider.length>10) {
			this._dataProvider = this._dataProvider.splice(0,10);
		}
		var data = [];
		var titleData = [];
		this.numData = [];
		var maxNum = 0;
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			if (1*this._dataProvider[i][this._config.valueField] > maxNum) {
				maxNum = 1*this._dataProvider[i][this._config.valueField];
			}
		}

		this._dataProvider.sort(function(a,b){
			return b.num - a.num;
		})
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
			item.name = this._dataProvider[i][this._config.labelField];
			this.numData.push(this._dataProvider[i][this._config.valueField]);
			item.value = this._dataProvider[i][this._config.valueField]/this.numScale;
			data.push(item);
			titleData.push(item.name);
		}
		
		var xAxis = {
			type: 'category',
			data: titleData,
			axisLabel: {
				textStyle: {
					color: '#3fc0ff'
				},
				formatter: function(param) {
					var arr = param.split('');
					if (arr.length>3) {
						arr = arr.splice(0,3);
						return arr.join('\n');
					}else{
						return arr.join('\n');
					}
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
			color: ['#3fc0ff'],
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
				barWidth: 14,
				barMinHeight:10,
				name: '来源媒体',
				data: data,
				itemStyle: {
					emphasis: {
						color: '#fffc00'
					}
				}
			}]
		};

		this._Bar3dchart.setOption(option);
	};

	WbstChart.Bar3d = Bar3d;
})();