this.EE = this.EE || {};
(function() {
	var hostUrl = "http://" + window.location.host + "/eems/eyes/";
	// var hostUrl = "http://" + win.location.host + "/eems/sys/jsp/eyes/"; 

	var Header = function(n) {
		this.c = new EE.Controller();
		this.iNow = n || 0;
		this.bNot = false;
		this.init();
	};

	var p = Header.prototype;

	p.init = function() {
		this.createHtml();
		this.initDom();
		this.headerEvent();
	};

	p.createHtml = function(){
		var sClass = '';
		var goPage = 'micro.html';
		if (!this.getCookie('microBlog')&&!this.getCookie('weChat')) {
			this.bNot = true;
			sClass = 'navsilent';
		}
		if (!this.getCookie('microBlog')) {
			goPage = 'weibo.html';
		}
		var strHtml = '<h1 class="fl">环保舆情大数据平台</h1>'
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
		+'<a href="greensearch.html">绿色搜索'
		+'<span class="pointbg"></span>'
		+'</a>'
		+'<a href="'+goPage+'" class="'+sClass+'">微眼观察'
		+'<span class="pointbg"></span>'
		+'</a>'
		+'<span class="navlight"></span>'
		+'</nav>'
		+'<div class="infopanel fr">'
		+'<p class="welcome fl">'
		+'<span class="username fl" id="showuser">Admin</span>'
		+'<span class="welcomeword fl">欢迎您</span>'
		+'</p>'
		+'<span class="signout fl" id="signout">退出<b></b></span>'
		+'</div>';

		$('#header').html(strHtml);
	};

	p.initDom = function() {
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
			});
		});
		_this.$navA.mouseout(function() {
			_this.$light.stop().animate({
				left: (0.28 + iNow * 1.2) + 'rem'
			});
		});

		_this.$navA.click(function() {
			var index = $(this).index();
			if (index == 5 && _this.bNot) {
				alert('用户没有关联微博');
				return false;
			}
			_this.$navA.removeClass('active');
			$(this).addClass('active');
			iNow = $(this).index('a');
		});

		_this.$navA.eq(_this.iNow).trigger('click').trigger('mouseover');
		// 设置登录用户名
		var uName = window.localStorage.userName;
		if (uName == 'undefined') {
			uName = 'admin';
		}
		_this.$showuser.html(uName);

		$('#signout').click(function(){
			_this.c.logout('',function(){
				window.location.href=hostUrl+'login.html';
			})
		})

	};

	p.getCookie = function(name){
		var arr = document.cookie.split('; ');
		for (var i = 0; i < arr.length; i++) {
			arr2 = arr[i].split('=');
			if (name==arr2[0]){
				return arr2[1];
			}
		}
	};

	EE.Header = Header;
})();