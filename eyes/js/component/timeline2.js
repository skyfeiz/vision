this.WbstChart = this.WbstChart || {};
(function(doc) {
	var iScale = 1;
	/*传入的start和end的格式为2008-08-08*/
	var TimeLine = function(json) {
		// 是否包括 当年 当月;
		this.bNow = json.now;
		// 1某月 2某年
		this.type = 2;
		// 开启计算时间的开关
		this.getTime = true;

		// 下标的间距
		this.xSpace = 60;

		// 数据初始化canvas的长度  屏幕的宽
		this.axisLength = 1200;

		// 选择区域的宽  默认一格
		this.aW = this.xSpace;
		// 选择区域的left值
		this.aL = 0;
		// 拉动后的默认变长距离
		this.mW = 600;
		// contentBox 的left值 ， 用来判断canvas是否变长
		this.cl = 0;

		// 用来判断是否是月时间轴下，默认的是年时间轴 
		this.bMonth = false;

		// 自动运动时nLeft的改变 ，自动运动结束时清零
		this.changenLeft = 0;

		// 记录切换前年轴的状态
		this.yearJson = {};
		//记录切换前月轴的状态
		this.monthJson = {};
		// 记录now轴的状态
		this.nowJson = {};

		this.bSpeedUp = 0;

		this.bStop = false;

		// 判断是否只能移动，点击最近7天时 为true;
		this.moveOnly = false;

		this.initTimeLimit(json);
		this.init();
	};

	var p = TimeLine.prototype;

	p.init = function() {
		this.initDom();
		this.setSize();
		this.initSize(true);
		this.moveEvent();
		this.moveLeft();
		this.btnEvent();
		this.resize();
		this.canvasClick();
	};

	// 年轴 通过起始时间和结束时间获取时间轴的总长
	p.initTimeLimit = function(json) {
		if (json.end) {
			this.endTime = json.end;
			var endArr = this.endTime.split('-');
			this.endYear = endArr[0];
			this.endMonth = Math.floor(endArr[1]);
		} else {
			var oDate = new Date();
			this.endYear = oDate.getFullYear();
				this.endMonth = oDate.getMonth();
			if (json.now) {
				this.endMonth++;
			}
			
			this.endTime = this.endYear + '-' + this.endMonth;
		}
		this.startTime = json.start;

		var startArr = this.startTime.split('-');

		this.startYear = startArr[0];
		this.startMonth = Math.floor(startArr[1]);

		this.monthLength = ((this.endYear - this.startYear) * 12 + this.endMonth - this.startMonth + 1) * this.xSpace;
		this.yearLength = (this.endYear - this.startYear) * this.xSpace;
		// 初始选择前一年
		this.defaultYear = this.endYear;
		if (json.now) {
			this.defaultYear++;
		}
		

		this.xArr = this.setYearxArr();

	};

	p.initDom = function() {
		$doc = $(doc);

		this.timeLine = $('#timeaxis');
		this.yearCanvas = $('#yearcanvas');
		this.monthCanvas = $('#monthcanvas');
		this.canvas = this.yearCanvas;
		this.limitbox = this.timeLine.find('.timelimitbox');
		this.contentBox = this.timeLine.find('.timecontent');
		this.areabox = $('#timeareabox');
		this.axisleft = $('#axisleft');
		this.axisright = $('#axisright');
		this.areaBox = $('#timeareabox');
		this.startline = $('#startline');
		this.endline = $('#endline');

		this.timeBtn = this.timeLine.find('.timebtns li');
	};

	p.initSize = function(isfirst) {
		// 获取盒子的宽高，给canvas设置宽高
		if (this.timeLine.width() < 1920) {
			iScale = 1;
		} else {
			iScale = SCALE;
		}
		var json = {
			width: this.timeLine.width() / iScale,
			height: this.timeLine.height() / iScale
		};

		// 设置canvas显示区域的宽高 有overlow：hidden样式
		this.limitbox.css(json);
		this.limitLeft = this.limitbox.offset().left;
		this.limitWidth = this.limitbox.width();
		// 设置canvas实际区域的宽高
		this.canvas.attr({
			width: this.axisLength + 8,
			height: json.height
		});

		this.contentBox.css({
			width: this.axisLength + 28,
			height: json.height
		});
		this.drawGrid(isfirst, true);
		this.canvas.attr('isdraw', 'yes');
		if (isfirst) {
			this.aL = this.areabox.position().left / iScale;
			this.aW = this.areabox.width() / iScale;
			this.cl = this.contentBox.position().left / iScale;
		}
	};

	p.setSize = function() {
		this.canvas.attr({
			width: this.axisLength + 8
		});

		this.contentBox.css({
			width: this.axisLength + 28
		});
	};

	p.drawGrid = function(isfirst) {
		var _this = this;
		var ctx = _this.canvas[0].getContext('2d');
		ctx.clearRect(0, 0, _this.canvas.width() / iScale, _this.canvas.height() / iScale);

		ctx.fillStyle = 'rgba(10,107,174,0.5)';
		ctx.rect(0, 23, _this.axisLength + 8, 15);
		ctx.fill();

		ctx.fillStyle = 'rgba(0,198,255,0.2)';
		ctx.fillRect(0, 19, _this.axisLength + 8, 1);
		ctx.fillRect(0, 41, _this.axisLength + 8, 1);

		// Y轴最开始的基数 ，从右到左
		var baseY = _this.bMonth ? _this.endMonth : _this.defaultYear;
		var endYear = _this.endYear;
		var yText = _this.bMonth ? baseY + '月' : baseY + '年';

		var xlength = _this.xArr.length;

		for (var i = _this.axisLength, j = 0; i >= 0; i -= _this.xSpace) {
			var xName;
			if (this.bMonth) {
				xName = _this.xArr[((_this.axisLength - i) / _this.xSpace) % xlength];
			} else {
				xName = baseY--;
			}


			if (Math.floor(i / _this.xSpace) % 2) {
				ctx.fillStyle = 'rgba(10,107,174,0.2)';
				ctx.fillRect(_this.axisLength - i - _this.xSpace - 4, 23, _this.xSpace, 15);
			}

			// 下标字
			ctx.fillStyle = '#3fc0ff';
			ctx.fillText(xName, i + 12, 55);
			// 下标线
			ctx.beginPath();
			ctx.fillStyle = '#fffe00';
			ctx.fillRect(i - 4, 38, 1, 1)

			// 画上标
			// 上标字

			if (xName == 1 && _this.bMonth) {
				yText = endYear + '年';
				ctx.fillStyle = '#fff';
				ctx.fillText(yText, i + 4, 13);
				ctx.fillStyle = '#3fc0ff';
				ctx.fillRect(i - 4, 15, 1, 4);
				endYear--;
			}
		}

		if (isfirst) {
			_this.cl = _this.limitbox.width() / iScale - _this.canvas.width() / iScale + 8;
			_this.aL = _this.axisLength - _this.xSpace - 4;
			_this.setArea();
			_this.contentBox.css('left', _this.cl)
		}
	};

	p.moveEvent = function() {
		var _this = this,
			widthX,
			disX,
			isDown = false,
			autoMove = false,
			nLeft = 0,
			datal = 0,
			dataw = 0,
			nowPageX = 0,
			limitWidth = 0,
			limitLeft = 0,
			beginX = 0,
			beginW = 0,
			overWidth = false;

		_this.areaBox.mousedown(function(ev) {
			limitWidth = _this.limitbox.width() / iScale;
			limitLeft = _this.limitbox.offset().left / iScale;
			nLeft = _this.contentBox.offset().left / iScale;
			disX = ev.pageX - _this.aL - nLeft;
			beginX = ev.pageX - $(this).offset().left / iScale;
			beginW = $(this).width() / iScale;
			if (beginW > limitWidth - 20) {
				overWidth = true;
			} else {
				overWidth = false;
			}
			isDown = true;
			_this.changenLeft = 0;
			ev.stopPropagation();
		});

		$doc.mousemove(function(ev) {
			if (!isDown) {
				return;
			}
			fnMove(ev);
			ev.preventDefault();
		});

		$doc.mouseup(function() {
			isDown = false;
			autoMove = false;
			_this.changenLeft = 0;

			if (_this.bSpeedUp > 0) {
				var $obj = [_this.axisleft, _this.axisright][_this.bSpeedUp - 1];
				_this.bStop = true;
				_this.bSpeedUp = 0;
				$obj.trigger('mouseover');

			} else {
				_this.bSpeedUp = 0;
				_this.bStop = true;
			}

			var nl = _this.axisLength - Math.round((_this.axisLength - _this.aL - 4) / _this.xSpace) * _this.xSpace;

			if (_this.aW % _this.xSpace) {
				var nWidth = nl - _this.aL;
				_this.aW = Math.round((_this.aW - nWidth) / _this.xSpace) * _this.xSpace;
			}
			_this.aL = nl - 4;

			_this.setArea();

			if (datal == _this.aL && dataw == _this.aW && !_this.getTime) {
				return;
			}
			_this.getTime = false;
			datal = _this.aL;
			dataw = _this.aW;

			_this.toChange && _this.toChange(_this.getRangeTime());
		});

		function fnMove(ev) {
			nowPageX = ev.pageX;
			if (overWidth) {
				nowPageX = ev.pageX;
			} else if (nowPageX <= limitLeft + beginX + 4) {
				nowPageX = limitLeft + beginX + 4;
			} else if (nowPageX >= limitLeft + limitWidth - beginW + beginX - 4) {
				nowPageX = limitLeft + limitWidth - beginW + beginX - 4;
			}

			nLeft = _this.contentBox.offset().left / iScale;
			var changeX = nowPageX - nLeft;


			_this.aL = changeX - disX + _this.changenLeft;

			if (_this.aL <= 0) {
				_this.aL = 4;
			} else if (_this.aL + _this.aW >= _this.axisLength) {
				_this.aL = _this.axisLength - _this.aW;
			}
			if (_this.aL < 100 || _this.cl > -100) {
				_this.createLeft();
				_this.contentBox.css('left', _this.cl);
			}
			if (nowPageX <= limitLeft + (!overWidth ? beginX + 4 : 0) && _this.aL > 0) {
				if (!autoMove) {
					_this.bStop = true;
					_this.canvaspMove('left', true);
					autoMove = true;
				}
			} else if (nowPageX >= limitWidth + limitLeft + (!overWidth ? -beginW + beginX - 4 : 0)) {
				if (!autoMove) {
					_this.bStop = true;
					_this.canvaspMove('right', true);
					autoMove = true;
				}
			} else if (_this.axisLength - _this.aL - _this.aW < 10) {
				_this.bStop = true;
				_this.canvaspMove('right');
			} else {
				_this.bStop = true;
				autoMove = false;
			}

			// 非定时器的情况下,即拖拽情况下，设置l和width
			if (!autoMove) {
				_this.testLimit();
				_this.setArea();
			}

		};
	};

	p.setArea = function() {
		this.areabox.css({
			width: this.aW,
			left: this.aL
		});
	};

	// canvas的父级移动     包含canvas和 时间开始轴，中间区域，时间结束轴等一起移动
	// bOk为true时width和left跟着一起累加
	p.canvaspMove = function(dir, bOkl, bOkw) {
		var _this = this,
			maxLeft = _this.axisLength - _this.limitbox.width() / iScale;
		if (dir == 'left') {
			_this.bStop = false;
			fnLeft();
		} else if (dir == 'right') {
			_this.bStop = false;
			fnRight();
		}

		function fnLeft() {
			if (_this.bStop) {
				return;
			}
			_this.cl += 4;
			if (_this.cl >= 4) {
				_this.cl = 0;
				_this.bStop = true;
				return;
			}
			if (bOkl && bOkw) {
				_this.aW += 4;
				_this.aL -= 4;
				if (_this.cl > -100 || _this.aL < 100) {
					// 记录自动运动时nLeft的改变，停止时清零
					_this.changenLeft += _this.mW;
				}
			} else if (bOkl) {
				_this.aL -= 4;
			}
			if (_this.cl > -100 || _this.aL < 100) {
				_this.createLeft();
			}
			_this.setArea();
			_this.contentBox.css('left', _this.cl);
			setTimeout(fnLeft, 30);
		}

		function fnRight() {
			if (_this.bStop) {
				return;
			}
			_this.cl -= 4;
			if (_this.cl <= -maxLeft - 4) {
				_this.cl = -maxLeft - 4;
				_this.bStop = true;
				return;
			}
			_this.contentBox.css('left', _this.cl);
			if (bOkl && bOkw) {
				_this.aW += 4;
				if (_this.aL + _this.aW >= _this.axisLength) {
					_this.aW = _this.axisLength - _this.aL;
				}
				_this.areabox.css({
					width: _this.aW
				});
			} else if (bOkl) {
				_this.aL += 4;
				if (_this.aL + _this.aW >= _this.axisLength) {
					_this.aL = _this.axisLength - _this.aW;
				}
				_this.setArea();
			}
			setTimeout(fnRight, 30);
		}
	};

	// canvas左边部分增加
	p.createLeft = function() {
		var _this = this,
			aw = 0;
		// 小于50 增加canvas的宽，设置canvas的left,
		// 判断处于年轴还是月轴

		if (_this.bMonth) {
			if (_this.monthLength < _this.axisLength) {
				return;
			}
			aw = _this.monthLength > _this.axisLength + _this.mW + 10 ? _this.mW : _this.monthLength - _this.axisLength + 10;
		} else {
			if (_this.yearLength < _this.axisLength) {
				return;
			}
			aw = _this.yearLength > _this.axisLength + _this.mW + 10 ? _this.mW : _this.yearLength - _this.axisLength + 10;
		}
		_this.axisLength += aw;

		_this.setSize();
		// left值增加
		_this.aL += aw;
		_this.drawGrid(false, true);
		_this.cl -= aw;
	};

	// 左移
	p.moveLeft = function() {
		var _this = this;

		_this.axisleft.mouseover(function() {
			_this.bStop = true;
			_this.canvaspMove('left');
		});

		_this.axisright.mouseover(function() {
			_this.bStop = true;
			_this.canvaspMove('right');
		});

		_this.axisleft.mouseout(function() {
			_this.bStop = true;
		});

		_this.axisright.mouseout(function() {
			_this.bStop = true;
		});

	};

	/*
		通过 left 和 width 计算 时间范围
		通过刻度的最后year month ,l,width计算
	*/
	p.getRangeTime = function() {
		// 距离最末端的 距离格数  总间隔数
		var l = (this.axisLength - this.aL - 4) / this.xSpace | 0, // 取整
			// endlined的间隔数
			w = l - this.aW / this.xSpace + 1,
			date = '';
		if (this.bMonth) {
			// 月时间轴

			var oDate = new Date(this.endTime);
			var baseMonth = oDate.getMonth() + 1;
			oDate.setMonth(baseMonth - l);
			date = oDate.getFullYear() + '-' + n2d(oDate.getMonth() + 1);

		} else {
			// 年时间轴
			date = this.defaultYear - l + '';
		}

		console.log(date);

		return {
			date: date,
			type: this.type
		};

		// 补零函数
		function n2d(n) {
			return n < 10 ? '0' + n : '' + n;
		};
	};

	p.btnEvent = function() {
		var _this = this,
			sign = 'year',
			firstClick = true;
		_this.timeBtn.click(function(ev) {
			$(this).addClass('active').siblings().removeClass('active');
			_this.canvas.hide();
			_this.getTime = true;
			switch ($(this).attr('data-type')) {
				case 'month':
					_this.type = 1;
					if (firstClick) {
						_this.aW = _this.xSpace;
					} else {
						firstClick = false;
					}
					_this.bMonth = true;
					_this.canvas = _this.monthCanvas;
					if (sign == 'month') {
						_this.getTime = false;
						break;
					} else if (sign == 'year') {
						// 保存年轴的状态
						_this.yearJson = {
							l: _this.aL,
							w: _this.aW,
							axisLength: _this.axisLength,
							boxl: _this.cl
						};
					}
					sign = 'month';
					// 判断canvas是否已经初始化
					if (_this.canvas.attr('isdraw') != 'yes') {
						_this.canvas.attr('isdraw', 'yes');
						// 初始化月轴
						_this.initSize(true);
						break;
					}
					_this.aL = _this.monthJson.l;
					_this.aW = _this.monthJson.w;
					_this.axisLength = _this.monthJson.axisLength;
					_this.cl = _this.monthJson.boxl;
					_this.contentBox.css({
						width: _this.monthJson.axisLength + 28,
						left: _this.cl
					});
					// 设置月轴的状态
					_this.setArea();
					break;
				case 'year':
					_this.type = 2;
					if (sign == 'year') {
						_this.getTime = false;
						break;
					} else if (sign == 'month') {
						_this.monthJson = {
							l: _this.aL,
							w: _this.aW,
							axisLength: _this.axisLength,
							boxl: _this.cl
						};
					}
					sign = 'year';
					_this.bMonth = false;
					_this.xArr = _this.setYearxArr();
					_this.canvas = _this.yearCanvas;
					// 设置年轴的状态
					_this.aL = _this.yearJson.l;
					_this.aW = _this.yearJson.w;
					_this.axisLength = _this.yearJson.axisLength;
					_this.cl = _this.yearJson.boxl;
					_this.contentBox.css({
						width: _this.yearJson.axisLength + 28,
						left: _this.cl
					});
					_this.setArea();
					break;
			}
			_this.canvas.show();
			ev.stopPropagation();
			$doc.trigger('mouseup');
		});
	};

	p.resize = function() {
		var _this = this;
		if (SCALE > 1) {
			_this.timeLine.css('transform', 'translateX(' + SCALE * 50 + '%) scale(' + SCALE + ',' + SCALE + ')');
		}
		$(window).resize(function() {
			var n = _this.limitWidth;
			_this.initSize(false);
			if (_this.limitbox.width() - n > 0) {
				_this.cl = _this.contentBox.position().left / iScale - n + _this.limitbox.width() / iScale;
				if (_this.yearJson.boxl) {
					_this.yearJson.boxl -= n - _this.limitbox.width() / iScale
				}
				if (_this.monthJson.boxl) {
					_this.monthJson.boxl -= n - _this.limitbox.width() / iScale
				}
				if (_this.nowJson.boxl) {
					_this.nowJson.boxl -= n - _this.limitbox.width() / iScale
				}
				_this.contentBox.css('left', _this.cl);
			}
		});
	};

	// 获取年下xArr的数据 ，
	p.setYearxArr = function() {
		// 获取month的排序，最近的一个月排在最后
		var xArr = [];
		var n = this.endMonth + 2;
		if (!n) {
			return [];
		}
		for (var i = 0; i < 12; i++) {
			xArr.push(Math.abs(n % 12 || 12));
			n++;
		}

		return xArr.reverse();
	};

	// 测试边界
	p.testLimit = function(only){
		if (this.bMonth) {
			if (this.axisLength - this.aL - this.xSpace / 2 > this.monthLength) {
				this.aL = this.axisLength - this.monthLength - 1;
				$doc.trigger('mouseup');
			}
		} else {
			if (this.axisLength - this.aL - this.xSpace / 2 > this.yearLength) {
				this.aL = this.axisLength - this.yearLength - 1;
				$doc.trigger('mouseup');
			}
		}
		if (only) {
			$doc.trigger('mouseup');
		}
	}

	/*新加事件  点击canvas选择起始位置调整*/
	p.canvasClick = function(){
		var _this = this;
		_this.yearCanvas.click(function(ev){
			fn(ev)
			ev.stopPropagation();
		});

		_this.monthCanvas.click(function(ev){
			fn(ev)
			ev.stopPropagation();
		})

		function fn(ev){
			var x = ev.pageX;
			var y = ev.pageY - _this.limitbox.offset().top / iScale;
			if (y<=56 && y>=18) {
				var l = _this.areabox.offset().left / iScale;
				_this.aL += x - l;
				_this.testLimit(true);
			}
		}
	}

	WbstChart.TimeLine = TimeLine;
})(document);