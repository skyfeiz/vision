this.WbstChart = this.WbstChart || {};
(function() {
	var Chart8 = function(dom) {
		this._dom = dom;

		this.EventDispatcher = $({});

		this.init();
	};

	var p = Chart8.prototype;

	p.init = function() {
		this._myChart = echarts.init(this._dom);

		var _this = this;

		_this._myChart.on('mouseover', function(param) {
			var item = {};
			item.seriesName = param.name;
			item.xAxisValue = param.value;
			var evt = param.event.event;
			_this.EventDispatcher.trigger('chartmouseover', {
				item: item,
				event: evt
			});
		});

		_this._myChart.on('mouseout', function() {
			_this.EventDispatcher.trigger('chartmouseout');
		});

		_this._myChart.on('click', function(param) {
			_this.EventDispatcher.trigger('click', param);
		});

		this.initDom();
	};

	p.initDom = function() {
		this.$pietip = $('#pietip');
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

		var seriesData = [];
		var legendData = [];
		var total = {};
		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			if (this._dataProvider[i].name == '总数') {
				total.name = '总数';
				total.value = this._dataProvider[i].num;
			} else {
				seriesData.push({
					name: this._dataProvider[i].name,
					value: this._dataProvider[i].num
				})
				legendData.push({
					name: this._dataProvider[i].name,
					icon: 'rect'
				});
			}
		}

		this.$pietip.html('<span class="piecn">舆情总数</span><span class="pienum">' + total.value + '</span>');

		var option = {
			animationDuration: 3000,
			color: ['#ed3f49', '#32ccc3', '#fed61c'],
			legend: {
				itemWidth: 7,
				itemHeight: 3,
				data: legendData,
				orient: 'vertival',
				bottom: '8%',
				left: '7%',
				padding: 2,
				textStyle: {
					color: '#81d6ff'
				},
			},
			gird: {
				left: '5%',
				top: '5%',
				right: '5%',
				bottom: '5%'
			},
			series: [{
				z: 1,
				type: 'pie',
				radius: ['8%', '10%'],
				center: ['50%', '55%'],
				silent: true,
				label: {
					normal: {
						show: false
					}
				},
				itemStyle: {
					normal: {
						color: '#4e5766'
					}
				},
				data: [{
					name: '背景1',
					value: 1
				}]
			}, {
				z: 2,
				type: 'pie',
				radius: ['55%', '63%'],
				center: ['50%', '55%'],
				silent: true,
				label: {
					normal: {
						show: false
					}
				},
				itemStyle: {
					normal: {
						color: 'rgba(16,29,47,0.5)'
					}
				},
				data: [{
					name: '背景2',
					value: 1
				}]
			}, {
				z: 3,
				type: 'pie',
				radius: ['68%', '69%'],
				center: ['50%', '55%'],
				silent: true,
				label: {
					normal: {
						show: false
					}
				},
				itemStyle: {
					normal: {
						color: '#394352'
					}
				},
				data: [{
					name: '背景3',
					value: 1
				}]
			}, {
				name: '来源',
				type: 'pie',
				radius: ['17%', '45%'],
				center: ['50%', '55%'],
				data: seriesData,
				label: {
					normal: {
						show: true,
						formatter: function(param) {
							return param.name + '\n' + param.value + '\n' + Math.round(param.percent) + '%';
						}
					}
				},
				labelLine: {
					normal: {
						show: true,
						length: 30,
						length2: 10
					}
				},
				z: 4,
			}]
		};
		this._myChart.setOption(option);
	};

	WbstChart.Chart8 = Chart8;
})();