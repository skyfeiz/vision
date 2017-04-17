this.WbstChart = this.WbstChart || {};
(function() {
	var DashBoard = function(dom) {
		this._dom = dom;
		// 显示的某方索引
		this._key = 3;
		// 保存颜色的Arr;
		this.cArr = ['#fff','#01b057','#fffc00','#f9042f'];

		this.init();
	};

	var p = DashBoard.prototype;

	p.init = function() {
		this._dashChart = echarts.init(this._dom);
		this.initDom();
		this.baseEvent();
	};

	p.initDom = function(){
		//仪表图 下面的说明文字
		this.$chartNum = $('#left1charttext');
		
		// 其他三个说明文字 的父级  默认第一个是正数，第二个是中立，第三个是总数
		this.$pNums = $('#left1text').find('.totalnum');
		this.$children = $('#left1text').children();

	}

	p.setConfig =  function(value){
		this._config = value;
	};

	p.setDataProvider = function(value){
		this._dataProvider = value;
		this.creationContent();
	};

	p.creationContent = function(){

		if (this._config == null || this._dataProvider == null) {return;}

		// 计算百分比，四舍五入
		var scalc = this._dataProvider[this._key-1].num/this._dataProvider[3].num;
		scalc = Math.round(scalc*100) + '%';

		var option = {
			animationDuration:3000,
			color:[this.cArr[this._key],'#838791'],
			series:[{
				name:'舆情反馈',
				type:'pie',
				radius:['80%','90%'],
				center:['50%','55%'],
				hoverAnimation:false,
				label:{
					normal:{
						show:false,
						formatter:function(param){
							return scalc;
						},
						textStyle:{
							fontSize:16,
							color:'#01b5e9'
						}
					},
					emphasis:{
						show:false,
						formatter:function(param){
							return scalc;
						}
					}
				},
				data:[{
					value:this._dataProvider[this._key-1].num,
					name:this._dataProvider[this._key-1].name,
					label:{
						normal:{
							show:true,
							position:'center'
						}
					},
					itemStyle:{
						normal:{
							borderWidth:2,
							borderColor:this.cArr[this._key],
							shadowColor:this.cArr[this._key],
							shadowBlur:5,
						}
					}
				},{
					value:this._dataProvider[3].num - this._dataProvider[this._key-1].num,
					name:'其他'
				}]
			}]
		};
		
		this._dashChart.setOption(option);
		this.creationText(this._dataProvider,this._key);
	}

	p.creationText = function(data){
		this.$pNums.eq(0).html('<span>舆情总数</span><span class="bluenum">'+data[3].num+'</span>')
		this.$pNums.eq(1).html('<span>正立总数</span><span class="bluenum">'+data[0].num+'</span>')
		this.$pNums.eq(2).html('<span>中立总数</span><span class="bluenum">'+data[1].num+'</span>')
		this.$pNums.eq(3).html('<span>负方总数</span><span class="bluenum">'+data[2].num+'</span>')
		this.$chartNum.html('<p>'+data[this._key-1].name+'总数</p><p class="bluenum bluelight">'+data[this._key-1].num+'</p>');
		this.$children.removeClass('z_hide').eq(this._key).addClass('z_hide');
	}

	p.baseEvent = function(){
		var _this = this;
		this.$pNums.click(function(){
			_this._key = $(this).index('.totalnum');
			// 为0时 不操作;
			if (_this._key) {
				_this.creationContent();
			}
		})
	}

	WbstChart.DashBoard = DashBoard;
})();