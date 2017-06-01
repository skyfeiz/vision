this.WbstChart = this.WbstChart || {};
(function() {
	var Chart5 = function(dom) {
		this._dom = dom;
		this.numScale = 1;
		this.EventDispatcher = $({});

		this.numData = {};
		this.init();
	};

	var p = Chart5.prototype;

	p.init = function() {
		this.initDom()
		var _this = this;
		_this._myChart = echarts.init(this._dom);

		_this._myChart.on('mouseover', function(param) {
			var item = {};
			item.seriesName = param.name;
			item.xAxisValue = _this.numData[param.seriesName][param.dataIndex].value;
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

	p.initDom = function() {
		this.$unittitle = $('#unittitle');
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
		if (this._dataProvider.length == 0) {
			this._myChart.clear();
			this.$unittitle.html('');
			/*this._myChart.showLoading({
				color:'#3fc0ff',
				text:"暂无数据",
				textColor:'#3fc0ff',
				maskColor:"none"
			});*/
			return;
		}
		this._myChart.hideLoading();
		console.log(this._dataProvider);
		
		var rankArr = []; 		// 存排序的数组
		var legendJson = {};	// 存 ，雾霾，酸雨，核污染...
		var cateJson = {};		// 存城市，北京，河北，河南...

		this.numData = {};		// 存原始数据

		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			legendJson[this._dataProvider[i].seriesTitle] = 1;
			cateJson[this._dataProvider[i].name] = 1;
			this.numData[this._dataProvider[i].seriesTitle] = [];
		}


		var series = [];
		var legend = [];

		var cateNumArr = [];

		var maxNum = 0;
		for (var item in cateJson) {
			var addNum = 0;
			var json = {name:item,num:[]};
			for (var i = 0, len = this._dataProvider.length; i < len; i++) {
				if (this._dataProvider[i].name == item) {
					addNum += 1*this._dataProvider[i].num;
					if (maxNum < addNum) {
						maxNum = addNum;
					}
					json.num.push(1*this._dataProvider[i].num);
				}
			}

			cateNumArr.push(json);
		}
 		var _this = this;
 		// 通过 该省数据的和进行排序
 		cateNumArr.sort(function(a,b){
 			return _this.sumArr(a.num) - _this.sumArr(b.num);
 		})

 		// 保存排好序的类目名 [河南，河北，北京,....]
 		var cataArr = [];
		for (var i = 0; i < cateNumArr.length; i++) {
			cataArr.push(cateNumArr[i].name)
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
		this.$unittitle.html('单位/'+ ['条', '千', '万', '十万', '百万', '千万', '亿', '十亿', '百亿', '千亿', '万亿'][numLen]);

		for (var item in legendJson) {
			var json = {
				type: 'bar',
				name: item,
				stack: '总量',
				barWidth: 14,
				itemStyle: {
					emphasis: {
						color: '#fffe00',
						borderWidth: 4,
						borderColor: '#fffe00'
					}
				},
				legendHoverLink: false,
				data: []
			};
			legend.push({
				name: item,
				icon: 'rect'
			});
			// 保存需要排序的数组数据
			var rankArr = [];
			for (var i = 0, len = this._dataProvider.length; i < len; i++) {
				if (this._dataProvider[i].seriesTitle == item) {

					rankArr.push({
						value:this._dataProvider[i].num,
						name:this._dataProvider[i].name
					});
				}
			}
			// 保存排好序的数组数组
			var listArr = [];
			for (var i = 0; i < cataArr.length; i++) {
				listArr[cataArr.indexOf(rankArr[i].name)] = rankArr[i];
			}

			json.data = listArr;

			for (var i = 0; i < listArr.length; i++) {
				// 真实数据保存，避免 对象引用
				this.numData[item][i] = {};
				this.numData[item][i].name = listArr[i].name;
				this.numData[item][i].value = listArr[i].value;

				listArr[i].value = listArr[i].value/this.numScale;
			}
			
			series.push(json);
		}
		var option = {
			animationDuration: 3000,
			color: ['#052d7f', '#4462e6', '#024de7', '#00c6ff', '#90e1fe'],
			legend: {
				textStyle: {
					color: '#81d6ff',
					fontSize: 12
				},
				data: legend,
				top:'3%',
				padding: 0,
				itemWidth: 7,
				itemHeight: 3,
				formatter: function(param) {
					return param.substring(0, 3) + '..';
				}
			},
			grid: {
				left: '5%',
				right: '6%',
				top: '10%',
				bottom: '3%',
				containLabel: true,
			},
			xAxis: {
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
					show: false,
				}
			},
			yAxis: {
				data: cataArr,
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
					},
					alignWithLabel: true
				},
				splitLine: {
					show: false,
				}
			},
			series: series
		};
		this._myChart.setOption(option);
	};

	// 数组求和
	p.sumArr = function(arr){
		if (!arr.length) {
			return 0;
		}
		var num = 0;
		for (var i = 0; i < arr.length; i++) {
			num += arr[i]*1;
		}
		return num;
	}

	WbstChart.Chart5 = Chart5;
})();