this.WbstChart = this.WbstChart || {};
(function() {
	var chartP6_map = function(dom) {
		this._dom = dom;
		this.EventDispatcher = $({});
		this.init();
	};

	var p = chartP6_map.prototype;

	p.init = function() {
		var _this = this;
		_this._myChart = echarts.init(this._dom);

		_this._myChart.on('mouseover', function(param) {
			_this.EventDispatcher.trigger('chartmouseover', param);
		});

		_this._myChart.on('mouseout', function() {
			_this.EventDispatcher.trigger('chartmouseout');
		});
	};


	p.setConfig = function(value) {
		/*{
			"title": "",
			fromName: "",
			toName: "",
			fromCoord: [],
			toCoord: [],
			scatterName: "",
			scatterCoord: [],
			scatterNum: 
		}*/
		this._config = value;
		this.creationContent();
	};

	p.setDataProvider = function(value) {
		this._dataProvider = value;
		this.creationContent();
	};

	p.creationContent = function() {
		var _this = this;
		if (this._config == null || this._dataProvider == null) {
			return;
		}

		var lineAry = [],
			scatterAry = [],
			totalNum = 0;

		this._dataProvider.forEach(function(val, i) {
			if (_this._config["fromName"] && _this._config["toName"] && _this._config["fromCoord"] && _this._config["toCoord"]) {
				lineAry.push({
					"fromName": val[_this._config["fromName"]],
					"toName": val[_this._config["toName"]],
					"coords": [val[_this._config["fromCoord"]], val[_this._config["toCoord"]]]
				});
			}

			scatterAry.push({
				name: val[_this._config["scatterName"]],
				value: val[_this._config["scatterCoord"]].concat(val[_this._config["scatterNum"]])
			});
		});

		scatterAry.push({
			name:this._dataProvider[0][_this._config["toName"]],
			value:this._dataProvider[0][_this._config["endCoord"]].concat(this._dataProvider[0][_this._config["endNum"]])
		})

		var series = [];
		series.push({
				name: this._dataProvider[0][this._config["title"]],
				type: 'lines',
				zlevel: 1,
				effect: {
					show: true,
					period: 1.5,
					trailLength: 0.5,
					color: '#fff',
					symbolSize: 1.3
				},
				lineStyle: {
					normal: {
						color: "#ffff01",
						width: 0,
						curveness: 0.2
					}
				},
				data: lineAry
			},
			/*{
			    name: this._dataProvider[0][this._config["title"]],
			    type: 'lines',
			    zlevel: 2,
			    lineStyle: {
			        normal: {
			            color: "#ffff01",
			            width: 1,
			            opacity: 0.6,
			            curveness: 0.2
			        }
			    },
			    data: lineAry
			},*/
			{
				name: this._dataProvider[0][this._config["title"]],
				type: 'effectScatter',
				coordinateSystem: 'geo',
				zlevel: 2,
				rippleEffect: {
					brushType: 'stroke'
				},
				label: {
					normal: {
						show: true,
						position: 'right',
						formatter: '{b}',
						textStyle: {
							color: "#3fc0ff"
						}
					}
				},
				symbolSize: function(val) {
					return val[2] / 2;
				},
				itemStyle: {
					normal: {
						color: "#fff71d"
					}
				},
				data: scatterAry
			});

		var option = {
			geo: {
				map: 'china',
				show: false,
				left: "33.95%",
				top: "12.96%",
				bottom: "12.78%",
				right: "5.6%"
			},
			series: series
		};

		this._myChart.setOption(option);
	};

	WbstChart.chartP6_map = chartP6_map;
})();