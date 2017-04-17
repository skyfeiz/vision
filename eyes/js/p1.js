this.EE = this.EE || {};
(function(win,doc) {
	var P1Map = function() {
		this.c = new EE.Controller();

		this._mapKIdVChart = {};

		this.ready();
	};

	var p = P1Map.prototype;

	p.ready = function() {
		var _this = this;
		_this.c.ready(function(region) {
			_this.region = region;
			_this.c.getInit({
				region: region
			}, function(json) {
				_this.viewName = json.data[0].name;
				_this.viewId = json.data[0].seriesTitle;
				_this.init();
				_this.initDom();
			})
		});
	};

	p.init = function() {
		var _this = this;
		_this.s = new WBST.CitySelect(_this.viewName, _this.viewId);
		_this.t = new WbstChart.TimeLine('2010-08-08','2016-08-08');
		_this.map = new yu.map(_this.viewId,function(){

			_this.c.getChartConfig('',function(data){
				_this._config = data;
				_this.initChart();
			})
			//	时间轴
			_this.t.toChange = function(json) {
				_this.startDate = json.startDate;
				_this.endDate = json.endDate;
				_this.changeData();
			};

			$(document).trigger('mouseup');
		});
		//	选择城市改变地图
		_this.s.cityChange = function(obj) {
			_this.map.clickCity(obj, function(){
				_this.changeData();
			})
		};
		_this.s.provinceChange = function(obj) {
			_this.map.clickProvince(obj, function(){
				_this.changeData();
			})
		};
		_this.s.chinaChange = function() {
			_this.map.clickChina(null, function(){
				_this.changeData();
			});
		};
		//	点击地图改变视角
		_this.map.chinaClick = function(name, id) {
			_this.s.createLeft(name, id);
			_this.changeData();
		};
		/*_this.map.blankClick = function() {
			_this.s.createLeft("全国", "101");
			_this.s.chinaChange();
		};
		*/
		_this.map.cityBlankClick = function(obj) {
			_this.s.createLeft(obj.name, obj.id);
			_this.s.provinceChange(obj);
		};
		_this.map.provinceBlankClick = function() {
			_this.s.createLeft("全国", "101");
			_this.s.chinaChange();
		};

		// _this.map.getDots = function(id){
		// 	_this.c.getMapData_P1({
		// 		region: _this.region,
		// 		startDate: _this.startDate,
		// 		endDate: _this.endDate
		// 	})
		// };
	};

	p.initDom = function(){
		this.$op = $('#tooltip');
	}

	p.changeData = function() {
		var _this = this;
		_this.c.getLeft1Data({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate
		}, function(result) {
			_this._mapKIdVChart['left1'].setDataProvider(result.data);
		});

		_this.c.getLeft2Data({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate
		}, function(result) {
			_this._mapKIdVChart['left2'].setDataProvider(result.data);
		});

		_this.c.getLeft3Data({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate
		}, function(result) {
			_this._mapKIdVChart['left3'].setDataProvider(result.data);
		});
		//	刷新地图打点数据
		_this.c.getMapData_P1({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate
		},function(result){
			_this.map.setDotAry(result.data);
		});
	}

	
p.initChart = function() {
		var _this = this;
		// 仪表图 left1
		_this._dashChart = new WbstChart.DashBoard(doc.getElementById('left1'));
		_this._dashChart.setConfig(_this._config.left1.config);
		_this._mapKIdVChart['left1'] = _this._dashChart;
		// _this.getLeft1Data();

		// 舆情头条 left2
		_this._hearLineChart = new WbstChart.HeaderLine(doc.getElementById('chart2'));
		_this._hearLineChart.setConfig(_this._config.left2.config);
		_this._mapKIdVChart['left2'] = _this._hearLineChart;
		// _this.getLeft2Data();

		//媒体来源分布 left3
		_this._sourceChart = new WbstChart.Bar3d(doc.getElementById('left3'));
		_this._sourceChart.setConfig(_this._config.left3.config);
		_this._mapKIdVChart['left3'] = _this._sourceChart;
		_this._sourceChart.EventDispatcher.on('chartmouseover',function(evt,item){
			var str = '<div class="tooltip_left3">'+
		        	'<p class="blockyellow">'+item.item.seriesName+'</p>'+
		        	'<p class="tooltiptext">'+item.item.xAxisValue+
		        		'<span class="fffpoint_lt"></span>'+
		        		'<span class="fffpoint_rb"></span>'+
		        	'</p>'+
		        '</div>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		})

		_this._sourceChart.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		})
	}

	p.showToolTip = function(text, x, y) {
		this.$op.html(text);
		var w = this.$op.width() + 20;
		var h = this.$op.height() + 20;
		if (x + w > $(window).innerWidth()) x = $(window).innerWidth() - w;
		if (y + h > $(window).innerHeight()) y = $(window).innerHeight() - h;
		this.$op.css({
			opacity: 1,
			left: x+20,
			top: y-40
		});
	}

	p.hideToolTip = function(){
		this.$op.css({
			opacity: 0,
			left: -100,
			top: -100
		});
	}

	EE.P1Map = P1Map;
})(window,document);