this.EE = this.EE || {};
(function(win, doc) {
	var hostUrl = "http://" + win.location.host + "/eems/eyes/";
	// var hostUrl = "http://" + win.location.host + "/vision/eyes/";

	var P1Map = function() {
		this.c = new EE.Controller();

		this._mapKIdVChart = {};

		this.timer = null;

		this.startDate = '2017-04-01';
		

		this.ready();
	};

	var p = P1Map.prototype;

	p.ready = function() {
		var _this = this;
		_this.c.ready(function(region) {
			_this.c.getInit({
				region: region
			}, function(json) {
				// 初始的视角
				_this.region = json.data[0].seriesTitle;
				_this.regionName = json.data[0].name;
				_this.viewName = json.data[0].name;
				_this.viewId = json.data[0].seriesTitle;

				// 情感默认为总数
				_this.emotion = 'sum';
				_this.sign = 1;

				_this.c.getNowTime({},function(result){
					_this.endDate = result;
					_this.init();
					_this.initDom();
				});
			})
		});
	};

	p.init = function() {
		var _this = this;
		_this.s = new WBST.CitySelect(_this.viewName, _this.viewId);
		_this.t = new WbstChart.TimeLine(this.startDate,_this.endDate);

		// 信息预处理
		_this.initData(function(event) {
			_this.map = new EE.map(_this.viewId, function() {
				console.log("地图形成-------------------------------")
				_this.c.getChartConfig('', function(data) {
					_this._config = data;
					_this.initChart();
				});
				//	时间轴
				_this.t.toChange = function(json) {
					_this.startDate = json.startDate;
					_this.endDate = json.endDate;
					_this.initData(function(event) {
						_this.changeData(event)
					});
				};
				//				$(document).trigger('mouseup');
				$("#setnow").trigger('click');
			});


			//			选择城市改变地图
			_this.s.cityChange = function(obj) {
				console.log(obj);
				_this.viewName = obj.name;
				_this.viewId = obj.id;
				_this.map.clickCity(obj, function() {
					_this.initData(function() {
						_this.changeData()
					});
				});
			};
			_this.s.provinceChange = function(obj) {
				_this.viewName = obj.name;
				_this.viewId = obj.id;
				_this.map.clickProvince(obj, function() {
					//					_this.initData(function(){
					//						_this.changeData()
					//					});
				});
			};
			_this.s.chinaChange = function() {
				_this.viewName = '全国';
				_this.viewId = '101';
				_this.map.clickChina(null, function() {
					_this.initData(function() {
						_this.changeData()
					});
				});
			};
			//	点击地图改变视角
			_this.map.chinaClick = function(name, id) {
				_this.viewName = name;
				_this.viewId = id;
				var len = id.split("_").length;
				if (len == 0)
					_this.sign = 1;
				else
					_this.sign = 2;

				_this.s.createLeft(name, id);
				_this.initData(function() {
					_this.changeData()
				});
			};
			_this.map.cityBlankClick = function(obj) {
				_this.viewName = obj.name;
				_this.viewId = obj.id;
				_this.sign = 2;
				_this.s.createLeft(obj.name, obj.id);
				_this.s.provinceChange(obj);
			};
			_this.map.provinceBlankClick = function() {
				_this.viewName = '全国';
				_this.viewId = '101';
				_this.sign = 1;
				_this.s.createLeft("全国", "101");
				_this.s.chinaChange();
			};
		});
	};

	p.initDom = function() {
		this.$op = $('#tooltip');
	};

	p.initData = function(fn) {
		var _this = this;
		console.log(_this.viewId);
		if (_this.viewId.indexOf(_this.region) == -1) {
			_this.viewId = _this.region;
		}

		_this.c.getInitHeadlines({
			region: _this.viewId,
			startDate: _this.startDate,
			endDate: _this.endDate,
			attribute: 'sum'
		}, function(json) {
			_this.events = json.data;
			fn && fn(json.data);
		})
	};

	p.autoRefresh = function() {
		var _this = this;
		clearInterval(_this.timer);
		_this.timer = setInterval(function(){
			console.log('自动刷新了');
			_this.initData(function() {
				_this.changeData();
			});
		},7200000);
	};

	p.changeData = function(event) {
		var _this = this;

		// 判断视角 超出权限 
		if (_this.viewId.indexOf(_this.region) == -1) {
			_this.viewId = _this.region;
		}

		_this.c.getLeft1Data({
			region: _this.viewId,
			startDate: _this.startDate,
			endDate: _this.endDate
		}, function(result) {
			_this._mapKIdVChart['left1'].setDataProvider(result.data);
		});

		_this.changeData2(event);
	};

	p.changeData2 = function(event) {
		var _this = this;
		_this.events = event || _this.events;
		_this.autoRefresh();
		if (_this.viewId.indexOf(_this.region) == -1) {
			_this.viewId = _this.region;
		}

		_this.c.getLeft2Data({
			attribute: _this.emotion,
			region: _this.viewId,
			startDate: _this.startDate,
			endDate: _this.endDate,
			event: _this.events
		}, function(result) {
			_this._mapKIdVChart['left2'].setDataProvider(result.data);
		});

		_this.c.getLeft3Data({
			attribute: _this.emotion,
			region: _this.viewId,
			startDate: _this.startDate,
			endDate: _this.endDate,
			event: _this.events
		}, function(result) {
			_this._mapKIdVChart['left3'].setDataProvider(result.data);
		});
		//	刷新地图打点数据
		console.log(_this.viewId);
		console.log("地图视角" + _this.emotion)
		_this.c.getMapData_P1({
			attribute: _this.emotion,
			region: _this.viewId,
			startDate: _this.startDate,
			endDate: _this.endDate,
			sign: _this.sign
		}, function(result) {
			_this.map.setDotAry(result.data);
		});
	};

	p.initChart = function() {
		var _this = this;
		// 仪表图 left1
		_this._dashChart = new WbstChart.DashBoard(doc.getElementById('left1'));
		_this._dashChart.setConfig(_this._config.left1.config);
		_this._mapKIdVChart['left1'] = _this._dashChart;

		_this._dashChart.EventDispatcher.on('click', function(evt, item) {
			_this.emotion = ['negative', 'neutral', 'positive', 'sum'][item + 1];
			console.log(_this.emotion);
			_this.changeData2();
		});
		// _this.getLeft1Data();

		// 舆情头条 left2
		_this._hearLineChart = new WbstChart.HeaderLine(doc.getElementById('chart2'));
		_this._hearLineChart.setConfig(_this._config.left2.config);
		_this._mapKIdVChart['left2'] = _this._hearLineChart;

		_this._hearLineChart.EventDispatcher.on('click', function(evt, item) {
			// 事件id，情感 视角，视角区域id		通过url传递
			var arr = _this.endDate.split('-');
			var sDate, eDate;
			if (arr.length == 2) {
				var oDate = new Date(_this.endDate);
				oDate.setMonth(arr[1],0);
				sDate = _this.startDate + '-01';
				eDate = _this.endDate + '-'+ (oDate.getDate());
			} else {
				sDate = _this.startDate;
				eDate = _this.endDate;
			}
			win.location.href = encodeURI(hostUrl + 'p3.html?header=0&eventId=' + item + '&emotion=' + _this.emotion + '&angle=' + _this.viewName + '&regin=' + _this.viewId + '&startDate=' + sDate + '&endDate=' + eDate);

		});
		// _this.getLeft2Data();

		//媒体来源分布 left3
		_this._sourceChart = new WbstChart.Bar3d(doc.getElementById('left3'));
		_this._sourceChart.setConfig(_this._config.left3.config);
		_this._mapKIdVChart['left3'] = _this._sourceChart;
		_this._sourceChart.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<div class="tooltip_left3">' +
				'<p class="blockyellow">' + item.item.seriesName + '</p>' +
				'<p class="tooltiptext">' + item.item.xAxisValue +
				'<span class="fffpoint_lt"></span>' +
				'<span class="fffpoint_rb"></span>' +
				'</p>' +
				'</div>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});

		_this._sourceChart.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});
	};

	p.showToolTip = function(text, x, y) {
		this.$op.html(text);
		var w = this.$op.width() + 20;
		var h = this.$op.height() + 20;
		if (x + w > $(win).innerWidth()) x = $(win).innerWidth() - w;
		if (y + h > $(win).innerHeight()) y = $(win).innerHeight() - h;
		this.$op.css({
			opacity: 1,
			left: x + 20,
			top: y - 40
		});
	};

	p.hideToolTip = function() {
		this.$op.css({
			opacity: 0,
			left: -100,
			top: -100
		});
	};

	EE.P1Map = P1Map;

})(window, document);