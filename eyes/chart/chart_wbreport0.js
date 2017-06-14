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

		var dataArr = [];
		var edgesArr = [];
		var n = 0;
		var colorArr = ['#007dff','#5999e2','#00c6ff','#67ffe1'];
		var bOk = true;

		var arr1 = [];	//没有父级的节点 
		var arr2 = [];	//只有1级父级节点的
		var arr3 = [];	//只有两级父级节点的

		//找到arr1的元素
		n = 0;
		for (var i = 0; i < this._dataProvider.length; i++) {
			for (var j = 0; j < this._dataProvider[i].length; j++) {
				n++;
				if (n>500) {break;}
				var item = this._dataProvider[i][j];
				if (item.parentStatusId == item.statusId) {
					arr1.push(item.statusId);
				}
			}
		}
		//找到arr2的元素
		n = 0;
		for (var i = 0; i < this._dataProvider.length; i++) {
			for (var j = 0; j < this._dataProvider[i].length; j++) {
				n++;
				if (n>500) {break;}
				var item = this._dataProvider[i][j];
				if (item.parentStatusId!=item.statusId) {
					if(this.findInArr(item.parentStatusId,arr1)){
						arr2.push(item.statusId);
					}
				}
			}
		}
		//找到arr3的元素
		n = 0;
		for (var i = 0; i < this._dataProvider.length; i++) {
			for (var j = 0; j < this._dataProvider[i].length; j++) {
				n++;
				if (n>500) {break;}
				var item = this._dataProvider[i][j];
				if (item.parentStatusId!=item.statusId) {
					if(this.findInArr(item.parentStatusId,arr2)){
						arr3.push(item.statusId);
					}
				}
			}
		}

		n = 0;
		for (var i = 0,len = this._dataProvider.length; i < len; i++) {
			for (var j = 0; j < this._dataProvider[i].length; j++) {
				n++;
				if (n>500) {break;}
				var item = this._dataProvider[i][j];
				var json;
				if (item.parentStatusId != item.statusId) {

					edgesArr.push({
						source:item.parentStatusId,
						target:item.statusId
					});

					json = {
						name:item.userScreenName,
						id:item.statusId,
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
						symbolSize:12
					};
					if (this.findInArr(item.parentStatusId,arr2)) {
						json.itemStyle = {
							normal:{
								color:colorArr[1]
							}
						}
					}else if (this.findInArr(item.parentStatusId,arr3)){
						json.itemStyle = {
							normal:{
								color:colorArr[2]
							}
						}
					}else{
						json.itemStyle = {
							normal:{
								color:colorArr[3]
							}
						}
					}
				}else{
					json = {
						name:item.userScreenName,
						id:item.statusId,
						value: 1,
						category: 4,
						label:{
							normal:{
								show:false
							}
						},
						itemStyle:{
							normal:{
								color:colorArr[0]
							}
						},
						symbolSize:20
					};
				}
				dataArr.push(json);
			}
		}
		console.log(n);
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
				animation: false,
			series: [{
				type: 'graph',
				layout: 'force',
				data:dataArr,
				roam: true,
				focusNodeAdjacency:true,
				lineStyle:{
					normal:{
						color:'rgba(21,82,112,1)'
					}
				},
				force: {
					// initLayout: 'circular',
					// repulsion: 20,
					// edgeLength:50,
					initLayout:'circular',
					repulsion: 50,
					gravity: 0.2
				},
				links: edgesArr
			}]
		}

		this._myChart.setOption(option);
	};

	p.findInArr = function(id,arr){
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == id) {
				return true;
			}
		}
		return false;
	}

	WbstChart.Wbreport0 = Wbreport0;
})();