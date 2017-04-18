/*
	opt = {
		canvas: {},
		data: [],
		range: { x: [], y: [] },
		center: [],
		scale: [],
		click2Deep: true,
		dotAry: [],
		bg: {},
		clickScale: 1,
		silent: false
	}
*/

this.EE = this.EE || {};
(function() {
	var mapViewSwitch = function(opt) {
		var cur = this;
		var stage, radiusX = 0,
			radiusY = 0,
			coorCenter, width, height, tweenAry = [];
		var testAry = [];

		function init() {
			cur.stage = stage = new createjs.Stage(opt.canvas);
			stage.enableMouseOver(10);
			stage.cursor = 'pointer';

			cur.mapBox = new createjs.Container();
			stage.addChild(cur.mapBox);

			cur.drawingBox = new createjs.Container();
			stage.addChild(cur.drawingBox);

			cur.dotBox = new createjs.Container();
			stage.addChild(cur.dotBox);

			setPosition();

			createMaps();
		};

		function setPosition() {
			opt.range = opt.range || {
				x: [73.4766, 135.0879],
				y: [18.1055, 53.5693]
			};
			// opt.center = opt.center || [0.5, 0.5];
			opt.center = opt.center || [0.6, 0.5];
			// opt.scale = opt.scale || [1, 1];
			opt.scale = opt.scale || [0.78, 0.95];
			opt.click2Deep = opt.click2Deep === false ? false : true;
			opt.clickDispare = opt.clickDispare === true ? true : false;
			opt.silent = opt.silent === true ? true : false;
			opt.clickScale = opt.clickScale || 1;

			if (!opt.silent)
				createjs.Ticker.addEventListener("tick", stage);

			width = opt.canvas.width * (0.5 - Math.abs(0.5 - opt.center[0])) * 2;
			height = opt.canvas.height * (0.5 - Math.abs(0.5 - opt.center[1])) * 2;

			var radius = Math.min(width / (Math.PI / 180 * (opt.range.x[1] - opt.range.x[0])), height / (Math.PI / 180 * (opt.range.y[1] - opt.range.y[0])));
			radiusX = radius * opt.scale[0];
			radiusY = radius * opt.scale[1];

			coorCenter = [(opt.range.x[0] + opt.range.x[1]) / 2, (opt.range.y[0] + opt.range.y[1]) / 2];
			var centerX = coorCenter[0] / 180 * Math.PI * radiusX;
			var centerY = -coorCenter[1] / 180 * Math.PI * radiusY;

			cur.drawingBox.x = cur.mapBox.x = cur.dotBox.x = opt.canvas.width * opt.center[0] - centerX;
			cur.drawingBox.y = cur.mapBox.y = cur.dotBox.y = opt.canvas.height * opt.center[1] - centerY;
		};

		function createMaps() {
			for (var i = 0; i < opt.data.length; i++) {
				new EE.Cartography({
					Container: cur.drawingBox,
					coordinateData: opt.data[i].geometry,
					nameData: opt.data[i].properties.name,
					font: 10,
					fillColor: "#04204e",
					radiusX: radiusX,
					radiusY: radiusY,
					strokeColor: "#00c5ff",
					onComplete: function(mapShape) {
						stage.update();
						if (i == opt.data.length - 1)
							drawMapBg();

						if (!opt.silent)
							bindEvent(mapShape, stage);
					}
				});
			}
		};

		function drawMapBg() {
			var cty = opt.canvas.getContext("2d");
			var imgData = cty.getImageData(0, 0, opt.canvas.width, opt.canvas.height);
			var copyData = imgData.data.slice(0);

			new EE.EdgeGradient({
				imageData: copyData,
				width: opt.canvas.width,
				borderW: 0,
				height: opt.canvas.height,
				GradientW: 10,
				color: [0, 165, 255]
			});

			var bgCanvas = document.createElement("canvas");
			bgCanvas.width = opt.canvas.width;
			bgCanvas.height = opt.canvas.height;
			var ctx = bgCanvas.getContext("2d");
			ctx.putImageData(new ImageData(copyData, imgData.width, imgData.height), 0, 0);

			for (var i = 0; i < cur.drawingBox.children.length; i++) {
				var mapShape = cur.drawingBox.children[i];
				if (opt.activeName && opt.activeName.match(mapShape.name)) {
					mapShape.mapData.fillCommand.style = "#00c6ff";
					mapShape.alpha = 1;
				} else {
					mapShape.mapData.fillCommand.style = "#04204e";
					mapShape.alpha = 0.1;
				}
			}

			var bg = new createjs.Bitmap(bgCanvas);
			bg.x = -cur.mapBox.x;
			bg.y = -cur.mapBox.y;
			// bg.alpha = 0.9;
			bg.shadow = new createjs.Shadow("#1085ff", 0, 0, 35);
			cur.mapBox.addChildAt(bg, 0);

			var light = new createjs.Bitmap(opt.imgAry.getResult("coverLight"));
			light.regX = opt.imgAry.getResult("coverLight").width / 2;
			light.regY = opt.imgAry.getResult("coverLight").height / 2;
			light.x = -cur.mapBox.x + bgCanvas.width * (opt.center[0] + 0.07);
			light.y = -cur.mapBox.y + bgCanvas.height * opt.center[1];
			cur.mapBox.addChildAt(light, 1);

			if (opt.bg === true) {
				var BG = new createjs.Bitmap(opt.imgAry.getResult("bg"));
				BG.x = -cur.mapBox.x;
				BG.y = -cur.mapBox.y;
				cur.mapBox.addChildAt(BG, 0);
			} else {
				var BG = new createjs.Shape();
				BG.graphics.beginFill("#000").drawRect(0, 0, opt.canvas.width, opt.canvas.height);
				BG.alpha = 0.01;
				BG.x = -cur.mapBox.x;
				BG.y = -cur.mapBox.y;
				cur.mapBox.addChildAt(BG, 2);

				BG.addEventListener("click", function() {
					if (cur.outClick instanceof Function) {
						cur.outClick();
					}
				})
			}



			if (opt.onComplete instanceof Function)
				opt.onComplete();
			// addDots(opt.dotAry || []);
			cur.stage.update();
		};

		function bindEvent(mapShape, stage) {
			if (!opt.activeName || opt.activeName.match(mapShape.name)) {
				mapShape.addEventListener('mouseover', function() {
					mapShape.mapData.fillCommand.style = "#00c6ff";
					mapShape.alpha = 1;
					mapShape.x = -3;
					mapShape.y = -3;

				});
				mapShape.addEventListener('mouseout', function() {
					mapShape.mapData.fillCommand.style = "#04204e";
					mapShape.x = 0;
					mapShape.y = 0;

					if (opt.activeName && opt.activeName.match(mapShape.name)) {
						mapShape.mapData.fillCommand.style = "#00c6ff";
						mapShape.alpha = 1;
					} else {
						mapShape.mapData.fillCommand.style = "#04204e";
						mapShape.alpha = 0.1;
					}

				});

				if (opt.click2Deep) {
					mapShape.addEventListener("click", function() {
						if (opt.activeName && opt.activeName.match(mapShape.name)) {
							mapShape.mapData.fillCommand.style = "#00c6ff";
							mapShape.alpha = 1;
						} else {
							mapShape.mapData.fillCommand.style = "#04204e";
							mapShape.alpha = 0.1;
						}

						mapShape.mapData.fillCommand.style = "#04204e";
						mapShape.x = 0;
						mapShape.y = 0;


						if (cur.clickFun) {
							cur.clickFun(mapShape.name, function(range) {
								changeCenter(range || opt.range);
							});
						}
					});
				}
			}
		};

		function changeCenter(range) {
			var radius = Math.min(width / (Math.PI / 180 * (range.x[1] - range.x[0])), height / (Math.PI / 180 * (range.y[1] - range.y[0])));

			var scale = radius / radiusX * opt.scale[0];

			var x = Math.PI / 180 * (range.x[1] + range.x[0]) / 2;
			var y = Math.PI / 180 * (range.y[1] + range.y[0]) / 2;

			if (scale == 1) {
				x = Math.PI / 180 * coorCenter[0];
				y = Math.PI / 180 * coorCenter[1];

				for (var i = 0; i < tweenAry.length; i++) {
					tweenAry[i].paused();
				}
			} else {
				scale *= opt.clickScale;
				cur.dotBox.visible = false;
				cur.drawingBox.visible = false;
				for (var i = 0; i < tweenAry.length; i++) {
					tweenAry[i].play();
				}
			}

			x *= radiusX * scale;
			y *= -radiusY * scale;

			x = stage.canvas.width * opt.center[0] - x;
			y = stage.canvas.height * opt.center[1] - y;

			TweenMax.to(cur.mapBox, 0.6, {
				ease: Power2.easeInOut,
				x: x,
				y: y,
				scaleX: scale,
				scaleY: scale,
				onCompleteParams: [scale],
				onComplete: function(scale) {
					cur.drawingBox.visible = cur.dotBox.visible = scale == 1;

				}
			});
		};
		var addDots = function(dotCoors) {
			cur.dotBox.removeAllChildren();
			for (var i = 0; i < dotCoors.length; i++) {
				var img, light;
				var max = Math.max(Math.max(dotCoors[i].numJust, dotCoors[i].numIn), dotCoors[i].numNegative);
				if (dotCoors[i].numJust == max) {
					img = opt.imgAry.getResult("positive");
					light = opt.imgAry.getResult("positiveL");
					dotCoors[i].type = "positive";
				}
				if (dotCoors[i].numIn == max) {
					img = opt.imgAry.getResult("neutral");
					light = opt.imgAry.getResult("neutralL");
					dotCoors[i].type = "neutral";
				}
				if (dotCoors[i].numNegative == max) {
					img = opt.imgAry.getResult("negative");
					light = opt.imgAry.getResult("negativeL");
					dotCoors[i].type = "negative";
				}

				var dot = new createjs.Bitmap(img);
				dot.regX = img.width / 2;
				dot.regY = img.height / 2;
				dot.scaleX = dot.scaleY = 0;

				dot.x = dotCoors[i].coordinate[0] / 180 * Math.PI * radiusX;
				dot.y = -dotCoors[i].coordinate[1] / 180 * Math.PI * radiusY;
				// dot.coorData = dotCoors[i].coor;
				var num = new createjs.Text(dotCoors[i].num, "18px Arial normal", "#00c6ff");
				num.regY = 12;
				num.x = dot.x - 14;
				num.y = dot.y;
				num.alpha = 0;

				dotBind(dot, dotCoors[i]);

				cur.dotBox.addChild(num);
				cur.dotBox.addChild(dot);

				var light1 = new createjs.Bitmap(light);
				light1.regX = light.width / 2;
				light1.regY = light.height / 2;
				light1.x = dot.x;
				light1.y = dot.y;
				light1.scaleX = light1.scaleY = light1.alpha = 0;
				cur.dotBox.addChildAt(light1, 0);

				var delay = Math.random() * 1;

				TweenMax.to(dot, 0.6, {
					delay: delay,
					scaleX: 1,
					scaleY: 1,
					ease: Linear.easeNone
				});
				TweenMax.to(num, 0.6, {
					delay: delay + 0.2,
					alpha: 1,
					x: dot.x + 18,
					ease: Power2.easeOut
				});

				var tween1 = TweenMax.to(light1, 2.1, {
					delay: delay,
					scaleX: 1.4,
					scaleY: 1.4,
					// alpha: 1,
					ease: Linear.easeNone,
					repeat: -1,
					onUpdateParams: [light1],
					onUpdate: function(l) {
						l.alpha = Math.sin(Math.PI * l.scaleX / 1.4);
					}
				})
				tweenAry.push(tween1);

				var light2 = new createjs.Bitmap(light);
				light2.regX = light.width / 2;
				light2.regY = light.height / 2;
				light2.x = dot.x;
				light2.y = dot.y;
				light2.scaleX = light2.scaleY = light2.alpha = 0;
				cur.dotBox.addChildAt(light2, 0);

				var tween2 = TweenMax.to(light2, 2.1, {
					delay: delay + 0.7,
					scaleX: 1.4,
					scaleY: 1.4,
					// alpha: 1,
					ease: Linear.easeNone,
					repeat: -1,
					onUpdateParams: [light2],
					onUpdate: function(l) {
						l.alpha = Math.sin(Math.PI * l.scaleX / 1.4);
					}
				})
				tweenAry.push(tween2);

				var light3 = new createjs.Bitmap(light);
				light3.regX = light.width / 2;
				light3.regY = light.height / 2;
				light3.x = dot.x;
				light3.y = dot.y;
				light3.scaleX = light3.scaleY = light3.alpha = 0;
				cur.dotBox.addChildAt(light3, 0);

				var tween3 = TweenMax.to(light3, 2.1, {
					delay: delay + 1.4,
					scaleX: 1.4,
					scaleY: 1.4,
					// alpha: 1,
					ease: Linear.easeNone,
					repeat: -1,
					onUpdateParams: [light3],
					onUpdate: function(l) {
						l.alpha = Math.sin(Math.PI * l.scaleX / 1.4);
					}
				})
				tweenAry.push(tween3);
			}
		};

		//	切换地图视口 
		this.changeView = function(range) {
			changeCenter(range || opt.range);
		};

		this.clear = function() {
			stage.removeAllChildren();
			for (var i = 0; i < tweenAry.length; i++) {
				tweenAry[i].kill();
			}

			tweenAry.splice(0, tweenAry.length);
		};

		this.setDots = function(ary) {
			addDots(ary);
		};

		function dotBind(dot, infor) {
			dot.addEventListener("mouseover", function() {
				var loc = cur.mapBox.localToGlobal(dot.x, dot.y);
				if (cur.toolTipOver instanceof Function)
					cur.toolTipOver(infor, loc);
			});
			dot.addEventListener("mouseout", function() {
				if (cur.toolTipOut instanceof Function)
					cur.toolTipOut();
			});
		};

		init();
	};

	EE.mapViewSwitch = mapViewSwitch;
})();

/*
	边缘判断 ＋ 渐变光叠加处理 ＋ 高斯模糊
	opt = {
		imageData: [],		图形像素数组
		width: 0,			图形宽度
		height: 0,			图形高度
		borderW: 1,			图形边界线宽度，不参与边界处理
		GradientW: 20,		边界处理宽度
		color: [0,0,0]		边界叠加颜色
	}
*/
this.EE = this.EE || {};
(function() {
	var EdgeGradient = function(opt) {
		var borderAry = [];
		var cloneData;

		function init() {
			if (!opt.imageData || !opt.width || !opt.height) {
				throw new Error("参数传入错误!");
				return false;
			}
			// console.log(opt.imageData)

			opt.GradientW = opt.GradientW || 20;
			opt.borderW = 0;
			opt.color = opt.color || [255, 255, 255];

			getEdge();
		};

		//	边界获取
		function getEdge() {
			var data = opt.imageData;
			var startA = 0;
			for (var i = 0; i < opt.height; i++) {
				for (var j = 0; j < opt.width; j++) {
					if (data[(i * opt.width + j) * 4 + 3] != 0) {
						var isOut = false;
						for (var z = 0; z < 2 * Math.PI; z += Math.PI / 8) {
							var x = Math.round(opt.GradientW * Math.cos(z + startA));
							var y = Math.round(opt.GradientW * Math.sin(z + startA));
							if (data[((i + y) * opt.width + (j + x)) * 4 + 3] == 0) {
								startA += z;
								isOut = true;
								break;
							}
						}

						if (isOut) {
							colorAdd(data, i, j);
							borderAry.push({
								x: i,
								y: j
							});
						} else if (data[(i * opt.width + j) * 4] != 4 && data[(i * opt.width + j) * 4 + 1] != 32 && data[(i * opt.width + j) * 4 + 2] != 78) {
							data[(i * opt.width + j) * 4] = 16;
							data[(i * opt.width + j) * 4 + 1] = 68;
							data[(i * opt.width + j) * 4 + 2] = 130;
							// data[(i*opt.width+j)*4+3] = 17;
						}
					}

				}
			}

			cloneData = opt.imageData.slice(0);
			for (var i = 0; i < borderAry.length; i++) {
				GaussBlur(opt.imageData, borderAry[i]);
			}
		};

		//	渐变色添加
		function colorAdd(data, i, j) {
			var r = opt.GradientW;
			for (var a = 0; a < opt.GradientW - opt.borderW; a++) {
				r = opt.GradientW - a;
				var isOut = false;
				for (var b = 0; b < 2 * Math.PI; b += Math.PI / 24) {
					var x = Math.round(r * Math.cos(b));
					var y = Math.round(r * Math.sin(b));
					if (data[((i + y) * opt.width + (j + x)) * 4 + 3] == 0) {
						isOut = true;
						break;
					}
				}

				if (!isOut) {
					data[(i * opt.width + j) * 4] = mix(opt.color[0], data[(i * opt.width + j) * 4], 1 - (r / opt.GradientW - 1) * (r / opt.GradientW - 1));
					data[(i * opt.width + j) * 4 + 1] = mix(opt.color[1], data[(i * opt.width + j) * 4 + 1], 1 - (r / opt.GradientW - 1) * (r / opt.GradientW - 1));
					data[(i * opt.width + j) * 4 + 2] = mix(opt.color[2], data[(i * opt.width + j) * 4 + 2], 1 - (r / opt.GradientW - 1) * (r / opt.GradientW - 1));
					// data[(i*opt.width+j)*4 + 3] = 255;
					// console.log((i*opt.width+j)*4 + 3)
					break;
				}
			}
		};

		//	高斯模糊处理
		function GaussBlur(Data, ary) {
			var rgb = [0, 0, 0];
			var GaussAry = [
				[0.014418818362460818, 0.028084023356349165, 0.035072700805593486, 0.028084023356349165, 0.014418818362460818],
				[0.028084023356349165, 0.054700208300935874, 0.06831229327078019, 0.054700208300935874, 0.028084023356349165],
				[0.035072700805593486, 0.06831229327078019, 0.08531173019012506, 0.06831229327078019, 0.035072700805593486],
				[0.028084023356349165, 0.054700208300935874, 0.06831229327078019, 0.054700208300935874, 0.028084023356349165],
				[0.014418818362460818, 0.028084023356349165, 0.035072700805593486, 0.028084023356349165, 0.014418818362460818]
			];
			/*[[0.001341965359843281,0.004076530817923619,0.007939997843478291,0.009915857326703659,0.007939997843478291,0.004076530817923619,0.001341965359843281],[0.004076530817923619,0.012383407207635911,0.024119583762554287,0.03012171490265726,0.024119583762554287,0.012383407207635911,0.004076530817923619],[0.007939997843478291,0.024119583762554287,0.04697853435039661,0.05866908949084948,0.04697853435039661,0.024119583762554287,0.007939997843478291],[0.009915857326703659,0.03012171490265726,0.05866908949084948,0.07326882605600585,0.05866908949084948,0.03012171490265726,0.009915857326703659],[0.007939997843478291,0.024119583762554287,0.04697853435039661,0.05866908949084948,0.04697853435039661,0.024119583762554287,0.007939997843478291],[0.004076530817923619,0.012383407207635911,0.024119583762554287,0.03012171490265726,0.024119583762554287,0.012383407207635911,0.004076530817923619],[0.001341965359843281,0.004076530817923619,0.007939997843478291,0.009915857326703659,0.007939997843478291,0.004076530817923619,0.001341965359843281]]*/

			for (var i = 0; i < GaussAry.length; i++) {
				for (var j = 0; j < GaussAry[i].length; j++) {
					var x = i - 2,
						y = j - 2;
					if (cloneData[((ary.x + x) * opt.width + (ary.y + y)) * 4 + 3] != 0) {
						rgb[0] += cloneData[((ary.x + x) * opt.width + (ary.y + y)) * 4] * GaussAry[i][j];
						rgb[1] += cloneData[((ary.x + x) * opt.width + (ary.y + y)) * 4 + 1] * GaussAry[i][j];
						rgb[2] += cloneData[((ary.x + x) * opt.width + (ary.y + y)) * 4 + 2] * GaussAry[i][j];
					}
				}
			}

			Data[(ary.x * opt.width + ary.y) * 4] = rgb[0];
			Data[(ary.x * opt.width + ary.y) * 4 + 1] = rgb[1];
			Data[(ary.x * opt.width + ary.y) * 4 + 2] = rgb[2];
		};

		function mix(a, b, t) {
			if (t < 0)
				t = 0;
			return Math.round(b * t + (1 - t) * a);
		};

		init();
	};

	EE.EdgeGradient = EdgeGradient;
})();

/* 
	地图板块绘制组件。
	与 createjs 库一起运用;
	默认用 geojson 数据结构；
	参数配置:
		Container: null,		//		生成图形所需添加入的容器对象( createjs.Container / createjs.Stage )
		coordinateData: {},				//	地图形成的点数据经纬坐标
		nameData: {},					//	地名数据
		scale: 1,				//	地图绘制比例
		fillColor: 'rgba(40,40,202,1)',			//	地图边框颜色
		strokeColor: 'rgba(40,40,202,0.5)',		//	地图填充颜色
		offsetRatio: { scaleX: 1, scaleY: 1 },		//	地图偏移比例，默认为形成地图宽高的一半
		onComplete: function(){}	//	绘制完成调用函数
 */
this.EE = this.EE || {};
(function() {
	var Cartography = function(opt) {
		//	地图板块
		var cur = this;
		cur.mapShape = new createjs.Shape();

		//	默认配置
		var defaults = {
			Container: null,
			coordinateData: {},
			nameData: {},
			font: 50,
			radiusX: 0,
			radiusY: 0,
			fillColor: 'rgba(243,17,17,0.3)',
			strokeColor: 'rgba(226,243,17,1)',
			onComplete: function() {}
		};
		var globalOption = {};

		function mergeConfig() {
			var option = {};
			for (var i in defaults) {
				if (i in opt) {
					option[i] = opt[i];
				} else {
					option[i] = defaults[i];
				}
			}

			return option;
		};

		function init() {
			globalOption = (opt instanceof Object) ? mergeConfig() : defaults;
			cur.mapShape.mapData = {
				// coorRange: { x: [180,-180], y: [90, -90] }
			};

			initOutline();
			initName();
		};

		//	获取画布
		function getCanvas(container) {
			//	是否是stage
			if (container.canvas)
				return container.canvas;
			else
				return getCanvas(container.parent);
		};

		function initOutline() {
			if (globalOption.fillColor instanceof Object)
				cur.mapShape.mapData.fillCommand = cur.mapShape.graphics.beginBitmapFill(globalOption.fillColor).setStrokeStyle(1, 0, 1).beginStroke(globalOption.strokeColor).command;
			else
				cur.mapShape.mapData.fillCommand = cur.mapShape.graphics.setStrokeStyle(1, 0, 1).beginStroke(globalOption.strokeColor).beginFill(globalOption.fillColor).command;

			globalOption.Container.addChild(cur.mapShape);
		};

		function initName() {
			if (globalOption.nameData) {
				var name;
				if (globalOption.nameData.cp) {
					cur.mapShape.name = globalOption.nameData.name;
					name = new createjs.Text(globalOption.nameData.title, "bold " + globalOption.font + "px Arial", "#fff");
					var coordinate = coordinateConversions(globalOption.nameData.cp[0], globalOption.nameData.cp[1]);
					name.x = coordinate.x;
					name.y = coordinate.y;
					name.textAlign = 'center';
					globalOption.Container.addChild(name);
				} else {
					name = globalOption.nameData;
					cur.mapShape.name = globalOption.nameData;
				}

				cur.mapShape.mapData.name = name;
				analysisData();
			}
		};

		function analysisData(obj) {
			if (globalOption.coordinateData.type == "MultiPolygon") {
				for (var i = 0; i < globalOption.coordinateData.coordinates.length; i++) {
					var ary = globalOption.coordinateData.coordinates[i];
					for (var j = 0; j < ary.length; j++) {
						if (i == globalOption.coordinateData.coordinates.length - 1 && j == ary.length - 1) {
							drawing(ary[j], function() {
								globalOption.onComplete(cur.mapShape);
							});
						} else
							drawing(ary[j]);
					}
				}
			} else {
				for (var i = 0; i < globalOption.coordinateData.coordinates.length; i++) {
					if (i == globalOption.coordinateData.coordinates.length - 1) {
						drawing(globalOption.coordinateData.coordinates[i], function() {
							globalOption.onComplete(cur.mapShape);
						});
					} else
						drawing(globalOption.coordinateData.coordinates[i]);
				}
			}
		};

		function drawing(dataAry, callback) {
			// console.log(isNaN(dataAry[0]))
			// if(dataAry.length<3){
			// 	// console.log(isNaN(dataAry[0]))
			// 	//	数组长度小于3，即为坐标数组
			// 	for(var i in dataAry){
			// 		drawing(dataAry[i],callback);
			// 	}
			// }
			// else{
			for (var i in dataAry) {
				// if(dataAry[i].length<3)

				var coordinate = coordinateConversions(dataAry[i][0], dataAry[i][1]);
				// cur.mapShape.mapData.coorRange = {x: [Math.min(cur.mapShape.mapData.coorRange.x[0],dataAry[i][0]), Math.max(cur.mapShape.mapData.coorRange.x[1],dataAry[i][0])], y: [Math.min(cur.mapShape.mapData.coorRange.y[0],dataAry[i][1]), Math.max(cur.mapShape.mapData.coorRange.y[1],dataAry[i][1])]};
				if (i == 0)
					cur.mapShape.graphics.moveTo(coordinate.x, coordinate.y);
				else
					cur.mapShape.graphics.lineTo(coordinate.x, coordinate.y);

				if (i == dataAry.length - 1 && callback instanceof Function) {
					callback();
				}
			}
			// }
		};

		function coordinateConversions(angleX, angleY) {
			var coordinate = {
				x: 0,
				y: 0
			};

			coordinate.x = angleX / 180 * Math.PI * globalOption.radiusX;
			coordinate.y = -angleY / 180 * Math.PI * globalOption.radiusY;

			return coordinate;
		};

		init();
	};

	EE.Cartography = Cartography;
})();