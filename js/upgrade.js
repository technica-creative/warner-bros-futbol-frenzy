var __bgImageOriginalWidth = 2048;
var __bgImageOriginalHeight = 1536;

var preloadInterval;
var preloadIndex = 0;

$(document).ready(function(e) {	
	$(window).resize(resizeHandler);	
	resizeHandler();
});

resizeHandler = function(){
	$("#main_wrapper").css({"overflow": "hidden"});
	
	var availWidth = $(window).width();
	var availHeight = $(window).height();
	var widthToHeight = availWidth / availHeight;
	var heightToWidth = availHeight / availWidth;
	
	var widthToHeightOfBgImg = __bgImageOriginalWidth / __bgImageOriginalHeight;
	var heightToWidthOfBgImg = __bgImageOriginalHeight / __bgImageOriginalWidth;
	
	if (widthToHeight > widthToHeightOfBgImg){
		$("#upgradeImg").attr({"height":(availWidth * heightToWidthOfBgImg)}).css({"right":"0px", "top":"0px"});
	}
	else
	{
		$("#upgradeImg").attr({"height": availHeight});
		
		// center horizontally
		var newLeft =  (2048*(availHeight / 1536) - availWidth ) / 2;		
		$("#upgradeImg").css({"right": - newLeft + "px", "top": "0px"}); 
	}

	if(availWidth < 1000) {
		$("#logo").css({"position": "relative"});
		$("#content").css({"width": "100%"});
		$("#text-content").css({"padding-top": "0"});
		$("#tweety").css({"right": "0", "top": "-95px"});
	} else {
		$("#logo").css({"position": "absolute"});
		$("#content").css({"width": "1024px"});
		$("#text-content").css({"padding-top": "155px"});
		$("#tweety").css({"right": "130px", "top": "210px"});
	}
}

/* ==============================================
 DOC READY
============================================== */

$(document).ready(function(e) {
	preloadInterval = setInterval(function() { 
		$('#tweety').css("background-position", (preloadIndex % 2 * (-149)) + "px " + (Math.floor(preloadIndex /2) * (-171)) + "px");
		preloadIndex = (preloadIndex + 1) % 8;		
	}, 70);
		
	TweenMax.to($("#tweety-ball"), 1, {repeat: -1, top:"-=30px", yoyo:true, ease:Quad.easeInOut});
	TweenMax.to($("#tweety-ball"), .1, {scaleX: .9, scaleY: .9, x: "+=10"});
});
