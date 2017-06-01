this.EE = this.EE || {};
(function(win, doc) {
	var hostUrl = "http://" + win.location.host + "/eems/sys/jsp/eyes/";

	var Wbreport = function() {
		this.c = new EE.Controller();

		this._mapKIdVChart = {};

		this.ready();
	};

	var p = Wbreport.prototype;

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
		
		this.initDom();

		_this.c.getChartConfig('', function(data) {
			_this._config = data;
			_this.initChart();
			// 判断视角 超出权限 
			_this.changeData();
			//	刷新词云
			_this.c.getWbreport6Data({
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
			//http://47.93.4.100:8181/eems/sina/getSinaData.action?sina=https%3A%2F%2Fapi-open-beta.51wyq.cn%2Fdscar%2Fapi%2Fenvironmental%2FsingleTimeDiagram%26json%3D%7Bindex%3D1%7D
			//http://47.93.4.100:8181/eems/sina/getSinaData.action?sina=https%3A%2F%2Fapi-open-beta.51wyq.cn%2Fdscar%2Fapi%2Fenvironmental%2FsingleTimeDiagram&json=%7Bindex%3D1%7D
			_this.c.getWbreport1Data({
				sina:'https://api-open-beta.51wyq.cn/dscar/api/environmental/singleTimeDiagram',
				json:'{index=1}'
			}, function(result) {
				console.log(result);
				// _this.p3Chart1.setDataProvider(result.data);
			});

			//	刷新事件简介
			_this.c.getWbreport4Data({
				eventId: _this.eventId
			}, function(result) {
				console.log('刷新事件简介');
				$(".p3chart3 .element-title-text").text(result.data.name);
				$(".p3chart3 .element-content p").text(result.data.description);
			});
		});
	};

	p.initDom = function(){
		this.$op = $('#tooltip');
		this.$commentLimit1 = $('#commentLimit1');
		this.$commentLimit2 = $('#commentLimit2');
	};

	p.initChart = function() {
		var _this = this;
		_this.p8chart1 = new WbstChart.Wbreport0(doc.getElementById('p8chart1'));
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


		// 转发地域分布
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

		_this.changeData2();
	};

	p.changeData2 = function() {
		var _this = this;

		//	转发地域分布
		_this.c.getWbreport5Data({
			regin: _this.regin,
			startDate: _this.startDate,
			endDate: _this.endDate,
			angle: _this.angle,
			eventId: _this.eventId
		}, function(result) {
			console.log('转发地域分布');
			_this.p3Chart4.setDataProvider(result.data);
		});

		// 	刷新散点关系图
		_this.c.getWbreport0Data({
			sina:'https://api-open-beta.51wyq.cn/dscar/api/environmental/environmentalResultStar',
			json:'{index=1}'
		},function(result){
			_this.p8chart1.setDataProvider(result.data);
		})


		_this.c.getWbreport2Data({
			//	刷新意见领袖
			regin: _this.regin,
			startDate: _this.startDate,
			endDate: _this.endDate,
			angle: _this.angle,
			eventId: _this.eventId
		}, function(result) {
			if (result.data.length) {
				var strHtml = '<ul class="commentWeibo">';
				for (var i = 0; i < result.data.length; i++) {
					strHtml+='<li>'+
                        '<div class="commentImgBox">'+
                            '<img src="images/weibo/userimg.png" alt="" />'+
                        '</div>'+
                        '<div class="p_titleBox clearfix">'+
                            '<h4 class="p_title fl">'+result.data[i].title+'</h4>'+
                            '<p class="p_info fr">'+
                                '<span class="p_infoname">关注</span>'+
                                '<span class="p_infovalue">'+result.data[i].guanzhu+'</span>'+
                                '<span class="p_infoname">粉丝</span>'+
                                '<span class="p_infovalue">'+result.data[i].fans+'</span>'+
                                '<span class="p_infoname">微博</span>'+
                                '<span class="p_infovalue">'+result.data[i].weibo+'</span>'+
                            '</p>'+
                        '</div>'+
                        '<p class="p_content">'+result.data[i].replyContent+'</p>'+
                    '</li>';
				}
				_this.$commentLimit1.html(strHtml);
				_this.$commentLimit1.unbind().buildScrollBar();
			}
		});

		_this.c.getWbreport3Data({
			//	刷新转发微博详情
			regin: _this.regin,
			startDate: _this.startDate,
			endDate: _this.endDate,
			angle: _this.angle,
			eventId: _this.eventId
		}, function(result) {
			if (result.data.length) {
				var strHtml = '<ul class="commentWeibo">';
				for (var i = 0; i < result.data.length; i++) {
					strHtml+='<li>'+
                        '<div class="commentImgBox">'+
                            '<img src="images/weibo/userimg.png" alt="" />'+
                        '</div>'+
                        '<div class="p_titleBox clearfix">'+
                            '<h4 class="p_title fl">'+result.data[i].title+'</h4>'+
                            '<p class="p_time fr">'+result.data[i].replyTime+'</p>'+
                        '</div>'+
                        '<p class="p_content">'+result.data[i].replyContent+'</p>'+
                        '<p class="p_info">'+
                            '<span class="p_infoname">关注</span>'+
                            '<span class="p_infovalue">'+result.data[i].guanzhu+'</span>'+
                            '<span class="p_infoname">粉丝</span>'+
                            '<span class="p_infovalue">'+result.data[i].fans+'</span>'+
                            '<span class="p_infoname">微博</span>'+
                            '<span class="p_infovalue">'+result.data[i].weibo+'</span>'+
                        '</p>'+
                    '</li>';
				}
				_this.$commentLimit2.html(strHtml);
				_this.$commentLimit2.unbind().buildScrollBar();
			}
		});
	};

	p.m5Data = function(data){
		var str = '';
		for (var name in data) {
			str+=(str.length==0?'':'&')+name+'='+(name == 'encryptKey'?'+8LN4K0554%2FuTd26i9FB9Q%3D%3D':data[name]);
		}
		console.log(str);
		data.encryptCode = hex_md5('greeneastdata'+str);
		data=JSON.stringify(data).replace(/\:/g,'=');
		return data;
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

		this.angle = json.angle;
		this.regin = json.regin;
	};

	EE.Wbreport = Wbreport;
})(window, document);



