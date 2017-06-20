this.EE = this.EE || {};
this.isTest = this.isTest || false;
(function(win, doc) {

	var Weibo = function() {
		this.c = new EE.Controller();

		this._mapKIdVChart = {};

		this.eventNum = 5;

		this.rankNum = 8;

		// 评论条数
		this.commentNum = 10;

		this.emotion = 2;

		// 默认为 微博 1
		this.sourceType = 1;

		this.t = 0;
		this.bAuto = false;
		this.auTimer = null;

		if (isTest) {
			this.nowTime = new Date('2017-06-13');
		}else{
			this.nowTime = new Date();
		}
		

		this.nRandom = new Date().getTime();

		this.ready();
	};

	var p = Weibo.prototype;

	p.ready = function() {
		var _this = this;
		_this.c.ready(function(region) {
			_this.region = region;
			_this.init();
			_this.initDom();
			_this.baseEvent();
		});
	};

	p.init = function() {
		var _this = this;
		_this.t = new WbstChart.TimeLine('1900-08-08');
		_this.t.silent = true;

		_this.c.getChartConfig('', function(data) {
			_this._config = data;
			_this.initChart();
		});

		_this.t.toChange = function(json) {
			_this.date = json.date;
			_this.type = json.type;
			_this.changeData();
		};
		// $(document).trigger('mouseup');
		$('.timebtns').find('li').eq(1).trigger('click');
	};

	p.initDom = function() {

		this.$op = $('#tooltip');

		this.$medias = $('#mediabox span');

		this.$micro7 = $('#micro7');
		this.$commentWeibo = $('#commentWeibo');
	};

	p.initChart = function() {
		var _this = this;
		// 舆情头条 chart4
		_this._micro4 = new WbstChart.Chart4(doc.getElementById('micro4'));
		_this._micro4.setConfig(_this._config.micro4.config);
		_this._mapKIdVChart['micro4'] = _this._micro4;

		_this._micro4.EventDispatcher.on('click', function(evt, item) {
			// 需要的参数 事件id，视角，视角区域id，情感
			win.location.href = encodeURI('weibo_report.html?index=' + item);

		});

		// 舆情走势 chart6
		_this._micro6 = new WbstChart.Chart6(doc.getElementById('micro6'));
		_this._micro6.setConfig(_this._config.micro6.config);
		_this._mapKIdVChart['micro6'] = _this._micro6;
		_this._micro6.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<p class="tooltiptext"><span class="valuename">' + item.item.seriesName + ' :</span><span class="valuenum">' + item.item.xAxisValue + '</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this._micro6.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});

		// 来源媒体分布 chart8
		_this._micro8 = new WbstChart.Chart8(doc.getElementById('micro8'));
		_this._micro8.setConfig(_this._config.micro8.config);
		_this._mapKIdVChart['micro8'] = _this._micro8;
		_this._micro8.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<p class="tooltiptext"><span class="valuenum">' + item.item.xAxisValue + '</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this._micro8.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});
		_this._micro8.EventDispatcher.on('click', function(evt, item) {
			var str = item.name;
			switch (str) {
				case '正方':
					_this.emotion = 1;
					break;
				case '中立':
					_this.emotion = 0;
					break;
				case '负方':
					_this.emotion = -1;
					break;
				default:
					_this.emotion = 2;
					break;
			}

			_this.changeData2();
		});

		// 词云 chart9
		_this._micro9 = new WbstChart.Chart9(doc.getElementById('micro9'));
		_this._micro9.setConfig(_this._config.micro9.config);
		_this._mapKIdVChart['micro9'] = _this._micro9;
		_this._micro9.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<p class="tooltiptext"><span class="valuenum">' + item.item.xAxisValue + '</span><span class="fffpoint_lt"></span><span class="fffpoint_rb"></span></p>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this._micro9.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});

		_this._micro9.EventDispatcher.on('click', function(evt, item) {
			win.location.href = encodeURI('details.html?type=4&eventName=' + item + '&emotion=' + _this.emotion);
		});



		// 事件省份排名 chart5
		_this._micro5 = new WbstChart.Bar3d(doc.getElementById('micro5'));
		_this._micro5.setConfig(_this._config.micro5.config);
		_this._mapKIdVChart['micro5'] = _this._micro5;
		_this._micro5.EventDispatcher.on('chartmouseover', function(evt, item) {
			var str = '<div class="tooltip_left3">' +
				'<p class="blockyellow">' + item.item.seriesName + '</p>' +
				'<p class="tooltiptext">' + item.item.xAxisValue +
				'<span class="fffpoint_lt"></span>' +
				'<span class="fffpoint_rb"></span>' +
				'</p>' +
				'</div>';
			_this.showToolTip(str, item.event.pageX, item.event.pageY);
		});
		_this._micro5.EventDispatcher.on('chartmouseout', function() {
			_this.hideToolTip();
		});
	};

	p.changeData = function() {
		var _this = this;

		_this.c.getWeibo8Data({
			sina:'https://api-open-beta.51wyq.cn/dscar/api/environmental/sentimentDistribution'
		}, function(result) {
			
			_this._mapKIdVChart['micro8'].setDataProvider(result.statList);
		});

		_this.c.getWeibo9Data({
			sina:'https://api-open-beta.51wyq.cn/dscar/api/environmental/forwardUser'
		}, function(result) {
			var data = [];
			for (var i = 0; i < result.statList.length; i++) {
				var json = {
					name:result.statList[i].name,
					weight:result.statList[i].num
				};
				data.push(json);
			}
			_this._mapKIdVChart['micro9'].setDataProvider(data);
		});

		_this.changeData2();
	};

	p.changeData2 = function() {
		var _this = this;

		// 头条
		_this.c.getWeibo4Data({
			sina:'https://api-open-beta.51wyq.cn/dscar/api/environmental/hotHeadlines'
		}, function(result) {
			var data = [];
			for (var i = 0; i < result.statList.length; i++) {
				var json = {
					eventId : i,
					name : result.statList[i].name,
					num : result.statList[i].num
				};	
				data.push(json);
			}
			_this._mapKIdVChart['micro4'].setDataProvider(data);
		});

		// 转发地域分布
		_this.c.getWeibo5Data({
			sina:'https://api-open-beta.51wyq.cn/dscar/api/environmental/geographicalDistribution'
		}, function(result) {
			var data = [];
			for (var i = 0; i < result.statList.length; i++) {
				var json = {
					name:result.statList[i].name,
					num:result.statList[i].num
				};
				data.push(json);
			}
			_this._mapKIdVChart['micro5'].setDataProvider(data);
		});

		//时间走势图
		_this.c.getWeibo6Data({
			sina:'https://api-open-beta.51wyq.cn/dscar/api/environmental/timeDiagram'
		}, function(result) {
			//造数据
			var arr = [];
			var timeArr = _this.getTimeArr(_this.getFormatTime(_this.nowTime));
			for (var i = 0; i < result.statsList.length; i++) {
				var name = result.statsList[i].name;
				var json = {seriesTitle:name,times:{}};
				for (var j = 0; j < timeArr.length; j++) {
					json.times[timeArr[j]] = 0;
				}

				for (var j = 0; j < result.statsList[i].statList.length; j++) {
					if (json.times[result.statsList[i].statList[j].name] !== undefined) {
						json.times[result.statsList[i].statList[j].name] = result.statsList[i].statList[j].num;
					}
				}
				arr.push(json);
			}
			var data = [];
			for (var i = 0; i < arr.length; i++) {
				for (var name in arr[i].times) {
					var json = {
						seriesTitle:arr[i].seriesTitle,
						name:name,
						num:arr[i].times[name]
					}
					data.push(json);
				}
			}
			_this._mapKIdVChart['micro6'].setDataProvider(data);
		});

		//转发微博详情
		_this.c.getWeibo7Data({
			sina:'https://api-open-beta.51wyq.cn/dscar/api/environmental/forwardDetail'
		}, function(result) {
			var data = [];
			for (var i = 0; i < result.icontentCommonNetList.length; i++) {
				var json = {
					title:result.icontentCommonNetList[i].author,
					replyContent:result.icontentCommonNetList[i].content,
					id:result.icontentCommonNetList[i].id,
					replyTime:_this.getFormatTime(new Date(result.icontentCommonNetList[i].indexTime),true),
					fans:result.icontentCommonNetList[i].fansNumber,
					guanzhu:result.icontentCommonNetList[i].friendsCount,
					weibo:result.icontentCommonNetList[i].weiboNums
				};
				data.push(json);
			}
			_this.createComment(data);
		});
	};

	// 根据当前时间 获得72小时的时间排序
	// this.nowTime = '2017-06-01 14';
	p.getTimeArr = function(time){	

		var arr1 = time.split(' ');
		var arr2 = arr1[0].split('-');

		var arr = [];
		for (var i = 0; i < 72; i++) {
			var oDate = new Date(arr1[0]);
			oDate.setHours(arr1[1] - 71 + i);
			arr.push(this.getFormatTime(oDate));
			oDate = null;
		}
		return arr;
	}

	// obj 为时间对象
	p.getFormatTime = function(obj,isMinutes){
		var Y = obj.getFullYear();
		var M = obj.getMonth()+1;
		var D = obj.getDate();
		var h = obj.getHours();
		var m = obj.getMinutes();
		return Y+'-'+this.n2d(M)+'-'+this.n2d(D)+' '+this.n2d(h)+(isMinutes==true?':'+this.n2d(m):'');
	}

	p.baseEvent = function() {
		var _this = this;

		var	isBlog = _this.getCookie('microBlog');
		var	isWeChat = _this.getCookie('weChat');

		if (!isBlog) {
			_this.$medias.eq(0).addClass('btnsilent');
		}
		if (!isWeChat) {
			_this.$medias.eq(1).addClass('btnsilent');
		}

		_this.$medias.click(function(){
			// 重复点自己时不刷新
			if ($(this).hasClass('active') || $(this).hasClass('btnsilent') ) {return;}
			var href = $(this).attr('go');
			win.location.href = href;
		})

	};

	p.createComment = function(data) {
		var strHtml = '';
		var config = this._config.micro7.config;
		var len = data.length;
		if (!len) {return;}
		for (var i = 0; i < data.length; i++) {
			strHtml += '<li>'+
                            '<div class="commentImgBox">'+
                                '<img src="images/weibo/userimg.png" alt="" />'+
                            '</div>'+
                            '<div class="p_titleBox clearfix">'+
                                '<h4 class="p_title fl">'+data[i].title+'</h4>'+
                                '<p class="p_time fr">'+data[i].replyTime+'</p>'+
                            '</div>'+
                            '<p class="p_content">'+data[i].replyContent+'</p>'+
                            '<p class="p_info">'+
                                '<span class="p_infoname">关注</span>'+
                                '<span class="p_infovalue">'+data[i].guanzhu+'</span>'+
                                '<span class="p_infoname">粉丝</span>'+
                                '<span class="p_infovalue">'+data[i].fans+'</span>'+
                                '<span class="p_infoname">微博</span>'+
                                '<span class="p_infovalue">'+data[i].weibo+'</span>'+
                            '</p>'+
                        '</li>';
		}
		this.$commentWeibo.html(strHtml);
		this.$micro7.buildScrollBar();
	};

	p.showToolTip = function(text, x, y) {
		this.$op.html(text);
		var w = this.$op.width() + 20;
		var h = this.$op.height() + 20;
		// if (x + w > $(window).innerWidth()) x = $(window).innerWidth() - w;
		// if (y + h > $(window).innerHeight()) y = $(window).innerHeight() - h;
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

	// 根据时间戳获取时间
	p.getByTimes = function(times) {
		var oDate = new Date();
		oDate.setTime(times)
		var Y = oDate.getFullYear();
		var M = oDate.getMonth() + 1;
		var D = oDate.getDate();
		var h = oDate.getHours();
		var m = oDate.getMinutes();
		var s = oDate.getSeconds();
		return {
			Y: Y,
			M: this.n2d(M),
			D: this.n2d(D),
			h: this.n2d(h),
			m: this.n2d(m),
			s: this.n2d(s)
		}
	};

	p.n2d = function(n) {
		return n < 10 ? '0' + n : '' + n;
	};

	p.getCookie = function(name){
		var arr = document.cookie.split('; ');
		for (var i = 0; i < arr.length; i++) {
			arr2 = arr[i].split('=');
			if (name==arr2[0]){
				return arr2[1];
			}
		}
	};

	EE.Weibo = Weibo;
})(window, document);