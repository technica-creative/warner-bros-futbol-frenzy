FloatingFutbol.HowtoMobile = function(game) {
	this.transitionInTime = 800;
		
	// screen assets
    this.screenBG = null;
    this.tweetyFly = this.tweetyBall = null; 
    this.finger = this.tapRightArrow = this.tapLeftArrow = null;
    this.tapRightArrowText = this.tapLeftArrowText = this.instructionsText = null;
    this.nextButton = this.backButton = this.nextButtonText = this.backButtonText = null;
};

FloatingFutbol.HowtoMobile.prototype = 
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
    	this.screenBG 	= this.game.add.image(0, 0, 'how-to-play-bg');
    	this.finger = this.game.add.sprite(PositionData.fingerPositionX, PositionData.fingerPositionY + FloatingFutbol.logicHeight, 'finger-tap-atlas');
    	this.finger.animations.add('tapping', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48], true);
    	
    	this.finger.angle = 20;
    	
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
	// CREATE THE TWEETY
	//==========================================================
    addTweetyAnimation: function()
    {
		this.tweetyFly = this.add.sprite(PositionData.tweetyFlyPositionX, PositionData.tweetyFlyPositionY - 50, 'how-to-tweety-spritesheet');
    	this.tweetyFly.animations.add('flapping', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48], true);
    	if(FloatingFutbol.screen == 'iPad')
    	{
    		this.tweetyFly.scale.x = 1.5;
    		this.tweetyFly.scale.y = 1.5;
    	}
    	if(FloatingFutbol.screen == 'iPhone')
    	{
    		this.tweetyFly.scale.x = 1.1;
    		this.tweetyFly.scale.y = 1.1;
    	}
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
            	this.addTranslatedText('english');
                this.changeButtonsToCurrentLanguage("english-next.png", "english-back.png");
                break;
            case "ESPAÑOL":
            	this.updateLogo("esp-logo");
            	this.addTranslatedText('spanish');
                this.changeButtonsToCurrentLanguage("castillian-spanish-next.png", "spanish-back.png");
                break;
            case "CASTELLANO":
            	this.updateLogo("cast-logo");
            	this.addTranslatedText('castillian');
                this.changeButtonsToCurrentLanguage("castillian-spanish-next.png", "castillian-back.png"); 
                break;
            case "ITALIANO":
            	this.updateLogo("italian-logo");
            	this.addTranslatedText('italian');
               	this.changeButtonsToCurrentLanguage("italian-next.png", "italian-back.png");
                break;
            case "POLSKI":
                this.updateLogo("polish-logo");
                this.addTranslatedText('polish');
				this.changeButtonsToCurrentLanguage("polish-next.png", "polish-back.png");
                break;
            case "TÜRKÇE":
                this.updateLogo("turk-logo");
                this.addTranslatedText('turkish');
                this.changeButtonsToCurrentLanguage("turk-next.png", "turk-back.png");
                break;
            case "FRANÇAIS":
                this.updateLogo("french-logo");
                this.addTranslatedText('french');
                this.changeButtonsToCurrentLanguage("french-next.png", "french-back.png");
                break;
            case "DEUTSCH":
                this.updateLogo("german-logo");
                this.addTranslatedText('german');
                this.changeButtonsToCurrentLanguage("german-next.png", "german-back.png");
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
    //=================================================================
	// ADD OTHER ASSETS
	//=================================================================
    addTranslatedText: function(lang)
    {
    	// arrows    	
    	this.tapRightArrow = this.game.add.sprite(PositionData.tapRightArrowPositionX - FloatingFutbol.logicWidth/4, PositionData.tapRightArrowPositionY, 'how-to-tap-arrows-atlas');
    	this.tapRightArrow.frameName = "tap-arrow-left.png";
    	this.tapRightArrow.anchor.setTo(.5,.5);
    	this.tapRightArrow.scale.x *= -1;
    	
    	this.tapLeftArrow = this.game.add.sprite(PositionData.tapLeftArrowPositionX + FloatingFutbol.logicWidth/4, PositionData.tapLeftArrowPositionY, 'how-to-tap-arrows-atlas');
    	this.tapLeftArrow.frameName = "tap-arrow-left.png";
    	
        // next and back buttons
        this.tapLeftArrowText = this.game.add.sprite(PositionData.tapLeftArrowTextPositionX - FloatingFutbol.logicWidth/4, PositionData.tapLeftArrowTextPositionY, 'how-to-tap-arrows-atlas');
        this.tapLeftArrowText.frameName = lang + ".png";    	
        
        this.tapRightArrowText = this.game.add.sprite(PositionData.tapRightArrowTextPositionX + FloatingFutbol.logicWidth/4, PositionData.tapRightArrowTextPositionY, 'how-to-tap-arrows-atlas');
        this.tapRightArrowText.frameName = lang + ".png";
        
        // add the intro text
        this.instructionsText = this.game.add.sprite(PositionData.instructionsTextPositionX - FloatingFutbol.logicWidth/2, PositionData.instructionsTextPositionY, 'how-to-instructions-atlas');
        this.instructionsText.frameName = lang + "-instructions.png";  
        this.instructionsText.anchor.setTo(0.5, 0);
    },
    // ==========================================================
	// CHANGE THE BUTTONS TO THE CORRECT LANGUAGE
	// ==========================================================
	changeButtonsToCurrentLanguage: function(nextText, backText)
	{
		// change the back button
		this.backButton = this.add.button(PositionData.backButtonPositionX - 250, PositionData.backButtonPositionY, 'how-to-buttons-atlas', this.transitionOutAnimation, this);
		this.backButton.eventType = "back";
		this.backButton.setFrames("how-to-back-button-over.png", "how-to-back-button-up.png");
		this.backButton.inputEnabled = true;
		this.backButton.input.useHandCursor = true;
        
		this.backButtonText = this.game.add.sprite(PositionData.backButtonTextPositionX - 250, PositionData.backButtonTextPositionY, "how-to-buttons-atlas");
		this.backButtonText.frameName = backText;
        
        // change the next button
		this.nextButton = this.add.button(PositionData.nextButtonPositionX + 250, PositionData.nextButtonPositionY, 'how-to-buttons-atlas', this.transitionOutAnimation, this);
		this.nextButton.eventType = "next";
		this.nextButton.setFrames("how-to-next-button-over.png", "how-to-next-button-up.png");
		this.nextButton.inputEnabled = true;
		this.nextButton.input.useHandCursor = true;
        
		this.nextButtonText = this.game.add.sprite(PositionData.nextButtonTextPositionX + 250, PositionData.nextButtonTextPositionY, "how-to-buttons-atlas");
		this.nextButtonText.frameName = nextText;
	},
	// ==========================================================
	// TRANSITION IN ANIMATION
	// ==========================================================
    transitionInAnimation: function()
    {
    	// set all to alpha 0
    	this.tweetyFly.alpha = 0;	//= this.tweetyBall.alpha = 0; 
    	this.finger.alpha		= this.instructionsText.alpha = 0;
    	this.tapRightArrow.alpha = this.tapLeftArrow.alpha = this.tapRightArrowText.alpha = this.tapLeftArrowText.alpha = 0; 
    	this.nextButton.alpha = this.backButton.alpha = this.nextButtonText.alpha = this.backButtonText.alpha = 0;
    	this.screenBG.alpha = 0;
        
        // screen graphics
    	var moving = 30;
    	if(FloatingFutbol.screen == "iPad") {
    		moving = 120;
    	}

    	this.game.add.tween(this.tweetyFly).to({y: PositionData.tweetyFlyPositionY, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 500, false).onComplete.addOnce(
				   function()
				   { 
				   	  this.tweetyFly.animations.play('flapping', 24, true);
				   }, this);
    	
    	this.game.add.tween(this.nextButton).to({x: PositionData.nextButtonPositionX, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 1100, false);
    	this.game.add.tween(this.backButton).to({x: PositionData.backButtonPositionX, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 1100, false);
        this.game.add.tween(this.nextButtonText).to({x: PositionData.nextButtonTextPositionX, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 1100, false);
        this.game.add.tween(this.backButtonText).to({x: PositionData.backButtonTextPositionX, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 1100, false);
        
        this.game.add.tween(this.finger).to({y: PositionData.fingerPositionY, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 500, false).onComplete.addOnce(
				  function()
				  { 
					  this.finger.animations.play('tapping', 24, true);
				  }, this);
		if(FloatingFutbol.screen == "iPad")
		{
        	this.game.add.tween(this.tapLeftArrow).to({x: PositionData.tapLeftArrowPositionX, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 0, false);
        	this.game.add.tween(this.tapRightArrow).to({x: PositionData.tapRightArrowPositionX, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 0, false);
        	this.game.add.tween(this.tapLeftArrowText).to({x: PositionData.tapLeftArrowTextPositionX, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 0, false);
        	this.game.add.tween(this.instructionsText).to({x: PositionData.instructionsTextPositionX, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 800, false);
        }
        else
        {
        	this.game.add.tween(this.tapLeftArrow).to({x: PositionData.tapLeftArrowPositionX - 5, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 0, false);
        	this.game.add.tween(this.tapRightArrow).to({x: PositionData.tapRightArrowPositionX - 5, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 0, false);
        	this.game.add.tween(this.tapLeftArrowText).to({x: PositionData.tapLeftArrowTextPositionX, y: PositionData.tapLeftArrowTextPositionY - 1, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 0, false);
        	this.game.add.tween(this.instructionsText).to({x: PositionData.instructionsTextPositionX, y: PositionData.instructionsTextPositionY - 4, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 800, false);
        }
        
        this.game.add.tween(this.screenBG ).to({alpha: 1}, 800, Phaser.Easing.Linear.Out, true, 0, false);
        this.game.add.tween(this.tapRightArrowText).to({x: PositionData.tapRightArrowTextPositionX, alpha:1}, this.transitionInTime, Phaser.Easing.Quintic.Out, true, 0, false);
        
    	
    },
    // ==========================================================
	// TRANSITION OUT ANIMATION
	// ==========================================================
    transitionOutAnimation: function(e)
    {
    	if (soundEnabled) {
    		rolloverMusic.play('', 0, 1, false);
    	}
    	
    	this.tweetyFly.animations.stop();
    	
    	this.game.add.tween(logo).to({x: PositionData.logoPositionX - FloatingFutbol.logicWidth/2}, this.transitionInTime + 100, Phaser.Easing.Quintic.In, true, 0, false);
    	this.game.add.tween(this.tweetyFly).to({y: -200, alpha:0}, this.transitionInTime + 50, Phaser.Easing.Quintic.In, true, 0, false);
        
        this.game.add.tween(this.nextButton).to({x: FloatingFutbol.logicWidth + 250, alpha:0}, this.transitionInTime, Phaser.Easing.Quintic.In, true, 0, false);
        this.game.add.tween(this.backButton).to({x: -250, alpha:0}, this.transitionInTime, Phaser.Easing.Quintic.In, true, 0, false);
        this.game.add.tween(this.nextButtonText).to({x: FloatingFutbol.logicWidth + 250, alpha:0}, this.transitionInTime, Phaser.Easing.Quintic.In, true, 0, false);
        this.game.add.tween(this.backButtonText).to({x: -250, alpha:0}, this.transitionInTime, Phaser.Easing.Quintic.In, true, 0, false);
        
        this.game.add.tween(this.finger).to({y: PositionData.fingerPositionY + FloatingFutbol.logicHeight, alpha:0}, this.transitionInTime, Phaser.Easing.Quintic.In, true, 200, false);
        this.game.add.tween(this.tapLeftArrow).to({x: PositionData.tapLeftArrowPositionX + FloatingFutbol.logicWidth/4, alpha:0}, this.transitionInTime, Phaser.Easing.Quintic.In, true, 0, false);
        this.game.add.tween(this.tapRightArrow).to({x: PositionData.tapRightArrowPositionX - FloatingFutbol.logicWidth/4, alpha:0}, this.transitionInTime, Phaser.Easing.Quintic.In, true, 0, false);
        this.game.add.tween(this.tapLeftArrowText).to({x: PositionData.tapLeftArrowTextPositionX - FloatingFutbol.logicWidth/4, alpha:0}, this.transitionInTime, Phaser.Easing.Quintic.In, true, 0, false);
        this.game.add.tween(this.tapRightArrowText).to({x: PositionData.tapRightArrowTextPositionX + FloatingFutbol.logicWidth/4, alpha:0}, this.transitionInTime, Phaser.Easing.Quintic.In, true, 0, false);
        
        this.game.add.tween(this.screenBG ).to({alpha: 0}, 500, Phaser.Easing.Linear.In, true, 900, false);
        this.game.add.tween(this.instructionsText).to({alpha:0}, this.transitionInTime + 100, Phaser.Easing.Quintic.In, true, 0, false);
        this.game.add.tween(this.instructionsText).to({x: PositionData.instructionsTextPositionX - FloatingFutbol.logicWidth/2}, 
        												this.transitionInTime + 300, Phaser.Easing.Quintic.In, true, 0, false).onComplete.addOnce(
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
		
		if (this.finger) {
			this.finger.destroy();
			this.finger = null;
		}
		if (this.tapLeftArrow) {
			this.tapLeftArrow.destroy();
			this.tapLeftArrow = null;
		}
		if (this.tapLeftArrowText) {
			this.tapLeftArrowText.destroy();
			this.tapLeftArrowText = null;
		}
		if (this.tapRightArrow) {
			this.tapRightArrow.destroy();
			this.tapRightArrow = null;
		}
		if (this.tapRightArrowText) {
			this.tapRightArrowText.destroy();
			this.tapRightArrowText = null;
		}
		if (this.instructionsText) {
			this.instructionsText.destroy();
			this.instructionsText = null;
		}
		
		if (this.nextButtonText) {
			this.nextButtonText.destroy();
			this.nextButtonText = null;
		}
		if (this.backButtonText) {
			this.backButtonText.destroy();
			this.backButtonText = null;
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
		this.game.cache.removeImage("how-to-tap-arrows-atlas");
		this.game.cache.removeImage("how-to-instructions-atlas");
		this.game.cache.removeImage("how-to-buttons-atlas");
		
		this.game.cache.removeImage("how-to-tweety-spritesheet");
		this.game.cache.removeImage("finger-tap-atlas");
		
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