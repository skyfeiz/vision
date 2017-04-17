/*
	opt = {
		canvas: {},
		data: [],
		range: { x: [], y: [] },
		center: [],
		scale: [],
		click2Deep: true,
		dotAry: [],
		bg: {}
	}
*/

this.yu = this.yu || {};
(function(){
	var mapViewSwitch = function(opt){
		var cur = this;
		var stage, radiusX=0, radiusY=0, coorCenter, width, height;
		var greenImg,redImg,yellowImg;
		var testAry = [];

		function init(){
			greenImg = new Image();
			greenImg.onload = function(){};
			greenImg.src = "images/greenDot.png";

			redImg = new Image();
			redImg.onload = function(){};
			redImg.src = "images/redDot.png";

			yellowImg = new Image();
			yellowImg.onload = function(){};
			yellowImg.src = "images/yellowDot.png";

			cur.stage = stage = new createjs.Stage(opt.canvas);
			stage.enableMouseOver(10);
			stage.cursor = 'pointer';
			
			cur.mapBox = new createjs.Container();
			stage.addChild(cur.mapBox);

			cur.dotBox = new createjs.Container();
			stage.addChild(cur.dotBox);

			setPosition();

			createMaps();
		};

		function setPosition(){
			opt.range = opt.range || { x: [73.4766,135.0879], y: [18.1055,53.5693] };
			// opt.center = opt.center || [0.5, 0.5];
			opt.center = opt.center || [0.6, 0.5];
			// opt.scale = opt.scale || [1, 1];
			opt.scale = opt.scale || [0.85, 0.9];
			opt.click2Deep = opt.click2Deep===false ? false : true;

			width = opt.canvas.width*(0.5-Math.abs(0.5-opt.center[0]))*2;
			height = opt.canvas.height*(0.5-Math.abs(0.5-opt.center[1]))*2;

			var radius = Math.min(width/(Math.PI/180*(opt.range.x[1]-opt.range.x[0])),height/(Math.PI/180*(opt.range.y[1]-opt.range.y[0])));
			radiusX = radius*opt.scale[0];
			radiusY = radius*opt.scale[1];

			coorCenter = [(opt.range.x[0]+opt.range.x[1])/2, (opt.range.y[0]+opt.range.y[1])/2];
			var centerX = coorCenter[0]/180*Math.PI*radiusX;
			var centerY = -coorCenter[1]/180*Math.PI*radiusY;

			cur.mapBox.x = cur.dotBox.x = opt.canvas.width*opt.center[0] - centerX;
			cur.mapBox.y = cur.dotBox.y = opt.canvas.height*opt.center[1] - centerY;
		};
		
		function createMaps(){
			for(var i=0; i<opt.data.length; i++){
				new yu.Cartography({
					Container: cur.mapBox,
					coordinateData: opt.data[i].geometry,
					nameData: opt.data[i].properties.name,
					font: 10,
					fillColor: "#04204e",
					radiusX: radiusX,
					radiusY: radiusY,
					strokeColor: "#1f6bb9",
					onComplete: function(mapShape){
						stage.update();
						if(i==opt.data.length-1)
							drawMapBg();

						bindEvent(mapShape,stage);
					}
				});
			}
		};

		function drawMapBg(){
			var cty = opt.canvas.getContext("2d");
			var imgData = cty.getImageData(0,0,opt.canvas.width,opt.canvas.height);
			var copyData = imgData.data.slice(0);

			new yu.EdgeGradient({ imageData: copyData, width: opt.canvas.width, borderW: 0, height: opt.canvas.height, GradientW: 13, color: [0,198,255] });

			var bgCanvas = document.createElement("canvas");
			bgCanvas.width = opt.canvas.width;
			bgCanvas.height = opt.canvas.height;
			var ctx = bgCanvas.getContext("2d");
			ctx.putImageData(new ImageData(copyData, imgData.width, imgData.height),0,0);

			for(var i=0; i<cur.mapBox.children.length; i++){
				cur.mapBox.children[i].alpha = 0.1;
			}

			var bg = new createjs.Bitmap(bgCanvas);
			bg.x = -cur.mapBox.x;
			bg.y = -cur.mapBox.y;
			bg.shadow = new createjs.Shadow("#1085ff", 0, 0, 50);
			cur.mapBox.addChildAt(bg,0);

			if(opt.bg){
				console.log(opt.bg)
				var BG = new createjs.Bitmap(opt.bg);
				BG.x = -cur.mapBox.x;
				BG.y = -cur.mapBox.y;
				cur.mapBox.addChildAt(BG,0);
			}

			stage.update();

			addDots(opt.dotAry || []);
		};
		
		function bindEvent(mapShape,stage){
			// mapShape.isClick = false;

			mapShape.addEventListener('mouseover',function(){
				mapShape.mapData.fillCommand.style = "#00c6ff";
				mapShape.alpha = 1;
				mapShape.x = -3;
				mapShape.y = -3;
				stage.update();
			});
			mapShape.addEventListener('mouseout',function(){
				mapShape.mapData.fillCommand.style = "#04204e";
				mapShape.x = 0;
				mapShape.y = 0;
				mapShape.alpha = 0.1;
				stage.update();
			});

			if(opt.click2Deep){
				mapShape.addEventListener("click",function(){
					mapShape.alpha = 0.1;
					mapShape.mapData.fillCommand.style = "#04204e";
					mapShape.x = 0;
					mapShape.y = 0;

					if(cur.clickFun){
						cur.clickFun(mapShape.name, function(range){
							changeCenter(range || opt.range);
						});
					}
					// else
						// changeCenter(mapShape.mapData.coorRange || opt.range);
				});
			}
		};

		/*function sizeChange(mapShape){
			var range = mapShape.mapData.coorRange || opt.range;
			// if(mapShape.isClick)
				// range = opt.range;

			changeCenter(range);

			// mapShape.isClick = !mapShape.isClick;
		};*/

		function changeCenter(range){
			var radius = Math.min(width/(Math.PI/180*(range.x[1]-range.x[0])),height/(Math.PI/180*(range.y[1]-range.y[0])));

			var scale = radius/radiusX*opt.scale[0];

			var x = Math.PI/180*(range.x[1]+range.x[0])/2;
			var y = Math.PI/180*(range.y[1]+range.y[0])/2;

			if(scale == 1){
				x = Math.PI/180*coorCenter[0];
				y = Math.PI/180*coorCenter[1];
			}
			else
				cur.dotBox.visible = false;

			x *= radiusX*scale;
			y *= -radiusY*scale;
			
			x = stage.canvas.width*opt.center[0] - x;
			y = stage.canvas.height*opt.center[1] - y;

			TweenMax.to(cur.mapBox,0.6,{
				ease: Power2.easeInOut,
				x: x,
				y: y,
				scaleX: scale,
				scaleY: scale,
				onUpdate: function(){
					stage.update();
				},
				onCompleteParams: [scale],
				onComplete: function(scale){
					cur.dotBox.visible = scale == 1;
					stage.update();
				}
			});
		};
		var addDots = function(dotCoors){
			cur.dotBox.removeAllChildren();
			for(var i=0; i<dotCoors.length; i++){
				var img;
				var max = Math.max(Math.max(dotCoors[i].numJust,dotCoors[i].numIn),dotCoors[i].numNegative);
				if(dotCoors[i].numJust == max)
					img = greenImg;
				if(dotCoors[i].numIn == max)
					img = redImg;
				if(dotCoors[i].numNegative == max)
					img = yellowImg;

				var dot = new createjs.Bitmap(img);
				dot.regX = 18;
				dot.regY = 15;

				dot.x = dotCoors[i].coordinate[0]/180*Math.PI*radiusX;
				dot.y = -dotCoors[i].coordinate[1]/180*Math.PI*radiusY;
				// dot.coorData = dotCoors[i].coor;
				var num = new createjs.Text(dotCoors[i].num, "20px Arial normal", "#00c6ff");
				num.regY = 10;
				num.x = dot.x + 22;
				num.y = dot.y;

				dotBind(dot,dotCoors[i]);

				cur.dotBox.addChild(num);
				cur.dotBox.addChild(dot);

				stage.update();
			}

			
		};

		//	切换地图视口 
		this.changeView = function(range){
			changeCenter(range || opt.range);
		};

		this.clear = function(){
			stage.removeAllChildren();
			stage.update();
		};

		this.setDots = function(ary){
			addDots(ary);
		};

		function dotBind(dot,infor){
			dot.addEventListener("mouseover",function(){
				var loc = cur.mapBox.localToGlobal(dot.x,dot.y);
				cur.toolTipOver(infor,loc);
			});
			dot.addEventListener("mouseout",function(){
				cur.toolTipOut();
			});
		}

		init();
	};

	yu.mapViewSwitch = mapViewSwitch;
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
this.yu = this.yu||{};
(function(){
	var EdgeGradient = function( opt ){
		var borderAry = [];
		var cloneData;

		function init(){
			if(!opt.imageData || !opt.width || !opt.height){
				throw new Error("参数传入错误!");
				return false;
			}

			opt.GradientW = opt.GradientW || 20;
			opt.borderW = opt.borderW || 1;
			opt.color = opt.color || [0,0,0];

			getEdge();
		};

		//	边界获取
		function getEdge(){
			var data = opt.imageData;
			var startA = 0;
			for(var i=0; i<opt.height; i++){
				for(var j=0; j<opt.width; j++){
					if(data[(i*opt.width+j)*4 + 3]!=0){
						var isOut = false;
						for(var z=0; z<2*Math.PI; z+=Math.PI/8){
							var x = Math.round(opt.GradientW*Math.cos(z+startA));
							var y = Math.round(opt.GradientW*Math.sin(z+startA));
							if(data[((i+y)*opt.width+(j+x))*4 + 3]==0){
								startA += z;
								isOut = true;
								break;
							}
						}

						if(isOut){
							colorAdd(data,i,j);
							borderAry.push({x: i, y: j});
						}
					}
					
				 }
			}

			cloneData = opt.imageData.slice(0);
			for(var i=0; i<borderAry.length; i++){
				GaussBlur(opt.imageData,borderAry[i]);
			}
		};

		//	渐变色添加
		function colorAdd(data,i,j){
			var r = opt.GradientW;
			for(var a=0; a<opt.GradientW-opt.borderW; a++){
				r = opt.GradientW - a;
				var isOut = false;
				for(var b=0; b<2*Math.PI; b+=Math.PI/24){
					var x = Math.round(r*Math.cos(b));
					var y = Math.round(r*Math.sin(b));
					if(data[((i+y)*opt.width+(j+x))*4 + 3]==0){
						isOut = true;
						break;
					}
				}

				if(!isOut){
					data[(i*opt.width+j)*4] = mix(opt.color[0],data[(i*opt.width+j)*4],1-(r/opt.GradientW-1)*(r/opt.GradientW-1));
					data[(i*opt.width+j)*4 + 1] = mix(opt.color[1],data[(i*opt.width+j)*4 + 1],1-(r/opt.GradientW-1)*(r/opt.GradientW-1));
					data[(i*opt.width+j)*4 + 2] = mix(opt.color[2],data[(i*opt.width+j)*4 + 2],1-(r/opt.GradientW-1)*(r/opt.GradientW-1));
					break;
				}
			}
		};

		//	半径为1的高斯模糊处理
		function GaussBlur(Data,ary){
			var rgb = [0,0,0];
			if(cloneData[((ary.x-1)*opt.width+(ary.y-1))*4 + 3]!=0){
				rgb[0] += cloneData[((ary.x-1)*opt.width+(ary.y-1))*4]*0.0947416;
				rgb[1] += cloneData[((ary.x-1)*opt.width+(ary.y-1))*4+1]*0.0947416;
				rgb[2] += cloneData[((ary.x-1)*opt.width+(ary.y-1))*4+2]*0.0947416;
			}
			if(cloneData[((ary.x-1)*opt.width+(ary.y))*4 + 3]!=0){
				rgb[0] += cloneData[((ary.x-1)*opt.width+(ary.y))*4]*0.118318;
				rgb[1] += cloneData[((ary.x-1)*opt.width+(ary.y))*4+1]*0.118318;
				rgb[2] += cloneData[((ary.x-1)*opt.width+(ary.y))*4+2]*0.118318;
			}
			if(cloneData[((ary.x-1)*opt.width+(ary.y+1))*4 + 3]!=0){
				rgb[0] += cloneData[((ary.x-1)*opt.width+(ary.y+1))*4]*0.0947416;
				rgb[1] += cloneData[((ary.x-1)*opt.width+(ary.y+1))*4+1]*0.0947416;
				rgb[2] += cloneData[((ary.x-1)*opt.width+(ary.y+1))*4+2]*0.0947416;
			}
			if(cloneData[((ary.x)*opt.width+(ary.y-1))*4 + 3]!=0){
				rgb[0] += cloneData[((ary.x)*opt.width+(ary.y-1))*4]*0.118318;
				rgb[1] += cloneData[((ary.x)*opt.width+(ary.y-1))*4+1]*0.118318;
				rgb[2] += cloneData[((ary.x)*opt.width+(ary.y-1))*4+2]*0.118318;
			}
			if(cloneData[((ary.x)*opt.width+(ary.y))*4 + 3]!=0){
				rgb[0] += cloneData[((ary.x)*opt.width+(ary.y))*4]*0.147761;
				rgb[1] += cloneData[((ary.x)*opt.width+(ary.y))*4+1]*0.147761;
				rgb[2] += cloneData[((ary.x)*opt.width+(ary.y))*4+2]*0.147761;
			}
			if(cloneData[((ary.x)*opt.width+(ary.y+1))*4 + 3]!=0){
				rgb[0] += cloneData[((ary.x)*opt.width+(ary.y+1))*4]*0.118318;
				rgb[1] += cloneData[((ary.x)*opt.width+(ary.y+1))*4+1]*0.118318;
				rgb[2] += cloneData[((ary.x)*opt.width+(ary.y+1))*4+2]*0.118318;
			}
			if(cloneData[((ary.x+1)*opt.width+(ary.y-1))*4 + 3]!=0){
				rgb[0] += cloneData[((ary.x+1)*opt.width+(ary.y-1))*4]*0.0947416;
				rgb[1] += cloneData[((ary.x+1)*opt.width+(ary.y-1))*4+1]*0.0947416;
				rgb[2] += cloneData[((ary.x+1)*opt.width+(ary.y-1))*4+2]*0.0947416;
			}
			if(cloneData[((ary.x+1)*opt.width+(ary.y))*4 + 3]!=0){
				rgb[0] += cloneData[((ary.x+1)*opt.width+(ary.y))*4]*0.118318;
				rgb[1] += cloneData[((ary.x+1)*opt.width+(ary.y))*4+1]*0.118318;
				rgb[2] += cloneData[((ary.x+1)*opt.width+(ary.y))*4+2]*0.118318;
			}
			if(cloneData[((ary.x+1)*opt.width+(ary.y+1))*4 + 3]!=0){
				rgb[0] += cloneData[((ary.x+1)*opt.width+(ary.y+1))*4]*0.0947416;
				rgb[1] += cloneData[((ary.x+1)*opt.width+(ary.y+1))*4+1]*0.0947416;
				rgb[2] += cloneData[((ary.x+1)*opt.width+(ary.y+1))*4+2]*0.0947416;
			}


			Data[(ary.x*opt.width+ary.y)*4] = rgb[0];
			Data[(ary.x*opt.width+ary.y)*4+1] = rgb[1];
			Data[(ary.x*opt.width+ary.y)*4+2] = rgb[2];
		};

		function mix(a,b,t){
			return Math.round(b*t + (1-t)*a);
		};

		init();
	};
	
	yu.EdgeGradient = EdgeGradient;
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
this.yu = this.yu||{};
(function(){
	var Cartography = function( opt ){
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
			onComplete: function(){}
		};
		var globalOption = {};
	
		function mergeConfig(){
			var option = {};
			for( var i in defaults ){
				if( i in opt ){
					option[i] = opt[i];
				}
				else
				{
					option[i] = defaults[i];
				}
			}
			
			return option;
		};

		function init(){
			globalOption = (opt instanceof Object) ? mergeConfig() : defaults;
			cur.mapShape.mapData = {
				// coorRange: { x: [180,-180], y: [90, -90] }
			};	

			initOutline();
			initName();
		};

		//	获取画布
		function getCanvas(container){
			//	是否是stage
			if(container.canvas)
				return container.canvas;
			else
				return getCanvas(container.parent);
		};

		function initOutline(){
			if(globalOption.fillColor instanceof Object)
				cur.mapShape.mapData.fillCommand = cur.mapShape.graphics.beginBitmapFill(globalOption.fillColor).setStrokeStyle(1,0,1).beginStroke(globalOption.strokeColor).command;
			else
				cur.mapShape.mapData.fillCommand = cur.mapShape.graphics.setStrokeStyle(1,0,1).beginStroke(globalOption.strokeColor).beginFill(globalOption.fillColor).command;

			globalOption.Container.addChild(cur.mapShape);
		};

		function initName(){
			if(globalOption.nameData){
				var name;
				if(globalOption.nameData.cp){
					cur.mapShape.name = globalOption.nameData.name;
					name = new createjs.Text(globalOption.nameData.title, "bold "+globalOption.font+"px Arial", "#fff");
					var coordinate = coordinateConversions(globalOption.nameData.cp[0],globalOption.nameData.cp[1]);
					name.x = coordinate.x;
					name.y = coordinate.y;
					name.textAlign = 'center';
					globalOption.Container.addChild(name);
				}
				else{
					name = globalOption.nameData;
					cur.mapShape.name = globalOption.nameData;
				}

				cur.mapShape.mapData.name = name;
				analysisData();
			}
		};

		function analysisData(obj){
			if(globalOption.coordinateData.type == "MultiPolygon"){
				for(var i=0; i<globalOption.coordinateData.coordinates.length; i++){
					var ary = globalOption.coordinateData.coordinates[i];
					for(var j=0; j<ary.length; j++){
						if(i==globalOption.coordinateData.coordinates.length-1 && j==ary.length-1){
							drawing(ary[j],function(){
								globalOption.onComplete(cur.mapShape);
							});
						}
						else
							drawing(ary[j]);
					}
				}
			}
			else{
				for(var i=0; i<globalOption.coordinateData.coordinates.length; i++){
					if(i == globalOption.coordinateData.coordinates.length-1){
						drawing(globalOption.coordinateData.coordinates[i],function(){
							globalOption.onComplete(cur.mapShape);
						});
					}
					else
						drawing(globalOption.coordinateData.coordinates[i]);
				}
			}
		};

		function drawing(dataAry,callback){
			// console.log(isNaN(dataAry[0]))
			// if(dataAry.length<3){
			// 	// console.log(isNaN(dataAry[0]))
			// 	//	数组长度小于3，即为坐标数组
			// 	for(var i in dataAry){
			// 		drawing(dataAry[i],callback);
			// 	}
			// }
			// else{
				for(var i in dataAry){
					if(dataAry[i].length<3)

					var coordinate = coordinateConversions(dataAry[i][0],dataAry[i][1]);
					// cur.mapShape.mapData.coorRange = {x: [Math.min(cur.mapShape.mapData.coorRange.x[0],dataAry[i][0]), Math.max(cur.mapShape.mapData.coorRange.x[1],dataAry[i][0])], y: [Math.min(cur.mapShape.mapData.coorRange.y[0],dataAry[i][1]), Math.max(cur.mapShape.mapData.coorRange.y[1],dataAry[i][1])]};
					if(i==0)
						cur.mapShape.graphics.moveTo(coordinate.x,coordinate.y);
					else
						cur.mapShape.graphics.lineTo(coordinate.x,coordinate.y);

					if(i == dataAry.length-1 && callback instanceof Function){
						callback();
					}
				}
			// }
		};

		function coordinateConversions(angleX,angleY){
			var coordinate = { x: 0, y: 0 };

			coordinate.x = angleX/180*Math.PI*globalOption.radiusX;
			coordinate.y = -angleY/180*Math.PI*globalOption.radiusY;
			
			return coordinate;
		};

		init();
	};
	
	yu.Cartography = Cartography;
})();