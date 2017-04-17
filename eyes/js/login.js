this.WBST = this.WBST || {};
(function(win) {
	var Login = function(fn) {
		this.c = new EE.Controller(); 
		this.login = fn;
		this.a = false;
		this.first = true;
		this.init();
	};

	var p = Login.prototype;

	p.init = function() {
		this.initDom();
		this.inputEvent();
		this.initTestImg();
		this.dragEvent();
	};

	p.initDom = function() {
		this.$user = $('#username');
		this.$password = $('#password');

		this.$img0 = $('#randomimg');
		this.$imgbar = $('#imgbar');
		this.$imgbarp = this.$imgbar.parent();
		this.$bar = $('#bar');
		this.$loginbtn = $('#loginbtn');
		this.$logintip = $('#logintip');
		this.$resulttip = $('#resulttip');
		this.$imgtestbox = $('#imgtestbox');
	};

	p.inputEvent = function() {
		var _this = this;

		this.$user.focus(function() {
			_this.focusEv($(this));
		});

		this.$password.focus(function() {
			_this.focusEv($(this), true);
		});

		this.$user.blur(function() {
			_this.blurEv($(this));
		});

		this.$password.blur(function() {
			_this.blurEv($(this), true);
		});

	};

	p.focusEv = function(obj, isPassword) {
		var dvalue = obj.attr('defaultValue');
		var val = obj.val();
		if (val == dvalue) {
			obj.val('');
			if (isPassword) {
				obj.attr('type', 'password');
			}
		}
		this.a = false;
		this.first = true;
		this.$logintip.html('请拖动鼠标移动拼图，进行验证');
	};

	p.blurEv = function(obj, isPassword) {
		var val = obj.val();
		if (val == '') {
			if (isPassword) {
				obj.attr('type', 'text');
			}
			obj.val(obj.attr('defaultValue'));
		}
	};

	p.initTestImg = function() {
		this.$imgbarp.css('left',22)
		this.$bar.css('left',22)
		// 范围 140 - 290
		this._posL = this.rnd(140, 290);
		this.$img0.css({
			left: this._posL
		})

		this.$imgbar.css({
			backgroundPosition: -this._posL + 'px -13px'
		})
	}

	p.rnd = function(m, n) {
		return Math.random() * (n - m) + m;
	}

	p.dragEvent = function() {
		var _this = this;
		var disx = 0;
		var l = 0;
		var isDown = false;
		_this.$bar.mouseover(function(ev){
			if (_this.first) {
				if (_this.testInput()) {
					_this.$imgtestbox.addClass('testing');
					_this.first = false;
				}
			}
		});
		_this.$bar.mousedown(function(ev) {
			if (_this.a) {return;}
			disx = ev.pageX - $(this).position().left;
			isDown = true;
			$(document).on('mousemove',fnMove);
			$(document).on('mouseup',fnUp);
		});

		function fnMove(ev){
			if (!isDown) { return;}
			l = ev.pageX - disx;
			if (l<=22) {
				l = 22;
			}else if (l >= 295) {
				l = 295
			}
			_this.$bar.css('left',l);
			_this.$imgbarp.css('left',l)
			ev.preventDefault();
			ev.stopPropagation();
		};
		function fnUp(){
			isDown = false;
			if (Math.abs(l-_this._posL)<=3) {
				_this.$logintip.html('验证成功！');
				_this.initTestImg();
				_this.$imgtestbox.removeClass('testing');
				_this.a = true;
			}else{
				_this.$logintip.html('验证失败，请重新拖动鼠标移动拼图，进行验证');
				_this.initTestImg();
			}
			$(document).off('mousemove',fnMove);
			$(document).off('mouseup',fnUp);
		};

		_this.$loginbtn.click(function(){
			var name = _this.$user.val();
			var password = _this.$password.val();
			if (_this.testInput()) {
				_this.c.login({loginName:name,password:password},function(str){
					_this.$resulttip.html(str);
				});
			}
		});

	};

	p.testInput = function(){
		return (this.$user.val() != this.$user.attr('defaultValue')
			&&this.$password.val() != this.$password.attr('defaultValue'));
	};

	WBST.Login = Login;
})(window)