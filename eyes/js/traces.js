this.EE = this.EE || {};
(function(win, doc) {
    var Traces = function() {
        this.c = new EE.Controller();

        this._mapKIdVChart = {};

        this.ready();
    };

    var p = Traces.prototype;

    p.ready = function() {
        var _this = this;
        _this.c.ready(function(region) {
            _this.region = region;
            _this.init();
            _this.initDom();
        });
    };

    p.init = function() {
        var _this = this;
        _this.t = new WbstChart.TimeLine('2010-08-08', '2016-08-08');

    	_this.c.getChartConfig('',function(data){
    		_this._config = data;
    		_this.initChart();
    	})

        _this.t.toChange = function(json) {
            _this.startDate = json.startDate;
            _this.endDate = json.endDate;
            _this.changeData();
        };

        $(document).trigger('mouseup');

    }

    p.initDom = function() {
        this.$op = $('#tooltip');
        this.$ddbox = $('#ddbox');
        this.$ddlist = this.$ddbox.find('ul');
    }

    p.changeData = function() {
        var _this = this;

        _this.c.getTracesChart1Data({
        	region: _this.region,
        	startDate: _this.startDate,
        	endDate: _this.endDate
        }, function(result) {
        	_this._mapKIdVChart['left1'].setDataProvider(result.data);
        });

        _this.c.getTracesEventData({
            region: _this.region,
            startDate: _this.startDate,
            endDate: _this.endDate
        }, function(result) {

            console.log(result);
            _this.createList(result.data);

            // _this._mapKIdVChart['left1'].setDataProvider(result.data);
        });

        _this.c.getChartP6Data({
            region: _this.region,
            startDate: _this.startDate,
            endDate: _this.endDate
        },function(result){
            _this.chartP6.setDataProvider(result.data);
        })

    }

    p.createList = function(data){
    	var strHtml = '';
    	for (var i = 0,len = data.length; i < len; i++) {
    		strHtml += '<li class="ddlist clearfix">'+
                        '<p class="ddname fl">'+data[i].name+'</p>'+
                        '<p class="ddtime fl">'+data[i].pubTime+'</p>'+
                        '<p class="ddabout fl">'+data[i].heat+'</p>'+
                    '</li>';
    	}
    	this.$ddlist.html(strHtml);
    	this.$ddbox.buildScrollBar();
    }

    p.initChart = function() {
        var _this = this;

        // 仪表图 left1
        _this._dashChart = new WbstChart.DashBoard(doc.getElementById('left1'));
        _this._dashChart.setConfig(_this._config.tracesChart1.config);
        _this._mapKIdVChart['left1'] = _this._dashChart;
        // _this.getLeft1Data();

        _this.chartP6 = new WbstChart.chartP6_map(document.getElementById('echartsMap'));
         _this.chartP6.setConfig(_this._config.chartP6.config);
        _this.chartP6.EventDispatcher.bind("chartmouseover",function(e,arg){
            console.log(arg);
        })
    }

    EE.Traces = Traces;
})(window, document);
