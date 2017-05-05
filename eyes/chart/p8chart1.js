this.WbstChart = this.WbstChart || {};
(function() {
	var P8chart1 = function(dom) {
		this._dom = dom;
		this.EventDispatcher = $({});
		this.init();
	};

	var p = P8chart1.prototype;

	p.init = function() {
		var _this = this;
		_this._myChart = EE.echarts.init(this._dom);

		_this._myChart.on('mouseover', function(param) {
			if(param.name.indexOf('>')!=-1)return;
			var item = {};
			item.seriesName = param.name;
			var evt = param.event.event;
			_this.EventDispatcher.trigger('chartmouseover', {
				item: item,
				event: evt
			});
		});

		_this._myChart.on('mouseout', function() {
			_this.EventDispatcher.trigger('chartmouseout');
		});
	};


	p.setConfig = function(value) {
		this._config = value;
	};

	p.setDataProvider = function(value) {
		this._dataProvider = value;
		this.creationContent();
	};

	p.creationContent = function() {
		if (this._config == null || this._dataProvider == null) {
			return;
		}
		var nestData = this.nestingData(this._dataProvider,this._config.pName,this._config.name);
		// 是否开启鼠标缩放，移动。 根据最后一级子元素的个数  大于18个时开启
		var len3 = 0;

		// 判断有没有三级子级没有的话，改变初始left的百分比值
		var isCenter = false;

		var data = [];
		for (var i = 0; i < nestData.length; i++) {
			var json1 = {};
			json1.name = nestData[i].mdata[this._config.name] + '\n' + nestData[i].mdata[this._config.time];
			json1.symbolSize = 35;
			json1.itemStyle = {
				normal:{
					color:"#024ecc"
				}
			};
			json1.children = [];
			if (nestData[i].son.length) {
				for (var j = 0; j < nestData[i].son.length; j++) {
					var json2 = {};
					json2.name = nestData[i].son[j].mdata[this._config.name] + '\n' + nestData[i].son[j].mdata[this._config.time];
					json2.symbolSize = 28;
					json2.itemStyle = {
						normal:{
							color:"#0084ff"
						}
					};
					json2.children = [];
					if (nestData[i].son[j].son.length) {
						len3 += nestData[i].son[j].son.length;
						for (var k = 0; k < nestData[i].son[j].son.length; k++) {
							var json3 = {};
							json3.name = nestData[i].son[j].son[k].mdata[this._config.name] + '\n' + nestData[i].son[j].son[k].mdata[this._config.time];
							json3.symbolSize = 22;
							json3.itemStyle = {
								normal:{
									color:"#00c6ff"
								}
							};
							json2.children.push(json3);
						}
					}else{
						isCenter = true;
					}
					json1.children.push(json2)
				}
			}
			data.push(json1);
		}

		var option = {
			color:['#165473'],
			calculable: false,
			series:[{
				name: '树图',
				type: 'tree',
				orient: 'horizontal', // vertical horizontal
				clickable:true,
				rootLocation: {
					x: isCenter?'30%':'10%',
					y: 'center'
				}, // 根节点位置  {x: 100, y: 'center'}
				nodePadding: 10,
				layerPadding:220,
				itemStyle:{
					normal:{
						color:'#024ecc',
						label:{
							show:true,
							position:'right',
							textStyle:{
								color:'#84d5ff'
							}
						},
						lineStyle: {
	                        color: '#155271',
	                        type: 'curve' // 'curve'|'broken'|'solid'|'dotted'|'dashed'

	                    }
					},
					emphasis:{
						color:'#fffc00',
						label:{
							show:true,
							textStyle:{
								color:'#fffc00'
							}
						},
					}
				},
				roam: len3>18,
				data:data
			}]
		}
		console.log(len3);

		this._myChart.setOption(option);
	};

	// 数据转换成嵌套格式

	p.nestingData = function(data,pname,name){
		var pArr = [],//存pName == ''的数组
			sArr = [],//存pName != ''的数组
			dataArr = [];//存转换后嵌套的数据
		
		for (var i = 0; i < data.length; i++) {
			if (data[i][pname] == 0) {
				pArr.push(data[i]);
			}else{
				sArr.push(data[i]);
			}
		}
		
		var len = sArr.length;
		for (var i = 0; i < pArr.length; i++) {
			var json = {};
			json.mdata = pArr[i];
			json.son = [];
			rabitData(pArr[i],json);
			dataArr.push(json);
		}

		function rabitData(json,json2){
			for (var i = 0; i < len; i++) {
				if (sArr[i][pname] == json[name]) {
					var jsonBlank = {};
					jsonBlank.mdata = sArr[i];
					jsonBlank.son = [];
					rabitData(sArr[i],jsonBlank);
					json2.son.push(jsonBlank);
				}
			}
		}

		return dataArr;
	};


	WbstChart.P8chart1 = P8chart1;
})();
