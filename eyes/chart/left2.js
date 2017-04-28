this.WbstChart = this.WbstChart || {};
(function() {
	var HeaderLine = function(dom) {
		this._dom = dom;

		this.z_pos = 5;
		this.z_index = 0;
		this.timer = null;

		this.EventDispatcher = $({});

		this.data = null;

		this.normal000 = {
			color: '#fff',
			shadowColor: '#1085ff',
			shadowBlur: 10,
		};

		this.init();
	};

	var p = HeaderLine.prototype;

	p.init = function() {
		var _this = this;
		this._myChart = echarts.init(this._dom);

		this._myChart.on('mouseover', function(param) {
			_this.z_index = param.dataIndex;
			_this.data[_this.z_index].label = {
				normal: {
					show: true,
					position: 'right',
					offset: [0, -2],
					textStyle: {
						color: '#fffe00'
					}
				}
			};
			_this.autoLight();
		});

		this._myChart.on('mouseout', function() {
			_this.data[_this.z_index].itemStyle.normal = _this.normal000;
			_this.data[_this.z_index].label = {
				normal: {
					show: true,
					position: 'right',
					offset: [0, -2],
					textStyle: {
						color: '#fff'
					}
				}
			};
			_this.z_pos = 0;
			clearInterval(_this.timer);
			_this.setOption();
		});

		this.initDom();
		this.baseEvent();
	};

	p.autoLight = function() {
		var _this = this;
		_this.timer = setInterval(function() {
			_this.z_pos += 0.2;
			_this.z_pos %= 12;
			if (_this.z_pos <= 1) {
				_this.data[_this.z_index].itemStyle.normal = {
					color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
						offset: 0,
						color: '#fffe00'
					}, {
						offset: _this.z_pos / 10,
						color: '#ffffff'
					}])
				};
			} else if (_this.z_pos <= 2) {
				_this.data[_this.z_index].itemStyle.normal = {
					color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
						offset: 0,
						color: '#ffffff'
					}, {
						offset: (_this.z_pos - 1) / 10,
						color: '#fffe00'
					}, {
						offset: _this.z_pos / 10,
						color: '#ffffff'
					}])
				};
			} else if (_this.z_pos <= 10) {
				_this.data[_this.z_index].itemStyle.normal = {
					color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
						offset: (_this.z_pos - 2) / 10,
						color: '#ffffff'
					}, {
						offset: (_this.z_pos - 1) / 10,
						color: '#fffe00'
					}, {
						offset: _this.z_pos / 10,
						color: '#ffffff'
					}])
				};
			} else if (_this.z_pos <= 11) {
				_this.data[_this.z_index].itemStyle.normal = {
					color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
						offset: (_this.z_pos - 2) / 10,
						color: '#ffffff'
					}, {
						offset: (_this.z_pos - 1) / 10,
						color: '#fffe00'
					}, {
						offset: 1,
						color: '#ffffff'
					}])
				};
			} else if (_this.z_pos <= 12) {
				_this.data[_this.z_index].itemStyle.normal = {
					color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
						offset: (_this.z_pos - 2) / 10,
						color: '#ffffff'
					}, {
						offset: 1,
						color: '#fffe00'
					}])
				};
			}
			_this.setOption();
		}, 30);
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
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			data.push({
				name: '头条',
				value: this._dataProvider[i].num,
				itemStyle: {}
			});
		}
		data = data.sort(function(n1, n2) {
			return n1.value - n2.value
		});

		this.data = data;


		this.creationText(this._dataProvider);

		this.setOption();
	};

	p.setOption = function() {
		var option = {
			textStyle:{
				fontFamily:'Microsoft Yahei'
			},
			animationDuration: 3000,
			toolTip: {
				show: true,
				trigger: 'item'
			},
			grid: {
				left: '7%',
				right: '16%',
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
				show: false
			},
			series: [{
				type: 'bar',
				barWidth: 2,
				barGap: '100%',
				barCategoryGap: '40%',
				itemStyle: {
					normal: {
						color: '#fff',
						shadowColor: '#1085ff',
						shadowBlur: 10
					}
				},
				label: {
					normal: {
						show: true,
						position: 'right',
						offset: [0, -2],
						formatter:function(param){
							console.log(param.value);
							if(param.value && param.value!=0){
								return param.value;
							}else{
								return '';
							}
						}
					},
					emphasis: {
						textStyle: {
							color: '#fffe00'
						}
					}
				},
				data: this.data
			}]
		};
		// console.log(option);
		this._myChart.setOption(option);
	};

	p.creationText = function(data) {
		var strHtml = '';
		$('a').remove('.chart4news');
		if (data.length) {
			for (var i = 0; i < data.length; i++) {
				strHtml += '<a class="chart4news anew' + i + '" eventid="' + data[i].seriesTitle + '">' + data[i].name + '</a>';
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



	WbstChart.HeaderLine = HeaderLine;
})();