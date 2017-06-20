this.EE = this.EE || {};
(function(win) {
	var Controller = function() {
		var baseUrl = ""; //	请求域名头部
		var hostUrl = "http://" + win.location.host + "/eems/sys/jsp/eyes/"; //	主机地址

		var homeUrl = "http://" + win.location.host + "/eems";

		var storage = win.localStorage; //	离线缓存登录状态
		//	接口列表
		var api = {
			"getNowTime": homeUrl + "/publicOpinionMap/getSystime.action",
			//	============== p1 =================================
			"login": homeUrl + "/rbac/foregroundLogin.action",
			"logout": "",
			"chartConfig": "../eyes/asset/config.json",
			"initPage": homeUrl + "/publicOpinionMap/regionalInformation.action",
			"left1": homeUrl + "/publicOpinionMap/currentView.action",
			"left2": homeUrl + "/publicOpinionMap/rankingEventsOne.action",
			"left3": homeUrl + "/publicOpinionMap/rankingEventsSix.action",
			"p1_mapData": homeUrl + "/publicOpinionMap/mapToData.action",
			"initHeadlines": homeUrl + "/publicOpinionMap/rankingEventsPretreatment.action",

			"chart4": homeUrl + "/opinionStudy/getHottestEvent.action", //舆情头条
			"chart5": homeUrl + "/opinionStudy/getEventProvinceRank.action", //舆情省份排名
			"chart6": homeUrl + "/opinionStudy/getPublicOpinionLine.action", //舆情走势
			"chart7": homeUrl + "/opinionStudy/getMediaTypeSource.action", //来源媒体分布
			"chart8": homeUrl + "/opinionStudy/getHeadline.action", //头条正中负面
			"chart9": homeUrl + "/opinionStudy/getKeywordsCloud.action", //关键词

			//=================== p3 =====================================
			"p3_mapData": homeUrl + "/researchReport/loadMap.action",
			"eventBrief_p3": homeUrl + "/researchReport/eventInfo.action", // 雾霾详情
			"mediaRange_p3": homeUrl + "/researchReport/mediaHeat.action", // 最热事件排行
			"worldCloud_p3": homeUrl + "/researchReport/keywords.action", // 词云
			"opinions_p3": homeUrl + "/researchReport/emotionDistribution.action", // 情感类型
			"opinionsList_p3": homeUrl + "/researchReport/articleEmotion.action", //	情感事件列表
			"eventCurve_p3": homeUrl + "/researchReport/eventHeatLine.action", //	30天事件曲线

			"warninglevel": homeUrl + "/crisisEarlyWarning/warningLevel.action",
			"p4chart1": homeUrl + "/crisisEarlyWarning/warningHistogram.action",
			"p4chart2": homeUrl + "/crisisEarlyWarning/warningChart.action",
			"p4list": homeUrl + "/crisisEarlyWarning/warningList.action",

			"detailsList": homeUrl + "/detailsListSolr/searchDetails.action",
			"wordsData": homeUrl + "/detailsList/getSubjectName.action",
			"areaData": homeUrl + "/area/getAreaByAreaNo.action",
			// "detailsList": "../eyes/debug/detailsList.json",
			// "wordsData": "../eyes/debug/wordsData.json",

			"tracesChart1": homeUrl + "/leaderSpecialColumn/leaderInfo.action",
			"tracesLeft1": homeUrl + "/leaderSpecialColumn/leaderEventEmotion.action",
			"tracesEvent": homeUrl + "/leaderSpecialColumn/getArticleList.action",
			"chartP6": homeUrl + "/leaderSpecialColumn/leaderMap.action",

			"micro4": homeUrl + "/microblogAnalysis/getOpinionHeadline.action", //舆情头条
			"micro5": homeUrl + "/microblogAnalysis/getMediaTypeSource.action", //舆情省份排名
			"micro6": homeUrl + "/microblogAnalysis/getPublicOpinionLine.action", //舆情走势
			"micro7": homeUrl + "/microblogAnalysis/getHotUserReply.action", //来源媒体分布
			"micro8": homeUrl + "/microblogAnalysis/getHeadline.action", //头条正中负面
			"micro9": homeUrl + "/microblogAnalysis/getReplyUser.action", //关键词

			"p8chart1": "../eyes/debug/p8chart1.json",
			"p8chart2": "../eyes/debug/p8chart2.json",
			"p8chart3": "../eyes/debug/p8chart3.json",
			"p8chart3list": "../eyes/debug/p8chart3_list.json",
			"p8chart4": "../eyes/debug/source.json",
			"p8explain": "../eyes/debug/p8explain.json",
			"worldCloud_p8": "debug/chart9.json",

			"weibo4": homeUrl + "/sina/getSinaData.action", //舆情头条
			"weibo5": homeUrl + "/sina/getSinaData.action", //转发地域分布
			// "weibo5": "../eyes/debug/source.json",				//转发地域分布
			// "weibo6": "../eyes/debug/chart6.json",				//舆情走势
			"weibo6": homeUrl + "/sina/getSinaData.action", //舆情走势
			// "weibo7": "../eyes/debug/weibo7.json",				//转发微博详情
			"weibo7": homeUrl + "/sina/getSinaData.action", //转发微博详情
			// "weibo8": "../eyes/debug/weibo8.json",				//头条正中负面
			"weibo8": homeUrl + "/sina/getSinaData.action", //头条正中负面
			// "weibo9": "../eyes/debug/chart9.json",				//关键词
			"weibo9": homeUrl + "/sina/getSinaData.action", //关键词

			// "wbreport0":"../eyes/debug/wbreport0.json",
			"wbreport0": homeUrl + "/sina/getSinaData.action",
			"wbreport1": homeUrl + "/sina/getSinaData.action",
			"wbreport2": homeUrl + "/sina/getSinaData.action",
			"wbreport3": homeUrl + "/sina/getSinaData.action",
			"wbreport4": homeUrl + "/sina/getSinaData.action",
			"wbreport5": homeUrl + "/sina/getSinaData.action",
			"wbreport6": homeUrl + "/sina/getSinaData.action",
			// "wbreport1":"../eyes/debug/wbreport1.json",
			// "wbreport2":"../eyes/debug/wbreport2.json",
			// "wbreport3":"../eyes/debug/wbreport3.json",
			// "wbreport4":"../eyes/debug/wbreport4.json",
			// "wbreport5":"../eyes/debug/wbreport5.json",
			// "wbreport6":"../eyes/debug/wbreport6.json"
		};

		//	异步请求方法
		var requestAsk = function(opt) {
			$.ajax({
				type: opt.type || "GET",
				data: opt.data || {},
				url: baseUrl + opt.url,
				success: function(json) {
					if (opt.callback instanceof Function)
						opt.callback(json);
				},
				error: function() {
					throw new Error(baseUrl + opt.url + " 接口");
				}
			});
		};

		var requestAsk2 = function(opt) {
			$.ajax({
				type: opt.type || "GET",
				data: opt.data || {},
				contentType: "application/json",
				url: baseUrl + opt.url,
				success: function(json) {
					if (opt.callback instanceof Function)
						opt.callback(json);
				},
				error: function() {
					throw new Error(baseUrl + opt.url + " 接口");
				}
			});
		};

		//	判断是否登录
		function isLogin(fn) {
			if (storage) {
				if (!storage.region && win.location.href !== hostUrl + "login.html") { //	如果已登录或就为登陆页，则留在本页面, 判断字段具体看后端
					win.location.href = hostUrl + "login.html"; //	反之，跳转至登陆页
				} else {
					getAuthority(fn);
					//storage.region = "";			//	localStorage 储存类型只能是字符串类型,只能设为 “” 才能判断为空，赋值其他类型值都会转为字符串类型
				}
			} else
				alert("不支持localStorage！");
		};

		//	获取权限
		function getAuthority(fn) {
			//	请求权限
			/*requestAsk({
				url: api.authority,
				callback: function(json) {
					fn(json); //	运行外部函数并传出权限数据
				}
			});*/
			// 权限存在 storage.region下面
			fn(storage.region);
		};

		function setCookie(name, value, iDay) {
			if (iDay) {
				var oDate = new Date();
				oDate.setDate(oDate.getDate() + iDay);
				document.cookie = name + '=' + value + ';path=/;expires=' + oDate;
			} else {
				document.cookie = name + '=' + value + ';path=/';
			}
		}

		this.ready = function(fn) {
			if (fn instanceof Function)
				isLogin(fn);
		};

		//	============================== 接口请求函数 ====================================

		this.getNowTime = function(data, callback) {
			requestAsk({
				url: api.getNowTime,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.login = function(data, callback) {
			requestAsk({
				url: api.login,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success == false) {
							callback(json.error);
						} else {
							storage.region = json.region;
							storage.userName = json.userName;
							json.microBlog && setCookie('microBlog', '1');
							json.weChat && setCookie('weChat', '1');
							win.location.href = hostUrl + 'p1.html';
						}
					}
				}
			});
		};

		this.logout = function(data, callback) {
			requestAsk({
				url: api.logout,
				data: data,
				callback: function(json) {
					if (callback instanceof Function)
						callback(json);
					storage.region = "";
				}
			});
		};

		// 登录模块
		this.loginModule = function() {
			var _this = this;
			var plogin = new WBST.Login();
			plogin.subMsg = function(data, callback) {
				_this.login(data, callback);
			};
		};

		this.getInit = function(data, callback) {
			requestAsk({
				url: api.initPage,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json)
					}
				}
			});
		};

		this.getInitHeadlines = function(data, callback) {

			requestAsk({
				url: api.initHeadlines,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getChartConfig = function(data, callback) {
			requestAsk({
				url: api.chartConfig,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json)
					}
				}
			});
		};

		this.getLeft1Data = function(data, callback) {
			requestAsk({
				url: api.left1,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getLeft2Data = function(data, callback) {
			requestAsk2({
				url: api.left2,
				data: JSON.stringify(data),
				type: "POST",
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};
		this.getLeft3Data = function(data, callback) {
			requestAsk2({
				url: api.left3,
				type: "POST",
				data: JSON.stringify(data),
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};
		//	p1 的地图打点数据
		this.getMapData_P1 = function(data, callback) {
			requestAsk({
				url: api.p1_mapData,
				data: data,
				callback: function(json) {
					console.log("地图数据==============================================")
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		/*------------------------------------p2------------------------------------------*/

		this.getChart4Data = function(data, callback) {
			requestAsk({
				url: api.chart4,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						var json = eval('(' + json + ')');
						callback(json);
					}
				}
			});
		};

		this.getChart5Data = function(data, callback) {
			requestAsk({
				url: api.chart5,
				data: data,
				callback: function(json) {
					var json = eval('(' + json + ')');
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getChart6Data = function(data, callback) {
			requestAsk({
				url: api.chart6,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						var json = eval('(' + json + ')');
						callback(json);
					}
				}
			});
		};

		this.getChart7Data = function(data, callback) {
			requestAsk({
				url: api.chart7,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						var json = eval('(' + json + ')');
						callback(json);
					}
				}
			});
		};

		this.getChart8Data = function(data, callback) {
			requestAsk({
				url: api.chart8,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						var json = eval('(' + json + ')');
						callback(json);
					}
				}
			});
		};

		this.getChart9Data = function(data, callback) {
			requestAsk({
				url: api.chart9,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						var json = eval('(' + json + ')');
						callback(json);
					}
				}
			});
		};


		//	p3 的地图打点数据
		this.getMapData_P3 = function(data, callback) {
			requestAsk({
				url: api.p3_mapData,
				data: data,
				type: "POST",
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getEventBrief_p3 = function(data, callback) {
			requestAsk({
				url: api.eventBrief_p3,
				data: data,
				type: "POST",
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getMediaRange_p3 = function(data, callback) {
			requestAsk({
				url: api.mediaRange_p3,
				data: data,
				type: "POST",
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getWorldCloud_p3 = function(data, callback) {
			requestAsk({
				url: api.worldCloud_p3,
				data: data,
				type: "POST",
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getOpinions_p3 = function(data, callback) {
			console.log(data);
			requestAsk({
				url: api.opinions_p3,
				data: data,
				type: "POST",
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getOpinionList_p3 = function(data, callback) {
			requestAsk({
				url: api.opinionsList_p3,
				data: data,
				type: "POST",
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getEventCurve_p3 = function(data, callback) {
			requestAsk({
				url: api.eventCurve_p3,
				data: data,
				type: "POST",
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};


		/*------------------------------------ p4 ------------------------------------------*/

		this.getWarningLevel = function(data, callback) {
			requestAsk({
				url: api.warninglevel,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			})
		}

		this.getP4Chart1Data = function(data, callback) {
			requestAsk({
				url: api.p4chart1,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getP4Chart2Data = function(data, callback) {
			requestAsk({
				url: api.p4chart2,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getP4ListData = function(data, callback) {
			requestAsk({
				url: api.p4list,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		/*------------------------------------ details ------------------------------------------*/

		this.getDetailsListData = function(data, callback) {
			requestAsk({
				url: api.detailsList,
				data: data,
				type: 'POST',
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getWordsData = function(data, callback) {
			requestAsk({
				url: api.wordsData,
				data: data,
				type: "POST",
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		}

		this.getAreaData = function(data, callback) {
			requestAsk({
				url: api.areaData,
				data: data,
				type: "POST",
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		}



		/*------------------------------------ leader traces ------------------------------------------*/
		// 领导信息
		this.getTracesLeft1Data = function(data, callback) {
			requestAsk({
				url: api.tracesChart1,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		// 饼图
		this.getTracesChart1Data = function(data, callback) {
			requestAsk({
				url: api.tracesLeft1,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		// 事件
		this.getTracesEventData = function(data, callback) {
			requestAsk({
				url: api.tracesEvent,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		// 地图
		this.getChartP6Data = function(data, callback) {
			console.log(data);
			requestAsk({
				url: api.chartP6,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		/*------------------------------------Micro observation------------------------------------------*/

		this.getMicro4Data = function(data, callback) {
			requestAsk({
				url: api.micro4,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						var json = eval('(' + json + ')');
						callback(json);
					}
				}
			})
		};

		this.getMicro5Data = function(data, callback) {
			requestAsk({
				url: api.micro5,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						var json = eval('(' + json + ')');
						callback(json);
					}
				}
			})
		};

		this.getMicro6Data = function(data, callback) {
			requestAsk({
				url: api.micro6,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						var json = eval('(' + json + ')');
						callback(json);
					}
				}
			})
		};

		this.getMicro7Data = function(data, callback) {
			requestAsk({
				url: api.micro7,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						var json = eval('(' + json + ')');
						callback(json);
					}
				}
			})
		};

		this.getMicro8Data = function(data, callback) {
			requestAsk({
				url: api.micro8,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						var json = eval('(' + json + ')');
						callback(json);
					}
				}
			})
		};

		this.getMicro9Data = function(data, callback) {
			requestAsk({
				url: api.micro9,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						var json = eval('(' + json + ')');
						callback(json);
					}
				}
			})
		};


		/*------------------------------------ anreport ------------------------------------------*/
		this.getP8Chart1Data = function(data, callback) {
			requestAsk({
				url: api.p8chart1,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getP8Chart2Data = function(data, callback) {
			requestAsk({
				url: api.p8chart2,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getP8Chart3Data = function(data, callback) {
			requestAsk({
				url: api.p8chart3,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getP8Chart3ListData = function(data, callback) {
			requestAsk({
				url: api.p8chart3list,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getP8Chart4Data = function(data, callback) {
			requestAsk({
				url: api.p8chart4,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getP8ExplainData = function(data, callback) {
			requestAsk({
				url: api.p8explain,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		this.getP8WorldCloudData = function(data, callback) {
			requestAsk({
				url: api.worldCloud_p8,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json);
					}
				}
			});
		};

		/*------------------------------------Weibo------------------------------------------*/

		this.getWeibo4Data = function(data, callback) {
			requestAsk({
				url: api.weibo4,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						var json = eval('(' + json + ')');
						callback(json);
					}
				}
			})
		};

		this.getWeibo5Data = function(data, callback) {
			requestAsk({
				url: api.weibo5,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if ((typeof json) != 'object') {
							var json = eval('(' + json + ')');
						}
						callback(json);
					}
				}
			})
		};

		this.getWeibo6Data = function(data, callback) {
			requestAsk({
				url: api.weibo6,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if ((typeof json) != 'object') {
							var json = eval('(' + json + ')');
						}
						callback(json);
					}
				}
			})
		};

		this.getWeibo7Data = function(data, callback) {
			requestAsk({
				url: api.weibo7,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if ((typeof json) != 'object') {
							var json = eval('(' + json + ')');
						}
						callback(json);
					}
				}
			})
		};

		this.getWeibo8Data = function(data, callback) {
			requestAsk({
				url: api.weibo8,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if ((typeof json) != 'object') {
							var json = eval('(' + json + ')');
						}
						callback(json);
					}
				}
			})
		};

		this.getWeibo9Data = function(data, callback) {
			requestAsk({
				url: api.weibo9,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if ((typeof json) != 'object') {
							var json = eval('(' + json + ')');
						}
						callback(json);
					}
				}
			})
		};

		/*------------------------------------ wbreport ------------------------------------------*/

		this.getWbreport0Data = function(data, callback) {
			requestAsk({
				url: api.wbreport0,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if ((typeof json) != 'object') {
							var json = eval('(' + json + ')');
						}
						callback(json);
					}
				}
			});
		};

		this.getWbreport1Data = function(data, callback) {
			requestAsk({
				url: api.wbreport1,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if ((typeof json) != 'object') {
							var json = eval('(' + json + ')');
						}
						callback(json);
					}
				}
			});
		};

		this.getWbreport2Data = function(data, callback) {
			requestAsk({
				url: api.wbreport2,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if ((typeof json) != 'object') {
							var json = eval('(' + json + ')');
						}
						callback(json);
					}
				}
			});
		};

		this.getWbreport3Data = function(data, callback) {
			requestAsk({
				url: api.wbreport3,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if ((typeof json) != 'object') {
							var json = eval('(' + json + ')');
						}
						callback(json);
					}
				}
			});
		};

		this.getWbreport4Data = function(data, callback) {
			requestAsk({
				url: api.wbreport4,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if ((typeof json) != 'object') {
							var json = eval('(' + json + ')');
						}
						callback(json);
					}
				}
			});
		};

		this.getWbreport5Data = function(data, callback) {
			requestAsk({
				url: api.wbreport5,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if ((typeof json) != 'object') {
							var json = eval('(' + json + ')');
						}
						callback(json);
					}
				}
			});
		};

		this.getWbreport6Data = function(data, callback) {
			requestAsk({
				url: api.wbreport6,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if ((typeof json) != 'object') {
							var json = eval('(' + json + ')');
						}
						callback(json);
					}
				}
			});
		}

	};

	EE.Controller = Controller;
})(window);