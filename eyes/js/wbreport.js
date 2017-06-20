this.EE = this.EE || {};
(function(win, doc) {

	var Wbreport = function() {
		this.c = new EE.Controller();

		this.nowTime = new Date();

		this._mapKIdVChart = {};

		this.index = 0;

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
			_this.initDom();
			_this.init();
			_this.initEvent();
		});
	};

	p.initDom = function(){
		this.$op = $('#tooltip');
		this.$timeRange = $('#timeRange');

		this.$commentLimit1 = $('#commentLimit1');
		this.$commentLimit2 = $('#commentLimit2');

		this.$dialogbox = $('#dialogbox');
		this.$diacontainer = $('#diacontainer');
	};

	p.initEvent = function(){
		var _this = this;
		var $p3ulList = $('#p3ulList');

		/*$p3ulList.on('click','h6',function(ev){
			var html = $(this).find('span').html();
			ev.stopPropagation();
			win.location.href = encodeURI('details.html?type=3&eventName='+html+'&emotion='+_this.emotion);
		})*/

		_this.$commentLimit1.parent().on('click','.p_content',function(ev){
			//弹出层
			var x = ev.pageX;
			var y = ev.pageY;
			_this.$diacontainer.html('<p class="diainner">'+$(this).html()+'</p>').css({
				left:x,
				top:y,
				transform:'none'
			});
			_this.$dialogbox.show();
			ev.stopPropagation();
		});

		$(document).click(function(){
			_this.$dialogbox.hide();
		})

		this.$diacontainer.click(function(ev){
			ev.stopPropagation();
		})
	};

	p.init = function() {
		var _this = this;

		_this.c.getChartConfig('', function(data) {
			_this._config = data;
			_this.initChart();
			// 判断视角 超出权限 
			_this.changeData();
			//	刷新词云
			_this.c.getWbreport6Data({
				sina:'https://api-open-beta.51wyq.cn/dscar/api/environmental/singleKeywordClouds',
				json:'{index="'+_this.index+'"}'
			}, function(result) {
				console.log("刷新词云p6");
				var data = [];
				for (var i = 0; i < result.statList.length; i++) {
					var json = {
						name:result.statList[i].name,
						weight:result.statList[i].num
					};
					data.push(json);
				}
				_this.p3Chart5.setDataProvider(data);
			});

			//	刷新30天事件曲线
			//http://47.93.4.100:8181/eems/sina/getSinaData.action?sina=https%3A%2F%2Fapi-open-beta.51wyq.cn%2Fdscar%2Fapi%2Fenvironmental%2FsingleTimeDiagram%26json%3D%7Bindex%3D1%7D
			//http://47.93.4.100:8181/eems/sina/getSinaData.action?sina=https%3A%2F%2Fapi-open-beta.51wyq.cn%2Fdscar%2Fapi%2Fenvironmental%2FsingleTimeDiagram&json=%7Bindex%3D1%7D
			_this.c.getWbreport1Data({
				sina:'https://api-open-beta.51wyq.cn/dscar/api/environmental/singleTimeDiagram',
				json:'{index="'+_this.index+'"}'
			}, function(result) {
				console.log('刷新30天事件曲线p1');
				//造数据
				if (!result.statList) {
					console.warn('接口 ——— https://api-open-beta.51wyq.cn/dscar/api/environmental/singleTimeDiagram \n没有数据');
					return;
				}
				var times = {};
				var timeArr = _this.getTimeArr(_this.getFormatTime(_this.nowTime));
				for (var i = 0; i < timeArr.length; i++) {
					times[timeArr[i]] = 0;
				}
				for (var i = 0; i < result.statList.length; i++) {
					if (times[result.statList[i].name] === 0) {
						times[result.statList[i].name] = result.statList[i].num;
					}
				}
				var data = [];
				for (var name in times) {
					data.push({
						seriesTitle:'singleEvent',
						name:name,
						num:times[name]
					})
				}
				_this.p3Chart1.setDataProvider(data);
				_this.$timeRange.html(data[0].name.split(' ')[0]+'~'+data[data.length - 1].name.split(' ')[0]);
			});

			//	刷新事件简介
			_this.c.getWbreport4Data({
				sina:'https://api-open-beta.51wyq.cn/dscar/api/environmental/moduleEventProfile',
				json:'{index="'+_this.index+'"}'
			}, function(result) {
				console.log('刷新事件简介');
				$(".p3chart3 .element-title-text").text(result.extendStats.keyword);
				$(".p3chart3 .element-content p").text(result.extendStats.iContentCommonNetLists[0].icontentCommonNetList[0].content);
			});
		});
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
			win.location.href = encodeURI('details.html?type=4&eventName=' + item + '&emotion=' + _this.emotion);
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
			sina:'https://api-open-beta.51wyq.cn/dscar/api/environmental/singleGeographicalDistribution',
			json:'{index="'+_this.index+'"}'
		}, function(result) {
			console.log('转发地域分布p5');
			_this.p3Chart4.setDataProvider(result.statList);
		});

		// 	刷新散点关系图
		_this.c.getWbreport0Data({
			sina:'https://api-open-beta.51wyq.cn/dscar/api/environmental/environmentalResultStar',
			json:'{index="'+_this.index+'"}'
		},function(result){
			console.log('散点图p0');
			_this.p8chart1.setDataProvider(result.leafList);
		})


		_this.c.getWbreport2Data({
			sina:'https://api-open-beta.51wyq.cn/dscar/api/environmental/singleOpinionLeader',
			json:'{index="'+_this.index+'"}'
		}, function(result) {
			console.log('刷新意见领袖p2');
			if (result.icontentCommonNetList.length) {
				var strHtml = '<ul class="commentWeibo">';
				for (var i = 0; i < result.icontentCommonNetList.length; i++) {
					var item = result.icontentCommonNetList[i];
					strHtml+='<li>'+
                        '<div class="commentImgBox">'+
                            '<img src="images/weibo/userimg.png" alt="" />'+
                        '</div>'+
                        '<div class="p_titleBox w056">'+
                            '<h4 class="p_title">'+item.author+'</h4>'+
                            '<p class="p_info">'+
                                '<span class="p_infoname">关注</span>'+
                                '<span class="p_infovalue">'+item.forwardNumber+'</span>'+
                                '<span class="p_infoname">粉丝</span>'+
                                '<span class="p_infovalue">'+item.fansNumber+'</span>'+
                                '<span class="p_infoname">微博</span>'+
                                '<span class="p_infovalue">'+item.weiboNums+'</span>'+
                            '</p>'+
                        '</div>'+
                        '<p class="p_content" title="'+item.content+'">'+item.content+'</p>'+
                    '</li>';
				}
				_this.$commentLimit1.html(strHtml);
				_this.$commentLimit1.unbind().buildScrollBar();
			}else{
				_this.$commentLimit1.unbind().html('');
			}
		});

		_this.c.getWbreport3Data({
			//	刷新转发微博详情
			sina:'https://api-open-beta.51wyq.cn/dscar/api/environmental/singleForwardDetail',
			json:'{index="'+_this.index+'"}'
		}, function(result) {
			console.log('刷新转发微博详情p3');
			if (result.icontentCommonNetList.length) {
				var strHtml = '<ul class="commentWeibo">';
				for (var i = 0; i < result.icontentCommonNetList.length; i++) {
					var item = result.icontentCommonNetList[i];
					strHtml+='<li>'+
                        '<div class="commentImgBox">'+
                            '<img src="images/weibo/userimg.png" alt="" />'+
                        '</div>'+
                        '<div class="p_titleBox clearfix">'+
                            '<h4 class="p_title fl">'+item.author+'</h4>'+
                            '<p class="p_time fr">'+_this.getFormatTime(new Date(item.indexTime))+'</p>'+
                        '</div>'+
                        '<p class="p_content">'+item.content+'</p>'+
                        '<p class="p_info">'+
                            '<span class="p_infoname">关注</span>'+
                            '<span class="p_infovalue">'+item.forwardNumber+'</span>'+
                            '<span class="p_infoname">粉丝</span>'+
                            '<span class="p_infovalue">'+item.fansNumber+'</span>'+
                            '<span class="p_infoname">微博</span>'+
                            '<span class="p_infovalue">'+item.weiboNums+'</span>'+
                        '</p>'+
                    '</li>';
				}
				_this.$commentLimit2.html(strHtml);
				_this.$commentLimit2.unbind().buildScrollBar();
			}else{
				_this.$commentLimit2.unbind().html('');
			}
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
	};

	// obj 为时间对象
	p.getFormatTime = function(obj,isMinutes){
		var Y = obj.getFullYear();
		var M = obj.getMonth()+1;
		var D = obj.getDate();
		var h = obj.getHours();
		var m = obj.getMinutes();
		return Y+'-'+this.n2d(M)+'-'+this.n2d(D)+' '+this.n2d(h)+(isMinutes==true?':'+this.n2d(m):'');
	}

	p.n2d = function(n) {
		return n < 10 ? '0' + n : '' + n;
	}

	p.m5Data = function(data){
		var str = '';
		for (var name in data) {
			str+=(str.length==0?'':'&')+name+'='+(name == 'encryptKey'?'+8LN4K0554%2FuTd26i9FB9Q%3D%3D':data[name]);
		}
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

		this.index = json.index;
	};

	EE.Wbreport = Wbreport;
})(window, document);



