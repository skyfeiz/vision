this.EE = this.EE || {};
(function(win, doc) {
	var hostUrl = "http://" + win.location.host + "/vision/eyes/";

	var P3Chart = function() {
		this.c = new EE.Controller();

		this._mapKIdVChart = {};

		this.ready();
	};

	var p = P3Chart.prototype;

	p.ready = function() {
		var _this = this;
		_this.c.ready(function(region) {
			_this.region = region;

			_this.c.getInit({
				region: region
			}, function(json) {
				_this.viewName = json.data[0].name;
				_this.viewId = json.data[0].seriesTitle;
				_this.getStatus();
				_this.init();
			});
		});
	};

	p.init = function() {
		var _this = this;
		this.$op = $('#tooltip');
		_this.bindMapNav();
		_this.dealNav(_this.viewId);
		_this.map = new EE.map(_this.viewId, function() {
			_this.c.getChartConfig('', function(data) {
				_this._config = data;
				_this.initChart();
				_this.changeData();
			});
		});

		_this.map.chinaClick = function(name, id) {
			_this.changeData();
			_this.dealNav(id, name);
		};
		_this.map.provinceBlankClick = function() {
			_this.dealNav("101");
			_this.map.clickChina(null, function() {
				_this.changeData();
			});
		};

		_this.map.cityBlankClick = function(obj) {
			_this.map.clickProvince(obj, function() {
				_this.changeData();
			});
		};
	};

	//	地图层级导航点击事件
	p.bindMapNav = function() {
		var _this = this;

		$(".mapNav span").eq(1).click(function() {
			var obj = {
				name: $(this).data("areaName"),
				id: $(this).data("id")
			};
			_this.map.clickProvince(obj, function() {
				_this.changeData();
			});
		});

		$(".mapNav span").eq(0).click(function() {
			_this.map.clickChina(null, function() {
				_this.changeData();
			});
		});
	};

	p.dealNav = function(id, name) {
		console.log(id, name)
		var index = id.split("_").length - 1;
		$(".mapNav span").each(function(i) {
			if (i > index)
				$(this).hide();
			else {
				if (i == index)
					$(this).text(name).data({
						"areaName": name,
						"areaId": id
					});
				$(this).show();
			}
		});
	};

	p.initChart = function() {
		var _this = this;
		//	群众正负意见分布
		_this.p3Chart1 = new WbstChart.ChartP3_1(doc.getElementById('p3Chart1'));
		_this.p3Chart1.setConfig(_this._config.p3Chart1.config);
		_this.p3Chart1.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<p class="tooltiptext"><span class="valuenum">' + item.item.xAxisValue + '</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this.p3Chart1.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});

		//	群众正负意见分布
		_this.p3Chart2 = new WbstChart.DashBoard(doc.getElementById('p3Chart2'));
		_this.p3Chart2.setConfig(_this._config.left1.config);
		_this.p3Chart2.EventDispatcher.on('click', function(evt, item) {
			_this.emotion = item;
			_this.changeData2();
		});
		//	关键词云
		_this.p3Chart5 = new WbstChart.Chart9(doc.getElementById('p3Chart5'));
		_this.p3Chart5.setConfig(_this._config.p3Chart5.config);
		_this.p3Chart5.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<p class="tooltiptext"><span class="valuenum">' + item.item.xAxisValue + '</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this.p3Chart5.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});
		// 媒体发热度排名
		_this.p3Chart4 = new WbstChart.Bar3d(doc.getElementById('p3Chart4'));
		_this.p3Chart4.setConfig(_this._config.left3.config);
		_this.p3Chart4.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<div class="tooltip_left3">' +
				'<p class="blockyellow">' + item.item.seriesName + '</p>' +
				'<p class="tooltiptext">' + item.item.xAxisValue +
				'<span class="fffpoint_lt"></span>' +
				'<span class="fffpoint_rb"></span>' +
				'</p>' +
				'</div>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this.p3Chart4.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});
	};

	p.changeData = function() {
		var _this = this;

		//	刷新意见
		_this.c.getOpinions_p3({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate,
			angle: _this.angle,
			eventId: _this.eventId,
		}, function(result) {
			var ary = [],
				sum = 0;
			for (var i in result.data) {
				sum += result.data[i];
				ary.push({
					"name": i,
					"num": result.data[i]
				});
			}
			ary.push({
				"name": "sum",
				"num": sum
			});
			_this.p3Chart2.setDataProvider(ary);
		});

		_this.changeData2();
	};

	p.changeData2 = function() {
		var _this = this;
		//	刷新地图打点数据
		_this.c.getMapData_P3({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate,
			angle: _this.angle,
			eventId: _this.eventId
		}, function(result) {
			console.log(999)
			_this.map.setDotAry(result.data);
		});
		//	刷新事件简介
		_this.c.getEventBrief_p3({
			eventId: _this.eventId
		}, function(result) {
			$(".p3chart3 .element-title-text").text(result.data.name);
			$(".p3chart3 .element-content p").text(result.data.description);
		});
		//	刷新媒体发热度排名
		_this.c.getMediaRange_p3({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate,
			angle: _this.angle,
			eventId: _this.eventId
		}, function(result) {
			_this.p3Chart4.setDataProvider(result.data);
		});
		//	刷新词云
		_this.c.getWorldCloud_p3({
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate,
			angle: _this.angle,
			eventId: _this.eventId
		}, function(result) {
			_this.p3Chart5.setDataProvider(result.data);
		});
		//	刷新30天事件曲线
		_this.c.getEventCurve_p3({
			region: _this.region,
			angle: _this.angle,
			eventId: _this.eventId,
		}, function(result) {
			_this.p3Chart1.setDataProvider(result.data);
		});

		_this.c.getOpinionList_p3({
			//	刷新list
			region: _this.region,
			startDate: _this.startDate,
			endDate: _this.endDate,
			angle: _this.angle,
			eventId: _this.eventId,
			emotion: _this.emotion
		}, function(result) {
			$(".p3chart2Text ul").empty();
			for (var i in result.data) {
				var $li = $("<li>" +
					"<h6>事件：<span>" + result.data[i].articleTitle + "</span></h6>" +
					"<p class='tips'>作者：<span>" + result.data[i].articleAuthor + "</span>来源：<span>" + result.data[i].articleSource + "</span></p>" +
					"<p class='tips'>时间：<span>" + result.data[i].articlePubtime + "</span></p>" +
					"<div class='abstract'>" +
					"<p>" +
					"简评：<span>" + result.data[i].articleAbstract + "</span>" +
					"</p>" +
					"<button>查看评论＞</button>" +
					"</div>" +
					"</li>");

				$(".p3chart2Text ul").append($li);
			}

			$(".p3chart2Text .barBox").remove();
			$(".p3chart2Text").unbind().buildScrollBar();
		});
	};

	p.showToolTip = function(text, x, y) {
		this.$op.html(text);
		var w = this.$op.width() + 20;
		var h = this.$op.height() + 20;
		if (x + w > $(window).innerWidth()) x = $(window).innerWidth() - w - 100;
		if (y + h > $(window).innerHeight()) y = $(window).innerHeight() - h;
		this.$op.css({
			opacity: 1,
			left: x + 20,
			top: y - 20
		});
	};

	p.hideToolTip = function() {
		this.$op.css({
			opacity: 0,
			left: -100,
			top: -100
		});
	};

	// 根据url获取状态
	p.getStatus = function() {
		var search = decodeURI(win.location.search).substring(1);
		var arr = search.split('&');

		if (!arr.length) {
			return;
		}

		var json = {}
		for (var i = 0; i < arr.length; i++) {
			var item = arr[i].split('=');
			json[item[0]] = item[1];
		}

		this.eventId = json.eventId;
		this.emotion = json.emotion;
		this.angle = this.getCookie('angle');
		this.regin = this.getCookie('regin');
	};

	// 获取cookie
	p.getCookie = function(name) {
		var arr = document.cookie.split('; ');
		for (var i = 0; i < arr.length; i++) {
			arr2 = arr[i].split('=');
			if (name == arr2[0]) {
				return arr2[1];
			}
		}
	}

	EE.P3Chart = P3Chart;
})(window, document);