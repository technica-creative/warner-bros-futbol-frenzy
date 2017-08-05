	FloatingFutbol.Preloader = function(game) {
	// global variables
	currentLanguage 	= 'ENGLISH';
	currentLogo 		= 'eng-logo';
	ballMovingUp 	 	= 1;
	ballMovingSpace	 	= 1;
	preloaderSpeed 		= .98;
	
	// resolutions
	mobileResolution	= "568x320";
	tabletResolution	= "2048x1536";
	desktopResolution	= "1024x768";
	
	// position data
	positionDataJSON = null;
	PositionData = null;

	// items
	this.background 	= null;	
	this.flappy 		= null;
	this.preloaderBall 	= null;
	this.percentText 	= null;
	this.tweetyGroup	= null;
	
	this.currentLoaded 	= 0;
	this.currentProgress= 0;
	this.loadingTimer 	= null;
	this.currentTweetyMovingStatus = 0;
	
	// items position
	this.end = 0;
};
FloatingFutbol.Preloader.prototype = 
{
	preload: function() 
	{
		// the clients wants the preloader to keep loading
		game.stage.disableVisibilityChange = true;
		
        // Set game background
	    game.stage.backgroundColor = 0x49721d;
        
		this.background = this.game.add.image(0, 0, 'preloader-bg');
				
		// Load the Google WebFont Loader script
		if( !(/MSIE 9/i.test(navigator.userAgent)) ) {
			this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		}        
        
        // position items
		this.loadPositionDataAndLoadAssets();
		
		// Start preloader animation
		this.startPreloaderAnimation();
       
        // callback to update the animation
        this.load.onFileComplete.add(this.fileLoaded, this);
	},
	// ==================================================================
    // CHECK IF MOBILE OR DESKTOP/TABLET TO SWITCH WHAT DATA IS LOADED
    // ==================================================================
	loadPositionDataAndLoadAssets: function()
	{
		// get the position data
    	positionDataJSON = JSON.parse(game.cache.getText('positionJSON'));
    	
		if (FloatingFutbol.screen == 'iPhone') 
        {
        	PositionData = positionDataJSON.res568;
			this.loadAssets(mobileResolution);

			this.end = FloatingFutbol.logicWidth - 75;
        } 
        else if (FloatingFutbol.screen == 'iPad') 
        {
        	PositionData = positionDataJSON.res2048;
        	this.loadAssets(tabletResolution);
        	 
        	this.end = FloatingFutbol.logicWidth - 250;
        } 
        else // desktop
        {
        	PositionData = positionDataJSON.res1024;
        	this.loadAssets(desktopResolution);
        	
        	this.end = FloatingFutbol.logicWidth - 150;
        }
	},
	 // ==================================================================
     // PRELOADER ANIMATION
     // ==================================================================
	startPreloaderAnimation:function ()
	{
		this.flappy = this.add.sprite(PositionData.tweetyX, PositionData.tweetyY, 'tweety-with-ball');
		if(FloatingFutbol.screen == "desktop"){
			this.flappy.scale.x = .5;
			this.flappy.scale.y = .5;
		}
		
		this.flappy.animations.add('run');
		this.flappy.play('run', PositionData.tweetyAnimationSpeed, true);
		
		this.percentText = this.add.text(this.flappy.x + PositionData.percentTextX, this.flappy.y + PositionData.percentTextY, "0%", { font: PositionData.percentTextSize + " 'Bowlby One SC'", fill: '#ffe71a', stroke: '#000', strokeThickness: 6 });
		
		this.loadingTimer = this.time.events.loop(Phaser.Timer.SECOND / 25, this.updateCounter, this);
	},
	//============================================================
	// LOAD ALL ASSETS FOR THE SELECTED RESOLUTIONS
	//============================================================
	loadAssets: function(resolution)
	{
		// -------------------------------------
		// COLLISION POLYGON DATA FOR CHARACTERS
		// -------------------------------------       
        this.load.physics('physicsData', 'assets/JSON/' + resolution + '/character-collision.json');
        
        // -------------------------------------
        // MAIN MENU
        // -------------------------------------
        this.load.image('main-menu-bottom-gradient', 'assets/common/' + resolution + '/main-menu/main-menu-bottom-gradient.png');
        this.load.image('main-menu-goal', 'assets/common/' + resolution + '/main-menu/main-menu-goal.png');  
        this.load.image('main-menu-tweety', 'assets/common/' + resolution + '/main-menu/main-menu-tweety.png');  
        this.load.image('main-menu-footer', 'assets/common/' + resolution + '/main-menu/footer.png');  
        this.load.spritesheet('main-menu-sound', 'assets/common/' + resolution + '/spritesheets/sound.png', PositionData.soundWidth, PositionData.soundHeight);  
  
        this.load.atlasJSONHash('main-menu-languages-atlas', 
        						'assets/common/' + resolution + '/spritesheets/main-menu-languages-spritesheet.png', 
        						'assets/common/' + resolution + '/spritesheets/texture-atlas-json/main-menu-languages-atlas.json');
        
        this.load.atlasJSONHash('main-menu-play-btns-atlas', 
								'assets/common/' + resolution + '/spritesheets/main-menu-play-btns-spritesheet.png', 
								'assets/common/' + resolution + '/spritesheets/texture-atlas-json/main-menu-play-btns-atlas.json');
		
		// -------------------------------------
		// HOW TO PLAY
		// -------------------------------------
		this.load.image('how-to-play-bg', 'assets/common/' + resolution + '/how-to-play/how-to-play-bg.jpg'); 
		this.load.spritesheet('how-to-tweety-spritesheet', 'assets/common/' + resolution + '/spritesheets/how-to-tweety-spritesheet.png', PositionData.howToTweetyWidth, PositionData.howToTweetyHeight, 49);
		
		if ( resolution != "1024x768" )
		{
			this.load.atlasJSONHash('finger-tap-atlas', 
				'assets/common/' + resolution + '/spritesheets/finger-tap-spritesheet.png', 
				'assets/common/' + resolution + '/spritesheets/texture-atlas-json/finger-tap-atlas.json');
				      	
        	this.load.atlasJSONHash('how-to-tap-arrows-atlas', 
				'assets/common/' + resolution + '/spritesheets/how-to-tap-arrows-spritesheet.png', 
				'assets/common/' + resolution + '/spritesheets/texture-atlas-json/how-to-tap-arrows-atlas.json');
        }        
        
        if ( resolution === "1024x768" )
        {
             this.load.spritesheet('spacebar', 'assets/common/1024x768/how-to-play/spacebar-animation.png', 510, 109);
             this.load.atlasJSONHash('spacebar-animation', 
				'assets/common/1024x768/spritesheets/how-to-spacebar-spritesheet.png', 
				'assets/common/1024x768/spritesheets/texture-atlas-json/how-to-spacebar-atlas.json');
        }
        
        this.load.atlasJSONHash('how-to-buttons-atlas', 
				'assets/common/' + resolution + '/spritesheets/how-to-buttons-spritesheet.png', 
				'assets/common/' + resolution + '/spritesheets/texture-atlas-json/how-to-buttons-atlas.json');
        this.load.atlasJSONHash('how-to-instructions-atlas', 
				'assets/common/' + resolution + '/spritesheets/how-to-instructions-spritesheet.png', 
				'assets/common/' + resolution + '/spritesheets/texture-atlas-json/how-to-instructions-atlas.json');
		
		// -------------------------------------
		// PLAY SCREEN
		// -------------------------------------
        this.load.image('playing-game-sky', 'assets/common/' + resolution + '/play-screen/playing-game-sky.png');
		this.load.image('playing-game-bg', 'assets/common/' + resolution + '/play-screen/playing-game-crowd.png');
		this.load.image('great-job', 'assets/common/' + resolution + '/play-screen/great-job-graphic.png');
		
        this.load.image('cloud1', 'assets/common/' + resolution + '/play-screen/cloud1.png');
        this.load.image('cloud2', 'assets/common/' + resolution + '/play-screen/cloud2.png');
        this.load.image('goal', 'assets/common/' + resolution + '/play-screen/goal.png');
        this.load.image('ball', 'assets/common/' + resolution + '/play-screen/ball.png');
		this.load.spritesheet('countdown', 'assets/common/' + resolution + '/spritesheets/countdown-spritesheet-mod.png', PositionData.CountdownSpriteWidth, PositionData.CountdownSpriteHeight); 
		
		this.load.image('bonus-castillian', 'assets/common/' + resolution + '/play-screen/bonus-round/castillian.png');  
		this.load.image('bonus-english', 'assets/common/' + resolution + '/play-screen/bonus-round/english.png');  
		this.load.image('bonus-french', 'assets/common/' + resolution + '/play-screen/bonus-round/french.png');  
		this.load.image('bonus-german', 'assets/common/' + resolution + '/play-screen/bonus-round/german.png');  
		this.load.image('bonus-italian', 'assets/common/' + resolution + '/play-screen/bonus-round/italian.png');  
		this.load.image('bonus-polish', 'assets/common/' + resolution + '/play-screen/bonus-round/polish.png');  
		this.load.image('bonus-spanish', 'assets/common/' + resolution + '/play-screen/bonus-round/spanish.png');  
		this.load.image('bonus-turk', 'assets/common/' + resolution + '/play-screen/bonus-round/turk.png');  
                
		// -------------------------------------
		// CHARACTER SPRITESHEETS
		// -------------------------------------
		if ( resolution === "2048x1536" ) // spritesheet contains blank areas in the 1024 and 568 versions so we tell the spritesheet how many frames to load
        	this.load.spritesheet('playing-bugs-spritesheet', 'assets/common/' + resolution + '/spritesheets/playing-bugs-spritesheet.png', PositionData.BugsSpriteWidth, PositionData.BugsSpriteHeight);
        else 
        	this.load.spritesheet('playing-bugs-spritesheet', 'assets/common/' + resolution + '/spritesheets/playing-bugs-spritesheet.png', PositionData.BugsSpriteWidth, PositionData.BugsSpriteHeight, 13);	
        	
        this.load.spritesheet('playing-tweety-spritesheet', 'assets/common/' + resolution + '/spritesheets/playing-tweety-spritesheet.png', PositionData.TweetySpriteWidth, PositionData.TweetySpriteHeight);
        this.load.spritesheet('playing-gossamer', 'assets/common/' + resolution + '/play-screen/playing-gossamer.png', PositionData.GossamerSpriteWidth, PositionData.GossamerSpriteHeight); 
        this.load.spritesheet('playing-taz-spritesheet', 'assets/common/' + resolution + '/spritesheets/playing-taz-spritesheet.png', PositionData.TazSpriteWidth, PositionData.TazSpriteHeight);  		
		this.load.spritesheet('playing-daffy', 'assets/common/' + resolution + '/play-screen/playing-daffy.png', PositionData.DaffySpriteWidth, PositionData.DaffySpriteHeight); 		
		this.load.spritesheet('playing-lola', 'assets/common/' + resolution + '/play-screen/playing-lola.png', PositionData.LolaSpriteWidth, PositionData.LolaSpriteHeight);		
		this.load.spritesheet('playing-bunny-spritesheet', 'assets/common/' + resolution + '/spritesheets/playing-bunny-spritesheet.png', PositionData.BunnySpriteWidth, PositionData.BunnySpriteHeight); 
		this.load.spritesheet('playing-tweety-collision-spritesheet', 'assets/common/' + resolution + '/spritesheets/playing-tweety-collision-spritesheet.png', PositionData.TweetyCollisionSpriteWidth, PositionData.TweetyCollisionSpriteHeight);
		
		// -------------------------------------
		// ATLAS FILES
		// -------------------------------------

		this.load.atlasJSONHash('playing-text-atlas', 
				'assets/common/' + resolution + '/spritesheets/playing-text-spritesheet.png',
				'assets/common/' + resolution + '/spritesheets/texture-atlas-json/playing-text-atlas.json');
		
		// updated scoring area text for LEVEL 3 =============================================================
		this.load.atlasJSONHash('playing-score-text-atlas', 
				'assets/common/' + resolution + '/spritesheets/playing-score-text-spritesheet.png',
				'assets/common/' + resolution + '/spritesheets/texture-atlas-json/playing-score-text-atlas.json');

		this.load.atlasJSONHash('playing-bonus-round-text-atlas', 
				'assets/common/' + resolution + '/spritesheets/playing-bonus-round-text-spritesheet.png',
				'assets/common/' + resolution + '/spritesheets/texture-atlas-json/playing-bonus-round-text-atlas.json');
		
		// end LEVEL 3 updates ================================================================================
				
		this.load.atlasJSONHash('playing-win-screen-btns-atlas', 
				'assets/common/' + resolution + '/spritesheets/playing-win-screen-btns-spritesheet.png',
				'assets/common/' + resolution + '/spritesheets/texture-atlas-json/playing-win-screen-btns-atlas.json');
				
		this.load.atlasJSONHash('playing-level-indicator-atlas', 
				'assets/common/' + resolution + '/spritesheets/playing-level-indicator-spritesheet.png',
				'assets/common/' + resolution + '/spritesheets/texture-atlas-json/playing-level-indicator-atlas.json');
		
		// -------------------------------------
		// LOSE SCREEN
		// -------------------------------------
		this.load.image('screen-gameover', 'assets/common/' + resolution + '/lose-screen/lose-popup.png');
		
		// -------------------------------------
		// WIN SCREEN
		// -------------------------------------
		this.load.image('screen-congrat', 'assets/common/' + resolution + '/win-screen/win-popup.png'); 
		this.load.image('coloring-art-1', 'assets/common/' + resolution + '/win-screen/thumb-level-01.png'); 
		this.load.image('coloring-art-2', 'assets/common/' + resolution + '/win-screen/thumb-level-02.png'); 
		this.load.image('coloring-art-3', 'assets/common/' + resolution + '/win-screen/thumb-level-03.png');
        this.load.image('happy-tweety', 'assets/common/' + resolution + '/win-screen/happy-tweety.png');
		
		// -------------------------------------		
		// LOGOS
		// -------------------------------------
		this.load.image('eng-logo', 'assets/common/translated-logos/eng/' + resolution + '/eng-logo.png');  
        this.load.image('cast-logo', 'assets/common/translated-logos/castillian/' + resolution + '/cast-logo.png');
        this.load.image('esp-logo', 'assets/common/translated-logos/espanol/' + resolution + '/esp-logo.png');  
        this.load.image('french-logo', 'assets/common/translated-logos/french/' + resolution + '/french-logo.png'); 
        this.load.image('italian-logo', 'assets/common/translated-logos/italian/' + resolution + '/italian-logo.png'); 
        this.load.image('german-logo', 'assets/common/translated-logos/german/' + resolution + '/german-logo.png');  
        this.load.image('polish-logo', 'assets/common/translated-logos/polish/' + resolution + '/polish-logo.png');  
        this.load.image('turk-logo', 'assets/common/translated-logos/turk/' + resolution + '/turk-logo.png');
        
        // -------------------------------------
		// SOUNDS
		// -------------------------------------
        // start page & instruction page
        this.load.audio('intromusic-music', ['assets/sound/intromusic_01.mp3', 'assets/sound/intromusic_01.aac', 'assets/sound/intromusic_01.m4a', 'assets/sound/intromusic_01.ogg']);
        
        // should play any time user clicks on a CTA
        this.load.audio('rollover-music', ['assets/sound/rollover_01.mp3', 'assets/sound/rollover_01.aac', 'assets/sound/rollover_01.m4a', 'assets/sound/rollover_01.ogg']);
        
        // should play during gameplay for all 3 levels
        this.load.audio('background-music', ['assets/sound/bgMusic_loop_8sec.mp3', 'assets/sound/bgMusic_loop_8sec.aac', 'assets/sound/bgMusic_loop_8sec.m4a', 'assets/sound/bgMusic_loop_8sec.ogg']);
		
		// should correspond with the "3 - 2 - 1" countdown just before the game starts
        this.load.audio('countdown-music', ['assets/sound/countdown_022.mp3', 'assets/sound/countdown_022.aac', 'assets/sound/countdown_022.m4a', 'assets/sound/countdown_022.ogg']);
        
        // when user hits space bar/taps screen to make Tweety fly
        this.load.audio('bounce-music', ['assets/sound/wingflapppppps.mp3', 'assets/sound/wingflapppppps.aac', 'assets/sound/wingflapppppps.m4a', 'assets/sound/wingflapppppps.ogg']);
        
        // when users hit one of the characters
        this.load.audio('hit-music', ['assets/sound/tweety_hit_01.mp3', 'assets/sound/tweety_hit_01.aac', 'assets/sound/tweety_hit_01.m4a', 'assets/sound/tweety_hit_01.ogg']);
        
        // plays when Tweety successfully reaches the goal
        this.load.audio('goal-music', ['assets/sound/goal.mp3', 'assets/sound/goal.aac', 'assets/sound/goal.m4a', 'assets/sound/goal.ogg']);
        
        // when winner screen appears
        this.load.audio('victory-music', ['assets/sound/victory_01.mp3', 'assets/sound/victory_01.aac', 'assets/sound/victory_01.m4a', 'assets/sound/victory_01.ogg']);
        
        // when loser screen appears
        this.load.audio('lose-music', ['assets/sound/lose_01.mp3', 'assets/sound/lose_01.aac', 'assets/sound/lose_01.m4a', 'assets/sound/lose_01.ogg']);

        
	},
   	updatePercentText: function()
    {
    	// fixes center alignment issue (Pixi doesnt allow centered text on 1 line, only multiline)
    	if ( this.currentProgress　< 10 )
   			this.percentText.x = this.flappy.x + PositionData.percentTextX + 20;
   		else if ( this.currentProgress > 10 && this.currentProgress < 100) 
   			this.percentText.x = this.flappy.x + PositionData.percentTextX + 10;
   		else
			this.percentText.x = this.flappy.x + PositionData.percentText100x;   			
   			
    	this.percentText.y = this.flappy.y + PositionData.percentTextY;
    	this.percentText.setText(Math.floor(this.currentProgress) + "%");
    },
    updateCounter: function () {
		if(this.currentProgress < this.currentLoaded) {
			this.currentProgress += preloaderSpeed;
		}
		
    	this.updatePercentText();
    	
    	if(this.currentProgress >= 25 && this.currentTweetyMovingStatus == 0) {
    		this.game.add.tween(this.flappy).to({x: PositionData.preloaderRight[0], y: PositionData.preloaderTop}, 2500, Phaser.Easing.Quintic.Out, true, 0, false).onComplete.addOnce(function()
    		    	{
    					this.currentTweetyMovingStatus = 25;
    		    	}, this);
    		this.currentTweetyMovingStatus++;
    	}
    	
    	if(this.currentProgress >= 50 && this.currentTweetyMovingStatus == 25) {
    		this.game.add.tween(this.flappy).to({x: PositionData.preloaderRight[1], y: PositionData.preloaderBottom}, 2500, Phaser.Easing.Quintic.Out, true, 0, false).onComplete.addOnce(function()
    		    	{
    					this.currentTweetyMovingStatus = 50;
    		    	}, this);
    		this.currentTweetyMovingStatus++;
    	}
    	
    	if(this.currentProgress >= 75 && this.currentTweetyMovingStatus == 50) {
    		this.game.add.tween(this.flappy).to({x: PositionData.preloaderRight[2], y: PositionData.preloaderTop}, 2500, Phaser.Easing.Quintic.Out, true, 0, false).onComplete.addOnce(function()
    		    	{
    					this.currentTweetyMovingStatus = 75;
    		    	}, this);
    		this.currentTweetyMovingStatus++;
    	}
    	
    	if(this.currentProgress >= 100 && this.currentTweetyMovingStatus == 75) {
    		this.game.add.tween(this.flappy).to({x: PositionData.preloaderRight[3], y: PositionData.preloaderBottom}, 2500, Phaser.Easing.Quintic.Out, true, 0, false).onComplete.addOnce(function()
    		    	{
    					this.currentTweetyMovingStatus = 100;
    		    	}, this);
    		this.currentTweetyMovingStatus++;
    	}
    	
    	if(this.currentTweetyMovingStatus == 100) {
    		//  Removes the timer
            this.time.events.remove(this.loadingTimer);
            this.shutDown();
    	}
	},
	fileLoaded: function (progress) {
		this.currentLoaded = progress;
    },
    //===============================================================
	// SHUT DOWN THE LEVEL AND CLEAN UP THE TWEENS AND OTHER ITEMS
	//===============================================================
    shutDown: function (pointer) 
    {
        if (this.flappy) {
            this.flappy.destroy();
            this.flappy = null;
        }
        if (this.preloaderBall) {
            this.preloaderBall.destroy();
            this.preloaderBall = null;
        }

    	//destroy bitmap text
    	this.percentText.destroy();
    	this.percentText = null;   
    	
    	var backgroundTween = this.add.tween(this.background).to({alpha: 0}, 500, Phaser.Easing.Quintic.Out, true, 0, false).onComplete.addOnce(
						  function()
						  { 
						  	this.loadNextState(); 
						  	this.tweens = [];
						  }, this);
    	 	
    },
    //==========================================================
	// MOVE TO THE NEXT STATE (HowTo screen)
	//==========================================================
    loadNextState: function () 
    {
    	//destroy sprite
        if (this.background) {
            this.background.destroy();
            this.background = null;
        }
        
        // play background music
        music = game.add.sound('intromusic-music');
        if(soundEnabled) {
        	music.play('', 0, 0.5, true, false);
        }        	   
        
        // setup other music
        rolloverMusic = game.add.sound('rollover-music');
        countdownMusic = game.add.sound('countdown-music');
        bounceMusic = game.add.sound('bounce-music');
        hitMusic = game.add.sound('hit-music');
        goalMusic = game.add.sound('goal-music');
        victoryMusic = game.add.sound('victory-music');
        loseMusic = game.add.sound('lose-music');

        
    	this.game.state.start('MainMenu');
	}
};