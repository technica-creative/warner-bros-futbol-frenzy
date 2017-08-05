FloatingFutbol.Howto = function(game) 
{
    this.transitionInTime = 1000;
	
	// screen assets
    this.screenBG = null;
    this.tweetyFly = null;
    this.spaceBar = this.instructionsText = null;
    this.nextButton = this.backButton = null;
    this.spaceBarTween = null;
    
	this.tweetyFlyPositionX = FloatingFutbol.logicWidth/2;
	
	this.backButtonTweenHover = this.backButtonTweenOut = null;
	this.nextButtonTweenHover = this.nextButtonTweenOut = null;
};

FloatingFutbol.Howto.prototype = 
{
    create: function() 
    {
    	this.createBackgroundImages();
        this.addTweetyAnimation();
        this.setLanguage();
        this.transitionInAnimation();
    },
    //==========================================================
	// ADD ALL BACKGROUND IMAGES TO SCREEN
	//==========================================================
    createBackgroundImages:function()
    {    	
        this.screenBG = this.game.add.image(0, 0, 'how-to-play-bg');
        this.spaceBar = this.game.add.sprite(PositionData.spaceBarPositionX, PositionData.spaceBarPositionY + 200, 'spacebar-animation');
        
        this.spaceBar.animations.add('pressingKey', [0,1,2,3,4,5,6,7,8,9,10,25,25,25,0,1,2,3,4,5,6,7,8,9,10,25,25,25]);
        
        soundButton			= this.game.add.button(PositionData.soundX, PositionData.soundY, 'main-menu-sound', this.toggleSound, this);
        soundButton.anchor.setTo(1, 0);
        soundButton.inputEnabled = true;
        soundButton.input.useHandCursor = true;
        if(soundEnabled) {
        	soundButton.setFrames(1, 0, 1, 0);
        } else {
        	soundButton.setFrames(2, 2, 2, 2);
        }
        
    },
    //==========================================================
	// CREATE THE TWEETY FLY ON THE SPACE BAR 
	//==========================================================
    addTweetyAnimation: function()
    {
    	this.tweetyFly = this.add.sprite(PositionData.tweetyFlyPositionX, PositionData.tweetyFlyPositionY - 200, 'how-to-tweety-spritesheet');
    	this.tweetyFly.animations.add('flapping', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48], true);
    	
    	this.tweetyFly.scale.x = .8;
    	this.tweetyFly.scale.y = .8;
    },
    //=================================================================
	// SET THE CURRENT LANGUAGE FOR TEXTS AND BUTTONS
	//=================================================================
    setLanguage: function()
    {
        switch(currentLanguage)
        {
            case "ENGLISH":
                    this.updateLogo("eng-logo");
                    this.changeInstructionsToCurrentLanguage('english.png', 0);
                    this.changeButtonsToCurrentLanguage("back-english-up.png", "back-english-over.png", 
                    									"next-english-up.png", "next-english-over.png");
                break;
            case "ESPAÑOL":
                    this.updateLogo("esp-logo");
                    this.changeInstructionsToCurrentLanguage('spanish.png', 1);
                    this.changeButtonsToCurrentLanguage("back-spanish-up.png", "back-spanish-over.png", 
                    									"next-castillian-spanish-up.png", "next-castillian-spanish-over.png");
                break;
            case "CASTELLANO":
                    this.updateLogo("cast-logo");
                    this.changeInstructionsToCurrentLanguage('castillian.png', 2);
                    this.changeButtonsToCurrentLanguage("back-castillian-up.png", "back-castillian-over.png", 
                    									"next-castillian-spanish-up.png", "next-castillian-spanish-over.png"); 
                break;
            case "ITALIANO":
                    this.updateLogo("italian-logo");
                    this.changeInstructionsToCurrentLanguage('italian.png', 3);
                    this.changeButtonsToCurrentLanguage("back-italian-up.png", "back-italian-over.png", 
                    									"next-italian-up.png", "next-italian-over.png");
                break;
            case "POLSKI":
                   	this.updateLogo("polish-logo");
                   	this.changeInstructionsToCurrentLanguage('polish.png', 4);
					this.changeButtonsToCurrentLanguage("back-polish-up.png", "back-polish-over.png", 
														"next-polish-up.png", "next-polish-over.png");
                break;
            case "TÜRKÇE":
                   this.updateLogo("turk-logo");
                   this.changeInstructionsToCurrentLanguage('turkish.png', 5);
                   this.changeButtonsToCurrentLanguage("back-turk-up.png", "back-turk-over.png", 
                   										"next-turk-up.png", "next-turk-over.png");
                break;
            case "FRANÇAIS":
                   this.updateLogo("french-logo");
                   this.changeInstructionsToCurrentLanguage('french.png', 6);
                   this.changeButtonsToCurrentLanguage("back-french-up.png", "back-french-over.png", 
                   										"next-french-up.png", "next-french-over.png");
                break;
            case "DEUTSCH":
                   this.updateLogo("german-logo");
                   this.changeInstructionsToCurrentLanguage('german.png', 7);
                   this.changeButtonsToCurrentLanguage("back-german-up.png", "back-german-over.png", 
                   										"next-german-up.png", "next-german-over.png");
                break;
            }
    },
    // ==========================================================
    // REMOVE THE CURRENTLY DISPLAYED LOGO AND REPLACE WITH
    // SELECTED LANGUAGE (uses same logo as large but scaled)
    // ==========================================================
    updateLogo: function (logoName)
    {
    	if(logo) {
    		logo.destroy();
    	}

        logo = this.game.add.sprite(PositionData.logoPositionX - FloatingFutbol.logicWidth, PositionData.logoPositionY, logoName);
        logo.scale.x = .5;
        logo.scale.y = .5;
        this.game.add.tween(logo).to({x: PositionData.logoPositionX, y: PositionData.logoPositionY}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 0, false);
    },
	// ==========================================================
	// CHANGE THE INSTRUCTIONS TEXT TO THE CORRECT LANGUAGE
	// ==========================================================
	changeInstructionsToCurrentLanguage: function(lang, xOffset)
	{
		// set the sprite to the instructions text atlas, then
		// set the frameName to the correct atlas image
		this.instructionsText = this.game.add.sprite(FloatingFutbol.logicWidth/2, PositionData.instructionsTextPositionY + 200, 'how-to-instructions-atlas');
		this.instructionsText.anchor.setTo(0.5, 0.5);
		this.instructionsText.frameName = lang; 
	},
	// ==========================================================
	// CHANGE THE BUTTONS TO THE CORRECT LANGUAGE
	// ==========================================================
	changeButtonsToCurrentLanguage: function(backUp, backOver, nextUp, nextOver)
	{
		// change the back button
	    this.backButton = this.add.button(PositionData.backButtonPositionX - 250, PositionData.backButtonPositionY, 'how-to-buttons-atlas', this.transitionOutAnimation, this);
	    this.backButton.eventType = "back";
	    this.backButton.setFrames(backOver, backUp);
	    this.backButton.inputEnabled = true;
	    this.backButton.input.useHandCursor = true;
        
        // change the next button
	    this.nextButton = this.add.button(PositionData.nextButtonPositionX + 250, PositionData.nextButtonPositionY, 'how-to-buttons-atlas', this.transitionOutAnimation, this);
	    this.nextButton.eventType = "next";
	    this.nextButton.setFrames(nextOver, nextUp);
	    this.nextButton.inputEnabled = true;
	    this.nextButton.input.useHandCursor = true;
	    
	    this.backButton.events.onInputOver.add(this.backButtonOver, this);
    	this.backButton.events.onInputOut.add(this.backButtonOut, this);

	    this.backButtonTweenHover = this.add.tween(this.backButton);
    	this.backButtonTweenHover.to({ y: PositionData.backButtonPositionY - 5 }, 150, Phaser.Easing.Linear.None);
    	this.backButtonTweenOut = this.add.tween(this.backButton);
    	this.backButtonTweenOut.to({ y: PositionData.backButtonPositionY }, 150, Phaser.Easing.Linear.None);
    	
    	this.nextButton.events.onInputOver.add(this.nextButtonOver, this);
    	this.nextButton.events.onInputOut.add(this.nextButtonOut, this);
         
	    this.nextButtonTweenHover = this.add.tween(this.nextButton);
    	this.nextButtonTweenHover.to({ y: PositionData.nextButtonPositionY - 5 }, 150, Phaser.Easing.Linear.None);
    	this.nextButtonTweenOut = this.add.tween(this.nextButton);
    	this.nextButtonTweenOut.to({ y: PositionData.nextButtonPositionY }, 150, Phaser.Easing.Linear.None);
	},
	backButtonOver: function()
    {
    	this.backButtonTweenHover.start();
    },
    backButtonOut: function()
    {
    	this.backButtonTweenOut.start();
    },
    nextButtonOver: function()
    {
    	this.nextButtonTweenHover.start();
    },
    nextButtonOut: function()
    {
    	this.nextButtonTweenOut.start();
    },
	//==========================================================
	// TRANSITION ANIMATIONS FOR IN AND OUT 
	//==========================================================
	transitionInAnimation: function()
    {
        // set all to alpha 0
		this.tweetyFly.alpha = 0; 
		this.instructionsText.alpha = this.spaceBar.alpha = 0;
        this.backButton.alpha = this.nextButton.alpha = 0;
        this.screenBG.alpha = 0;
		
        // screen graphics
        this.game.add.tween(this.screenBG ).to({alpha: 1}, 800, Phaser.Easing.Linear.Out, true, 0, false);
        this.game.add.tween(this.tweetyFly).to({y: PositionData.tweetyFlyPositionY, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 200, false).onComplete.addOnce(
						   function()
						   { 
						   	  this.tweetyFly.animations.play('flapping', 21, true);
						   }, this);
		this.game.add.tween(this.backButton).to({x: PositionData.backButtonPositionX, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 600, false);
        this.game.add.tween(this.nextButton).to({x: PositionData.nextButtonPositionX, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 600, false);
        this.game.add.tween(this.instructionsText).to({y: PositionData.instructionsTextPositionY, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 600, false);
        this.game.add.tween(this.spaceBar).to({y: PositionData.spaceBarPositionY, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 200, false).onComplete.addOnce(
				    						  function()
				    						  { 
				    							  this.spaceBar.animations.play('pressingKey', 6, true);
				    						  }, this);
    },
    transitionOutAnimation: function(e)
    {
    	if (soundEnabled) {
    		rolloverMusic.play('', 0, 1, false);
    	}
    	
    	this.tweetyFly.animations.stop();
    	this.spaceBar.animations.stop();
    	
    	this.game.add.tween(logo).to({x: PositionData.logoPositionX - FloatingFutbol.logicWidth/2}, this.transitionInTime - 100, Phaser.Easing.Quintic.In, true, 0, false);
        this.game.add.tween(this.screenBG ).to({alpha: 0}, 400, Phaser.Easing.Linear.In, true, 400, false);
        this.game.add.tween(this.tweetyFly).to({y: -200, alpha:0}, this.transitionInTime - 300, Phaser.Easing.Quintic.In, true, 0, false);
        this.game.add.tween(this.backButton).to({x: -250, alpha:0}, this.transitionInTime - 300, Phaser.Easing.Quintic.In, true, 0, false);
        this.game.add.tween(this.nextButton).to({x: FloatingFutbol.logicWidth + 250, alpha:0}, this.transitionInTime - 300, Phaser.Easing.Quintic.In, true, 0, false);
        this.game.add.tween(this.instructionsText).to({y: FloatingFutbol.logicHeight + 200, alpha:0}, this.transitionInTime - 300, Phaser.Easing.Quintic.In, true, 0, false);
        this.game.add.tween(this.spaceBar).to({y: FloatingFutbol.logicHeight, alpha:0}, this.transitionInTime - 200, Phaser.Easing.Quintic.In, true, 0, false).onComplete.addOnce(
			        						  function()
			        						  { 
			        						  		// check to see if the user clicked on next or back
			        						  		if (e.eventType === "next")
			        						  			this.shutDown();
			        						  		else
			        						  			this.loadPreviousState();
			        						  }, this);
    },
    // ==========================================================
    // UPDATE - CONSTANTLY RUNNING BIRD FLYING AND BALL
    // ==========================================================
    update: function() 
    {
    },
    //==========================================================
	// SHUT DOWN THE LEVEL AND CLEAN UP THE TWEENS AND OTHER ITEMS
	//==========================================================
	shutDown: function (pointer) 
	{
		// remove tweens
		this.tweens = [];
		
		//destroy sprites
		if (this.screenBG) {
			this.screenBG.destroy();
			this.screenBG = null;
		}
		if (this.mainMenuBG) {
			this.mainMenuBG.destroy();
			this.mainMenuBG = null;
		}
		if (this.gamePlayBG) {
			this.gamePlayBG.destroy();
			this.gamePlayBG = null;
		}
		
		if (this.tweetyFly) {
			this.tweetyFly.destroy();
			this.tweetyFly = null;
		}		
		
		if (this.spaceBar) {
			this.spaceBar.destroy();
			this.spaceBar = null;
		}
		if (this.instructionsText) {
			this.instructionsText.destroy();
			this.instructionsText = null;
		}
		
		//destroy buttons
		if (this.nextButton) {
			this.nextButton.kill();
			this.nextButton = null;
		}
		if (this.backButton) {
			this.backButton.kill();
			this.backButton = null;
		}

		if (soundButton) {
			soundButton.kill();
			soundButton = null;
		}
		
		/***************************************
		 *  clear cache before start the game  * 
		 **************************************/		
		// clear the preloader papge
		this.game.cache.removeImage("preloader-bg");
		//this.game.cache.removeImage("tweety-with-ball");
		
		// clear the main menu page
		this.game.cache.removeImage("main-menu-goal");
		this.game.cache.removeImage("main-menu-tweety");
		this.game.cache.removeImage("main-menu-languages-atlas");
		this.game.cache.removeImage("main-menu-play-btns-atlas");
		this.game.cache.removeImage("main-menu-bottom-gradient");
		
		// clear the how to play page
		this.game.cache.removeImage("how-to-play-bg");
		this.game.cache.removeImage("how-to-instructions-atlas");
		this.game.cache.removeImage("how-to-buttons-atlas");
		
		this.game.cache.removeImage("how-to-tweety-spritesheet");
		this.game.cache.removeImage("spacebar-animation");
		
		// clear other languages logo
		if(currentLanguage != "ENGLISH") {
			this.game.cache.removeImage("eng-logo");
			this.game.cache.removeImage("bonus-english");
		}
		if(currentLanguage != "CASTELLANO") {
			this.game.cache.removeImage("cast-logo");
			this.game.cache.removeImage("bonus-castillian");
		}
		if(currentLanguage != "ESPAÑOL") {
			this.game.cache.removeImage("esp-logo");
			this.game.cache.removeImage("bonus-spanish");
		}
		if(currentLanguage != "FRANÇAIS") {
			this.game.cache.removeImage("french-logo");
			this.game.cache.removeImage("bonus-french");
		}
		if(currentLanguage != "ITALIANO") {
			this.game.cache.removeImage("italian-logo");
			this.game.cache.removeImage("bonus-italian");
		}
		if(currentLanguage != "DEUTSCH") {
			this.game.cache.removeImage("german-logo");
			this.game.cache.removeImage("bonus-german");
		}
		if(currentLanguage != "POLSKI") {
			this.game.cache.removeImage("polish-logo");
			this.game.cache.removeImage("bonus-polish");
		}
		if(currentLanguage != "TÜRKÇE") {
			this.game.cache.removeImage("turk-logo");
			this.game.cache.removeImage("bonus-turk");
		}
		
		// after cleaning, go to next state
		this.loadNextState();
    },
    //==========================================================
	// MOVE TO THE PREVIOUS STATE (MAIN MENU screen)
	//==========================================================
    loadPreviousState: function () {
    	this.game.state.start('MainMenu');
	},
    //==========================================================
	// MOVE TO THE NEXT STATE (play screen)
	//==========================================================
    loadNextState: function () {
    	this.game.state.start('Play');
	},
	//==========================================================
	// TOGGLE THE SOUND
	//==========================================================
	toggleSound: function (event) 
    {
		soundEnabled = !soundEnabled;
		if (soundEnabled) {
			soundButton.setFrames(1, 0, 1, 0);
			
			if(music.paused) {
				music.resume();
			} else {
				music.play('', 0, 0.5, true, false);
			}			
		}
		else
		{
			soundButton.setFrames(2, 2, 2, 2);
			music.pause();
		}
	}
};