this.WBST = this.WBST || {};
(function(win) {
	var CitySelect = function(name, id) {
		this.province = [];
		this.city = [];
		// 判断当前城市列表是否是 全部城市
		this.regionJson = {
			name: name,
			id: id
		}
		this.isAllCity = true;

		this.bCity = false;

		this.init(name, id);
	};

	var p = CitySelect.prototype;

	p.init = function() {
		this.initDom();
		this.getCityData();
		this.initCityBox();
	};

	p.initDom = function() {
		// 左侧父级
		this.$city = $('#city');
		// 右侧选择部分 
		this.$zCity = $('#z_city');
	};

	p.baseEvent = function() {
		var _this = this;
		var $close = $('#cColse');
		var timer = null;
		_this.$city.click(function(ev) {
			_this.$zCity.show();
			_this.$citybox.addClass('active');
			_this.$city.addClass('active');
			ev.stopPropagation();
		});

		_this.$city.mouseenter(function(){
			clearTimeout(timer);
			_this.$city.trigger('click');
		});

		_this.$city.mouseleave(function(){
			timer = setTimeout(function(){
				$close.trigger('click');
			},500);
		});

		this.$zCity.mouseenter(function(){
			clearTimeout(timer);
		});

		this.$zCity.mouseleave(function(){
			timer = setTimeout(function(){
				$close.trigger('click');
			},500);
		});

		$close.click(function(ev) {
			_this.$city.removeClass('active');
			_this.$citybox.removeClass('active');
			// _this.$zCity.hide();
			ev.stopPropagation();
		});

		

		// 点击document隐藏
		$(document).click(function(ev) {
			if (!_this.$zCity[0].contains(ev.target)) {
				_this.$city.removeClass('active');
				_this.$zCity.hide();
			};
		});

		if (!_this.bCity) {
			// 选择省 ，更新数据
			_this.$city0.on('click', 'a', function(ev) {
				var name = $(this).attr('data-name');
				var id = $(this).attr('data-id');
				_this.$city.html('<p>' +
					'<span data-id="' + id + '" data-name="' + name + '" title="' + name + '">' + name + '</span>' +
					'</p>');
				_this.$city.removeClass('active');
				_this.$zCity.hide();
				// 加载视图
				_this.provinceChange({
					name: name,
					id: id
				});

				ev.stopPropagation();
			});

			// 省 城市选项卡切换
			$('#_citysheng li').click(function(ev) {
				$(this).addClass('citySel').siblings().removeClass('citySel');
				switch ($(this).index()) {
					case 0:
						_this.$city0.show();
						_this.$city1.hide();
						break;
					case 1:
						_this.$city0.hide();
						_this.$city1.show();
						break;
				}
				ev.stopPropagation();
			});
		}

		// 选择城市 更新数据
		_this.$city1.on('click', 'a', function(ev) {
			var pname = $(this).attr('pdata-name');
			var pid = $(this).attr('pdata-id');
			var name = $(this).attr('data-name');
			var id = $(this).attr('data-id');
			_this.$city.html('<p><span data-id="' + id + '" data-name="' + name + '" pdata-id="' + pid + '" pdata-name="' + pname + '" title="' + name + '">' + name + '</span></p>');
			_this.$city.removeClass('active');
			_this.$zCity.hide();
			// 加载视图
			_this.cityChange({
				name: name,
				pName: pname
			});

			ev.stopPropagation();
		});

		// 搜索
		_this.$cityserch.click(function() {
			var val = _this.$cityinput.val();
			if (val == '') {
				// 判断当前显示是否是全部城市 ,是的话 直接return , 否则显示全部城市
				if (_this.isAllCity) {
					return;
				} else {
					_this.createCity();
				}
			} else {
				var arr = [];
				for (var i = 0, len = _this.city.length; i < len; i++) {
					if (_this.city[i].name.indexOf(val) != -1) {
						arr.push(_this.city[i]);
					}
				}
				_this.createCity(arr);
			}

		});
	};

	// 初始化时获取权限，1全国，正常初始化，2省，只显示该省的城市选择；
	// 默认权限同时为地区id
	p.initCityBox = function(name, id) {
		var _this = this;
		var name = _this.regionJson.name;
		var id = _this.regionJson.id;
		var arr = id.split('_');
		switch (arr.length) {
			case 1:
				// 权限为全国
				_this.initAll();
				_this.$city.html('<p><span data-id="' + arr[0] + '" data-name="全国">' + name + '</span></p>');
				break;
			case 2:
				// 权限为省
				_this.bCity = true;
				_this.initProvince(id);
				_this.$city.html('<p><span data-id="' + arr[1] + '" data-name="' + name + '" title="' + name + '">' + name + '</span>' +
					'</p>');
				break;
			case 3:
				// 权限为市
				var pid = arr[0] + '_' + arr[1];
				var pname = _this.province[pid].name;
				_this.$city.html('<p><span pdata-id="' + pid + '" pdata-name="' + pname + '" data-id="' + arr[2] + '" data-name="' + name + '" title="' + name + '">' + name + '</span>' +
					'</p>');
				break;
		}

	};

	p.initAll = function() {
		var dal = '<div class="citybox" id="citybox"><div class="_citys" id="_citys">' +
			'<span title="关闭" id="cColse" >×</span>' +
			'<ul id="_citysheng" class="_citys0">' +
			'<li class="citySel">省份</li>' +
			'<li>城市</li>' +
			'</ul>' +
			'<div style="display:none" id="_citys0" class="_citys1"></div>' +
			'<div id="_citys1" class="_citys1 _citys2">' +
			'<div class="citysearch">' +
			'<input class="searchinput" type="text" id="cityinput" />' +
			'<span class="searchbtn" id="cityserch">搜索</span>' +
			'</div>' +
			'<div class="cityscrollbox"></div>' +
			'</div>'+
			'</div>';
		this.$zCity.html(dal);
		this.$citybox = $('#citybox');
		this.$citys = $('#citys');
		this.$city0 = $('#_citys0');
		this.$city1 = $('#_citys1');
		this.$cityserch = $('#cityserch');
		this.$cityinput = $('#cityinput');
		this.createProvince();
		this.createCity();
		$('.cityscrollbox').buildScrollBar();
		this.$city0.show();
		this.$city1.hide();
		this.$zCity.hide();
		this.baseEvent();
	};

	p.initProvince = function(id) {
		var dal = '<div class="citybox" id="citybox"><div class="_citys" id="_citys">' +
			'<span title="关闭" id="cColse" >×</span>' +
			'<ul id="_citysheng" class="_citys0">' +
			'<li>城市</li>' +
			'</ul>' +
			'<div id="_citys1" class="_citys1 _citys2">' +
			'<div class="citysearch">' +
			'<input class="searchinput" type="text" id="cityinput" />' +
			'<span class="searchbtn" id="cityserch">搜索</span>' +
			'</div>' +
			'<div class="cityscrollbox"></div>' +
			'</div>' +
			'</div>';
		this.$zCity.html(dal);
		this.$citybox = $('#citybox');
		this.$citys = $('#citys');
		this.$city1 = $('#_citys1');
		this.$cityserch = $('#cityserch');
		this.$cityinput = $('#cityinput');
		this.createCity(this.getThisCity(id));
		$('.cityscrollbox').buildScrollBar();
		this.$zCity.hide();
		this.baseEvent();
	};

	p.getCityData = function() {
		var c = province;
		var city = [];
		for (var name in c) {
			if (c[name].sub) {
				for (var sname in c[name].sub) {
					city.push(c[name].sub[sname]);
				}
			}
		}
		this.province = c;
		this.city = city;
	};

	p.createProvince = function() {
		var province = this.province;
		var strHtml = '';
		for (var name in province) {
			strHtml += '<a data-id="' + name + '" data-name="' + province[name]['name'] + '">' + province[name]['name'] + '</a>';
		}
		this.$city0.html(strHtml);
	};

	p.createCity = function(arr) {
		var city;
		if (arr) {
			city = arr;
			this.isAllCity = false;
		} else {
			city = this.city;
			this.isAllCity = true;
		}
		if (city.length == 0) {
			this.$city1.find('.cityscrollbox').html('<p style="color:#fff; text-align:center">没有相关城市</p>');
			return
		}
		var strHtml = '<div>';
		for (var i = 0, len = city.length; i < len; i++) {
			strHtml += '<a data-id="' + city[i].id + '" data-name="' + city[i]['name'] + '" title="' + city[i]['name'] + '" pdata-name="' + city[i]['pname'] + '" pdata-id="' + city[i]['pid'] + '">' + city[i]['name'] + '</a>';
		}
		strHtml += '</div>';
		this.$city1.find('.cityscrollbox').html(strHtml);
		$('.cityscrollbox').buildScrollBar();
	};

	// 获取当前省的城市列表  传入当前省的id
	p.getThisCity = function(id) {
		var arr = [];
		if (this.province[id].sub) {
			for (var name in this.province[id].sub) {
				arr.push(this.province[id].sub[name])
			}
		}

		return arr;
	};
	// 创建左侧分全国、省，当为 市权限时左侧只能为市

	p.createLeft = function(name, id) {
		var _this = this;
		var arr = id.split('_');
		var strHtml = '';
		var regionArr = _this.regionJson.id.split('_');
		if (regionArr.length > arr.length) {
			arr = regionArr;
			var name = _this.regionJson.name;
			var id = _this.regionJson.id;
		}
		switch (arr.length) {
			case 1:
				strHtml = '<p><span data-id="101" data-name="全国">全国</span></p>';
				break;
			case 2:
				strHtml = '<p><span data-id="' + id + '" data-name="' + name + '" title="' + name + '">' + name + '</span>' +
					'</p>';
				break;
			case 3:
				var pid = arr[0] + '_' + arr[1];
				var pname = _this.province[pid].name;
				strHtml = '<p><span data-id="' + id + '" data-name="' + name + '" pdata-id="' + pid + '" pdata-name="' + pname + '" title="' + name + '">' + name + '</span>' +
					'</p>';
				break;
		}
		_this.$city.html(strHtml);
	};

	WBST.CitySelect = CitySelect;
})(window);