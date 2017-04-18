var SCALE = 1;
this.EE = this.EE || {};

(function() {
    var Screen = function() {
        $(document.documentElement).css({
            'font-size': (window.screen.availHeight > 1200 ? 1920 : $(document.documentElement).width()) / 1920 * 100
        });
        console.log(window.screen.availHeight)
        if (window.screen.availHeight > 1200) {
            SCALE = window.screen.availHeight / 1080;
            $(".root").css({
                "width": "1920px",
                "height": "1080px",
                "transform": "translate(-50%,-50%) scale(" + SCALE + "," + SCALE + ")",
                "-webkit-transform": "translate(-50%,-50%) scale(" + SCALE + "," + SCALE + ")"
            });
        }
    }

    EE.Screen = Screen;
})();

$(function(){
    EE.Screen();
})