this.WbstChart = this.WbstChart || {};
(function() {
	var P4Chart2 = function(dom) {
		this._dom = dom;
		this.EventDispatcher = $({});
		this.init();
	};

	var p = P4Chart2.prototype;

	p.init = function() {
		var _this = this;
		_this._myChart = echarts.init(this._dom);

		_this._myChart.on('mouseover',function(param){
			var item = {};
			item.seriesName = param.name+'日';
			item.xAxisValue = param.value;
			var evt = param.event.event;
			_this.EventDispatcher.trigger('chartmouseover', {
				item: item,
				event: evt
			});
		})

		_this._myChart.on('mouseout',function(){
			_this.EventDispatcher.trigger('chartmouseout');
		})
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
			return ;
		}

		var legendJson = {};
		var cateJson = {};

		for (var i = 0,len = this._dataProvider.length; i < len; i++) {
			legendJson[this._dataProvider[i].seriesTitle] = 1;
			cateJson[this._dataProvider[i].name] = 1;
		}

		var series = [];
		var legendData = [];
		var m = 0;
		var colorData = ['rgba(255,42,62,0.8)','rgba(241,180,32,0.8)','rgba(0,166,245,0.8)'];
		
		for (var item in legendJson) {
			var color = colorData[m++];
			var json = {
				type:'line',
				name : item,
				data:[],
				symbolSize:0.1,
				areaStyle:{
					normal:{
						color:new echarts.graphic.LinearGradient(0,0,0,1,[{
							offset:0,
							color:color
						},{
							offset:1,
							color:color.substring(0,color.lastIndexOf('.'))+')'
						}],false),
						shadowColor:'rgba(0,0,0,0.1)',
						shadowBlur:10
					}
				},
				smooth:true,
				legendHoverLink:false
			};
			legendData.push({
				name:item,
				icon:'rect'
			});
			for (var i = 0,len = this._dataProvider.length; i < len; i++) {
				if (this._dataProvider[i].seriesTitle == item) {
					json.data.push(this._dataProvider[i].num)
				}
			}
			series.push(json);
		}

		var cateData = [];
		for (var item in cateJson) {
			cateData.push(item);
		}

		var option = {
			animationDuration:3000,
			color:['#e12b3e','#f09830','#00a6f5'],
			tooltip:{
				trigger:'axis',
				showContent:false,
				axisPointer:{
		            type:'line',
		            lineStyle:{
		                color:'rgba(63,192,255,0.5)'
		            }
		        }
			},
			legend:{
				bottom:'10%',
				textStyle:{
					color:'#81d6ff'
				},
				itemWidth:7,
				itemHeight:3,
				data:legendData,
				padding:2
			},
			grid:{
				left: '0',
		        right: '3%',
		        bottom: '0%',
		        containLabel: true
			},
			xAxis:[{
				data:cateData,
				splitNumber:0,
				boundaryGap:false,
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
					interval:0
				},
				splitLine: {
					show: false,
				}
			},{
				position:'bottom',
				axisLabel: {
					textStyle: {
						color: '#00c6ff'
					},
					margin:75
				},
				axisLine: {
					lineStyle: {
						color: '#1c4581',
					}
				},
			}],
			yAxis:{
				name: '单位/万  ',
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
					lineStyle:{
						color:['rgba(28,69,129,1)']
					}
				}
			},
			series:series
		}
		
		this._myChart.setOption(option);
	};

	WbstChart.P4Chart2 = P4Chart2;
})();