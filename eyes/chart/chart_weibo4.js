this.WbstChart = this.WbstChart || {};
(function() {
	var Chart4 = function(dom) {
		this._dom = dom;

		this.EventDispatcher = $({});

		this.data = null;

		this.init();
	};

	var p = Chart4.prototype;

	p.init = function() {
		var _this = this;
		this._myChart = echarts.init(this._dom);

		
		this.initDom();
		this.baseEvent();
	};

	p.initDom = function() {
		this.$parent = $(this._dom).parent();
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
		var maxNum = 0;
		var dataShadow = [];
		var dataShadow2 = [];
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			data.push({
				name: '头条',
				value: this._dataProvider[i].num,
				itemStyle: {}
			});
			if (maxNum < this._dataProvider[i].num) {
				maxNum = this._dataProvider[i].num;
			}
		}
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			var json = {
				value: maxNum*1.2,
				symbol: 'rect',
				symbolRepeat: true,
				symbolSize: ['98%', '8'],
				symbolOffset: [0, 0],
				symbolMargin: '1',
				symbolBoundingData: maxNum*1.2,
				animation:false,
				itemStyle: {
					normal: {
						color:'#0d65c3' 
					}
				}
			}
			dataShadow2.push(maxNum*1.2);
			dataShadow.push(json);
		}
		data = data.sort(function(n1, n2) {
			return n1.value - n2.value
		});

		var option = {
			animationDuration: 3000,
			toolTip: {
				show: true,
				trigger: 'item'
			},
			grid: {
				left: 0,
				right: '5%',
				top: '8%',
				bottom: '4%'
			},
			yAxis: {
				data: [],
				axisLine: {
					show: false
				}
			},
			xAxis: {
				show: false,
				type:'value',
				max:maxNum*1.2
			},
			series: [{
				type:'pictorialBar',
				barWidth:2,
				barGap:'-100%',
				silent:true,
				data:dataShadow
			},{
				name:'背景',
				type: 'bar',
				barWidth: 8,
				barGap:'-100%',
				data:dataShadow2,
				silent:true,
				animation:false,
				itemStyle:{
					normal:{
						color:new echarts.graphic.LinearGradient(1,0,0,0,[
                            {offset: 0.1, color: 'rgba(2,12,27,0)'},
							{offset: 1, color: 'rgba(2,12,27,1)'}
                        ])
					}
				}
			},{
				name:'头条',
				type: 'bar',
				barWidth: 8,
				barMinHeight:10,
				barCategoryGap: '40%',
				itemStyle: {
					normal:{
						color:new echarts.graphic.LinearGradient(1,0,0,0,[
                            {offset: 0, color: 'rgba(0,198,255,1)'},
							{offset: 1, color: 'rgba(10,32,70,1)'}
                        ])
					},
					emphasis:{
						color:new echarts.graphic.LinearGradient(1,0,0,0,[
							{offset: 0, color: 'rgba(232,228,1,1)'},
                            {offset: 1, color: 'rgba(159,66,10,1)'}
                        ])
					}
				},
				label: {
					normal: {
						show: true,
						position: 'right',
						offset: [0, -2],
						textStyle:{
							color:'#fff',
							fontFamily:'DIN Medium'
						}
					},
					emphasis: {
						textStyle: {
							color: '#fffe00',
							fontFamily:'DIN Medium'
						}
					}
				},
				data: data
			}]
		};
		this._myChart.setOption(option);

		this.creationText(this._dataProvider);
	};

	p.creationText = function(data) {
		var strHtml = '';
		$('a').remove('.chart4news');
		if (data.length) {
			for (var i = 0; i < data.length; i++) {
				strHtml += '<a class="chart4news anew' + i + '" eventid="' + (data[i].eventId||data[i].id||0) + '">' + data[i].name + '</a>'
			}
			this.$parent.append(strHtml);
		}
	};

	p.baseEvent = function() {
		var _this = this;
		_this.$parent.on('click', 'a', function() {
			_this.EventDispatcher.trigger('click', $(this).attr('eventid'));
		});
	};

	WbstChart.Chart4 = Chart4;
})();