FloatingFutbol.Play = function(game) 
{	
	langText = "english";
	debugPolygons = false;
	
	// background items
	this.gameBg = this.cloud1 = this.cloud2 = null;
	this.backgroundPosition = 0;
	this.gameSky = this.timeline = null;
	this.levelIndicator = null;
		
	// game over popup items
	this.gameOverScreen = this.gameOverText = this.buttonRestart = this.buttonRestartText = null;
	
	// congrat popup items
	this.congratScreen = this.congratText = this.congratPass1Text = this.congratPass2Text = null;
	this.buttonDownload = this.buttonDownloadText = this.buttonNext = this.buttonNextText = null;
	this.coloringArt = this.happyTweety = null;
	
	// game playing items
	this.player = this.ball = null;
	this.scoreLabel = this.scoreText = null;
	this.goal = null;
	this.greatJobIcon = null;
	
	// tweety states
	this.flappingState = this.glidingState = this.determinedState = this.collisionState = null;
	
	// game state
	this.runOnce = this.playing = this.gameOver = this.displayGoal = this.touchGoal = false;
	
	// playing variables
	this.score = 0;
	this.level = 1;
	levelPoints = [10, 20, 9999];
	
	// manage characters
	listCharacter = ['playing-bunny-spritesheet', 'playing-bugs-spritesheet', 'playing-gossamer', 'playing-taz-spritesheet', 'playing-daffy', 'playing-lola'];
	listCharacterMoving = [0, 0, 0, 0, 0, 0, 0];
	listCharacterTween = [0, 0, 0, 0, 0, 0, 0];
	lastCharcter = -1;
	characterInRow = 0;
	startRandom = 0;
	endRandom = 5;	
	
	// character groups
	this.playerCollisionGroup = this.charactersCollisionGroup = this.goalCollisionGroup = null;
	this.characterGroup = null;
	
	// tweens
	this.startTween = null;
	this.ballTween = null;
	this.gossamerTween = null;
	this.daffyTween = null;
	this.lolaTween = null;
}
FloatingFutbol.Play.prototype = 
{
	testFunction: function()
	{
		alert("FloatingFutbol.Play.prototype.testFunction: NOT OVERRIDDEN YET");
	},
	create: function() 
	{
		this.setLanguageText();	
		this.createBackgroundImages();
		this.startGamePhysics();
		this.createCollisionGroups();		
		this.createPlayerAndAnimationStates();
		this.addFloatingBallToTweetysHead();
		this.displayLogoForCurrentLanguage();
		this.createScoringText();
		this.startCountdown();
	    		
		this.startTween = this.game.add.tween(this.player);
		this.startTween.to({x: PositionData.playTweetyX}, 3000, Phaser.Easing.Linear.None, true, 0, false);
		this.startTween.onComplete.addOnce(function(){
			this.startTween.onComplete.removeAll();
            this.startTween.stop();
            this.startTween = null;
			
			// START PLAYER PHYSICS
			game.physics.p2.enable([this.player], debugPolygons);
			
			// change player animation
			this.player.animations.play('flapping', 30, true);
			
			this.player.scale.x = 1;
			this.player.scale.y = 1;
			
			// add player physics data polygons
			this.player.body.clearShapes();
			this.player.body.loadPolygon('physicsData', 'playing-tweety-polygon');
			this.player.body.fixedRotation = true;
			this.player.body.collideWorldBounds = true;
			this.player.body.setCollisionGroup(this.playerCollisionGroup);
			this.player.body.collides(this.charactersCollisionGroup, this.hitCharacters, this);
			this.player.body.collides(this.goalCollisionGroup, this.hitGoal, this);
			
			// add characters
			this.createCharacterGroups();
			this.createCharacterTweens();
			
			// add score
			this.showScoreLabel();
			
			// set playing status
			this.playing = true;
			
			// set device type input
			this.setDeviceTypeInputMethod();
			
			/*
			// remake the ball			
			this.player.removeChild(this.ball);
			var ballX = this.player.x + this.ball.x;
			var ballY = this.player.y + this.ball.y;
			
			// remove the tween for ball
            this.ballTween.stop();
            this.ballTween = null;
            
            // destroy and remake new ball
			this.ball.destroy();
			*/
			var ballX = this.player.x + PositionData.playTweetyBallX;
			var ballY = this.player.y - PositionData.playBallStartPosY;
			ballMovingUp = 0;
			
			this.ball = this.add.sprite(ballX, ballY, 'ball');
			this.ball.anchor.setTo(0.5, 0.5);
			this.ball.scale.x = .8;
			this.ball.scale.y = .8;
			if(FloatingFutbol.screen == "iPad"){
				this.ball.scale.x = .7;
				this.ball.scale.y = .7;
			}  
			
			logo.bringToTop();			
		}, this);
	},
	//==========================================================
	// CREATE THE GROUPS OF CHARACTERS WITH THEIR PHYSICS DATA
	//==========================================================
	createCharacterGroups: function()
	{
		for(var i=0; i<6; i++) 
		{
			switch(i)
			{
				case 0:
					var m = this.characterGroup.create(FloatingFutbol.logicWidth + PositionData.BunnySpriteWidth/2, PositionData.BunnySpriteHeight/2 - 1, listCharacter[0]);
					break;
				case 1:
					var m = this.characterGroup.create(FloatingFutbol.logicWidth + PositionData.BugsSpriteWidth/2, PositionData.BugsSpriteHeight/2 - 1, listCharacter[1]);
					break;
				case 2:
					var m = this.characterGroup.create(FloatingFutbol.logicWidth + PositionData.GossamerSpriteWidth/2, 0 - 1, listCharacter[2]);
					break;
				case 3:
					var m = this.characterGroup.create(FloatingFutbol.logicWidth + PositionData.TazSpriteWidth/2, FloatingFutbol.logicHeight - PositionData.TazSpriteHeight/2 + 1, listCharacter[3]);
					break;
				case 4:
					var m = this.characterGroup.create(FloatingFutbol.logicWidth + PositionData.DaffySpriteWidth/2, FloatingFutbol.logicHeight + 1, listCharacter[4]);
					break;
				case 5:
					var m = this.characterGroup.create(FloatingFutbol.logicWidth + PositionData.LolaSpriteWidth/2 + PositionData.LolaSpriteWidth/5, FloatingFutbol.logicHeight + 1, listCharacter[5]);
					break;
			}
			listCharacterMoving[i] = 0;
			listCharacterTween[i] = 0;
			
			m.anchor.setTo(0.5, 0.5);
			m.body.clearShapes();
			m.body.loadPolygon('physicsData', listCharacter[i]);
			
			if(i==5) {
				m.body.angle = -30;
			}
			m.body.setCollisionGroup(this.charactersCollisionGroup);
			m.body.collides([this.playerCollisionGroup]);
			
			m.body.collideWorldBounds = false;
			m.body.data.gravityScale = 0.0;
			m.body.kinematic = true;
			m.body.debug = debugPolygons;
			
			if(FloatingFutbol.screen != 'iPad') {
				m.animations.add('run');
			}
							
		}
	},
	//==========================================================
	// CREATE TWEENS ON THE CHARACTERS THAT WE CAN CALL LATER
	//==========================================================
	createCharacterTweens: function()
	{
		this.gossamerTween = this.add.tween(this.characterGroup.children[2].body);
		this.gossamerTween.to({ y: PositionData.GossamerSpriteHeight/2 }, 1300, Phaser.Easing.Quintic.Out);
		
		this.daffyTween = this.add.tween(this.characterGroup.children[4].body);
		this.daffyTween.to({ y: FloatingFutbol.logicHeight - PositionData.DaffySpriteHeight/2 }, 1300, Phaser.Easing.Quintic.Out);
		
		this.lolaTween = this.add.tween(this.characterGroup.children[5].body);
		this.lolaTween.to({ y: FloatingFutbol.logicHeight - PositionData.LolaSpriteHeight/2, angle: 0 }, 1300, Phaser.Easing.Quintic.Out);
	},
	//==========================================================
	// SHOW SCORE LABEL TEXT
	//==========================================================
	showScoreLabel: function()
	{
		if(this.scoreLabel) {
			this.scoreLabel.alpha = 1;
		}
		this.scoreText.alpha = 1;
	},
	//==========================================================
	// SET UP THE INPUT METHOD, EITHER TAP OR SPACE BAR CLICK
	//==========================================================
	setDeviceTypeInputMethod: function()
	{
		if(this.game.device.desktop) 
		{
			// setup keyboard
			spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			spaceKey.onDown.add(this.jump, this); 
		} else {
			//this.input.addPointer();
			game.input.onDown.add(this.touchInput, this);

		}
	},
	touchInput: function()
	{
		this.jump();
	},
    //==========================================================
	// SET LANGUAGE TEXT
	//==========================================================
    setLanguageText: function()
    {
    	var langs = ["ENGLISH", "CASTELLANO", "ESPAÑOL", "FRANÇAIS", "ITALIANO", "DEUTSCH", "TÜRKÇE", "POLSKI"];
		var langsText = ["english", "castillian", "spanish", "french", "italian", "german", "turk", "polish"];
		for (var i=0; i< langs.length; i++) {
			if(currentLanguage == langs[i]) {
				langText = langsText[i];
				break;
			}
		}
    },
	//==========================================================
	// ADD ALL BACKGROUND IMAGES TO SCREEN
	//==========================================================
	createBackgroundImages: function()
    {		
    	// TODO: GET POSITION DATA FROM POSITIONDATA.JSON
		if(FloatingFutbol.screen == 'iPhone') {
			this.gameSky = this.add.sprite(0, 0, 'playing-game-sky');
			this.gameBg = this.add.sprite(0, 130, 'playing-game-bg');
			this.cloud1 = this.add.sprite(200, 0, 'cloud1');
			this.cloud2 = this.add.sprite(450, 20, 'cloud2');			
        } else if(FloatingFutbol.screen == 'iPad') {
        	this.gameSky = this.add.sprite(0, 0, 'playing-game-sky');
        	this.gameBg = this.add.sprite(0, 500, 'playing-game-bg');
        	this.cloud1 = this.add.sprite(1000, 40, 'cloud1');
        	this.cloud2 = this.add.sprite(1750, 140, 'cloud2');
        } else {
        	this.gameSky = this.add.sprite(0, 0, 'playing-game-sky');
        	this.gameBg = this.add.sprite(0, 300, 'playing-game-bg');
        	this.cloud1 = this.add.sprite(400, 0, 'cloud1');
        	this.cloud2 = this.add.sprite(700, 80, 'cloud2');
        }
				        		
		this.greatJobIcon = this.add.sprite(FloatingFutbol.logicWidth, FloatingFutbol.logicHeight, 'great-job');
				
		music.stop();
		music = game.add.sound('background-music');		
		if (soundEnabled) {
			music.play('', 0, 0.5, true, false);
    	}
		music.volume = 0;
	},
	// ==========================================================
	// GAME OVER SCREEN
	// ==========================================================
	createGameOverItems: function()
	{
		this.gameOverScreen = this.add.sprite(0, 0, 'screen-gameover');
		this.gameOverScreen.alpha = 0;
		
		this.buttonRestart = this.add.button(FloatingFutbol.logicWidth/2, FloatingFutbol.logicHeight*2 , 'playing-win-screen-btns-atlas', this.restartGame, this);
		this.buttonRestart.setFrames("play-again-button-over.png", "play-again-button-up.png");
		this.buttonRestart.alpha = 0;
		this.buttonRestart.anchor.setTo(0.5, 0.5);
		//this.buttonRestart.input.useHandCursor = true;
		
		this.buttonRestartText = this.add.sprite(FloatingFutbol.logicWidth/2, FloatingFutbol.logicHeight*2 , 'playing-win-screen-btns-atlas');
		this.buttonRestartText.frameName = "play-again-" + langText + "-up.png";
		this.buttonRestartText.alpha = 0;
		this.buttonRestartText.anchor.setTo(0.5, 0.5);
		
		this.gameOverText = this.game.add.sprite(FloatingFutbol.logicWidth/2, FloatingFutbol.logicHeight*2, 'playing-text-atlas');
		this.gameOverText.frameName = "lose-" + langText + ".png";
		this.gameOverText.alpha = 0;
		this.gameOverText.anchor.setTo(0.5, 0.5);
	},
	// ================================================
	// DISPLAY GAME OVER SCREEN
	// ================================================
	gameOverTransitionInAnimation: function() {
		// play sound
		if (soundEnabled) {
			loseMusic.play('', 0, 1, false);
    	}
		
    	// bring elements to top    	
    	this.gameOverScreen.bringToTop();
    	this.buttonRestart.bringToTop();
    	this.buttonRestartText.bringToTop();
    	this.gameOverText.bringToTop();
    	
    	// set the mouse to pointer
    	this.buttonRestart.input.useHandCursor = true;
    	
    	// tween for game over popup
		this.game.add.tween(this.gameOverScreen).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, false);
		
		this.buttonRestart.y = PositionData.playRestartButtonY; 
		this.game.add.tween(this.buttonRestart).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, false);
		
		this.buttonRestartText.y = PositionData.playRestartButtonY; 
		this.game.add.tween(this.buttonRestartText).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, false);
		
		this.gameOverText.y = PositionData.playGameOverTextY; 
		this.game.add.tween(this.gameOverText).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, false);
    },
	// ==========================================================
	// CONGRATS SCREEN
	// ==========================================================
	createCongratsScreenItems: function()
	{
		this.congratScreen = this.add.sprite(0, 0, 'screen-congrat');
		this.congratScreen.alpha = 0;
		
		this.congratText = this.game.add.sprite(FloatingFutbol.logicWidth/2, PositionData.playCongratTextY, 'playing-text-atlas');
		this.congratText.frameName = "congrat-" + langText + ".png";
		this.congratText.anchor.setTo(0.5, 0.5);
		this.congratText.alpha = 0;

		if(this.level == 1) {
			this.congratPass1Text = this.game.add.sprite(FloatingFutbol.logicWidth/2, PositionData.playCongratPassText1Y, 'playing-text-atlas');
			this.congratPass1Text.frameName = "lv1-" + langText + ".png";
			//this.congratPass1Text.frameName = "goal-" + langText + ".png";
		} else if(this.level == 2) {
			this.congratPass1Text = this.game.add.sprite(FloatingFutbol.logicWidth/2, PositionData.playCongratPassText1Y, 'playing-text-atlas');
			this.congratPass1Text.frameName = "lv2-" + langText + ".png";
			//this.congratPass1Text.frameName = "goal-" + langText + ".png";
		} else {
			this.congratPass1Text = this.game.add.sprite(FloatingFutbol.logicWidth/2, PositionData.playCongratPassText1Y, 'playing-text-atlas');
			this.congratPass1Text.frameName = "goal-" + langText + ".png";
		}
		this.congratPass1Text.anchor.setTo(0.5, 0.5);
		this.congratPass1Text.alpha = 0;
		
		this.congratPass2Text = this.game.add.sprite(FloatingFutbol.logicWidth/2, PositionData.playCongratPassText2Y, 'playing-text-atlas');
		this.congratPass2Text.frameName = "coloring-" + langText + ".png";
		this.congratPass2Text.anchor.setTo(0.5, 0.5);
		this.congratPass2Text.alpha = 0;
		
		if(this.level == 1) {
			this.coloringArt = this.add.sprite(PositionData.playColoringArtX, PositionData.playColoringArtY, 'coloring-art-1');
		} else if(this.level == 2) {
			this.coloringArt = this.add.sprite(PositionData.playColoringArtX, PositionData.playColoringArtY, 'coloring-art-2');
		} else {
			this.coloringArt = this.add.sprite(PositionData.playColoringArtX, PositionData.playColoringArtY, 'coloring-art-3');
		}
		
		this.coloringArt.alpha = 0;
		this.coloringArt.anchor.setTo(0.5, 0.5);
		
		this.buttonDownload = this.add.button(FloatingFutbol.logicWidth/2, FloatingFutbol.logicHeight*2 , 'playing-win-screen-btns-atlas', this.download, this);
		this.buttonDownload.setFrames("download-reward-button-over.png", "download-reward-button-up.png");
		this.buttonDownload.input.useHandCursor = true;
		this.buttonDownload.alpha = 0;
		this.buttonDownload.anchor.setTo(0.5, 0.5);
		this.buttonDownloadText = this.add.sprite(FloatingFutbol.logicWidth/2, FloatingFutbol.logicHeight*2 , 'playing-win-screen-btns-atlas');
		this.buttonDownloadText.frameName = "download-" + langText + "-up.png";
		this.buttonDownloadText.alpha = 0;
		this.buttonDownloadText.anchor.setTo(0.5, 0.5);
		
		this.buttonNext = this.add.button(FloatingFutbol.logicWidth/2, FloatingFutbol.logicHeight*2 , 'playing-win-screen-btns-atlas', this.nextGame, this);
		this.buttonNext.setFrames("play-again-button-over.png", "play-again-button-up.png");
		this.buttonNext.input.useHandCursor = true;
		this.buttonNext.alpha = 0;
		this.buttonNext.anchor.setTo(0.5, 0.5);
		this.buttonNextText = this.add.sprite(FloatingFutbol.logicWidth/2, FloatingFutbol.logicHeight*2 , 'playing-win-screen-btns-atlas');
		if(this.level == 3) {
			this.buttonNextText.frameName = "play-again-" + langText + "-up.png";
		} else {
			this.buttonNextText.frameName = "keep-playing-" + langText + "-up.png";
		}
		this.buttonNextText.alpha = 0;
		this.buttonNextText.anchor.setTo(0.5, 0.5);
		
		this.happyTweety = this.add.sprite(PositionData.playHappyTweetyX, PositionData.playHappyTweetyY, 'happy-tweety');
		this.happyTweety.alpha = 0;
		this.happyTweety.anchor.setTo(0.5, 0.5);
	},
	//==========================================================
	// TRANSITION ANIMATIONS IN FOR CONGRATS SCREEN 
	//==========================================================
	congratsTransitionInAnimation: function()
    {
		// play sound
		if (soundEnabled) {
			victoryMusic.play('', 0, 1, false);
    	}
    	
		// bring elements to top    	
    	this.congratScreen.bringToTop();
    	this.congratText.bringToTop();
    	this.congratPass1Text.bringToTop();
    	this.congratPass2Text.bringToTop();
    	this.coloringArt.bringToTop();
    	this.buttonDownload.bringToTop();
    	this.buttonDownloadText.bringToTop();
    	this.buttonNext.bringToTop();
    	this.buttonNextText.bringToTop();
    	this.happyTweety.bringToTop();
    	
    	this.buttonDownload.input.useHandCursor = true;
    	this.buttonNext.input.useHandCursor = true;
    	
    	
		//============ DISPLAY PASS LEVEL POPUP ===============//
		this.add.tween(this.congratScreen).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, false);
		this.add.tween(this.congratText).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, false);
		this.add.tween(this.congratPass1Text).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, false);
		this.add.tween(this.congratPass2Text).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, false);
		
		this.add.tween(this.coloringArt).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, false);
		
		this.buttonDownload.y = PositionData.playCongratButtonDownloadY;
		this.add.tween(this.buttonDownload).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, false);
		this.buttonDownloadText.y = PositionData.playCongratButtonDownloadY;
		this.add.tween(this.buttonDownloadText).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, false);

		this.buttonNext.y = PositionData.playCongratButtonNextY;
		this.add.tween(this.buttonNext).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, false);		
		this.buttonNextText.y = PositionData.playCongratButtonNextY;
		this.add.tween(this.buttonNextText).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, false);
		
		this.add.tween(this.happyTweety).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, false);
    },
	// ==========================================================
	// START GAME PHYSICS SYSTEM
	// ==========================================================
	startGamePhysics: function()
	{
		game.physics.startSystem(Phaser.Physics.P2JS);
	    game.physics.p2.setImpactEvents(true);	    
	    game.physics.p2.defaultRestitution = PositionData.playRestitution;
	    game.physics.p2.gravity.x = 0;
	    game.physics.p2.gravity.y = PositionData.playGravity[this.level-1];
	},
	// ==========================================================
	// CREATE COLLISION GROUPS. ONE FOR PLAYER, ONE FOR CHARACTERS
	// ==========================================================
	createCollisionGroups: function()
	{
		this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
	    this.charactersCollisionGroup = game.physics.p2.createCollisionGroup();
	    this.goalCollisionGroup = game.physics.p2.createCollisionGroup();
	    game.physics.p2.updateBoundsCollisionGroup();

		this.characterGroup = this.add.group();
		this.characterGroup.enableBody = true;
		this.characterGroup.physicsBodyType = Phaser.Physics.P2JS;
	},
	// ==========================================================
	// ADD PLAYER AND CREATE ANIMATION STATES FOR TWEETY
	// ==========================================================
	createPlayerAndAnimationStates: function()
	{
		this.player = this.add.sprite(PositionData.playTweetyX, FloatingFutbol.logicHeight/2, 'playing-tweety-spritesheet');
		this.player.anchor.setTo(0.5, 0.5);
		
		// animation states for Tweety
		//this.player.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18], true);
		this.player.animations.add('flapping_happy', [48,49,50,51,52,53,54,55], true);
		
		this.flappingState 		= this.player.animations.add('flapping', [27,28,29,30,31,32,33,34], true);
		this.glidingState 		= this.player.animations.add('gliding', [35,36,37,38,39,40,41,42,43,44,45,46,47], true);
		this.determinedState 	= this.player.animations.add('determined', [19,20,21,22,23,24,25,26], true);
		
		this.player.loadTexture('playing-tweety-collision-spritesheet', 0);
		this.collisionState = this.player.animations.add('collision');
		
		this.player.loadTexture('tweety-with-ball', 0);
		if(FloatingFutbol.screen == "desktop"){
			this.player.scale.x = .6;
			this.player.scale.y = .6;
		} else if(FloatingFutbol.screen == "iPad"){
			this.player.scale.x = 1.1;
			this.player.scale.y = 1.1;
		}  
		this.player.animations.add('idle');
		
		this.player.animations.play('idle', 15, true);
		 
		this.flappingState.onLoop.add(this.onFlappingLoop, this);
		this.determinedState.onLoop.add(this.onDeterminedLoop, this);
		this.collisionState.onLoop.add(this.onCollisionLoop, this);
		
		// set initial vars
		this.runOnce = this.playing = this.gameOver = this.displayGoal = this.touchGoal = false;
		this.goal = null;
		this.score = 0;
		lastCharcter = -1;
	},
	// ==========================================================
	// ADD FLOATING BALL TO TWEETY'S HEAD
	// ==========================================================
	addFloatingBallToTweetysHead: function()
	{
		/*
		this.ball = this.add.sprite(PositionData.playTweetyBallX, PositionData.playTweetyBallY, 'ball');
		this.ball.anchor.setTo(0.5, 0.5);
		this.ball.scale.x = .8;
		this.ball.scale.y = .8;
		
		// yoyo tween for ball movement (Sinusoidal tween for smooth movement)
		if(FloatingFutbol.screen == "iPhone") {
			this.ballTween = this.game.add.tween(this.ball).to({y: -45}, 560 , Phaser.Easing.Sinusoidal.InOut, true, 0, 9999, true);
		} else if(FloatingFutbol.screen == "iPad") {
			this.ballTween = this.game.add.tween(this.ball).to({y: -160}, 560 , Phaser.Easing.Sinusoidal.InOut, true, 0, 9999, true);
		} else {
			this.ballTween = this.game.add.tween(this.ball).to({y: -80}, 560 , Phaser.Easing.Sinusoidal.InOut, true, 0, 9999, true);
		}
		
		// add the ball to the tweety sprite so we can move them together
		// and the yoyo tween doesnt get effected by the y position of tweety
		this.player.addChild(this.ball);
		*/
	},
	// ==========================================================
	// CHANGES THE LOGO ACCORDING TO LANGUAGE SELECTED BY USER 
	// ==========================================================
	displayLogoForCurrentLanguage: function()
	{
		// CASES HAVE TO BE UPPERCASE
		switch(currentLanguage)
		{
			case "ENGLISH":
	    		this.updateLogo("eng-logo");
		    	break;
	    	case "ESPAÑOL":	
	    		this.updateLogo("esp-logo");
	    		break;
	    	case "CASTELLANO":	
	    		this.updateLogo("cast-logo");
	    		break;
	    	case "ITALIANO":
	    		this.updateLogo("italian-logo");
	    		break;
	    	case "POLSKI":
	    		this.updateLogo("polish-logo");
	    		break;
	    	case "TÜRKÇE":
	    		this.updateLogo("turk-logo");
	    		break;
	    	case "FRANÇAIS":	
	    		this.updateLogo("french-logo");
	    		break;
	    	case "DEUTSCH":
	    		this.updateLogo("german-logo");
	    		break;
	    }	
	},
	// ==========================================================
	// DESTROYS DEFAULT LOGO AND ADDS SELECTED LANGUAGE LOGO
	// ==========================================================
	updateLogo: function(logoName)
	{
		logo.destroy();
		
		logo = this.game.add.sprite(PositionData.logoPositionX - FloatingFutbol.logicWidth/2, PositionData.logoPositionY, logoName);
        logo.scale.x = .5;
        logo.scale.y = .5;
        this.game.add.tween(logo).to({x: PositionData.logoPositionX, y: PositionData.logoPositionY}, 1200, Phaser.Easing.Quintic.Out, true, 0, false);
	},
	// ==========================================================
	// CREATE SCORING TEXT AREA
	// ==========================================================
	createScoringText: function() 
	{
		soundButton = this.game.add.button(PositionData.soundX, PositionData.soundY, 'main-menu-sound', this.toggleSound, this);
        soundButton.anchor.setTo(1, 0);
        soundButton.inputEnabled = true;
        soundButton.input.useHandCursor = true;
        if(soundEnabled) {
        	soundButton.setFrames(1, 0, 1, 0);
        } else {
        	soundButton.setFrames(2, 2, 2, 2);
        }

		if(this.level == 3)
		{
			var paddingBrowser = 0;
			if(FloatingFutbol.screen == "desktop" && this.game.device.firefox) {
				paddingBrowser = 17;
			} 
			
			if (this.levelIndicator) {
				this.levelIndicator.destroy();
				this.levelIndicator = null;
			}
			this.levelIndicator = this.game.add.sprite(PositionData.levelIndicatorX, PositionData.levelIndicatorY, 'playing-bonus-round-text-atlas');
			this.levelIndicator.frameName = langText + ".png";
			this.levelIndicator.anchor.setTo(1, 0);
			
			this.scoreLabel = this.game.add.sprite(FloatingFutbol.logicWidth - PositionData.lastLevelX, PositionData.lastLevelY, 'playing-score-text-atlas');
			this.scoreLabel.frameName = langText + ".png";
			this.scoreLabel.anchor.setTo(1, 0);
			this.scoreLabel.alpha = 0;

			if(FloatingFutbol.screen == 'iPhone') {
				scoreTextFont 	= { font: "16px 'Bowlby One SC'", fill: '#ffe71a', stroke: '#000', strokeThickness: 4 };		
			} else if(FloatingFutbol.screen == 'iPad') {
				scoreTextFont 	= { font: "74px 'Bowlby One SC'", fill: '#ffe71a', stroke: '#000', strokeThickness: 10 };
			} else {
				scoreTextFont 	= { font: "38px 'Bowlby One SC'", fill: '#ffe71a', stroke: '#000', strokeThickness: 6 };
			}
			
			this.scoreText = this.add.text(FloatingFutbol.logicWidth + PositionData.lastScoreTextX, PositionData.lastScoreTextY + paddingBrowser, "" + score, scoreTextFont);
			this.scoreText.anchor.setTo(0, 0);
			this.scoreText.setText("" + this.score);
			this.scoreText.alpha = 0;			
		} else {
			var paddingBrowser = 0;
			if(FloatingFutbol.screen == "desktop" && this.game.device.firefox) {
				paddingBrowser = 17;
			} 
			
			this.levelIndicator = this.game.add.sprite(PositionData.levelIndicatorX, PositionData.levelIndicatorY, 'playing-level-indicator-atlas');
			this.levelIndicator.frameName = langText + "-level-" + this.level + ".png";
			this.levelIndicator.anchor.setTo(1, 0);
			
			if(FloatingFutbol.screen == 'iPhone') {
				scoreTextFont 	= { font: "16px 'Bowlby One SC'", fill: '#ffe71a', stroke: '#000', strokeThickness: 4 };		
			} else if(FloatingFutbol.screen == 'iPad') {
				scoreTextFont 	= { font: "90px 'Bowlby One SC'", fill: '#ffe71a', stroke: '#000', strokeThickness: 10 };
			} else {
				scoreTextFont 	= { font: "44px 'Bowlby One SC'", fill: '#ffe71a', stroke: '#000', strokeThickness: 6 };
			}
			this.scoreText = this.add.text(FloatingFutbol.logicWidth + PositionData.scoreTextX, PositionData.scoreTextY + paddingBrowser, score + "/" + levelPoints[this.level-1], scoreTextFont);
			this.scoreText.anchor.setTo(1, 0);
			this.scoreText.setText(this.score + "/" + levelPoints[this.level-1]);
			this.scoreText.alpha = 0;
		}		
	},

	// ==========================================================
	// COUNTDOWN TEXT (3,2,1, GO and PLAY AS LONG AS YOU CAN)
	// ==========================================================
	startCountdown: function() 
	{
		if(this.level == 3)
		{
			var paddingBrowser = 0;
			if(FloatingFutbol.screen == "desktop" && (this.game.device.chrome || this.game.device.safari || this.game.device.ie)) {
				paddingBrowser = 25;
			}
			
			// ==================================================================================================================
			var bonusText = this.game.add.sprite(FloatingFutbol.logicWidth/2, FloatingFutbol.logicHeight/2, 'bonus-' + langText);
			bonusText.anchor.setTo(0.5, 0.5);
			
			this.add.tween(bonusText).to({ alpha:1 }, 2000, Phaser.Easing.Linear.None, true, 0).onComplete.addOnce(function()
			{
				music.stop();
				music.play('', 0, 0.5, true, false);
				if (soundEnabled) {
					music.volume = 1;
				} else {
					music.volume = 0;
				}
				
				this.world.remove(bonusText); 
				bonusText.destroy();
			}, this);
			return;			
		}
		
		// play sound
		countdownMusic.play('', 0, 1, false);
		if (soundEnabled) {
			countdownMusic.volume = 1;			
    	} else {
			countdownMusic.volume = 0;
		}
    	
		// use spritesheet for countdown
		var countdownText = this.game.add.sprite(FloatingFutbol.logicWidth/2 + PositionData.coundDownX, FloatingFutbol.logicHeight/2 + PositionData.coundDownY, 'countdown');
		countdownText.animations.add('count-down-to-go', [0,1,2]);
		countdownText.play('count-down-to-go', 1, false);
		
		countdownText.events.onAnimationComplete.add(function()
		{
			music.stop();
			music.play('', 0, 0.5, true, false);
			if (soundEnabled) {
				music.volume = 1;
			} else {
				music.volume = 0;
			}
			
			countdownText.kill();
			countdownText = null;
		}, this);
	},
	// ==========================================================
	// MANAGE ANIMATIONS
	// ==========================================================
	manageAnimations: function(status) 
	{
		if(status == 'on') {
			this.characterGroup.forEach(function(chr){
				chr.body.velocity.x = - PositionData.playGameSpeed[this.level-1];
				//TweenLite.to(chr.body.velocity, .5, {x: -1000})
			});
			if(this.goal) {
				this.goal.body.velocity.x = - PositionData.playGameSpeed[this.level-1];
			}
		} else if(status == 'off') {
			this.characterGroup.forEach(function(chr){
				chr.body.velocity.x = 0;
			});
			if(this.goal) {
				this.goal.body.velocity.x = 0;
			}
		}
	},
	// ====================
	// REGULAR ANIMATION
	// ====================
	jump: function() 
	{
		if(this.player && this.playing && !this.gameOver) {
			if(this.goal && this.goal.x <= FloatingFutbol.logicWidth/1.2) {
				return;
			}
			
			// play sound
			if (soundEnabled) {
				if(!bounceMusic.playing) {
					bounceMusic.play('', 0, 1, false);
				}					
	    	}
	    	
			// update position
			this.player.body.velocity.y = PositionData.playTweetyJump;

			if(this.goal) {
				this.player.animations.play('flapping_happy', 15, true);
				return;
			}
			
			if(this.flappingState.isPlaying) {
				this.flappingState.loopCount = 0;									
			} else if(!this.determinedState.isPlaying) {
				this.player.animations.play('flapping', 30, true);
			} 
		}		
    },
    // ====================
	// GLIDE ANIMATION
	// ====================
    onFlappingLoop: function(sprite, animation) {    	
    	if (animation.loopCount === 2 && this.score != levelPoints[this.level-1]) {
    		this.player.animations.play('gliding', 15, true);
    	}
	},   
	// ====================
	// DETERMINED ANIMATION
	// ====================
	onDeterminedLoop: function(sprite, animation) {
		if (animation.loopCount === 2) {
			this.player.animations.play('flapping', 15, true);
    	}
	},
	// ====================
	// COLLISION ANIMATION
	// ====================
	onCollisionLoop: function(sprite, animation) {
		if (animation.loopCount === 1) {
			this.player.animations.stop();
			
			if(this.level == 3) {
				for(var i=0; i<this.characterGroup.length; i++) {
					listCharacterMoving[i] = 0;
					listCharacterTween[i] = 0;	
					this.game.add.tween(this.characterGroup.children[i]).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, false);				
				}
				this.game.add.tween(this.ball).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, false);
				if(this.goal) {
					this.game.add.tween(this.goal).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, false);
				}
				
				var hideTween = this.game.add.tween(this.player);
				hideTween.to({ alpha: 0 }, 200, Phaser.Easing.Linear.None);
				hideTween.onComplete.addOnce(function(){
					// create congrat popup
					this.createCongratsScreenItems();
					
					// congrat fade in
					this.congratsTransitionInAnimation();						
				}, this);
				hideTween.start();
			} else {
				for(var i=0; i<this.characterGroup.length; i++) {
					listCharacterMoving[i] = 0;
					listCharacterTween[i] = 0;
					this.game.add.tween(this.characterGroup.children[i]).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, false);				
				}
				this.game.add.tween(this.ball).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, false);
				
				var hideTween = this.game.add.tween(this.player);
				hideTween.to({ alpha: 0 }, 200, Phaser.Easing.Linear.None);
				hideTween.onComplete.addOnce(function(){
					// create lose popup
					this.createGameOverItems();
					
					// lose fade in
					this.gameOverTransitionInAnimation();
				}, this);
				hideTween.start();
			}
    	}
	},
	// ======================================================
	// CHARACTER SLIDE IN ANIMATIONS - DAFFY, LOLA, GOSSAMER
	// ======================================================
   	updateCharacterUpDown: function()
   	{
   		if(listCharacterMoving[2] && !listCharacterTween[2]) {
   			if(this.characterGroup.children[2].body.y <= PositionData.GossamerSpriteHeight/2 
   					&& this.characterGroup.children[2].body.x < FloatingFutbol.logicWidth - PositionData.GossamerSpriteWidth/2 ) {
   				listCharacterTween[2] = 1;
   				this.gossamerTween.start();
			} 
   		}

   		if(listCharacterMoving[4] && !listCharacterTween[4]) {
   			if(this.characterGroup.children[4].body.y >= FloatingFutbol.logicHeight - PositionData.DaffySpriteHeight/2
   					&& this.characterGroup.children[4].body.x < FloatingFutbol.logicWidth - PositionData.DaffySpriteWidth/2 ) {
   				listCharacterTween[4] = 1;
   				this.daffyTween.start();
			} 
		}
		
   		if(listCharacterMoving[5] && !listCharacterTween[5]) {
   			if(this.characterGroup.children[5].body.y >= FloatingFutbol.logicHeight - PositionData.LolaSpriteHeight/2
   					&& this.characterGroup.children[5].body.x < FloatingFutbol.logicWidth - PositionData.LolaSpriteWidth/2 ) {
   				listCharacterTween[5] = 1;
   				this.lolaTween.start(); 
			}
		}
   	},
	// ==========================================================
	// RANDOMLY GENERATE CHARACTER OBSTACLES
	// ==========================================================
	addCharacter: function() 
	{
		if(!this.gameOver) 
		{
			if(lastCharcter != -1 && this.characterGroup.children[lastCharcter].x > FloatingFutbol.logicWidth - PositionData.playGameCharacterSpace[this.level-1])
			{
				return;
			}
			
			var currentMoving = 0;
			
			for(var i=0; i<6; i++)
			{
				if(listCharacterMoving[i]==1) {
					currentMoving++;
				}
			}
			
			if(currentMoving == 6) {				
				return;
			}
			
			if(this.score == levelPoints[this.level-1]/2 && (this.flappingState.isPlaying || this.glidingState.isPlaying) )
			{
				this.player.animations.play('determined', 15, true);				
			}
			
			if(currentMoving + this.score >= levelPoints[this.level-1] )
			{
				if(!this.displayGoal && this.score >= levelPoints[this.level-1]) 
				{
					this.displayGoal = true;
					this.goal = this.add.sprite(FloatingFutbol.logicWidth + 200, FloatingFutbol.logicHeight/2, 'goal');
					this.goal.anchor.setTo(0.5, 0.5);
					
					game.physics.p2.enable([this.goal], false);

					this.goal.body.clearShapes();
					this.goal.body.loadPolygon('physicsData', 'goal');
					
					this.goal.body.collideWorldBounds = false;
					this.goal.body.data.gravityScale = 0.0;
					this.goal.body.kinematic = true;
					this.goal.body.velocity.x = - PositionData.playGameSpeed[this.level-1];
					this.goal.body.debug = debugPolygons;
					
					this.goal.body.setCollisionGroup(this.goalCollisionGroup);
					this.goal.body.collides([this.playerCollisionGroup]);
					return;
				} else {
					return;
				}				
			}
			
			startRandom = 0;
			endRandom = 5;
			if(characterInRow == 2) {
				if(lastCharcter <= 2) {
					startRandom = 3;
					endRandom = 5;
				} else {
					startRandom = 0;
					endRandom = 2;
				}
			}
			
			var characterIndexRandom = this.rnd.integerInRange(startRandom, endRandom);
			var characterRandom = listCharacter[characterIndexRandom];
			
			while(listCharacterMoving[characterIndexRandom] == 1)
			{
				characterIndexRandom = this.rnd.integerInRange(startRandom, endRandom);
				characterRandom = listCharacter[characterIndexRandom];
			}
			
			if( (characterIndexRandom <= 2 && lastCharcter <= 2) 
					|| (characterIndexRandom > 2 && lastCharcter > 2)) {
				characterInRow++;
			} else {
				characterInRow = 1;
			}
			
			listCharacterMoving[characterIndexRandom] = 1;
			lastCharcter = characterIndexRandom;
			var chr = this.characterGroup.children[characterIndexRandom];
			
			switch(characterIndexRandom)
			{
				case 0:
					chr.body.x = FloatingFutbol.logicWidth + PositionData.BunnySpriteWidth/2;
					break;
				case 1:
					chr.body.x = FloatingFutbol.logicWidth + PositionData.BugsSpriteWidth/2;
					break;
				case 2:
					chr.body.x = FloatingFutbol.logicWidth + PositionData.GossamerSpriteWidth/2;
					chr.body.y = - PositionData.GossamerSpriteHeight/2;
					break;
				case 3:
					chr.body.x = FloatingFutbol.logicWidth + PositionData.TazSpriteWidth/2;
					break;
				case 4:
					chr.body.x = FloatingFutbol.logicWidth + PositionData.DaffySpriteWidth/2;
					chr.body.y = FloatingFutbol.logicHeight + PositionData.DaffySpriteHeight/2;
					break;
				case 5:
					chr.body.x = FloatingFutbol.logicWidth + PositionData.LolaSpriteWidth/2 + PositionData.LolaSpriteWidth/5;
					chr.body.y = FloatingFutbol.logicHeight + PositionData.LolaSpriteHeight;
					chr.body.angle = -50;
					break;
			}
			
			//TweenLite.to(chr.body.velocity, .5, {x: -1000 - Math.floor(this.score/10)})
			chr.body.velocity.x = - PositionData.playGameSpeed[this.level-1] - Math.floor(this.score/10)*PositionData.playGameSpeedIncrement;

			// dont have animation on iPad
			if(FloatingFutbol.screen != 'iPad') {
				chr.animations.play('run', 15, true);
			}			
		}
	},
	// ==========================================================
	// UPDATE - CONSTANTLY RUNNING CHECKS
	// ==========================================================
	update: function() {
		
		//this.game.debug.text("FPS RATE: "+this.game.time.fps || '--', 10, 20, "#000000"); 
		
		if(this.playing) {
			this.updateFloatingBall();
			this.updateCharacterUpDown();
		}		

		// ==========================================================
		// when game ends execute functions
		// ==========================================================
		if(this.gameOver) {
			this.player.body.velocity.x = 0;
			this.player.body.velocity.y = 0;
			music.volume = 0;
			
			if(!this.runOnce) {
				this.runOnce = true;

				// turn off animaitons
				this.manageAnimations('off');
				
				if(this.score == levelPoints[this.level-1] && (this.touchGoal || this.level == 3)) 
				{
					for(var i=0; i<this.characterGroup.length; i++) {
						listCharacterMoving[i]=0;
						listCharacterTween[i] = 0;	
						game.add.tween(this.characterGroup.children[i]).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, false);				
					}
					this.game.add.tween(this.ball).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, false);
					if(this.goal) {
						this.game.add.tween(this.goal).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, false);
					}
					
					var hideTween = this.game.add.tween(this.player);
					hideTween.to({ alpha: 0 }, 200, Phaser.Easing.Linear.None);
					hideTween.onComplete.addOnce(function(){
						// create congrat popup
						this.createCongratsScreenItems();
						
						// congrat fade in
						this.congratsTransitionInAnimation();						
					}, this);
					hideTween.start();
				} 
				else 
				{
					//============ CHANGE THE TWEETY TO COLLISION STATE ===============//
					this.player.animations.play('collision', 15, true);
				}
			}
		}
		else if(this.playing && !this.gameOver ) 
		{
			if(this.score == levelPoints[this.level-1] && this.goal && this.goal.x <= (FloatingFutbol.logicWidth/1.2)) {
				this.player.body.data.gravityScale = 0;
				this.player.body.velocity.x = 0;
				this.player.body.velocity.y = 0;
				this.updateParallaxBackgroundEffect();				
				return;
			}
			if(this.player.y > PositionData.playMaxDown) {
				if (soundEnabled) {
		    		hitMusic.play('', 0, 1, false);
		    	}
		    	
				this.gameOver = true;
				return;
			}
			
			this.player.body.velocity.x = 0;
			
			this.updateParallaxBackgroundEffect();
			this.updateScoreWhenCharacterPassed();
			this.addCharacter();
			
			// ========================================
			// Adds click or touch/tap functionality
			// ========================================
			
			if(!this.game.device.desktop && this.input.pointer1.isDown) {
			//	this.jump();
			}
			
			if(this.game.device.desktop &&this.input.mousePointer.isDown) {
				this.jump();
			}
		}
    },    
    // ================================================
	// UPDATE FLOATING BALL ACCORDING TO TWEETY POSITION
	// ================================================
   	updateFloatingBall: function()
    {
		this.ball.x = this.player.x + PositionData.playTweetyBallX;
		
		if(ballMovingUp) 
		{
			if(this.ball.y <= this.player.y + PositionData.playTweetyBallY + PositionData.playSpacingBall) {
				ballMovingUp = 0;
			} else { 
				if(this.ball.y >= this.player.y + PositionData.playTweetyBallY - PositionData.playSpacingBall*5)
					this.ball.y+= PositionData.playSpacingBall/1.5;
				else if(this.ball.y >= this.player.y + PositionData.playTweetyBallY - PositionData.playSpacingBall*3)
					this.ball.y+= PositionData.playSpacingBall/2.5;
				else if(this.ball.y >= this.player.y + PositionData.playTweetyBallY - PositionData.playSpacingBall)
					this.ball.y+= PositionData.playSpacingBall/5;
				this.ball.y+= PositionData.playSpacingBall/15;
			}
		} else {
			if(this.ball.y >= this.player.y + PositionData.playTweetyBallY - PositionData.playSpacingBall) { 
				ballMovingUp = 1;
			} else { 
				if(this.ball.y <= this.player.y + PositionData.playTweetyBallY + PositionData.playSpacingBall*5)
					this.ball.y-= PositionData.playSpacingBall/1.5;
				else if(this.ball.y <= this.player.y + PositionData.playTweetyBallY + PositionData.playSpacingBall*3)
					this.ball.y-= PositionData.playSpacingBall/2.5;
				else if(this.ball.y <= this.player.y + PositionData.playTweetyBallY + PositionData.playSpacingBall)
					this.ball.y-= PositionData.playSpacingBall/5;
				this.ball.y-= PositionData.playSpacingBall/15;
			}
		}
   	},
   	// ================================================
   	// UPDATE SCORE WHEN CHARACTER IS PASSED BY TWEETY
   	// ================================================
  	updateScoreWhenCharacterPassed: function()
	{
   		for(var i=0; i<6; i++)
		{
			var chr = this.characterGroup.children[i];
			
			if(chr.body.x < -205 && listCharacterMoving[i] == 1)
			{
				listCharacterMoving[i] = 0;
				listCharacterTween[i] = 0;	
				
		
				if(FloatingFutbol.screen != 'iPad') {
					chr.animations.stop();
				}				

				// update score
		    	this.score += 1;
		    	
		    	// display great job icon
		    	if( (this.level == 1 && this.score == 4) || (this.level == 2 && this.score == 8) || (this.level == 3 && this.score == 10) ) 
		    	{
		    		this.greatJobIcon.alpha = 0;
		    		this.greatJobIcon.x = PositionData.greatJobIconX;
		    		this.greatJobIcon.y = PositionData.greatJobIconY;
		    		this.add.tween(this.greatJobIcon).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, false).onComplete.addOnce(
  						  function()
						  {
  							  this.add.tween(this.greatJobIcon).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 1500, false);
						  }, this);
		    	}
		    	

				var scorePadding = 0;
				if(this.level == 3 && this.score == 10) 
				{
					if(FloatingFutbol.screen == 'iPhone') {
						this.scoreLabel.x -= 15;
						this.scoreText.x -= 15;
					} else if(FloatingFutbol.screen == 'iPad') {
						this.scoreLabel.x -= 70;
						this.scoreText.x -= 70;
					} else {
						this.scoreLabel.x -= 40;
						this.scoreText.x -= 40;
					}
				}
				
		    	
		    	// udpate score
		    	if(this.level == 3) {
					this.scoreText.setText("" + this.score);
		    	} else { 
					this.scoreText.setText(this.score + "/" + levelPoints[this.level-1]);
		    	}
		    	
		    	// update tweety on end level
		    	if(this.score == levelPoints[this.level-1]) {
		    		this.player.animations.play('flapping_happy', 15, true);
		    	}
		    	
			}
		}
   	},
    // ==========================================================
	// PARALLAX BACKGROUND EFFECT
	// ==========================================================
    updateParallaxBackgroundEffect: function() 
    {
    	// update the background Position
    	if(FloatingFutbol.screen == 'iPad') {
    		this.gameBg.x = (this.gameBg.x - PositionData.playBackgroundSpeed[this.level-1])%2048;
    	} else if(FloatingFutbol.screen == 'iPhone') {
    		this.gameBg.x = (this.gameBg.x - PositionData.playBackgroundSpeed[this.level-1])%512;
    	} else {
    		this.gameBg.x = (this.gameBg.x - PositionData.playBackgroundSpeed[this.level-1])%1024;
    	}
    	
    	// update clouds positions
    	this.cloud1.x -= PositionData.cloud1Speed;
    	this.cloud2.x -= PositionData.cloud2Speed;    	
    	
    	if(this.cloud1.x < - PositionData.cloudSize1) {
    		this.cloud1.x = FloatingFutbol.logicWidth;
    	}
    	
    	if(this.cloud2.x < - PositionData.cloudSize2) {
    		this.cloud2.x = FloatingFutbol.logicWidth;
    	}
    },
    // ==========================================================
	// HIT CHARACTERS - GAME OVER
	// ==========================================================
    hitCharacters: function(obj1, obj2) 
    {
    	if(this.gameOver) return;
    	
    	if (soundEnabled) {
    		hitMusic.play('', 0, 1, false);
    	}
    	
    	this.player.body.velocity.x = -10;
    	this.gameOver = true;
    },
    // ==========================================================
	// HIT GOAL - GAME OVER
	// ==========================================================
    hitGoal: function(obj1, obj2) 
    {
    	if(this.gameOver) return;
    	
    	if (soundEnabled) {
    		goalMusic.play('', 0, 1, false);
    	}
    	
    	this.player.body.velocity.x = -10;
    	this.touchGoal = true;
    	this.gameOver = true;
    },
    // ==========================================================
	// RESTART GAME ON BUTTON PRESS
	// ==========================================================
    restartGame: function() {
    	if (soundEnabled) {
    		rolloverMusic.play('', 0, 1, false);
    	}
    	
		var restartTween = this.add.tween(this.gameOverScreen);
		restartTween.to({ alpha: 0 }, 300, Phaser.Easing.Linear.None);
		
		this.game.add.tween(this.gameOverText).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, false);		
		this.game.add.tween(this.buttonRestart).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, false);
		this.game.add.tween(this.buttonRestartText).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, false);
		
		this.level = 1;
		restartTween.onComplete.addOnce(function(){
			/* clear game over screen resource */
			
			//destroy sprites
			if (this.gameOverText) {
				this.gameOverText.destroy();
				this.gameOverText = null;
			}
			if (this.gameOverText) {
				this.gameOverText.destroy();
				this.gameOverText = null;
			}
			if (this.buttonRestartText) {
				this.buttonRestartText.destroy();
				this.buttonRestartText = null;
			}
			//destroy buttons
			if (this.buttonRestart) {
				this.buttonRestart.kill();
				this.buttonRestart = null;
			}

			// clear other resources 
			this.clearResources();
			
			this.state.restart();
		}, this);
		restartTween.start();
    },
    // ==========================================================
	// NEXT LEVEL
	// ==========================================================
    nextGame: function() {
    	if (soundEnabled) {
    		rolloverMusic.play('', 0, 1, false);
    	}
    	
    	if( this.level==3 ) {
    		this.level = 1;
    	} else {
    		this.level++;
    	}
    	
    	this.game.add.tween(this.coloringArt).to({ alpha:0 }, 200, Phaser.Easing.Linear.None, true, 0);
    	
    	this.game.add.tween(this.buttonDownload).to({ alpha:0 }, 200, Phaser.Easing.Linear.None, true, 0);
    	this.game.add.tween(this.buttonDownloadText).to({ alpha:0 }, 200, Phaser.Easing.Linear.None, true, 0);
    	this.game.add.tween(this.buttonNext).to({ alpha:0 }, 200, Phaser.Easing.Linear.None, true, 0);
    	this.game.add.tween(this.buttonNextText).to({ alpha:0 }, 200, Phaser.Easing.Linear.None, true, 0);
    	
    	this.game.add.tween(this.happyTweety).to({ alpha:0 }, 200, Phaser.Easing.Linear.None, true, 0);
    	
    	this.game.add.tween(this.congratText).to({ alpha:0 }, 200, Phaser.Easing.Linear.None, true, 0);
    	this.game.add.tween(this.congratPass1Text).to({ alpha:0 }, 200, Phaser.Easing.Linear.None, true, 0);
    	this.game.add.tween(this.congratPass2Text).to({ alpha:0 }, 200, Phaser.Easing.Linear.None, true, 0);
    	this.game.add.tween(this.congratScreen).to({ alpha:0 }, 400, Phaser.Easing.Linear.None, true, 0).onComplete.addOnce(function()
    	{
    		/* clear game over screen resource */
    		
    		//destroy sprites
			if (this.congratScreen) {
				this.congratScreen.destroy();
				this.congratScreen = null;
			}
			if (this.coloringArt) {
				this.coloringArt.destroy();
				this.coloringArt = null;
			}
			if (this.happyTweety) {
				this.happyTweety.destroy();
				this.happyTweety = null;
			}
			if (this.buttonNext) {
				this.buttonNext.destroy();
				this.buttonNext = null;
			}
			if (this.buttonNextText) {
				this.buttonNextText.destroy();
				this.buttonNextText = null;
			}
			if (this.buttonDownload) {
				this.buttonDownload.destroy();
				this.buttonDownload = null;
			}
			if (this.buttonDownloadText) {
				this.buttonDownloadText.destroy();
				this.buttonDownloadText = null;
			}
    		
			if (this.congratText) {
				this.congratText.destroy();
				this.congratText = null;
			}
			if (this.congratPass1Text) {
				this.congratPass1Text.destroy();
				this.congratPass1Text = null;
			}
			if (this.congratPass2Text) {
				this.congratPass2Text.destroy();
				this.congratPass2Text = null;
			}
			
			// clear other resources 
			this.clearResources();
			
			// restart the game			
    		this.game.state.restart();
    	}, this);
	},
	// ==========================================================
	// CLEAR OTHER RESOURCES
	// ==========================================================
	clearResources: function() {
		// remove tweens
		this.tweens = [];
		
		//destroy sprites
		if (this.gameSky) {
			this.gameSky.destroy();
			this.gameSky = null;
		}
		if (this.gameBg) {
			this.gameBg.destroy();
			this.gameBg = null;
		}
		if (this.cloud1) {
			this.cloud1.destroy();
			this.cloud1 = null;
		}
		if (this.cloud2) {
			this.cloud2.destroy();
			this.cloud2 = null;
		}
		
		if(this.scoreLabel) {
			this.scoreLabel.destroy();
			this.scoreLabel = null;
		}
		
		if (this.goal) {
			this.goal.destroy();
			this.goal = null;
		}
		if (this.greatJobIcon) {
			this.greatJobIcon.destroy();
			this.greatJobIcon = null;
		}
		
		// clear characters
		if (this.player) {
			this.player.destroy();
			this.player = null;
		}
		
		if (this.ball) {
			this.ball.destroy();
			this.ball = null;
		}
		
		for(var i=this.characterGroup.length-1; i>=0; i--) {
			this.characterGroup.children[i].destroy();
		}
		
		//destroy bitmap text
		this.scoreText = null;
	},
	// ==========================================================
	// DOWNLOAD ASSETS (coloring pages)
	// ==========================================================
	download: function() {
		if (soundEnabled) {
    		rolloverMusic.play('', 0, 1, false);
    	}
    	
		window.top.open('downloadables/' + langText + "-0" + this.level + ".zip");
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
			music.volume = 1;
			countdownMusic.volume = 1;
		}
		else
		{
			soundButton.setFrames(2, 2, 2, 2);
			music.pause();
			music.volume = 0;
			countdownMusic.volume = 0;
		}
	}
};

//===============================================================
//A SIMPLE WAY TO OVERRIDE FUNCTIONS FOR MOBILE OR OTHER VERSIONS
//===============================================================
/**
* Extends one class with another.
*
* @param {Function} destination The class that should be inheriting things.
* @param {Function} source The parent class that should be inherited from.
* @return {Object} The prototype of the parent.
*/
function extend(destination, source) {
destination.prototype = Object.create(source.prototype);
destination.prototype.constructor = destination;
return source.prototype;
}

//example class for mobile ============================================
//set the new PlayMobile prototype to the FloatingFutbol.Play prototype
//so we have access to all of its internal functions
function PlayMobile() {}
var parent = extend(PlayMobile, FloatingFutbol.Play);

//before overridding the function, it will return the value inside FloatingFutbol.Play.testFunction
//*comment this line out if you dont want it to call
//parent.testFunction();

//===============================================================
//YOU CAN OVERRIDE METHODS IN THE PLAY PROTOTYPE LIKE THIS
//===============================================================
PlayMobile.prototype.testFunction = function(){
     alert("PlayMobile.prototype.testFunction: Overrides FloatingFutbol.Play.testFunction()");
};    

parent.testFunction = PlayMobile.prototype.testFunction;

//after overridding the function, it will return the value inside Child.prototype.testFunction
//this allows you to override any function inside the Play prototype specific to the mobile/tablet or 
//any other version
//*comment this line out if you dont want it to call
//parent.testFunction();