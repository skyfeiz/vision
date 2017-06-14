this.WbstChart = this.WbstChart || {};
(function() {
	var Chart8 = function(dom) {
		this._dom = dom;

		this.EventDispatcher = $({});

		this.init();
	};

	var p = Chart8.prototype;

	p.init = function() {
		this._myChart = echarts.init(this._dom);

		var _this = this;

		_this._myChart.on('mouseover', function(param) {
			var item = {};
			item.seriesName = param.name;
			item.xAxisValue = param.value;
			var evt = param.event.event;
			_this.EventDispatcher.trigger('chartmouseover', {
				item: item,
				event: evt
			});
		});

		_this._myChart.on('mouseout', function() {
			_this.EventDispatcher.trigger('chartmouseout');
		});

		_this._myChart.on('click', function(param) {
			_this.EventDispatcher.trigger('click', param);
		});

		this.initDom();

		this.initCanvas();
	};

	p.initDom = function() {
		this.$pietip = $('#pietip');

		this.$canvas = $('#weibo8canvas');
	};

	p.setConfig = function(value) {
		this._config = value;
	};

	p.setDataProvider = function(value) {
		this._dataProvider = value;
		this.creationContent();
	};

	p.initCanvas = function(){
		this.$canvas.attr({
			width:$(this._dom).width(),
			height:$(this._dom).height()
		})
	};

	p.drawCanvas = function(obj1,obj2){
		var w = this.$canvas.width();
		var h = this.$canvas.height();
		var stage = new createjs.Stage(this.$canvas[0]);

		var shape1 = new createjs.Shape();
		var text1 = new createjs.Text(obj1.name+'\n'+obj2.value,'normal 14px DIN Medium','#00c6ff');
		text1.x = w*0.41+h/4+40+10;
		text1.y = h/4-14 - 15;
		shape1.graphics.setStrokeStyle(2)
						.beginStroke('#00c6ff')
						.arc(w*0.41,h*0.5,h/4+6+8,Math.PI*0.5,Math.PI*1.5)
						.lineTo(w*0.41+h/4+40,h/4-14)
						.arc(w*0.41+h/4+40+2,h/4-14,2,0,Math.PI*2)

		var shape2 = new createjs.Shape();
		var text2 = new createjs.Text(obj2.name+'\n'+obj1.value,'normal 14px DIN Medium','#fffc00');
		text2.x = w*0.41+h/4+2+10;
		text2.y = h*0.75+6 - 15;

		shape2.graphics.setStrokeStyle(2)
						.beginStroke("#fffc00")
						.arc(w*0.41,h*0.5,h/4+6,Math.PI*1.5,Math.PI*0.5,true)
						.lineTo(w*0.41+h/4,h*0.75+6)
						.arc(w*0.41+h/4,h*0.75+6,2,0,Math.PI*2);

		stage.addChild(text1);
		stage.addChild(text2);
		stage.addChild(shape1);
		stage.addChild(shape2);

		stage.update();
	};

	p.creationContent = function() {
		if (this._config == null || this._dataProvider == null) {
			return;
		}
		var data1 = this._dataProvider[0];
		var data2 = this._dataProvider[1];
		var data = [{
					name:data1.name,
					value:data1.num
				},{
					name:data2.name,
					value:data2.num
				}];
		this.$pietip.html('<span class="piecn">舆情总数</span><span class="pienum">' + ((1*data1.num+1*data2.num) || '') + '</span>')
		var option = {
			color:['#00c6ff','#fffc00'],
			grid:{
				left:0,
				top:0,
				bottom:0,
				right:0
			},
			legend:{
				data:[data1.name,data2.name],
				itemWidth: 7,
				itemHeight: 3,
				orient: 'vertival',
				bottom: '8%',
				left: '7%',
				padding: 2,
				textStyle: {
					color: '#81d6ff',
					fontFamily:'DIN Medium'
				}
			},

			series:[{
				name:'饼图',
				type:'pie',
				radius:"50%",
				center:["41%","50%"],
				label:{
					normal:{
						position:'inner',
						formatter:"{d}%",
						textStyle:{
							color:'#020e22'
						}
					}
				},
				data:data,
				itemStyle:{
					normal:{
						borderWidth:2,
						borderColor:'#010f26'
					}
				}
			}]
		}
		this._myChart.setOption(option);
		this.drawCanvas(data[0],data[1]);
	};

	WbstChart.Chart8 = Chart8;
})();