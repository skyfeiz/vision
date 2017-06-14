this.EE = this.EE || {};
(function(win, doc) {
    var hostUrl = "http://" + win.location.host + "/eems/eyes/";
    var Traces = function() {
        this.c = new EE.Controller();

        this.silent = false;

        this.emotion = 2;

        this._mapKIdVChart = {};

        this.startDate = '2008-08-08';

        this.ready();
    };

    var p = Traces.prototype;

    p.ready = function() {
        var _this = this;
        _this.c.ready(function(region) {
            _this.region = region;
            _this.c.getNowTime({},function(result){
                _this.endDate = result;
                _this.init();
                _this.initDom();
                _this.baseEvent();
            });
        });

    };

    p.init = function() {
        var _this = this;

        _this.c.getChartConfig('', function(data) {
            _this._config = data;
            _this.initChart();
            _this.c.getTracesLeft1Data('', function(result) {

                if (result.data.isBigScreen) {
                    _this.t = new WbstChart.TimeLine({
                        start:_this.startDate,
                        end:_this.endDate,
                    });
                    _this.emotion = 1;
                    _this.silent = true;
                    _this.t.silent = true;
                    _this.chartP6.silent = true;
                    _this.chartP6.setConfig(_this._config.chartP6_1.config);
                }else{
                    _this.t = new WbstChart.TimeLine({
                        start:_this.startDate,
                        end:_this.endDate,
                        now:true
                    })
                }
                _this.createLeaderInfo(result.data);
                _this.t.toChange = function(json) {
                    _this.date = json.date;
                    _this.changeData();
                };
                $('.timebtns li').eq(0).trigger('click');
                $(doc).trigger('mouseup');
            });
        });
    };

    p.initDom = function() {
        this.$op = $('#tooltip');
        this.$ddbox = $('#ddbox');
        this.$ddlist = this.$ddbox.find('ul');

        this.$leaderinfo = $('.leaderinfo');
    };

    p.baseEvent = function (){
        var _this = this;
        _this.$ddlist.on('click','li',function(ev){
            if (_this.silent) {
                return;
            }
            ev.stopPropagation();
            var eventId = $(this).attr('eventId');
            var eventName = $(this).attr('eventName');
            var timeObj = _this.handleTime(_this.date);
            win.location.href = encodeURI(hostUrl + "details.html?eventId=" + eventId + "&eventName="+eventName+'&startDate='+timeObj.sDate+'&endDate='+timeObj.eDate);
        })
        _this.$op.mouseenter(function(){
            _this.chartP6.bPause = true;
        })
        _this.$op.mouseleave(function(){
            _this.chartP6.bPause = false;
        })
    };

    p.createLeaderInfo = function(json) {
        var strHtml = '<div class="leaderimg">' +
            '<img src="/eems/' + json.imge + '" alt="" />' +
            '<span class="triangle"></span>' +
            '</div>' +
            '<p class="leadermsg">' + (json.desc || '') + '</p>';
        this.$leaderinfo.html(strHtml);
    };

    p.changeData = function() {
        var _this = this;

        // 饼图
        _this.c.getTracesChart1Data({
            date: _this.date
        }, function(result) {
            console.log('刷新正中负方数据');
            _this._mapKIdVChart['left1'].setDataProvider(result.data);
        });

        _this.changeData2();
    };

    p.changeData2 = function() {
        var _this = this;

        // 地图
        _this.c.getChartP6Data({
            emotion:_this.emotion,
            date: _this.date
        }, function(result) {
            console.log('刷新地图数据');
            // 事件
            if (result.isBigScreen) {
                _this._dashChart.$pNums.eq(1).trigger('click');
                _this._dashChart.bNotEvent = true;
            }
            _this.c.getTracesEventData({
                emotion:_this.emotion,
                date: _this.date
            }, function(result) {
                console.log('刷新事件列表');
                _this.createList(result.data);
            });
            _this.chartP6.setDataProvider(result.data);
        });
    };

    p.createList = function(data) {
        if (data.length>1) {
            data = data.sort(function(a,b){
                return b.heat - a.heat;
            })
        }
        var strHtml = '';
        for (var i = 0, len = data.length; i < len; i++) {
            strHtml += '<li class="ddlist clearfix" eventId="'+data[i].eventId+'" eventName="'+data[i].eventName+'">' +
                '<p class="ddname fl">' + data[i].eventName + '</p>' +
                '<p class="ddtime fl">' + data[i].pubTime + '</p>' +
                '<p class="ddabout fl">' + data[i].heat + '</p>' +
                '</li>';
        }
        $('.barBox').remove();
        this.$ddlist.html(strHtml);
        this.$ddbox.buildScrollBar();
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
            _this.emotion = arg;
            _this.changeData2();
        });
        // _this.getLeft1Data();

        _this.chartP6 = new WbstChart.chartP6_map(doc.getElementById('echartsMap'));
        _this.chartP6.setConfig(_this._config.chartP6.config);
        _this.chartP6.EventDispatcher.bind("chartmouseover", function(e, arg) {
            if (!_this.silent) {
                return;
            }
            console.log(arg);
            if (arg.humenData.name) {
                var strHtml = '<div class="tooltip_imgbox">' + '<img src="/eems/'+arg.humenData.image+'" alt="" />' + '<span class="triangle"></span>' + '</div>' + ' <div class="infobox">' + '<p class="infoname">'+arg.humenData.name+'</p>' + '<p class="infodetail">'+arg.humenData.position+'</p>' + '</div>' + '<span class="triangle_lt"></span>' + '<span class="triangle_rb"></span>';
                _this.showToolTip(strHtml, arg.event.event.pageX, arg.event.event.pageY);
            }
        });

        _this.chartP6.EventDispatcher.bind("chartmouseout", function(e, arg) {
            if (!_this.silent) {
                return;
            }
            _this.hideToolTip();
        });
    };

    // 处理时间， 传入一个时间得到时间的范围 2016 ----->2016-01-01~2016-12-31;   2016-08------>2016-08-01~2016-08-31
    p.handleTime = function(time){
        var arr = time.split('-');
        var sDate,eDate;
        if (arr.length == 1) {
            sDate = time+'-01'+'-01';
            eDate = time+'-12'+'-31';
        }else if (arr.length == 2) {
            sDate = time+'-01';
            var oDate = new Date(time);
            oDate.setMonth(arr[1],0);
            eDate = time+'-'+oDate.getDate();
        }
        return {sDate:sDate,eDate:eDate};
    };

    p.showToolTip = function(text, x, y) {
        this.$op.html(text);
        var w = this.$op.width();
        var h = this.$op.height();
        // if (x + w > $(window).innerWidth()) x = $(window).innerWidth() - w;
        // if (y + h > $(window).innerHeight()) y = $(window).innerHeight() - h;
        this.$op.css({
            opacity: 1,
            left: x - w/2,
            top: y - h - 30
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