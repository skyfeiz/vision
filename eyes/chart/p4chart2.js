this.WbstChart = this.WbstChart || {};
(function() {
	var P4Chart2 = function(dom) {
		this._dom = dom;
		this.numScale = 1;
		this.numData = {};
		this.warning = [];
		this.EventDispatcher = $({});
		this.option = null;
		this.colorJson = {
			red: [{
				rgba: 'rgba(255,43,62,0.8)',
				hex:'#e12b3e'
			}, {
				rgba:'rgba(238,74,41,0.8)',
				hex:'#ee4a29'
			}, {
				rgba:'rgba(241,140,32,0.8)',
				hex: '#f18c20'
			}],
			yellow: [{
				rgba:'rgba(242,154,1,0.8)',
				hex: '#f29a01'
			}, {
				rgba:'rgba(255,210,0,0.8)',
				hex: '#ffd200'
			}, {
				rgba:'rgba(248,255,59,0.8)',
				hex: '#f8ff3b'
			}],
			blue: [{
				rgba:'rgba(0,111,181,0.8)',
				hex: '#006fb5'
			}, {
				rgba:'rgba(1,162,255,0.8)',
				hex: '#01a2ff'
			}, {
				rgba:'rgba(1,228,255,0.8)',
				hex: '#01e4ff'
			}],
			green: [{
				rgba:'rgba(3,133,46,0.8)',
				hex: '#03852e'
			}, {
				rgba:'rgba(1,175,66,0.8)',
				hex: '#01af42'
			}, {
				rgba:'rgba(41,252,105,0.8)',
				hex: '#29fc69'
			}]
		};
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

			var index = param.seriesIndex;
			_this.option.series[index].lineStyle = {
				normal:{
					color:'#fff'
				}
			}
			_this._myChart.setOption(_this.option);

			_this.EventDispatcher.trigger('chartmouseover', {
				item: item,
				event: evt
			});
		});

		_this._myChart.on('mouseout', function(param) {
			var index = param.seriesIndex;
			_this.option.series[index].lineStyle = {
				normal:{
					color:_this.option.series[index].itemStyle.normal.color
				}
			}
			_this._myChart.setOption(_this.option);
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
					warnObj.s1 = item.num*1;
					break;
				case '高':
					warnObj.s2 = item.num*1;
					break;
				case '中':
					warnObj.s3 = item.num*1;
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

		var rArr = [],yArr = [],bArr = [],gArr = [];
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
						name: '标线2起点',
						yAxis: mark2,
						lineStyle: {
							normal:{
								color: colorData[1]
							}
						},
					}, {
						name: '标线3起点',
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
					lastNum /= this.numScale;
					json.data.push(lastNum);
				}
			}
			if (lastNum < (warnObj.s3/this.numScale)) {
				gArr.push({
					name:item,
					num:lastNum
				});
			} else if (lastNum < (warnObj.s2/this.numScale)) {
				bArr.push({
					name:item,
					num:lastNum
				});
			} else if (lastNum < (warnObj.s1/this.numScale)) {
				yArr.push({
					name:item,
					num:lastNum
				});
			} else {
				rArr.push({
					name:item,
					num:lastNum
				});
			}
			
			series.push(json);
		}
		rArr.sort(function(a,b){
			return b.num = a.num;
		});
		yArr.sort(function(a,b){
			return b.num = a.num;
		});
		bArr.sort(function(a,b){
			return b.num = a.num;
		});
		gArr.sort(function(a,b){
			return b.num = a.num;
		});
		for (var i = 0; i < series.length; i++) {
			for (var j = 0; j < rArr.length; j++) {
				if (series[i].name == rArr[j].name) {
					var color = this.colorJson.red[j].rgba;
					series[i].itemStyle = {
						normal: {
							color: this.colorJson.red[j].hex
						}
					}
					series[i].areaStyle = {
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
					}
				}
			}
			for (var j = 0; j < yArr.length; j++) {
				if (series[i].name == yArr[j].name) {
					var color = this.colorJson.yellow[j].rgba;
					series[i].itemStyle = {
						normal: {
							color: this.colorJson.yellow[j].hex
						}
					}
					series[i].areaStyle = {
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
					}
				}
			}
			for (var j = 0; j < bArr.length; j++) {
				if (series[i].name == bArr[j].name) {
					var color = this.colorJson.blue[j].rgba;
					series[i].itemStyle = {
						normal: {
							color: this.colorJson.blue[j].hex
						}
					}
					series[i].areaStyle = {
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
					}
				}
			}
			for (var j = 0; j < gArr.length; j++) {
				if (series[i].name == gArr[j].name) {
					var color = this.colorJson.green[j].rgba;
					series[i].itemStyle = {
						normal: {
							color: this.colorJson.green[j].hex
						}
					}
					series[i].areaStyle = {
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
					}
				}
			}
		}
		this.option = {
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
				formatter:function(n){
					return n.substring(0,14);
				},
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
						color: '#00c6ff',
						fontFamily:'DIN Medium'
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
						color: '#00c6ff',
						fontFamily:'DIN Medium'
					}
				},
				splitLine: {
					show: false,
				}
			},
			series: series
		};

		this._myChart.setOption(this.option);
	};

	WbstChart.P4Chart2 = P4Chart2;
})();