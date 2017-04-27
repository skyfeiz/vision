this.EE = this.EE || {};
(function(win) {
	var Login = function(fn) {
		this.c = new EE.Controller();
		this.login = fn;
		this.ready();
	};

	var p = Login.prototype;

	p.ready = function() {
		var _this = this;
		this.c.ready(function() {
			_this.init();
		});
	};

	p.init = function() {
		this.initDom();
		this.inputEvent();
	};

	p.initDom = function() {
		this.$user = $('#username');
		this.$password = $('#password');

		this.$loginbtn = $('#loginbtn');
		this.$resulttip = $('#resulttip');
	};

	p.inputEvent = function() {
		var _this = this;

		this.$user.focus(function() {
			_this.focusEv($(this));
		});

		this.$password.focus(function() {
			_this.focusEv($(this),true);
		});

		this.$user.blur(function() {
			_this.blurEv($(this));
		});

		this.$password.blur(function() {
			_this.blurEv($(this),true);
		});

		_this.$loginbtn.click(function() {
			var name = _this.$user.val();
			var password = _this.$password.val();
			if (_this.testInput()) {
				_this.c.login({
					loginName: name,
					password: password,
				}, function(str) {
					_this.$resulttip.html(str);
				});
			}
		});

		$(document).keydown(function(ev){
			if (ev.keyCode == 13 && _this.testInput()) {
				_this.$loginbtn.trigger('click');
			}
		})
	};

	p.focusEv = function(obj,isPassword) {
		var dvalue = obj.attr('defaultValue');
		var val = obj.val();
		if (val == dvalue) {
			obj.val('');
			if (isPassword) {
				obj.attr('type', 'password');
			}
		}
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

	p.testInput = function() {
		return (this.$user.val() != this.$user.attr('defaultValue') && this.$password.val() != this.$password.attr('defaultValue'));
	};

	EE.Login = Login;
})(window)