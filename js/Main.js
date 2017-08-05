// ==========================================================
// GLOBAL VARIABLES
// ==========================================================
var score = 0;

// ==========================================================
// CHECK BROWSER SIZE
// ==========================================================
//By default we set 
FloatingFutbol.screen = "small";
FloatingFutbol.srx = Math.max(window.innerWidth, window.innerHeight) * window.devicePixelRatio;
FloatingFutbol.sry = Math.min(window.innerWidth, window.innerHeight) * window.devicePixelRatio;

FloatingFutbol.logicWidth = 480;
FloatingFutbol.logicHeight = 320;

if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	FloatingFutbol.screen = "iPhone";
	FloatingFutbol.logicWidth = 568;
	FloatingFutbol.logicHeight = 320;
} else if( /iPad/i.test(navigator.userAgent) ) {
	FloatingFutbol.screen = "iPad";
	FloatingFutbol.logicWidth = 2048;
	//FloatingFutbol.logicHeight = 1344;
	FloatingFutbol.logicHeight = 1295;
} else {
	FloatingFutbol.screen = "desktop";
	FloatingFutbol.logicWidth = 1024;
	FloatingFutbol.logicHeight = 768;
}
//FloatingFutbol.screen = "iPad";
//FloatingFutbol.logicWidth = 2048;
//FloatingFutbol.logicHeight = 1295;
//FloatingFutbol.screen = "desktop";
//FloatingFutbol.logicWidth = 1024;
//FloatingFutbol.logicHeight = 768;
/*
*/
//FloatingFutbol.screen = "iPhone";
//FloatingFutbol.logicWidth = 568;
//FloatingFutbol.logicHeight = 320;
var game = new Phaser.Game(FloatingFutbol.logicWidth, FloatingFutbol.logicHeight, Phaser.AUTO, 'game_container');

//fixes line height issue with dynamic text (score and preloader percentage)
Phaser.Text.prototype.update = function() 
{
 this._lineSpacing = 12;
};

// ==========================================================
// GOOGLE WEBFONT
// The Google WebFont Loader will look for this object, so create it before loading the script.
// ==========================================================
WebFontConfig = {
    google: {
      families: ['Bowlby One SC']
    }
};
//alert($(window).width());
//alert($(window).height());
// ==========================================================
// DEFINE ALL STATES
// ==========================================================
game.state.add('Boot', FloatingFutbol.Boot);
game.state.add('Preloader', FloatingFutbol.Preloader);


if(FloatingFutbol.screen == 'desktop') {
	game.state.add('Howto', FloatingFutbol.Howto);
} else if(FloatingFutbol.screen == 'iPhone') {
	game.state.add('HowtoMobile', FloatingFutbol.HowtoMobile);
	$("body").css({"background": "#000000"});
} else if(FloatingFutbol.screen == 'iPad') {	
	game.state.add('Howto', FloatingFutbol.HowtoMobile);
	$("body").css({"background": "#000000"});
}
game.state.add('MainMenu', FloatingFutbol.MainMenu);
game.state.add('Play', FloatingFutbol.Play);  

// Start with the 'Boot' state
game.state.start('Boot'); 