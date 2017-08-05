FloatingFutbol.MainMenu = function(game) 
{
	// vars that need to be stored between states
	this.menuItemTextArray 		= [];  					// used by setLanguage() to reset language colors
	this.currentLangButtonOver	= 'english-over.png';
	this.currentPlayButton		= 'play-buttons-english.png';
	
	// bg graphics
	logo = this.startBG = this.menuGradient = null;
	this.playButton = this.playButtonText = this.goal = this.tweety = null; 
	this.playButtonTweenHover = this.playButtonTweenOut = null;
	this.playButtonTweenTextHover = this.playButtonTweenTextOut = null;
};

FloatingFutbol.MainMenu.prototype = 
{
    create: function() 
    {
    	// the clients wants the pause effect for the game back after preloader
    	game.stage.disableVisibilityChange = false;
    	
    	this.createBackgroundImages();
    	this.createLanguageMenu();
        this.createPlayButton();
        this.transitionInAnimation();
    },
    //==========================================================
	// ADD ALL BACKGROUND IMAGES TO SCREEN
	//==========================================================
    createBackgroundImages: function()
    {
    	this.startBG	 	= this.game.add.sprite(0, 0, 'preloader-bg');
        this.menuGradient 	= this.game.add.image(0, FloatingFutbol.logicHeight - PositionData.menuGradientY, 'main-menu-bottom-gradient');
       	this.goal 			= this.game.add.sprite(PositionData.goalPositionX + FloatingFutbol.logicWidth, PositionData.goalPositionY, 'main-menu-goal');
       	this.tweety 		= this.game.add.sprite(PositionData.tweetyPositionX + FloatingFutbol.logicWidth, PositionData.tweetyPositionY, 'main-menu-tweety');
       	this.footer 		= this.game.add.sprite(FloatingFutbol.logicWidth, FloatingFutbol.logicHeight, 'main-menu-footer');
       	this.footer.anchor.setTo(1, 1);
        logo 				= this.game.add.sprite(PositionData.logoPositionX - FloatingFutbol.logicWidth, PositionData.logoPositionY, currentLogo);
        
        soundButton			= this.game.add.button(PositionData.soundX, PositionData.soundY, 'main-menu-sound', this.toggleSound, this);
        soundButton.anchor.setTo(1, 0);
        soundButton.inputEnabled = true;
        soundButton.input.useHandCursor = true;
        if(soundEnabled) {
        	soundButton.setFrames(1, 0, 1, 0);
        } else {
        	soundButton.setFrames(2, 2, 2, 2);
        }
        
        this.goal.scale.x 	= .5;
        this.goal.scale.y 	= .5;
        this.goal.alpha 	= 0;  
    },
    //==========================================================
	// CREATE THE LANGUAGE MENU USING AN ATLAS AND JSON FILE
	//==========================================================
    createLanguageMenu: function()
    {
    	// store sprite name in JSON so we can look it up with our Atlas
    	var menuItemUp = ['english-up.png', 'espanol-up.png', 'castellano-up.png', 'italian-up.png', 
    					  'polish-up.png', 'turkce-accent-up.png', 'francais-up.png', 'german-up.png'];
    					  
    	var menuItemOver = ['english-over.png', 'espanol-over.png', 'castellano-over.png', 'italian-over.png', 
    						'polish-over.png', 'turkce-accent-over.png', 'francais-over.png', 'german-over.png'];
    	
    	for(var i=0; i<8; i++) 
    	{
	    	// create the button
	        var lang = this.add.button(PositionData.languagePosX[i], PositionData.languagePosY[i], 'main-menu-languages-atlas', this.setLanguage, this);
	    	lang.setFrames(menuItemOver[i], menuItemUp[i]);
	    	lang.upState = menuItemUp[i];
	    	lang.overState = menuItemOver[i];
	    	lang.inputEnabled = true;
	        lang.input.useHandCursor = true;
	        
	        // checks what button is currently selected so we can disable it and show it in the selected/over state
	        // if this is the first run of the main menu, the default is English = 'english-over.png'
	        if (menuItemOver[i] === this.currentLangButtonOver)
	        {
	        	lang.freezeFrames = true;
				lang.frameName = menuItemOver[i];
	        }
	        	
	        // store and tween in
        	this.menuItemTextArray.push(lang);
        	this.game.add.tween(lang).to({y: "-1000"}, (i*200)+400, Phaser.Easing.Quintic.Out, true, 0, false);
    	}
    },   
    //==========================================================
	// CREATE THE PLAY BUTTON
	//==========================================================
    createPlayButton: function()
    {
    	this.playButton = this.add.button(PositionData.playButtonPositionX - 200, PositionData.playButtonPositionY, 'main-menu-play-btns-atlas', this.transitionOutAnimation, this);
    	this.playButton.setFrames("play-buttons-over.png", "play-buttons-up.png");
    	this.playButton.inputEnabled = true;
    	this.playButton.input.useHandCursor = true;
    	this.playButton.alpha = .2;
		
    	this.playButton.events.onInputOver.add(this.playButtonOver, this);
    	this.playButton.events.onInputOut.add(this.playButtonOut, this);
         
    	this.playButtonText = this.add.sprite(PositionData.playButtonPositionX - 200, PositionData.playButtonPositionY, 'main-menu-play-btns-atlas');
    	this.playButtonText.frameName = this.currentPlayButton;
    	
    	this.playButtonTweenHover = this.add.tween(this.playButton);
    	this.playButtonTweenHover.to({ y: PositionData.playButtonPositionY - 5 }, 150, Phaser.Easing.Linear.None);
    	this.playButtonTweenTextHover = this.add.tween(this.playButtonText);
    	this.playButtonTweenTextHover.to({ y: PositionData.playButtonPositionY - 5 }, 150, Phaser.Easing.Linear.None);
    	
    	this.playButtonTweenOut = this.add.tween(this.playButton);
    	this.playButtonTweenOut.to({ y: PositionData.playButtonPositionY }, 150, Phaser.Easing.Linear.None);
    	this.playButtonTweenTextOut = this.add.tween(this.playButtonText);
    	this.playButtonTweenTextOut.to({ y: PositionData.playButtonPositionY }, 150, Phaser.Easing.Linear.None);
    	
    },
    playButtonOver: function()
    {
    	this.playButtonTweenHover.start();
    	this.playButtonTweenTextHover.start();    	
    },
    playButtonOut: function()
    {
    	this.playButtonTweenOut.start();
    	this.playButtonTweenTextOut.start();
    },
    //==========================================================
	// TRANSITION ANIMATIONS FOR IN AND OUT OF MAIN MENU
	//==========================================================
    transitionInAnimation: function()
    {
    	this.startBG.alpha = this.menuGradient.alpha = 0;
    	
    	this.game.add.tween(this.menuGradient).to({alpha:1}, 800, Phaser.Easing.Linear.None, true, 0, false);
    	this.game.add.tween(this.startBG).to({alpha:1}, 800, Phaser.Easing.Linear.None, true, 0, false);
    	this.game.add.tween(logo).to({x: PositionData.logoPositionX}, 1400, Phaser.Easing.Quintic.Out, true, 0, false);
    	this.game.add.tween(this.tweety).to({x: PositionData.tweetyPositionX}, 1000, Phaser.Easing.Quintic.Out, true, 0, false);
    	this.game.add.tween(this.playButton).to({x: PositionData.playButtonPositionX, alpha:1}, 500, Phaser.Easing.Quintic.Out, true, 0, false);
    	this.game.add.tween(this.playButtonText).to({x: PositionData.playButtonPositionX, alpha:1}, 500, Phaser.Easing.Quintic.Out, true, 0, false);
        this.game.add.tween(this.goal).to({x: PositionData.goalPositionX, alpha:1}, 1200, Phaser.Easing.Quintic.Out, true, 0, false);
        this.game.add.tween(this.goal.scale).to({x: 1, y:1}, 1600, Phaser.Easing.Quintic.Out, true, 0, false);     
    },
    transitionOutAnimation: function()
    {
    	if (soundEnabled) {
    		rolloverMusic.play('', 0, 1, false);
    	}
    	
    	this.game.add.tween(logo).to({x: PositionData.logoPositionX - FloatingFutbol.logicWidth}, 800, Phaser.Easing.Back.In, true, 0, false);
    	this.game.add.tween(this.tweety).to({x: FloatingFutbol.logicWidth},800, Phaser.Easing.Back.In, true, 0, false);
        this.game.add.tween(this.playButton).to({alpha:0}, 400, Phaser.Easing.Quintic.Out, true, 0, false);
    	this.game.add.tween(this.playButtonText).to({alpha:0}, 400, Phaser.Easing.Quintic.Out, true, 0, false);        
        this.game.add.tween(this.goal).to({x: FloatingFutbol.logicWidth, alpha:0}, 1800, Phaser.Easing.Back.Out, true, 0, false);
    	this.game.add.tween(this.menuGradient).to({alpha:0}, 800, Phaser.Easing.Linear.Out, true, 600, false);
        this.game.add.tween(this.startBG).to({alpha:0}, 800, Phaser.Easing.Linear.Out, true, 600, false);
        this.game.add.tween(this.goal.scale).to({x: .5, y:.5}, 1400, Phaser.Easing.Back.Out, true, 0, false).onComplete.addOnce(function()

    	{
    		this.shutDown();
    	}, this);
        
        // add delayed slide off for each item in the language menu
        for (var i = this.menuItemTextArray.length - 1; i >= 0; i--) 
        	this.game.add.tween(this.menuItemTextArray[i]).to({alpha:0}, 500, Phaser.Easing.Linear.Out, true, 0, false);
    },
    
    //=================================================================
	// SET THE MENU COLOR, PLAY BUTTON TEXT, AND LOGO TO THE CORRECT 
	// LANGUAGE WHEN THE USER CLICKS ON A LANGUAGE 
	//=================================================================
    setLanguage: function (lang) 
    {
    	// reset all menu item colors to white first
    	this.resetMenuItems();
    	
    	// temp disable the clicked button so it stays in over state
		lang.freezeFrames = true;
		lang.frameName = lang.overState;
		this.currentLangButtonOver = lang.overState;
		
		if (soundEnabled) {
    		rolloverMusic.play('', 0, 1, false);
    	}
    	
    	
		// update rest of screen
    	switch(lang.frameName)
    	{
    		case "english-over.png":
	    	default:
	    		if (currentLanguage != "ENGLISH")
	    		{
		    		currentLanguage = "ENGLISH";
		    		currentLogo = 'eng-logo';
		    		this.changePlayButtonToCurrentLanguage("play-buttons-english.png");
		    		this.destroyLogoAndRecreateForLanguage(currentLogo);
		    	}
		    	break;
	    	case "espanol-over.png":	
	    		if (currentLanguage != "ESPAÑOL")
	    		{
	    			currentLanguage = "ESPAÑOL";
	    			currentLogo = 'esp-logo';
	    			this.changePlayButtonToCurrentLanguage("play-buttons-castellano-spanish.png");
	    			this.destroyLogoAndRecreateForLanguage(currentLogo);
	    		}
	    		break;
	    	case "castellano-over.png":	
	    		if (currentLanguage != "CASTELLANO")
	    		{
		    		currentLanguage = "CASTELLANO";
		    		currentLogo = 'cast-logo';
		    		this.changePlayButtonToCurrentLanguage("play-buttons-castellano-spanish.png");
		    		this.destroyLogoAndRecreateForLanguage(currentLogo);
	    		}
	    		break;
	    	case "italian-over.png":
	    		if (currentLanguage != "ITALIANO")
	    		{	
		    		currentLanguage = "ITALIANO";
		    		currentLogo = 'italian-logo';
		    		this.changePlayButtonToCurrentLanguage("play-buttons-italian.png");
		    		this.destroyLogoAndRecreateForLanguage(currentLogo);
	    		}
	    		break;
	    	case "polish-over.png":
	    		if (currentLanguage != "POLSKI")
	    		{	
		    		currentLanguage = "POLSKI";
		    		currentLogo = 'polish-logo';
		    		this.changePlayButtonToCurrentLanguage("play-buttons-polish.png");
		    		this.destroyLogoAndRecreateForLanguage(currentLogo);
		    	}
	    		break;
	    	case "turkce-accent-over.png":
	    		if (currentLanguage != "TÜRKÇE")
	    		{	
		    		currentLanguage = "TÜRKÇE";
		    		currentLogo = 'turk-logo';
		    		this.changePlayButtonToCurrentLanguage("play-buttons-turk.png");
		    		this.destroyLogoAndRecreateForLanguage(currentLogo);
	    		}
	    		break;
	    	case "francais-over.png":	
	    		if (currentLanguage != "FRANÇAIS")
	    		{
		    		currentLanguage = "FRANÇAIS";
		    		currentLogo = 'french-logo';
		    		this.changePlayButtonToCurrentLanguage("play-buttons-french.png");
		    		this.destroyLogoAndRecreateForLanguage(currentLogo);
	    		}
	    		break;
	    	case "german-over.png":
	    		if (currentLanguage != "DEUTSCH")
	    		{	
		    		currentLanguage = "DEUTSCH";
		    		currentLogo = 'german-logo';
		    		this.changePlayButtonToCurrentLanguage("play-buttons-german.png");
		    		this.destroyLogoAndRecreateForLanguage(currentLogo);
	    		}
	    		break;
    	}
    },
    //==========================================================
	//RESET MENU TEXT ITEMS TO WHITE IF NOT THE CURRENT LANGUAGE
	//==========================================================
	resetMenuItems: function()
	{
		for (var i = 0; i < this.menuItemTextArray.length; i++) 
		{	
			this.menuItemTextArray[i].frameName = this.menuItemTextArray[i].upState;
			this.menuItemTextArray[i].freezeFrames = false;
		} 
	},
	// ==========================================================
	// CHANGE THE PLAY BUTTON WHEN USER SELECTS A LANGUAGE
	// ==========================================================
	changePlayButtonToCurrentLanguage: function(name)
	{
		this.currentPlayButton = name;
		this.playButtonText.frameName = name;
	},
	// ==========================================================
	// REMOVE THE CURRENTLY DISPLAYED LOGO AND REPLACE WITH 
	// SELECTED LANGUAGE 
	// ==========================================================
	destroyLogoAndRecreateForLanguage: function(logoName)
	{
		logo.destroy();
		logo = this.game.add.sprite(PositionData.logoPositionX - FloatingFutbol.logicWidth/2, PositionData.logoPositionY, logoName);
		this.add.tween(logo).to({x: PositionData.logoPositionX}, 1000, Phaser.Easing.Quintic.Out, true, 0, false);
	},
	//===============================================================
	// SHUT DOWN THE LEVEL AND CLEAN UP THE TWEENS AND OTHER ITEMS
	//===============================================================
	shutDown: function (pointer) 
	{
		//destroy sprites
		if (logo) {
			logo.destroy();
			logo = null;
        }
		
        if (this.startBG) {
            this.startBG.destroy();
            this.startBG = null;
        }
        if (this.menuGradient) {
            this.menuGradient.destroy();
            this.menuGradient = null;
        }
        if (this.howToBG) {
            this.howToBG.destroy();
            this.howToBG = null;
        }
        if (this.playButtonText) {
            this.playButtonText.destroy();
            this.playButtonText = null;
        }
		if (this.goal) {
            this.goal.destroy();
            this.goal = null;
        }
		if (this.tweety) {
            this.tweety.destroy();
            this.tweety = null;
        }
		
		//destroy buttons
		for (var i = this.menuItemTextArray.length - 1; i >= 0; i--) {
			this.menuItemTextArray[i].kill();
		}
		
		if (this.playButton) {
			this.playButton.kill();
			this.playButton = null;
		}
		
		if (soundButton) {
			soundButton.kill();
			soundButton = null;
		}
		
		
		// empty tweens and arrays
		this.tweens = [];
		this.menuItemTextArray = [];
		
		// after cleaning, go to next state
		this.loadNextState();
    },
    //==========================================================
	// MOVE TO THE NEXT STATE (HowTo screen)
	//==========================================================
    loadNextState: function () 
    {
    	if(FloatingFutbol.screen == 'desktop') {
    		this.game.state.start('Howto');
    	} else if(FloatingFutbol.screen == 'iPhone') { 
    		this.game.state.start('HowtoMobile');
    	} else if(FloatingFutbol.screen == 'iPad') { 
    		this.game.state.start('Howto');
    	}
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