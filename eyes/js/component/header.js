this.EE = this.EE || {};
(function() {
	var Header = function(n) {
		this.iNow = n || 0;
		this.init();
	};

	var p = Header.prototype;

	p.init = function() {
		this.createHtml();
		this.initDom();
		this.headerEvent();
	};

	p.createHtml = function(){
		var strHtml = '<h1 class="fl">环保舆情辅助管理系统</h1>'
		+'<nav class="headernav fl" id="headernav">'
		+' <a href="p1.html">舆情地图</a>'
		+' <a href="p2.html">舆情分析'
		+'<span class="pointbg"></span>'
		+'</a>'
		+'<a href="p4.html">危机预警'
		+'<span class="pointbg"></span>'
		+'</a>'
		+'<a href="traces.html">领导绿迹'
		+'<span class="pointbg"></span>'
		+'</a>'
		+'<a href="p3.html">绿色搜索'
		+'<span class="pointbg"></span>'
		+'</a>'
		+'<span class="navlight"></span>'
		+'</nav>'
		+'<div class="infopanel fr">'
		+'<p class="welcome fl">'
		+'<span class="username fl" id="showuser">Admin</span>'
		+'<span class="welcomeword fl">欢迎您</span>'
		+'</p>'
		+'<span class="datTime fl">2017.03.13</span>'
		+'<span class="signout fl">退出<b></b></span>'
		+'</div>';

		$('#header').html(strHtml);
	};

	p.initDom = function(){
		this.$headernav = $('#headernav');
		this.$navA = this.$headernav.find('a');
		this.$light = this.$headernav.find('.navlight');

		this.$showuser = $('#showuser');
	};

	p.headerEvent = function() {
		var _this = this;
		var iNow = 0;
		_this.$navA.mouseover(function() {
			var index = $(this).index('a');
			_this.$light.stop().animate({
				left: (0.28 + index * 1.2) + 'rem'
			})
		});
		_this.$navA.mouseout(function() {
			_this.$light.stop().animate({
				left: (0.28 + iNow * 1.2) + 'rem'
			})
		});

		_this.$navA.click(function() {
			_this.$navA.removeClass('active');
			$(this).addClass('active');
			iNow = $(this).index('a');
		});

		_this.$navA.eq(_this.iNow).trigger('click').trigger('mouseover');
		// 设置登录用户名
		_this.$showuser.html(window.localStorage.loginName);
	};

	EE.Header = Header;
})();