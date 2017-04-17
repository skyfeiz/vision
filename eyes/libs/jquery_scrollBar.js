/* 
	jquery滚动条插件__SCROLLBAR;
	自定义参数:
		width: 滚动条宽度(px);
		speed: 滚动鼠标的速度(ms);
		scrollLine: 滚动一次所跨过的距离(px);
		height: 可视框高度
		<<=================================================================================>>
		后续加入:
			paddingT: 可视框的顶部内边距(px);
			paddingB: 可视框的底部内边距(px);
			scrollDirection: horizontal(水平方向) / vertical(垂直方向) / both(水平和垂直方向)
		<<=================================================================================>>
		
	css配置:
		默认为本 js 文件目录里的css文件——scrollBar.css;
		自定义路径可在引入css路径函数 p.initCssPath() 中修改;
		css里的样式可自定义,一般只定义 :
			.barBox(滚动条容器) 背景;
								边框;
								圆角。
			.barItem(滑块)  背景;
							圆角。
 */

;(function($){
	//jquery插件定义
	$.fn.buildScrollBar = function(opt){
		if(this.height()<this.children().height()){
			new SCROLLBAR(this,opt);
		}
		return this;
	};
	
	//对象化
	var SCROLLBAR = function(ele,opt){
		var options = $.extend({},this.defaults,opt);
		this.$container = ele.data("top",0);
		this.$scrollText = ele.children().css({ "position": "relative", "top": "0px", "left": "0px" });
		this.scrollH = options.height ? options.height : ele.height();
		this.textH = ele.children().height();
		this.initBuild(options);
		this.callback = options.callback;
	};
	
	p = SCROLLBAR.prototype;
	
	//默认配置
	p.defaults = {
		/* width: 0, */
		speed: 200,
		scrollLine: 33,
		height: 0,
		callback: function(){}
	};
	
	//引入css路径
	/* p.initCssPath = function(options){
		var cur = this;
		var js = document.scripts;
		$.each(js,function(i,val){
			if(val.src.match("jquery_scrollBar")){
				var cssLink = val.src.substring(0,val.src.lastIndexOf("/")+1)+"css/scrollBar.css";
				var $link = $('<link rel="stylesheet" type="text/css" />').attr({"href":cssLink});
				$("head").append($link);
				cur.initBuild(options);
				return false;
			}
		})
	}; */
	
	//建立
	p.initBuild = function(opt){
		var cur = this;
		var $barBox = $('<div class="barBox"><div class="barItem"></div></div>')/* .css({width: opt.width ? opt.width : }) */;
		cur.$container.append($barBox).css({"padding-right":$barBox.find("div.barItem").width()/2});
		$barBox.children().css({"height":cur.scrollH/cur.$scrollText.height()*cur.scrollH});
		this.initBind(opt);
	};
	
	//定义绑定事件
	p.initBind = function(opt){
		this.bindDrag();
		this.bindScroll(opt);
		
	};
	
	/* 滚动条拖动事件 */
	p.bindDrag = function(){
		var cur = this;
		cur.isDrag = false;
		cur.mousedownTop = 0;
		cur.dragTop = 0;
		
		cur.$container.find(".barItem").mousedown(function(e){
			cur.isDrag = true;
			cur.mousedownTop = e.clientY;
			return false;
		})
		
		$(document).mousemove(function(e){
			if(cur.isDrag){
				cur.dragTop = cur.$container.data("top")*cur.scrollH + e.clientY - cur.mousedownTop;
				if((cur.dragTop/cur.scrollH)<=0&&e.clientY - cur.mousedownTop<0){
					cur.dragTop = 0;
					cur.mousedownTop = e.clientY;
					cur.$container.data("top",0);
				}
				else if((cur.dragTop/cur.scrollH)>=(1-cur.$container.find(".barItem").height()/cur.scrollH)&&e.clientY - cur.mousedownTop>0){
					cur.dragTop = (1-cur.$container.find(".barItem").height()/cur.scrollH)*cur.scrollH;
					cur.$container.data("top",1-cur.$container.find(".barItem").height()/cur.scrollH);
					cur.mousedownTop = e.clientY;
				}
				cur.$scrollText.css({top: -cur.dragTop/cur.scrollH*cur.textH});
				cur.$container.find(".barItem").css({top:cur.dragTop});
				//表格定位
				cur.callback(cur.dragTop/cur.scrollH*cur.textH);
				
			}
		}).mouseup(function(){
			if(cur.isDrag){
				cur.isDrag = false;
				cur.$container.data({"top":cur.dragTop/cur.scrollH});
			}
		});
	};
	
	/* 滚轮事件 */
	p.bindScroll = function(opt){
		var cur = this;
		cur.isScroll = false;
		cur.overTime = 0;
		var mousewheelevt=(/Firefox/i.test(navigator.userAgent))?"DOMMouseScroll": "mousewheel";
		cur.$container.mouseenter(function(){
			cur.isScroll = true;
		}).mouseleave(function(){
			cur.isScroll = false;
		});
		
		cur.mainScroll = function(event){
			if(cur.isScroll){
				var e = event ? event : window.event ;
				
				var scrollSpeed = e.detail ? e.detail/2*opt.scrollLine : -e.wheelDelta/120*opt.scrollLine ;
				var top = cur.$container.data("top")+scrollSpeed/cur.textH;
				if(top<=0){
					top = 0;
					if(scrollSpeed>0){
						e.preventDefault ? e.preventDefault() : event.returnValue =false;
					}
					else{
						cur.overTime++;
						if(cur.overTime<15){
							e.preventDefault ? e.preventDefault() : event.returnValue =false;
						}
					}
				}
				else if(top>=(1-cur.$container.find(".barItem").height()/cur.scrollH)){
					top = 1-cur.$container.find(".barItem").height()/cur.scrollH;
					if(scrollSpeed<0){
						e.preventDefault ? e.preventDefault() : event.returnValue =false;
					}
					else{
						cur.overTime++;
						if(cur.overTime<15){
							e.preventDefault ? e.preventDefault() : event.returnValue =false;
						}
					}
				}
				else{
					e.preventDefault ? e.preventDefault() : event.returnValue =false;
					cur.overTime = 0;
				}
				cur.$container.data({"top": top});
				cur.$container.find(".barItem").stop(true,false).css({top: top*cur.scrollH},opt.speed);
				cur.$scrollText.stop(true,false).css({top: -top*cur.textH},opt.speed);
				//表格定位
				cur.callback(top*cur.textH);
			}
		};
		
		if(document.attachEvent){
			document.attachEvent("on"+mousewheelevt,cur.mainScroll);
		}
		else if(document.addEventListener){
			document.addEventListener(mousewheelevt,cur.mainScroll);
		}
	};
		
})(jQuery);