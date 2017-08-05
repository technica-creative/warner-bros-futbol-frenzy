FloatingFutbol = 
{
    /* If the music in the game needs to play through-out a few State swaps, then you could reference it here */    
};
FloatingFutbol.Boot = function(game){
	screenWidth = 1024;
	screenHeight = 768;
	ratio = screenHeight / screenWidth;
	
	music = null;
    rolloverMusic = null;
    countdownMusic = null;
	bounceMusic = null;
	hitMusic = null;
	goalMusic = null;
	victoryMusic = null;
	loseMusic = null;

    soundEnabled = true;
    soundButton = null;
};
FloatingFutbol.Boot.prototype = {
	preload: function(){
		
		// for tracking FPS
		game.time.advancedTiming = true;
				
		 // Load object resolutions
        this.load.text('positionJSON', 'assets/JSON/PositionData.json');
        
		if(FloatingFutbol.screen == 'iPhone') {
			this.load.image('preloader-bg', 'assets/common/568x320/preloader/preloader-bg.jpg');
			this.load.spritesheet('tweety-with-ball', 'assets/common/568x320/spritesheets/preloader-tweety-spritesheet.png', 85, 124);			
		} else if(FloatingFutbol.screen == 'iPad') {
			this.load.image('preloader-bg', 'assets/common/2048x1536/preloader/preloader-bg.jpg');
			this.load.spritesheet('tweety-with-ball', 'assets/common/2048x1536/spritesheets/preloader-tweety-spritesheet.png', 250, 363, 15);
		} else { // desktop
			this.load.image('preloader-bg', 'assets/common/1024x768/preloader/preloader-bg.jpg');
			this.load.spritesheet('tweety-with-ball', 'assets/common/2048x1536/spritesheets/preloader-tweety-spritesheet.png', 250, 363, 15);
		}
	},
	create: function()
	{
		this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = false;
        
		if (this.game.device.desktop)
        {
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.maxWidth = 1024;
            this.scale.maxHeight = 768;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = false;
            this.scale.forceOrientation(true, false);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
            this.scale.setScreenSize(true);
        }
        else
        {
        	if( FloatingFutbol.screen == 'iPad' ) {
    			this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    		} else {
    			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    		}   
            
            //this.scale.forceLandscape  = true;
            this.scale.forceOrientation(true, false, 'orientation');
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
            
            this.scale.setScreenSize(false);
            
            // does not auto-start audio on mobile
            soundEnabled = false;
            
            if(FloatingFutbol.screen == "iPhone" && $(window).width() < $(window).height()) {
            	$("#iphone-portrait").css({"display": "block"});
            } else if(FloatingFutbol.screen == "iPad" && $(window).width() < $(window).height()) {
            	$("#ipad-portrait").css({"display": "block"});
            }
        }

		this.game.state.start('Preloader');
	},
    enterIncorrectOrientation: function () 
    {
    	if(FloatingFutbol.screen == "iPhone") {
        	$("#iphone-portrait").css({"display": "block"});
        } else if(FloatingFutbol.screen == "iPad") {
        	$("#ipad-portrait").css({"display": "block"});
        }
    	
    	game.orientated = false;
    	game.paused = true;
    },
    leaveIncorrectOrientation: function () 
    {
        if(FloatingFutbol.screen == "iPhone") {
        	$("#iphone-portrait").css({"display": "none"});
        } else if(FloatingFutbol.screen == "iPad") {
        	$("#ipad-portrait").css({"display": "none"});
        }
        
        game.orientated = true;
    	game.paused = false;
    },
    stageChanedEvent: function () 
    {
    	
    },
};