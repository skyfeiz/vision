this.WbstChart = this.WbstChart || {};
(function() {
	var chartP6_map = function(dom) {
		this._dom = dom;
		this.EventDispatcher = $({});

		this.playData = [];

		this.humenData = [];

		this.silent = false;
		this.init();
	};

	var p = chartP6_map.prototype;

	p.init = function() {
		var _this = this;
		_this._myChart = echarts.init(this._dom);

		_this._myChart.on('mouseover', function(param) {
			_this.EventDispatcher.trigger('chartmouseout');
			_this.bPause = true;
			param.humenData = _this.humenData[param.dataIndex];
			_this.EventDispatcher.trigger('chartmouseover', param);
		});

		_this._myChart.on('mouseout', function() {
			_this.bPause = false;
			_this.inow = 0;
			_this.EventDispatcher.trigger('chartmouseout');
		});

		_this.autoPlay();
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
		var $canvas1 = $(this._dom).find('canvas').eq(0);
		if (this._dataProvider.length == 0) {
			this._myChart.clear();
			$canvas1.hide();
			return;
		} else {
			$canvas1.show();
		}

		var lineAry = [],
			scatterAry = [],
			totalNum = 0;

		for (var i = 0, len = this._dataProvider.length; i < len; i++) {
			this._dataProvider[i].startCoor && (this._dataProvider[i].startCoor = eval(this._dataProvider[i].startCoor).reverse());
			this._dataProvider[i].endCoor && (this._dataProvider[i].endCoor = eval(this._dataProvider[i].endCoor).reverse());
			this.humenData.push({
				name: this._dataProvider[i].user,
				position: this._dataProvider[i].position,
				image: this._dataProvider[i].image
			});
		}
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
			name: this._dataProvider[0][_this._config["toName"]],
			value: this._dataProvider[0][_this._config["endCoord"]].concat(this._dataProvider[0][_this._config["endNum"]])
		})

		var series = [];

		series.push({
			name: this._dataProvider[0][this._config["title"]],
			type: 'lines',
			zlevel: 1,
			effect: {
				show: true,
				period: 2,
				trailLength: 0.5,
				symbol: 'circle',
				color: '#ffff01',
				symbolSize: 2
			},
			lineStyle: {
				normal: {
					color: "#ffff01",
					width: 0,
					curveness: 0.2
				}
			},
			data: lineAry
		}, {
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
		}, {
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
				var n = 1*val[2] / 2;
				if (n>16) {n = 16}
				if (!n) {
					return 8
				};
				return n > 6 ? n : 6;
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
		this.getPlayData();
	};

	p.getPlayData = function() {
		var _this = this;
		_this.playData = [];
		for (var i = 0; i < this._dataProvider.length; i++) {
			var item = this._dataProvider[i];
			if (item.image) {
				var arr = this._myChart.convertToPixel('geo', item.endCoor);
				this.playData.push({
					humenData:{
						position: item.position,
						name: item.user,
						image: item.image,
					},
					event: {
						event: {
							pageX: arr[0],
							pageY: arr[1]
						}
					}
				});
			}
		}
		console.log(_this.playData);
	};

	p.autoPlay = function() {
		var _this = this;
		_this.iNow = 0;
		_this.bPause = false;
		function fn(){
			var len = _this.playData.length;
			console.log(_this.bPause,len,_this.silent);
			if (!_this.bPause && len && _this.silent) {
				_this.iNow++;
				_this.iNow%=len;
				_this.EventDispatcher.trigger('chartmouseout');
				_this.EventDispatcher.trigger('chartmouseover',_this.playData[_this.iNow]);
			}
			setTimeout(fn,4000);
			
		}
		fn();
	};



	WbstChart.chartP6_map = chartP6_map;
})();