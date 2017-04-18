this.EE = this.EE || {};
(function() {
	var map = function(id, callback) {
		var cur = this,
			mapping, chinaMap, provinceMap, view, queue, activeProvince = null,
			activeCity = null;
		var resourceAry = [{
			id: "bg",
			src: "images/p1/bg.jpg"
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
			src: "images/p1/coverLight.png"
		}];

		function init() {
			queue = new createjs.LoadQueue();
			queue.loadManifest(resourceAry);
			queue.on("complete", function() {
				mapping = province;

				if (id) {
					// console.log(id)
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
						bg: true,
						activeName: activeProvince ? activeProvince.name : null
					});
					view = chinaMap;

					bindToolOver();

					chinaMap.clickFun = function(name, callback) {
						areaThorough(name, null, function(range, curMap) {
							mapLevelSwitch($("#ChinaMap"), $("#ProvinceMap"));
							callback(range);
						});
					};
				}
			});
		};

		function bindToolOver() {
			$(".toolTip div").mouseenter(function() {
				cur.mapCount = self.clearTimeout(cur.mapCount);
			}).mouseleave(function() {
				$(".toolTip").removeClass("toolShow");
			});
		};

		function mapToolShow(infor, position) {
			var scale = $("#china").height() / parseInt($("#ChinaMap").attr("height"));
			cur.mapCount = self.clearTimeout(cur.mapCount);
			if (infor.type == "positive") {
				$(".toolTip").removeClass("neutral").removeClass("negative").addClass("positive");
			} else if (infor.type == "neutral")
				$(".toolTip").removeClass("positive").removeClass("negative").addClass("neutral");
			else
				$(".toolTip").removeClass("neutral").removeClass("positive").addClass("negative");

			$(".toolTip .totalNum").html(infor.name + "总数：<span>" + infor.num + "</span>");
			$(".toolTip .mapTip1 span").text(infor.atmosphere);
			$(".toolTip .mapTip2 span").text(infor.water);
			$(".toolTip .mapTip3 span").text(infor.soil);
			$(".toolTip .mapTip4 span").text(infor.nucleus);
			$(".toolTip .mapTip5 span").text(infor.solid);
			$(".toolTip .mapTip6 span").text(infor.other);
			$(".toolTip").css({
				left: position.x * scale + $("#ChinaMap").offset().left - $("#china").offset().left,
				bottom: $("#china").height() - position.y * scale
			}).addClass("toolShow");
		};

		function mapToolHide() {
			cur.mapCount = self.setTimeout(function() {
				$(".toolTip").removeClass("toolShow");
			}, 2000);
		};

		//	创建省份
		function createProvince(id, name, activeName, callback) {
			var a = id.split("_");
			var ID = a[0] + "_" + a[1];
			$.ajax({
				type: "get",
				url: "geojson/" + ID + ".json",
				success: function(json) {
					// testCity(json.features);
					console.log(id, name, activeName);

					var range = getRange(json.features);
					provinceMap = new EE.mapViewSwitch({
						canvas: document.getElementById("ProvinceMap"),
						data: json.features,
						range: range,
						imgAry: queue,
						activeName: activeCity ? activeCity.name : activeName,
						scale: [0.546, 0.665],
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

							if (cur.chinaClick instanceof Function)
								cur.chinaClick(NAME, id);
						}
					});
					provinceMap.id = id;
					view = provinceMap;

					if (activeCity || activeName)
						provinceMap.outClick = function() {
							$(".toolTip").removeClass("toolShow");
							cur.cityBlankClick({
								id: ID,
								name: name
							});
						};
					else
						provinceMap.outClick = function() {
							$(".toolTip").removeClass("toolShow");
							cur.provinceBlankClick();
						};

					provinceMap.toolTipOver = mapToolShow;
					provinceMap.toolTipOut = mapToolHide;

					provinceMap.clickFun = function(cityName, callback) {
						// provinceMap.clear();
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
				console.log(999);
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
				ease: Power2.easeInOut
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