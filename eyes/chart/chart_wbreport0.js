this.WbstChart = this.WbstChart || {};
(function() {
	var Wbreport0 = function(dom) {
		this._dom = dom;
		this.EventDispatcher = $({});
		this.init();
	};

	var p = Wbreport0.prototype;

	p.init = function() {
		var _this = this;
		_this._myChart = echarts.init(this._dom);

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

		var pName = this._config.pName;
		var name = this._config.name;

		var dataArr = [];
		var edgesArr = [];
		var n = 0;
		for (var i = 0,len = this._dataProvider.length; i < len; i++) {
			var item = this._dataProvider[i];
			var json = {
				name:item[name],
				value: 1,
				category: 4,
				label:{
					normal:{
						show:false
					}
				},
				itemStyle:{
					normal:{
						color:'#67ffe1'
					}
				},
				symbolSize:22
			};
			// 父级id不为0的情况
			if (item[pName]) {
				edgesArr.push({
					source:item[pName],
					target:item[name],
				})
			}

			dataArr.push(json);
		}

		var newData = this.nestingData(this._dataProvider,pName,name);

		for (var i = 0,len = dataArr.length; i < len; i++) {
			for (var j = 0,len1 = newData.length; j < len1; j++) {
				if (dataArr[i].name == newData[j].mdata[name]) {
					dataArr[i].symbolSize = 35;
					dataArr[i].itemStyle.normal.color = '#0084ff';
				}
				if (newData[j].son.length) {
					for (var k = 0; k < newData[j].son.length; k++) {
						if (dataArr[i].name ==  newData[j].son[k].mdata[name]) {
							dataArr[i].symbolSize = 28;
							dataArr[i].itemStyle.normal.color = '#00c6ff';
						}
					}
				}
			}
		}

		var option = {
			tooltip:{
				show:false
			},
			grid:{
				left:'0%',
				right:"0%",
				top:"0%",
				bottom:"0%"
			},
			itemStyle:{
				emphasis:{
					color:'#fffc00'
				}
			},
			hoverAnimation:false,
			series: [{
				type: 'graph',
				layout: 'force',
				animation: false,
				draggable: true,
				// categories: webkitDep.categories,
				data:dataArr,
				lineStyle:{
					normal:{
						color:'rgba(21,82,112,1)'
					}
				},
				force: {
					// initLayout: 'circular'
					// repulsion: 20,
					// edgeLength:50,
					initLayout:'circular',
					repulsion: 100,
					gravity: 0.2
				},
				links: edgesArr
			}]
		}

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
			rabitData(pArr[i],json,len);
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


	WbstChart.Wbreport0 = Wbreport0;
})();