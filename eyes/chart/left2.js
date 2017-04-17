this.WbstChart = this.WbstChart || {};
(function() {
	var HeaderLine = function(dom) {
		this._dom = dom;

		this.init();
	};

	var p = HeaderLine.prototype;

	p.init = function() {
		this._headLineChart = echarts.init(this._dom);

		this.initDom();
	};

	p.initDom = function() {
		this.$newsbox = $('#left2news');
	}

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
			data.push(this._dataProvider[i].num);
		}
		data = data.reverse();
		var option = {
			animationDuration:3000,
			animationDurationUpdate: 3000,
			toolTip: {
				show: true,
				trigger: 'item'
			},
			grid: {
				left: 0,
				right: '8%',
				top: '5%',
				bottom: '2%'
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
				barGap:'100%',
				barCategoryGap: '40%',
				itemStyle: {
					normal: {
						color: '#fff',
						shadowColor: '#1085ff',
						shadowBlur: 10,
					}
				},
				label: {
					normal: {
						show: true,
						position: 'right',
						offset: [0, -2]
					}
				},
				data: data
			}]
		};
		this.creationText(this._dataProvider);

		this._headLineChart.setOption(option);
	}

	p.creationText = function(data) {
		var strHtml = '';
		if (data.length) {
			for (var i = 0; i < data.length; i++) {
				strHtml += '<li><a href="javascript:;">'+data[i].title+'</a></li>'
			}
			this.$newsbox.html(strHtml);
		}
	}



	WbstChart.HeaderLine = HeaderLine;
})();