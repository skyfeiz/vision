this.EE = this.EE || {};
(function() {
	var map = function(ID, callback) {
		var cur = this,
			mapping, chinaMap, provinceMap, view, queue, activeProvince = null, activeCity = null, tipShow = true, loadTween = { time: 0 }, loadAnimation;
		var resourceAry = [{
			id: "bg",
			src: "images/p3/bg.png"
		}, {
			id: "positive",
			src: "images/p1/greenDot.png"
		}, {
			id: "neutral",
			src: "images/p1/yellowDot.png"
		}, {
			id: "negative",
			src: "images/p1/redDot.png"
		}, {
			id: "positiveL",
			src: "images/p1/greenDot1.png"
		}, {
			id: "neutralL",
			src: "images/p1/yellowDot1.png"
		}, {
			id: "negativeL",
			src: "images/p1/redDot1.png"
		}, {
			id: "coverLight",
			src: "images/p3/coverLight.png"
		}];

		function init() {
			queue = new createjs.LoadQueue();
			queue.loadManifest(resourceAry);
			queue.on("complete", function() {
				mapping = province;

				var id=ID.region;
				if (id) {
					var pId = id.split("_");
					if (pId.length == 2) {
						activeProvince = mapping[id];
					} else if (pId.length == 3) {
						activeProvince = mapping[id.replace("_" + pId[2], "")];
						activeCity = activeProvince.sub[id];
					}
				}

				createChina();
			});
		};

		//	创建中国地图
		function createChina() {
			$.ajax({
				type: 'get',
				dataType: 'json',
				url: 'geojson/china.geo.json',
				success: function(json) {
					var range = getRange(json.features);
					chinaMap = new EE.mapViewSwitch({
						canvas: document.getElementById("ChinaMap"),
						data: json.features,
						range: range,
						onComplete: callback,
						imgAry: queue,
						clickScale: 0.7,
						center: [0.5, 0.55],
						scale: [0.65684, 0.8],
						bg: true,
						activeName: activeProvince ? activeProvince.name : null
					});
					view = chinaMap;

					initLoadTween();
					bindToolOver();

					chinaMap.toolTipOver = mapToolShow;
					chinaMap.toolTipOut = mapToolHide;

					chinaMap.clickFun = function(name, callback) {
						$("#waitCover").show();
						loadAnimation.play();
						areaThorough(name, null, function(range, curMap) {
							mapLevelSwitch($("#ChinaMap"), $("#ProvinceMap"));
							callback(range);
						});
					};

					if(ID.view && ID.view.indexOf(ID.region)!=-1&&ID.view!=ID.region){
						$("#waitCover").show();
						loadAnimation.play();
						var idAry = ID.view.split("_");
						if(idAry.length==2){
							areaThorough(ID.viewName, null, function(range, curMap) {
								chinaMap.changeView(range);
								mapLevelSwitch($("#ChinaMap"), $("#ProvinceMap"));
							});
						}
						else if(idAry.length==3){
							var pID = idAry[0]+"_"+idAry[1];

							areaThorough(province[pID].name, ID.viewName, function(range, curMap) {
								chinaMap.changeView(range);
								mapLevelSwitch($("#ChinaMap"), $("#ProvinceMap"));
							}, true);
						}
					}
				}
			});
		};

		function initLoadTween(){
			loadAnimation = TweenMax.to(loadTween,0.6,{
				time: 180,
				ease: Linear.easeNone,
				paused: true,
				onUpdate: function(){
					$("#loadSprite").css({
						"background-position": "0px "+(-64*Math.floor(loadTween.time/6))+"px"
					});
				},
				repeat: -1
			})
		};

		function bindToolOver() {
			$(".toolTip").mouseenter(function() {
				tipShow = false;
				cur.mapCount = self.clearTimeout(cur.mapCount);
			}).mouseleave(function() {
				tipShow = true;
				$(".toolTip").removeClass("toolShow");
			});
		};

		function mapToolShow(infor, position) {
			var scale = $("#china").height() / parseInt($("#ChinaMap").attr("height"));
			cur.mapCount = self.clearTimeout(cur.mapCount);

			$(".toolTip .areaName").text(infor.name + "总数：");
			$(".toolTip .areaNum").text(infor.num);
			$(".toolTip").css({
				left: position.x * scale + $("#ChinaMap").offset().left - $("#china").offset().left + 18,
				bottom: $("#china").height() - position.y * scale - 18
			}).addClass("toolShow");
		};

		function mapToolHide() {
			if(tipShow){
				cur.mapCount = self.setTimeout(function() {
					$(".toolTip").removeClass("toolShow");
				}, 2000);
			}
		};

		//	创建省份
		function createProvince(id, name, activeName, callback) {
			var a = id.split("_");
			var ID = a[0] + "_" + a[1];
			$.ajax({
				type: "get",
				url: "geojson/" + ID + ".json",
				success: function(json) {
					var range = getRange(json.features);
					provinceMap = new EE.mapViewSwitch({
						canvas: document.getElementById("ProvinceMap"),
						data: json.features,
						range: range,
						imgAry: queue,
						activeName: activeCity ? activeCity.name : activeName,
						center: [0.5, 0.55],
						scale: [0.467, 0.56],
						silent: isSilent(name) || a.length==3,
						onComplete: function() {
							if (callback instanceof Function) {
								callback(range, provinceMap);
							}

							var NAME = "";
							if (activeCity)
								NAME = activeCity.name;
							else if (activeName)
								NAME = activeName;
							else
								NAME = name;

							if (cur.chinaClick instanceof Function) {
								cur.chinaClick(NAME, id);
							}

						}
					});
					provinceMap.id = id;
					view = provinceMap;

					if (activeName)
						provinceMap.outClick = function() {
							$("#waitCover").show();
							loadAnimation.play();
							$(".toolTip").removeClass("toolShow");
							cur.cityBlankClick({
								id: ID,
								name: name
							});
						};
					else
						provinceMap.outClick = function() {
							$("#waitCover").show();
							loadAnimation.play();
							$(".toolTip").removeClass("toolShow");
							cur.provinceBlankClick();
						};

					provinceMap.toolTipOver = mapToolShow;
					provinceMap.toolTipOut = mapToolHide;

					provinceMap.clickFun = function(cityName, callback) {
						$("#waitCover").show();
						loadAnimation.play();
						areaThorough(name, cityName, function(Range, curMap) {
							mapLevelSwitch($("#ChinaMap"), $("#ProvinceMap"));
							callback(Range);
						}, true);
					};
				},
				error: function() {
					console.log(id + " 地图数据没有.");
				}
			});
		};

		function isSilent(name){
			var silenceAry = ["北京","天津","上海","重庆","香港","澳门","台湾"];
			var s = false;

			for(var i=0; i<silenceAry.length; i++){
				if(name.match(silenceAry[i])){
					s = true;
					break;
				}
			}

			return s;
		};

		// function testCity(ary){
		// 	console.log(ary.length)
		// 	for(var i=0; i<ary.length; i++){
		// 		var name = ary[i].properties.name/*.replace(/市|县|自治州|自治县|地区/,"")*/;
		// 		console.log(name)
		// 	}
		// };

		//	地区钻取
		function areaThorough(name, activeName, callback, isCity) {
			if (isCity) {
				for (var i in mapping) {
					if (mapping[i].name.match(name)) {
						for (var j in mapping[i].sub) {
							if (mapping[i].sub[j].name.match(activeName.replace(/市|县|自治区|自治县|地区/, ""))) {
								if (provinceMap)
									provinceMap.clear();
								createProvince(mapping[i].sub[j].id, mapping[i].name, activeName, callback);
								break;
							}
						}
					}
				}
			} else {
				for (var i in mapping) {
					if (mapping[i].name.match(name)) {
						if (provinceMap)
							provinceMap.clear();
						createProvince(mapping[i].id, mapping[i].name, activeName, callback);
						break;
					}
				}
			}
		};

		//	地图 canvas 层级切换
		function mapLevelSwitch($map1, $map2, opacity) {
			TweenMax.to($map1.css({
				zIndex: 0
			}), 0.4, {
				delay: 0.6,
				opacity: !isNaN(opacity) ? opacity : 0.3,
				ease: Power2.easeInOut
			});
			TweenMax.to($map2.css({
				zIndex: 100
			}), 0.2, {
				opacity: 1,
				delay: 0.6,
				ease: Power2.easeInOut,
				onComplete: function(){
					$("#waitCover").hide();
					loadAnimation.pause();
				}
			});
		};

		//	根据地图获取经纬度范围
		function getRange(data) {
			var range = {
				x: [180, -180],
				y: [90, -90]
			};
			for (var i = 0; i < data.length; i++) {
				var type = data[i].geometry.type;
				var coorAry = data[i].geometry.coordinates;

				if (type == "MultiPolygon") {
					for (var x = 0; x < coorAry.length; x++) {
						for (var y = 0; y < coorAry[x].length; y++) {
							var coors = coorAry[x][y];
							for (var z = 0; z < coors.length; z++) {
								range.x = [Math.min(range.x[0], coors[z][0]), Math.max(range.x[1], coors[z][0])];
								range.y = [Math.min(range.y[0], coors[z][1]), Math.max(range.y[1], coors[z][1])];
							}
						}
					}
				} else {
					for (var x = 0; x < coorAry.length; x++) {
						for (var y = 0; y < coorAry[x].length; y++) {
							var coors = coorAry[x][y];
							range.x = [Math.min(range.x[0], coors[0]), Math.max(range.x[1], coors[0])];
							range.y = [Math.min(range.y[0], coors[1]), Math.max(range.y[1], coors[1])];
						}
					}
				}
			}

			return range;
		};

		this.clickChina = function(obj, callback) {
			if (provinceMap)
				provinceMap.clear();

			$("#waitCover").show();
			loadAnimation.play();
			mapLevelSwitch($("#ProvinceMap"), $("#ChinaMap"), 0);

			chinaMap.changeView();

			view = chinaMap;

			if (callback instanceof Function)
				callback();
		};

		this.clickProvince = function(obj, callback) {
			if (provinceMap && provinceMap.id == obj.id) {
				if (callback instanceof Function)
					callback();

				if (view.id != obj.id) {
					if (provinceMap)
						provinceMap.clear();
					$("#ProvinceMap").css({
						opacity: 0
					});
					chinaMap.changeView(range);
					$("#waitCover").show();
					loadAnimation.play();
					mapLevelSwitch($("#ChinaMap"), $("#ProvinceMap"));
				}
			} else {
				$("#ProvinceMap").css({
					opacity: 0
				});
				areaThorough(obj.name, null, function(range) {
					if (callback instanceof Function)
						callback();
					chinaMap.changeView(range);
					$("#waitCover").show();
					loadAnimation.play();
					mapLevelSwitch($("#ChinaMap"), $("#ProvinceMap"));
				});
			}

		};

		this.clickCity = function(obj, callback) {
			$("#ProvinceMap").css({
				opacity: 0
			});
			areaThorough(obj.pName, obj.name, function(range) {
				if (callback instanceof Function)
					callback();
				chinaMap.changeView(range);
				mapLevelSwitch($("#ChinaMap"), $("#ProvinceMap"));
			}, true);
		};

		this.setDotAry = function(data) {
			view.setDots(data);
		};

		init();
	};

	EE.map = map;
})()