this.EE = this.EE || {};
(function(win) {
	var P2Map = function() {
		this.c = new EE.Controller();
		this.ready();
	};

	var p = P2Map.prototype;

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
				_this.headerEvent();
			})
		});
	};

	p.init = function() {
		var _this = this;
		_this.s = new WBST.CitySelect(_this.viewName, _this.viewId);
		//	时间轴
		_this.t = new WbstChart.TimeLine();
		_this.wbst = new WBST.Page();
		_this.t.toChange = function(json) {
			_this.startDate = json.startDate;
			_this.endDate = json.endDate;

			_this.changeData();

		};

		$(document).trigger('mouseup');


		// _this.map = new yu.map();
		// _this.s.cityChange = function(obj) {
		// 	_this.map.clickCity(obj)
		// };
		// _this.s.provinceChange = function(name) {
		// 	_this.map.clickProvince(name)
		// };
		// _this.s.chinaChange = function() {
		// 	_this.map.clickChina()
		// };
		// _this.map.chinaClick = function(name, id) {
		// 	_this.s.createLeft(name, id);
		// };

	};

	p.initDom = function() {
		this.$headernav = $('#headernav');
		this.$navA = this.$headernav.find('a');
		this.$light = this.$headernav.find('.navlight');

		this.$showuser = $('#showuser');
	};

	p.headerEvent = function() {
		var _this = this;
		var iNow = 0;
		_this.$navA.mouseover(function() {
			var index = $(this).index('a');
			_this.$light.stop().animate({
				left: (0.28 + index * 1.2) + 'rem'
			});
		});
		_this.$navA.mouseout(function() {
			_this.$light.stop().animate({
				left: (0.28 + iNow * 1.2) + 'rem'
			});
		});

		_this.$navA.click(function() {
			_this.$navA.removeClass('active');
			$(this).addClass('active');
			iNow = $(this).index('a');
		});

		// 设置登录用户名
		_this.$showuser.html(win.localStorage.loginName);
	};

	p.changeData = function() {
		var _this = this;
		_this.c.getLeft1Data({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate
		}, function(result) {
			_this.wbst._mapKIdVChart['left1'].setDataProvider(result.data);
		});

		_this.c.getLeft2Data({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate
		}, function(result) {
			_this.wbst._mapKIdVChart['left2'].setDataProvider(result.data);
		});

		_this.c.getLeft3Data({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate
		}, function(result) {
			_this.wbst._mapKIdVChart['left3'].setDataProvider(result.data);
		});
	};


	EE.P2Map = P2Map;
})(window);