this.EE = this.EE || {};
(function(win, doc) {
	var hostUrl = "http://" + win.location.host + "/eems/sys/jsp/eyes/"; 

	var Anreport = function() {
		this.c = new EE.Controller();

		this._mapKIdVChart = {};

		this.ready();
	};

	var p = Anreport.prototype;

	p.ready = function() {
		var _this = this;
		_this.c.ready(function(region) {
			_this.sign = 1;
			// region 权限  regin 视角id
			_this.region = region;
			_this.getStatus();
			_this.init();
			_this.initEvent();
		});
	};

	p.initEvent = function(){
		var _this = this;
		var $p3ulList = $('#p3ulList');
		$p3ulList.on('click','h6',function(ev){
			var html = $(this).find('span').html();
			ev.stopPropagation();
			win.location.href = encodeURI(hostUrl+'details.html?type=3&eventName='+html+'&emotion='+_this.emotion);
		})

		$p3ulList.on('click','button',function(ev){
			$(this).parant().parant().find('h6').trigger('click');
			ev.stopPropagation();
		})
	};

	p.init = function() {
		var _this = this;
		this.$op = $('#tooltip');
		
		_this.c.getChartConfig('', function(data) {
			_this._config = data;
			_this.initChart();
			// 判断视角 超出权限 
			_this.changeData();
			//	刷新词云
			_this.c.getP8WorldCloudData({
				regin: _this.regin,
				startDate: _this.startDate,
				endDate: _this.endDate,
				angle: _this.angle,
				eventId: _this.eventId
			}, function(result) {
				console.log("刷新词云");
				_this.p3Chart5.setDataProvider(result.data);
			});

			//	刷新30天事件曲线
			_this.c.getP8Chart2Data({
				regin: _this.regin,
				angle: _this.angle,
				eventId: _this.eventId,
			}, function(result) {
				console.log('刷新30天事件曲线');
				_this.p3Chart1.setDataProvider(result.data);
			});

			//	刷新事件简介
			_this.c.getP8ExplainData({
				eventId: _this.eventId
			}, function(result) {
				console.log('刷新事件简介');
				$(".p3chart3 .element-title-text").text(result.data.name);
				$(".p3chart3 .element-content p").text(result.data.description);
			});
		});
	};

	p.initChart = function() {
		var _this = this;
		_this.p8chart1 = new WbstChart.P8chart1(doc.getElementById('p8chart1'));
		_this.p8chart1.setConfig(_this._config.p8chart1.config);
		_this.p8chart1.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<p class="tooltiptext"><span class="valuenum">' + item.item.seriesName + '</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this.p8chart1.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});

		//	群众正负意见分布
		_this.p3Chart1 = new WbstChart.ChartP3_1(doc.getElementById('p3Chart1'));
		_this.p3Chart1.setConfig(_this._config.p3Chart1.config);
		_this.p3Chart1.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<p class="tooltiptext"><span class="valuename">' + item.item.seriesName + ' :</span><span class="valuenum">' + item.item.xAxisValue + '</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
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
		_this.p3Chart5.EventDispatcher.on('click', function(evt, item) {
			win.location.href = encodeURI(hostUrl + 'details.html?type=4&eventName=' + item + '&emotion=' + _this.emotion);
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
		console.log('刷新意见');
		_this.c.getP8Chart3Data({
			regin: _this.regin,
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

			_this.p3Chart2._key = (2-_this.emotion)%4;
			_this.p3Chart2.setDataProvider(ary);
		});

		_this.changeData2();
	};

	p.changeData2 = function() {
		var _this = this;

		//	刷新媒体发热度排名
		_this.c.getP8Chart4Data({
			regin: _this.regin,
			startDate: _this.startDate,
			endDate: _this.endDate,
			angle: _this.angle,
			eventId: _this.eventId
		}, function(result) {
			console.log('刷新媒体发热度排名');
			_this.p3Chart4.setDataProvider(result.data);
		});

		// 	刷新散点关系图
		_this.c.getP8Chart1Data({

		},function(result){
			_this.p8chart1.setDataProvider(result.data);
		})

		_this.c.getP8Chart3ListData({
			//	刷新list
			regin: _this.regin,
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
		switch(json.emotion){
			case 'positive':
				this.emotion = 1;
				break;
			case 'neutral':
				this.emotion = 0;
				break;
			case 'negative':
				this.emotion = -1;
				break;
			default:
				this.emotion = 2;
				break;
		}
		this.angle = json.angle;
		this.regin = json.regin;
	};

	EE.Anreport = Anreport;
})(window, document);



