this.EE = this.EE || {};
(function(win) {
	var Controller = function() {
		var baseUrl = ""; //	请求域名头部
		var hostUrl = "http://" + win.location.host + "/vision/eyes/"; //	主机地址
		var storage = win.localStorage; //	离线缓存登录状态
		//	接口列表
		var api = {
			//	============== p1 =================================
			"login": "../eyes/debug/login1.json",
			"logout": "",
			"authority": "../eyes/asset/authority.json",
			"chartConfig": "../eyes/asset/config.json",
			"initPage": "../eyes/debug/initPage.json",
			"left1": "../eyes/debug/dashData.json",
			"left2": "../eyes/debug/headline.json",
			"left3": "../eyes/debug/source.json",
			"p1_mapData": "../eyes/debug/map.json",
			"initHeadlines": "../eyes/debug/login1.json",

			"chart4": "../eyes/debug/chart4.json",		//舆情头条
			"chart5": "../eyes/debug/chart5.json",		//舆情省份排名
			"chart6": "../eyes/debug/chart6.json",		//舆情走势
			"chart7": "../eyes/debug/chart7.json",		//来源媒体分布
			"chart8": "../eyes/debug/chart8.json",		//头条正中负面
			"chart9": "../eyes/debug/chart9.json",		//关键词
			//=================== p3 =====================================
			"p3_mapData": "../eyes/debug/map.json", 	//地图
			"eventBrief_p3": "debug/p3_3.json",			//污染说明
			"mediaRange_p3": "debug/p3_4.json",			//发热度排名
			"worldCloud_p3": "debug/chart9.json",		//词云
			"opinions_p3": "debug/p3_2.json", 			//情感类型
			"opinionsList_p3": "debug/p3_2List.json", 	//事件列表
			"eventCurve_p3": "debug/p3_1.json",			//30天事件曲线图
			
			"warninglevel": "../eyes/debug/warninglevel.json",
			"p4chart1": "../eyes/debug/p4chart1.json",
			"p4chart2": "../eyes/debug/p4chart2.json",
			"p4list": "../eyes/debug/p4list.json",

			"detailsList": "../eyes/debug/detailsList.json",
			"wordsData": "../eyes/debug/wordsData.json",
			

			"tracesChart1": "../eyes/debug/tracesChart1.json",
			"tracesEvent": "../eyes/debug/traces.json",
			"chartP6": "../eyes/debug/p6_map.json",


			"micro4": "../eyes/debug/chart4.json",		//舆情头条
			"micro5": "../eyes/debug/source.json",		//舆情省份排名
			"micro6": "../eyes/debug/chart6.json",		//舆情走势
			"micro7": "../eyes/debug/micro7.json",		//来源媒体分布
			"micro8": "../eyes/debug/chart8.json",		//头条正中负面
			"micro9": "../eyes/debug/chart9.json",		//关键词


			"p8chart1":"../eyes/debug/p8chart1.json",
			"p8chart2":"../eyes/debug/p8chart2.json",
			"p8chart3":"../eyes/debug/p8chart3.json",
			"p8chart3list":"../eyes/debug/p8chart3_list.json",
			"p8chart4":"../eyes/debug/source.json",
			"p8explain":"../eyes/debug/p8explain.json",
			"worldCloud_p8": "debug/chart9.json"
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
				error: function(){
					throw new Error(baseUrl + opt.url + " 接口");
				}
			})
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

		this.ready = function(fn) {
			if (fn instanceof Function)
				isLogin(fn);
		};

		//	============================== 接口请求函数 ====================================
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
							storage.loginName = data.loginName;
							win.location.href = hostUrl + 'p1.html';
						}
					}
				}
			})
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
			})
		};

		// 登录模块
		this.loginModule = function() {
			var _this = this;
			var plogin = new WBST.Login();
			plogin.subMsg = function(data, callback) {
				_this.login(data, callback);
			}
		};

		this.getInit = function(data,callback) {
			requestAsk({
				url: api.initPage,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
					}
				}
			})
		};

		this.getInitHeadlines = function(data, callback) {
			
			requestAsk({
				url: api.initHeadlines,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json);
						}
					}
				}
			});
		};

		this.getChartConfig = function(data,callback){
			requestAsk({
				url: api.chartConfig,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						callback(json)
					}
				}
			})
		}

		this.getLeft1Data = function(data, callback) {
			requestAsk({
				url: api.left1,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
					}
				}
			})
		};

		this.getLeft2Data = function(data, callback) {
			requestAsk({
				url: api.left2,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
					}
				}
			})
		};
		this.getLeft3Data = function(data, callback) {
			requestAsk({
				url: api.left3,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
					}
				}
			});
		};
		//	p1 的地图打点数据
		this.getMapData_P1 = function(data,callback){
			requestAsk({
				url: api.p1_mapData,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
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
						if (json.success) {
							callback(json)
						}
					}
				}
			})
		};

		this.getChart5Data = function(data, callback) {
			requestAsk({
				url: api.chart5,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
					}
				}
			})
		};

		this.getChart6Data = function(data, callback) {
			requestAsk({
				url: api.chart6,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
					}
				}
			})
		};

		this.getChart7Data = function(data, callback) {
			requestAsk({
				url: api.chart7,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
					}
				}
			})
		};

		this.getChart8Data = function(data, callback) {
			requestAsk({
				url: api.chart8,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
					}
				}
			})
		};

		this.getChart9Data = function(data, callback) {
			requestAsk({
				url: api.chart9,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
					}
				}
			})
		};

		//	========== p3 =================
		//	p3 的地图打点数据
		this.getMapData_P3 = function(data,callback){
			requestAsk({
				url: api.p3_mapData,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
					}
				}
			});
		};

		this.getEventBrief_p3 = function(data,callback){
			requestAsk({
				url: api.eventBrief_p3,
				data: data,
				type: "POST",
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
					}
				}
			});
		};

		this.getMediaRange_p3 = function(data,callback){
			requestAsk({
				url: api.mediaRange_p3,
				data: data,
				type: "POST",
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
					}
				}
			});
		};

		this.getWorldCloud_p3 = function(data,callback){
			requestAsk({
				url: api.worldCloud_p3,
				data: data,
				type: "POST",
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
					}
				}
			});
		};

		this.getOpinions_p3 = function(data,callback){
			requestAsk({
				url: api.opinions_p3,
				data: data,
				type: "POST",
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
					}
				}
			});
		};

		this.getOpinionList_p3 = function(data,callback){
			requestAsk({
				url: api.opinionsList_p3,
				data: data,
				type: "POST",
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
					}
				}
			});
		};

		this.getEventCurve_p3 = function(data,callback){
			requestAsk({
				url: api.eventCurve_p3,
				data: data,
				type: "POST",
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json)
						}
					}
				}
			});
		};


		/*------------------------------------ p4 ------------------------------------------*/

		this.getWarningLevel = function(data, callback){
			requestAsk({
				url:api.warninglevel,
				data:data,
				callback:function(json){
					if (callback instanceof Function) {
						if (json.success) {
							callback(json);
						}
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
						if (json.success) {
							callback(json);
						}
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
						if (json.success) {
							callback(json);
						}
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
						if (json.success) {
							callback(json);
						}
					}
				}
			});
		};

		/*------------------------------------ details ------------------------------------------*/

		this.getDetailsListData = function(data, callback) {
			requestAsk({
				url: api.detailsList,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json);
						}
					}
				}
			});
		};

		this.getWordsData = function(data, callback){
			requestAsk({
				url: api.wordsData,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json);
						}
					}
				}
			});
		}

		/*------------------------------------ leader traces ------------------------------------------*/

		this.getTracesChart1Data = function(data, callback) {
			requestAsk({
				url: api.left1,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json);
						}
					}
				}
			});
		};

		this.getTracesEventData = function(data, callback) {
			requestAsk({
				url: api.tracesEvent,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json);
						}
					}
				}
			});
		};

		this.getChartP6Data = function(data, callback) {
			requestAsk({
				url: api.chartP6,
				data: data,
				callback: function(json) {
					if (callback instanceof Function) {
						if (json.success) {
							callback(json);
						}
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
						if (json.success) {
							callback(json)
						}
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
						if (json.success) {
							callback(json)
						}
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
						if (json.success) {
							callback(json)
						}
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
						if (json.success) {
							callback(json)
						}
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
						if (json.success) {
							callback(json)
						}
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
						if (json.success) {
							callback(json)
						}
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
						if (json.success) {
							callback(json);
						}
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
						if (json.success) {
							callback(json);
						}
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
						if (json.success) {
							callback(json);
						}
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
						if (json.success) {
							callback(json);
						}
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
						if (json.success) {
							callback(json);
						}
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
						if (json.success) {
							callback(json);
						}
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
						if (json.success) {
							callback(json);
						}
					}
				}
			});
		};

	};

	EE.Controller = Controller;
})(window);