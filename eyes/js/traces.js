this.EE = this.EE || {};
(function(win, doc) {
    var Traces = function() {
        this.c = new EE.Controller();

        this.silent = false;

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

        _this.c.getChartConfig('', function(data) {
            _this._config = data;
            _this.initChart();
        });

        _this.t.toChange = function(json) {
            _this.startDate = json.startDate;
            _this.endDate = json.endDate;
            _this.changeData();
        };

        $(doc).trigger('mouseup');

    };

    p.initDom = function() {
        this.$op = $('#tooltip');
        this.$ddbox = $('#ddbox');
        this.$ddlist = this.$ddbox.find('ul');
    };

    p.changeData = function() {
        var _this = this;

        _this.c.getChartP6Data({
            region: _this.region,
            startDate: _this.startDate,
            endDate: _this.endDate
        }, function(result) {
            if (result.silent) {
                _this.silent = true;
                _this._dashChart.bNotEvent = true;
                _this.chartP6.setConfig(_this._config.chartP6_1.config);
            }
            _this.chartP6.setDataProvider(result.data);
        });

        _this.c.getTracesChart1Data({
            region: _this.region,
            startDate: _this.startDate,
            endDate: _this.endDate
        }, function(result) {
            _this._mapKIdVChart['left1'].setDataProvider(result.data);
        });

        _this.changeData2();
    };

    p.changeData2 = function() {
        var _this = this;
        _this.c.getTracesEventData({
            region: _this.region,
            startDate: _this.startDate,
            endDate: _this.endDate
        }, function(result) {
            _this.createList(result.data);
        });
    };

    p.createList = function(data) {
        var strHtml = '';
        for (var i = 0, len = data.length; i < len; i++) {
            strHtml += '<li class="ddlist clearfix">' +
                '<p class="ddname fl">' + data[i].name + '</p>' +
                '<p class="ddtime fl">' + data[i].pubTime + '</p>' +
                '<p class="ddabout fl">' + data[i].heat + '</p>' +
                '</li>';
        }
        this.$ddlist.html(strHtml);
        !this.silent && this.$ddbox.buildScrollBar();
    };

    p.initChart = function() {
        var _this = this;

        // 仪表图 left1
        _this._dashChart = new WbstChart.DashBoard(doc.getElementById('left1'));
        // true 表示不触发事件
        _this._dashChart.setConfig(_this._config.tracesChart1.config);
        _this._mapKIdVChart['left1'] = _this._dashChart;

        _this._dashChart.EventDispatcher.on('click', function(e, arg) {
            if (_this.silent) {
                return;
            }
            _this.remotion = arg;
            _this.changeData2();
        });
        // _this.getLeft1Data();

        _this.chartP6 = new WbstChart.chartP6_map(doc.getElementById('echartsMap'));
        _this.chartP6.setConfig(_this._config.chartP6.config);
        _this.chartP6.EventDispatcher.bind("chartmouseover", function(e, arg) {
            if (!_this.silent) {
                return;
            }
            var strHtml = '<div class="tooltip_imgbox">' + '<img src="images/p6/leader_757.jpg" alt="" />' + '<span class="triangle"></span>' + '</div>' + ' <div class="infobox">' + '<p class="infoname">方力</p>' + '<p class="infodetail">北京市环保局局长</p>' + '</div>' + '<span class="triangle_lt"></span>' + '<span class="triangle_rb"></span>';
            _this.showToolTip(strHtml, arg.event.event.pageX - 90, arg.event.event.pageY - 190);
        });

        _this.chartP6.EventDispatcher.bind("chartmouseout", function(e, arg) {
            if (!_this.silent) {
                return;
            }
            _this.hideToolTip();
        });
    };

    p.showToolTip = function(text, x, y) {
        this.$op.html(text);
        var w = this.$op.width() + 20;
        var h = this.$op.height() + 20;
        // if (x + w > $(window).innerWidth()) x = $(window).innerWidth() - w;
        // if (y + h > $(window).innerHeight()) y = $(window).innerHeight() - h;
        this.$op.css({
            opacity: 1,
            left: x + 20,
            top: y - 20
        });
    };

    p.hideToolTip = function() {
        this.$op.css({
            opacity: 0,
            left: -100,
            top: -100
        });
    };

    EE.Traces = Traces;
})(window, document);