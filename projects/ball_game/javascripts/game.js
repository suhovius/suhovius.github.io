/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/javascripts/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _gameFramework = __webpack_require__(1);
	
	var _gameFramework2 = _interopRequireDefault(_gameFramework);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Inits
	window.onload = function init() {
	  var game = new _gameFramework2.default();
	  game.start();
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function () {
	
	  // Move this to separete file as sounds but for music
	  // Especially if there will be some more music
	  var musicPlayer = new _audioPlayer2.default("audio/music/ball_game_ost.mp3", { loop: true, gainCoefficient: 0.5 });
	  musicPlayer.play();
	
	  // Vars relative to the canvas
	  var canvas, ctx, w, h;
	
	  // vars for counting frames/s, used by the measureFPS function
	  var frameCount = 0;
	  var lastTime;
	  var fpsContainer;
	  var telemetryContainer;
	  var fps;
	  // for time based animation
	  var delta,
	      oldTime = 0;
	
	  var powerBoost = _constants.POWER_BOOST;
	
	  var maxBallSpeed = powerBoost * _constants.MAX_POWER_INIT;
	
	  // vars for handling inputs
	  var inputStates = {};
	
	  var ballArray = [];
	  var bricksArray = [];
	  var gatesArray = [];
	  var scorePointsArray = [];
	  var blackHolesArray = [];
	
	  var statsBall = new _graphicBall2.default(20, 120, 20, "#FF6633");
	  var statsScorePointGold = new _scorePoint2.default(15, 520, "gold");
	  var statsScorePointSilver = new _scorePoint2.default(15, 550, "silver");
	  var statsScorePointSteel = new _scorePoint2.default(15, 580, "steel");
	
	  var PLAYER_STATS_INIT = _defineProperty({
	    "balls": 3,
	    "levels": {},
	    "totalScore": 0,
	    "goldCount": 0,
	    "silverCount": 0,
	    "steelCount": 0
	  }, 'levels', {});
	
	  var playerStats = Object.assign({}, PLAYER_STATS_INIT);
	
	  playerStats.calculateTotalScore = function () {
	    this.totalScore = 0;
	    this.goldCount = 0;
	    this.silverCount = 0;
	    this.steelCount = 0;
	    for (var number in playerStats["levels"]) {
	      this.totalScore += playerStats["levels"][number]["score_points"].reduce(function (sum, score) {
	        return sum + score.weight;
	      }, 0);
	
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = playerStats["levels"][number]["score_points"][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var scorePoint = _step.value;
	
	          switch (scorePoint.type) {
	            case "gold":
	              this.goldCount++;
	              break;
	            case "silver":
	              this.silverCount++;
	              break;
	            case "steel":
	              this.steelCount++;
	              break;
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	    playerStats["levels"][currentLevel.number]["totalScore"] = playerStats["levels"][currentLevel.number]["score_points"].reduce(function (sum, score) {
	      return sum + score.weight;
	    }, 0);
	    return this.totalScore;
	  };
	
	  var player = {
	    x: 0,
	    y: 0,
	    boundingCircleRadius: 5
	  };
	
	  // game states
	  var gameStates = {
	    mainMenu: 0,
	    gameRunning: 1,
	    levelComplete: 2,
	    gameOver: 3,
	    frozenDebug: 4
	  };
	  // var currentGameState = gameStates.gameRunning;
	  // var currentGameState = gameStates.mainMenu;
	  var currentLevel = new _level2.default(1);
	
	  var gameAreaBorder = _constants.GAME_AREA_BORDER;
	
	  var mainMenuButton = new _menuButton2.default(300, 20, 80, 40, "Menu");
	  mainMenuButton.releaseHandler = function () {
	    currentGameState = gameStates.mainMenu;
	  };
	
	  var mainMenu = new _menu2.default("Main Menu");
	
	  var resumeGameButton = mainMenu.addButton("Resume Game", function () {
	    currentGameState = gameStates.gameRunning;
	  }, false);
	
	  var startNextLevelButton = mainMenu.addButton("Start Next Level", function () {
	    if (currentLevel.hasNextLevel()) {
	      currentLevel = currentLevel.getNextLevel();
	      startGame();
	    }
	  }, false);
	
	  var replayCurrentLevelButton = mainMenu.addButton("Replay Current Level", function () {
	    playerStats["levels"][currentLevel.number]["score_points"] = [];
	    playerStats.calculateTotalScore();
	    startGame();
	  }, false);
	
	  mainMenu.addButton("Start New Game", function () {
	    if (currentLevel.hasNextLevel()) {
	      currentLevel = new _level2.default(1);
	      playerStats = Object.assign(playerStats, PLAYER_STATS_INIT);
	      startGame();
	    }
	  });
	
	  function musicButtonText(musicPlayer) {
	    return "Music: " + (musicPlayer.status == "playing" ? "On" : "Off");
	  }
	
	  mainMenu.addButton(musicButtonText(musicPlayer), function () {
	    if (musicPlayer.status == "playing") {
	      musicPlayer.stop();
	    } else {
	      musicPlayer.play();
	    }
	    this.text = musicButtonText(musicPlayer);
	  });
	
	  function soundsButtonText(settings) {
	    return "Sounds: " + (settings.read().areSoundsOn ? "On" : "Off");
	  }
	
	  mainMenu.addButton(soundsButtonText(_gameSettings2.default), function () {
	    _gameSettings2.default.toggleBoolean("areSoundsOn");
	    this.text = soundsButtonText(_gameSettings2.default);
	  });
	
	  var currentGameState = gameStates.mainMenu;
	
	  var measureFPS = function measureFPS(newTime) {
	
	    // test for the very first invocation
	    if (lastTime === undefined) {
	      lastTime = newTime;
	      return;
	    }
	
	    //calculate the difference between last & current frame
	    var diffTime = newTime - lastTime;
	
	    if (diffTime >= 1000) {
	      fps = frameCount;
	      frameCount = 0;
	      lastTime = newTime;
	    }
	
	    //and display it in an element we appended to the
	    // document in the start() function
	    fpsContainer.innerHTML = 'FPS: ' + fps;
	    frameCount++;
	  };
	
	  function updateBalls() {
	    testCollisionBetweenBalls(ballArray);
	    var result = {};
	    // Move and draw each ball, test collisions,
	    for (var i = 0; i < ballArray.length; i++) {
	      var ball = ballArray[i];
	
	      // 1) move the ball
	      ball.move(delta);
	
	      // 2) test if the ball collides with a wall
	      (0, _collisionDetection.testCollisionWithWalls)(w, h, gameAreaBorder, ball);
	
	      bricksArray = (0, _collisionDetection.testCollisionWithBricks)(bricksArray, ball);
	
	      if (ball instanceof _playerBall2.default) {
	        (0, _frameworkFunctions.checkBallControllable)(ball, player, inputStates, powerBoost, ctx);
	
	        result = (0, _collisionDetection.testCollisionWithScorePoints)(scorePointsArray, ball);
	        scorePointsArray = result["available"];
	
	        if (result["collected"].length > 0) {
	          playerStats["levels"][currentLevel.number]["score_points"] = playerStats["levels"][currentLevel.number]["score_points"].concat(result["collected"]);
	          playerStats.calculateTotalScore();
	        }
	      }
	
	      if (ball instanceof _competitorBall2.default) {
	        ball.actionLogic(ballArray, delta);
	      }
	
	      if (ball instanceof _friendlyBall2.default) {
	        ball.actionLogic(ballArray, delta);
	      }
	
	      testGateHits(ball);
	
	      testBlackHoleHits(ball);
	
	      // 3) draw the ball
	      ball.draw(ctx);
	    }
	  }
	
	  function createPlayerBall(x, y) {
	    var ball = new _playerBall2.default(x, y, 20, "#FF6633", 0, 0, 'LightGreen');
	
	    ballArray.push(ball);
	  }
	
	  function testCollisionBetweenBalls(ballArray) {
	    var collisionAngle = void 0,
	        newCoordinates = void 0;
	
	    for (var i = 0; i < ballArray.length; i++) {
	      for (var j = i + 1; j < ballArray.length; j++) {
	        if ((0, _collisionDetection.circleCollide)(ballArray[i].x, ballArray[i].y, ballArray[i].radius, ballArray[j].x, ballArray[j].y, ballArray[j].radius)) {
	          // Reset ball position to avoid mixing it with another ball's position. Avoid overlapping.
	          collisionAngle = (0, _mathUtils.angleBetween2Lines)(ballArray[i].x, ballArray[i].y, ballArray[j].x, ballArray[j].y, ballArray[i].x, ballArray[i].y, ballArray[i].x + 25, ballArray[i].y);
	          newCoordinates = (0, _mathUtils.findNewPointBy)(ballArray[i].x, ballArray[i].y, collisionAngle, ballArray[i].radius + ballArray[j].radius);
	          ballArray[j].x = newCoordinates.x;
	          ballArray[j].y = newCoordinates.y;
	
	          var _ref = [ballArray[j].v, ballArray[i].v];
	          ballArray[i].v = _ref[0];
	          ballArray[j].v = _ref[1];
	          var _ref2 = [ballArray[j].angle, ballArray[i].angle];
	          ballArray[i].angle = _ref2[0];
	          ballArray[j].angle = _ref2[1];
	
	
	          _sounds2.default.play("ballToBallCollisionHit", { "gain": (0, _frameworkFunctions.calculateSoundGainForBallCollision)(Math.max(ballArray[i].v, ballArray[j].v)) });
	        }
	      }
	    }
	  }
	
	  function updateBricks() {
	    for (var i = 0; i < bricksArray.length; i++) {
	      bricksArray[i].draw();
	    }
	  }
	
	  function updateScorePoints() {
	    for (var i = 0; i < scorePointsArray.length; i++) {
	      scorePointsArray[i].draw();
	    }
	  }
	
	  function updateStats() {
	    ctx.save();
	    ctx.fillStyle = "#33CC33";
	    ctx.fillText("Level Score: " + playerStats["levels"][currentLevel.number]["totalScore"], 10, 30);
	    ctx.fillText("Total Score: " + playerStats.totalScore, 10, 55);
	    ctx.fillText("x " + playerStats.balls, 38, 127);
	    ctx.fillText("x " + playerStats.goldCount, 28, 526);
	    ctx.fillText("x " + playerStats.silverCount, 28, 556);
	    ctx.fillText("x " + playerStats.steelCount, 28, 586);
	    ctx.restore();
	    statsBall.draw();
	    statsScorePointGold.draw();
	    statsScorePointSilver.draw();
	    statsScorePointSteel.draw();
	  }
	
	  function testGateHits(ball) {
	    for (var i = 0; i < gatesArray.length; i++) {
	      if ((0, _mathUtils.distanceBettweenToPoints)(gatesArray[i].x, gatesArray[i].y, ball.x, ball.y) < 5) {
	        // Gate hit detected
	        if (gatesArray[i].type === "finish" && ball instanceof _playerBall2.default) {
	          _sounds2.default.play("levelComplete");
	          currentGameState = gameStates.levelComplete;
	        }
	      }
	    }
	  }
	
	  function removeBallFromArray(ballArray, ball) {
	    return ballArray.filter(function (array_ball) {
	      return array_ball.uuid != ball.uuid;
	    });
	  }
	
	  function testBlackHoleHits(ball) {
	    for (var i = 0; i < blackHolesArray.length; i++) {
	      if ((0, _mathUtils.distanceBettweenToPoints)(blackHolesArray[i].x, blackHolesArray[i].y, ball.x, ball.y) < blackHolesArray[i].radius) {
	        // Black Hole hit detected
	        ball.isAlive = false;
	        ballArray = removeBallFromArray(ballArray, ball);
	        blackHolesArray[i].setBallInside(ball);
	        _sounds2.default.play("lostInBlackHole");
	        if (ball instanceof _playerBall2.default) {
	          playerStats.balls--;
	          if (playerStats.balls > 0) {
	            var startGate = getStartGate(gatesArray);
	            createPlayerBall(startGate.x, startGate.y);
	          } else {
	            currentGameState = gameStates.gameOver;
	            _sounds2.default.play("gameOver");
	          }
	        }
	      }
	    }
	  }
	
	  function updateMainMenuButton(mainMenuButton) {
	    mainMenuButton.draw();
	    mainMenuButton.processCursor(player, inputStates);
	  }
	
	  function timer(currentTime) {
	    var delta = currentTime - oldTime;
	    oldTime = currentTime;
	    return delta;
	  }
	
	  var mainLoop = function mainLoop(time) {
	
	    //main function, called each frame
	    measureFPS(time);
	
	    // number of ms since last frame draw
	    delta = timer(time);
	
	    // Clear the canvas
	    (0, _frameworkFunctions.clearCanvas)(ctx, canvas);
	
	    (0, _frameworkFunctions.drawGameAreaBorder)(ctx, canvas);
	
	    (0, _frameworkFunctions.updatePlayerCursor)(player, inputStates);
	
	    switch (currentGameState) {
	      case gameStates.gameRunning:
	
	        (0, _frameworkFunctions.updateGates)(gatesArray);
	
	        blackHolesArray = (0, _frameworkFunctions.updateBlackHoles)(blackHolesArray, delta);
	
	        updateBricks();
	
	        updateScorePoints();
	        // Update balls positions
	        updateBalls();
	
	        updateStats();
	
	        updateMainMenuButton(mainMenuButton);
	
	        // drawAxis(ctx, w, h, w/2, h/2, ballArray[0].hitAngle, 200);
	        // drawAxis(ctx, w, h, w/2, h/2, 235 * (Math.PI / 180), 200);
	
	        // updateTelemetry(telemetryContainer, ballArray[0]);
	        // drawCollisionAngles(ctx, w, h, ballArray[0]);
	        break;
	      case gameStates.mainMenu:
	        // TODO Add UI menu
	        mainMenu.title = "Main Menu";
	        startNextLevelButton.isVisible = false;
	        replayCurrentLevelButton.isVisible = false;
	        mainMenu.draw(player, inputStates);
	        break;
	      case gameStates.levelComplete:
	        mainMenu.title = "Level " + currentLevel.number + " Complete!";
	        startNextLevelButton.isVisible = true;
	        replayCurrentLevelButton.isVisible = true;
	        resumeGameButton.isVisible = false;
	        mainMenu.draw(player, inputStates);
	        break;
	      case gameStates.gameOver:
	        mainMenu.title = "GAME OVER!";
	        startNextLevelButton.isVisible = false;
	        replayCurrentLevelButton.isVisible = false;
	        resumeGameButton.isVisible = false;
	        mainMenu.draw(player, inputStates);
	        break;
	    }
	
	    if (currentGameState != gameStates.frozenDebug) {
	      // call the animation loop every 1/60th of second
	      requestAnimationFrame(mainLoop);
	    } else {
	      ctx.save();
	      ctx.beginPath();
	      ctx.fillStyle = "Red";
	      ctx.font = "70px Arial";
	      ctx.fillText("Frozen Debug Mode", 35, 70);
	      ctx.restore();
	      console.log("Frozen Debug Mode");
	    }
	  };
	
	  function getMousePos(evt) {
	    // necessary to take into account CSS boudaries
	    var rect = canvas.getBoundingClientRect();
	    return {
	      x: evt.clientX - rect.left,
	      y: evt.clientY - rect.top
	    };
	  }
	
	  function getStartGate(gatesArray) {
	    return gatesArray.find(function (gate) {
	      return gate.type === "start";
	    });
	  }
	
	  // TODO This should load current level and start game.
	  function startGame() {
	    ballArray = currentLevel.loadBalls();
	    bricksArray = currentLevel.loadBricks();
	    gatesArray = currentLevel.loadGates();
	    blackHolesArray = currentLevel.loadBlackHoles();
	    scorePointsArray = currentLevel.loadScorePoints();
	    var startGate = getStartGate(gatesArray);
	    createPlayerBall(startGate.x, startGate.y);
	    playerStats["levels"][currentLevel.number] = {
	      "score_points": [],
	      "totalScore": 0
	    };
	    currentGameState = gameStates.gameRunning;
	    resumeGameButton.isVisible = true;
	  }
	
	  var start = function start() {
	
	    // adds a div for displaying the fps value
	    fpsContainer = document.createElement('div');
	    document.body.appendChild(fpsContainer);
	
	    telemetryContainer = document.createElement('div');
	    document.body.appendChild(telemetryContainer);
	
	    // Canvas, context etc.
	    canvas = _canvasData2.default.getCanvas();
	
	    // often useful
	    w = canvas.width;
	    h = canvas.height;
	
	    // important, we will draw with this object
	    ctx = _canvasData2.default.getContext2D();
	    //ctx = canvas.getContext('2d');
	    // default police for text
	    ctx.font = "20px Arial";
	
	    // add the listener to the main, window object, and update the states
	    window.addEventListener('keydown', function (event) {
	      if (event.keyCode === 37) {
	        inputStates.left = true;
	      } else if (event.keyCode === 38) {
	        inputStates.up = true;
	      } else if (event.keyCode === 39) {
	        inputStates.right = true;
	      } else if (event.keyCode === 40) {
	        inputStates.down = true;
	      } else if (event.keyCode === 32) {
	        inputStates.space = true;
	      }
	    }, false);
	
	    //if the key will be released, change the states object
	    window.addEventListener('keyup', function (event) {
	      if (event.keyCode === 37) {
	        inputStates.left = false;
	      } else if (event.keyCode === 38) {
	        inputStates.up = false;
	      } else if (event.keyCode === 39) {
	        inputStates.right = false;
	      } else if (event.keyCode === 40) {
	        inputStates.down = false;
	      } else if (event.keyCode === 32) {
	        inputStates.space = false;
	      }
	    }, false);
	
	    // Mouse event listeners
	    canvas.addEventListener('mousemove', function (evt) {
	      inputStates.mousePos = getMousePos(evt);
	    }, false);
	
	    canvas.addEventListener('mousedown', function (evt) {
	      inputStates.mousedown = true;
	      inputStates.mouseButton = evt.button;
	      inputStates.mouseDownPos = getMousePos(evt);
	      inputStates.mouseUpPos = null;
	    }, false);
	
	    canvas.addEventListener('mouseup', function (evt) {
	      inputStates.mousedown = false;
	      inputStates.mouseDownPos = null; // clean mouse down position
	      inputStates.mouseUpPos = getMousePos(evt);
	    }, false);
	
	    requestAnimationFrame(mainLoop);
	  };
	
	  //our GameFramework returns a public API visible from outside its scope
	  return {
	    start: start
	  };
	};
	
	var _collisionDetection = __webpack_require__(2);
	
	var _debugUtils = __webpack_require__(8);
	
	var _mathUtils = __webpack_require__(3);
	
	var _canvasData = __webpack_require__(9);
	
	var _canvasData2 = _interopRequireDefault(_canvasData);
	
	var _graphicBall = __webpack_require__(10);
	
	var _graphicBall2 = _interopRequireDefault(_graphicBall);
	
	var _competitorBall = __webpack_require__(12);
	
	var _competitorBall2 = _interopRequireDefault(_competitorBall);
	
	var _friendlyBall = __webpack_require__(18);
	
	var _friendlyBall2 = _interopRequireDefault(_friendlyBall);
	
	var _neutralBall = __webpack_require__(19);
	
	var _neutralBall2 = _interopRequireDefault(_neutralBall);
	
	var _playerBall = __webpack_require__(17);
	
	var _playerBall2 = _interopRequireDefault(_playerBall);
	
	var _brick = __webpack_require__(20);
	
	var _brick2 = _interopRequireDefault(_brick);
	
	var _squareBrick = __webpack_require__(21);
	
	var _squareBrick2 = _interopRequireDefault(_squareBrick);
	
	var _gate = __webpack_require__(22);
	
	var _gate2 = _interopRequireDefault(_gate);
	
	var _blackHole = __webpack_require__(23);
	
	var _blackHole2 = _interopRequireDefault(_blackHole);
	
	var _scorePoint = __webpack_require__(24);
	
	var _scorePoint2 = _interopRequireDefault(_scorePoint);
	
	var _menuButton = __webpack_require__(25);
	
	var _menuButton2 = _interopRequireDefault(_menuButton);
	
	var _menu = __webpack_require__(26);
	
	var _menu2 = _interopRequireDefault(_menu);
	
	var _level = __webpack_require__(27);
	
	var _level2 = _interopRequireDefault(_level);
	
	var _constants = __webpack_require__(15);
	
	var _frameworkFunctions = __webpack_require__(16);
	
	var _globalAudioContext = __webpack_require__(6);
	
	var _audioPlayer = __webpack_require__(5);
	
	var _audioPlayer2 = _interopRequireDefault(_audioPlayer);
	
	var _sounds = __webpack_require__(4);
	
	var _sounds2 = _interopRequireDefault(_sounds);
	
	var _gameSettings = __webpack_require__(7);
	
	var _gameSettings2 = _interopRequireDefault(_gameSettings);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.testCollisionWithScorePoints = exports.testCollisionWithBricks = exports.resetBallAfterBrickCollision = exports.testCollisionWithWalls = exports.circRectsOverlap = exports.circleCollide = undefined;
	
	var _mathUtils = __webpack_require__(3);
	
	var _sounds = __webpack_require__(4);
	
	var _sounds2 = _interopRequireDefault(_sounds);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function circleCollide(x1, y1, r1, x2, y2, r2) {
	  var dx = x1 - x2;
	  var dy = y1 - y2;
	  return dx * dx + dy * dy < (r1 + r2) * (r1 + r2);
	}
	
	function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
	  var testX = cx;
	  var testY = cy;
	
	  if (testX < x0) testX = x0;
	  if (testX > x0 + w0) testX = x0 + w0;
	  if (testY < y0) testY = y0;
	  if (testY > y0 + h0) testY = y0 + h0;
	
	  return (cx - testX) * (cx - testX) + (cy - testY) * (cy - testY) < r * r;
	}
	
	function testCollisionWithWalls(w, h, gameAreaBorder, ball) {
	  // left
	  if (ball.x < ball.radius + gameAreaBorder) {
	    ball.x = ball.radius + gameAreaBorder;
	    ball.collisionReset(Math.PI / 2); // set current values like speed, angle, and reset run time to zero
	    ball.angle = -ball.angle + Math.PI;
	  }
	  // right
	  if (ball.x > w - gameAreaBorder - ball.radius) {
	    ball.x = w - gameAreaBorder - ball.radius;
	    ball.collisionReset(Math.PI / 2);
	    ball.angle = -ball.angle + Math.PI;
	  }
	  // up
	  if (ball.y < ball.radius + gameAreaBorder) {
	    ball.y = ball.radius + gameAreaBorder;
	    ball.collisionReset(Math.PI);
	    ball.angle = -ball.angle;
	  }
	  // down
	  if (ball.y > h - gameAreaBorder - ball.radius) {
	    ball.y = h - gameAreaBorder - ball.radius;
	    ball.collisionReset(Math.PI);
	    ball.angle = -ball.angle;
	  }
	}
	
	function ballBrickCollisionSides(ball, brick) {
	  // TODO this logic should be changed. Use should use lengths from ball center to walls
	  // and find closest pair of dots this will be collision side.
	  // if there are among rest dots pair of non closest dots than there is side dot hit.
	  var sides = [];
	
	  var distances = {};
	  var sideKeys = Object.keys(brick.coordinatesHash);
	  for (var i in sideKeys) {
	    distances[sideKeys[i]] = (0, _mathUtils.dotLineLength)(ball.x, ball.y, brick.coordinatesHash[sideKeys[i]].x1, brick.coordinatesHash[sideKeys[i]].y1, brick.coordinatesHash[sideKeys[i]].x2, brick.coordinatesHash[sideKeys[i]].y2, true);
	  }
	
	  // console.log(distances);
	
	  var distanceSideKeys = Object.keys(distances);
	  var sortedDistanceSidesInAscendingOrder = distanceSideKeys.sort(function (a, b) {
	    return distances[a] - distances[b];
	  });
	
	  sides.push(sortedDistanceSidesInAscendingOrder[0]);
	  // TODO: Find better coefficient for this
	  if (Math.abs(distances[sortedDistanceSidesInAscendingOrder[0]] - distances[sortedDistanceSidesInAscendingOrder[1]]) < 0.5) {
	    sides.push(sortedDistanceSidesInAscendingOrder[1]);
	  }
	
	  return sides;
	}
	
	function resetBallAfterBrickCollision(ball, brick) {
	  // still this code needs fixes.
	  // collision detection is not accurate enough
	  var sides = ballBrickCollisionSides(ball, brick);
	
	  // console.log(sides);
	  if (ball.v > 0) {
	    brick.drawCollision(sides);
	  }
	
	  // 45 degree collision with brick's facet
	  // if (sides.length == 2) {
	  //   // var offset = ball.radius / Math.sqrt(2); // Pythagorean theorem https://en.wikipedia.org/wiki/Pythagorean_theorem
	  //   // if (ball.v == 0) {
	  //   //   offset = ball.radius;
	  //   // }
	
	  //   var offset = ball.radius;
	
	  //   if ( (sides.indexOf("left") != -1) && (sides.indexOf("bottom") != -1) ) {
	  //     ball.collisionReset(Math.PI/4);
	  //     // ball.angle = 3*Math.PI/4;
	  //     ball.angle = - ball.angle + Math.PI;
	  //     ball.x = (brick.x - offset);
	  //     ball.y = (brick.y + brick.height + offset);
	  //     // console.log("left and bottom 45");
	  //   }
	
	  //   if ( (sides.indexOf("top") != -1) && (sides.indexOf("right") != -1) ) {
	  //     ball.collisionReset(Math.PI/4);
	  //     // ball.angle = 7*Math.PI/4;
	  //     ball.angle = - ball.angle + Math.PI;
	  //     ball.x = (brick.x + brick.width + offset);
	  //     ball.y = (brick.y - offset);
	  //     // console.log("top and right 45");
	  //   }
	
	  //   if ( (sides.indexOf("left") != -1) && (sides.indexOf("top") != -1) ) {
	  //     ball.collisionReset(3*Math.PI/4);
	  //     // ball.angle = 5*Math.PI/4;
	  //     ball.angle = - ball.angle + Math.PI;
	  //     ball.x = (brick.x - offset);
	  //     ball.y = (brick.y - offset);
	  //     // console.log("left and top 135");
	  //   }
	
	  //   if ( (sides.indexOf("right") != -1) && (sides.indexOf("bottom") != -1) ) {
	  //     ball.collisionReset(3*Math.PI/4);
	  //     // ball.angle = Math.PI/4;
	  //     ball.angle = - ball.angle + Math.PI;
	  //     ball.x = (brick.x + brick.width + offset);
	  //     ball.y = (brick.y + brick.height + offset);
	  //     // console.log("right and bottom 135");
	  //   }
	
	  // // brick side collisions
	  // } else
	  if (sides.indexOf("left") != -1) {
	    ball.x = brick.x - ball.radius;
	    ball.collisionReset(Math.PI / 2);
	    ball.angle = -ball.angle + Math.PI;
	    // console.log("left");
	  } else if (sides.indexOf("right") != -1) {
	      ball.x = brick.x + brick.width + ball.radius;
	      ball.collisionReset(Math.PI / 2);
	      ball.angle = -ball.angle + Math.PI;
	      // console.log("right");
	    } else if (sides.indexOf("bottom") != -1) {
	        ball.y = brick.y + brick.height + ball.radius;
	        ball.collisionReset(Math.PI);
	        ball.angle = -ball.angle;
	        // console.log("bottom");
	      } else if (sides.indexOf("top") != -1) {
	          ball.y = brick.y - ball.radius;
	          ball.collisionReset(Math.PI);
	          ball.angle = -ball.angle;
	          // console.log("top");
	
	          // When ball is slipping (rotating) from the edge
	          if (ball.x < brick.coordinatesHash.top.x1) {
	            ball.x = ball.x - 3;
	          } else if (ball.x > brick.coordinatesHash.top.x2) {
	            ball.x = ball.x + 3;
	          }
	        }
	}
	
	function testCollisionWithBricks(bricksArray, ball) {
	  var removeAtIndexes = [];
	  for (var i = 0; i < bricksArray.length; i++) {
	    if (circRectsOverlap(bricksArray[i].x, bricksArray[i].y, bricksArray[i].width, bricksArray[i].height, ball.x, ball.y, ball.radius)) {
	      if (bricksArray[i].constructor.name == "BreakableBrick") {
	        removeAtIndexes.push(i);
	        _sounds2.default.play("breakableBrickHit");
	      }
	      resetBallAfterBrickCollision(ball, bricksArray[i]);
	    }
	  }
	
	  return bricksArray.filter(function (brick, index) {
	    return !removeAtIndexes.includes(index);
	  });
	}
	
	function testCollisionWithScorePoints(scorePointsArray, ball) {
	  var removeAtIndexes = [];
	  for (var i = 0; i < scorePointsArray.length; i++) {
	    if (circleCollide(scorePointsArray[i].x, scorePointsArray[i].y, scorePointsArray[i].radius, ball.x, ball.y, ball.radius)) {
	      removeAtIndexes.push(i);
	      _sounds2.default.play("scorePointHit");
	    }
	  }
	
	  return {
	    "available": scorePointsArray.filter(function (brick, index) {
	      return !removeAtIndexes.includes(index);
	    }),
	    "collected": scorePointsArray.filter(function (brick, index) {
	      return removeAtIndexes.includes(index);
	    })
	  };
	}
	
	exports.circleCollide = circleCollide;
	exports.circRectsOverlap = circRectsOverlap;
	exports.testCollisionWithWalls = testCollisionWithWalls;
	exports.resetBallAfterBrickCollision = resetBallAfterBrickCollision;
	exports.testCollisionWithBricks = testCollisionWithBricks;
	exports.testCollisionWithScorePoints = testCollisionWithScorePoints;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function findNewPointBy(x, y, angle, distance) {
	  var result = {};
	
	  result.x = Math.round(Math.cos(angle) * distance + x);
	  result.y = Math.round(Math.sin(angle) * distance + y);
	
	  return result;
	}
	
	function randomArrayValue(array) {
	  return array[Math.floor(Math.random() * array.length)];
	}
	
	function distanceBettweenToPoints(x1, y1, x2, y2) {
	  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	}
	
	function angleBetween2Lines(x1, y1, x2, y2, x3, y3, x4, y4) {
	  return Math.atan2(y2 - y1, x2 - x1);
	}
	
	// http://jsfromhell.com/math/dot-line-length
	// dotLineLength(x: Integer, y: Integer, x0: Integer, y0: Integer, x1: Integer, y1: Integer, [overLine: Boolean = False]): Double
	// Distance from a point to a line or segment.
	// x - point's x coord
	// y - point's y coord
	// x0 - x coord of the line's A point
	// y0 - y coord of the line's A point
	// x1 - x coord of the line's B point
	// y1 - y coord of the line's B point
	// overLine - specifies if the distance should respect the limits of the segment (overLine = true)
	//            or if it should consider the segment as an infinite line (overLine = false),
	//            if false returns the distance from the point to the line, otherwise the distance from
	//            the point to the segment
	function dotLineLength(x, y, x0, y0, x1, y1, o) {
	  function lineLength(x, y, x0, y0) {
	    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
	  }
	  if (o && !(o = function (x, y, x0, y0, x1, y1) {
	    if (!(x1 - x0)) return { x: x0, y: y };else if (!(y1 - y0)) return { x: x, y: y0 };
	    var left,
	        tg = -1 / ((y1 - y0) / (x1 - x0));
	    return { x: left = (x1 * (x * tg - y + y0) + x0 * (x * -tg + y - y1)) / (tg * (x1 - x0) + y0 - y1), y: tg * left - tg * x + y };
	  }(x, y, x0, y0, x1, y1), o.x >= Math.min(x0, x1) && o.x <= Math.max(x0, x1) && o.y >= Math.min(y0, y1) && o.y <= Math.max(y0, y1))) {
	    var l1 = lineLength(x, y, x0, y0),
	        l2 = lineLength(x, y, x1, y1);
	    return l1 > l2 ? l2 : l1;
	  } else {
	    var a = y0 - y1,
	        b = x1 - x0,
	        c = x0 * y1 - y0 * x1;
	    return Math.abs(a * x + b * y + c) / Math.sqrt(a * a + b * b);
	  }
	}
	
	// We want the object to move at speed pixels/s (there are 60 frames in a second)
	// If we are really running at 60 frames/s, the delay between frames should be 1/60
	// = 16.66 ms, so the number of pixels to move = (speed * del)/1000. If the delay is twice
	// longer, the formula works
	function calcDistanceToMove(delta, speed) {
	  //console.log("#delta = " + delta + " speed = " + speed);
	  return speed * delta / 1000;
	}
	
	function moveFromToLocationOffsetsXY(fromX, fromY, toX, toY, speed) {
	  var angle = Math.atan2(toY - fromY, toX - fromX);
	  return [Math.cos(angle) * speed, Math.sin(angle) * speed];
	}
	
	function msToSeconds(timeMs) {
	  return timeMs / 1000;
	}
	
	// Taken from here http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb/12342275#12342275
	function hex2rgb(hex, opacity) {
	  var h = hex.replace('#', '');
	  h = h.match(new RegExp('(.{' + h.length / 3 + '})', 'g'));
	
	  for (var i = 0; i < h.length; i++) {
	    h[i] = parseInt(h[i].length == 1 ? h[i] + h[i] : h[i], 16);
	  }if (typeof opacity != 'undefined') h.push(opacity);
	
	  return 'rgba(' + h.join(',') + ')';
	}
	
	// https://jsfiddle.net/xg7tek9j/7/
	function generateUUID() {
	  var d = new Date().getTime();
	  if (window.performance && typeof window.performance.now === "function") {
	    d += performance.now();; //use high-precision timer if available
	  }
	  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	    var r = (d + Math.random() * 16) % 16 | 0;
	    d = Math.floor(d / 16);
	    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
	  });
	  return uuid;
	};
	
	exports.distanceBettweenToPoints = distanceBettweenToPoints;
	exports.angleBetween2Lines = angleBetween2Lines;
	exports.dotLineLength = dotLineLength;
	exports.calcDistanceToMove = calcDistanceToMove;
	exports.msToSeconds = msToSeconds;
	exports.hex2rgb = hex2rgb;
	exports.moveFromToLocationOffsetsXY = moveFromToLocationOffsetsXY;
	exports.generateUUID = generateUUID;
	exports.findNewPointBy = findNewPointBy;
	exports.randomArrayValue = randomArrayValue;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _audioPlayer = __webpack_require__(5);
	
	var _audioPlayer2 = _interopRequireDefault(_audioPlayer);
	
	var _gameSettings = __webpack_require__(7);
	
	var _gameSettings2 = _interopRequireDefault(_gameSettings);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  "sounds": {
	    "ballCollisionHit": new _audioPlayer2.default("audio/sounds/269718__michorvath__ping-pong-ball-hit.wav", { gainCoefficient: 2 }),
	    "ballToBallCollisionHit": new _audioPlayer2.default("audio/sounds/269718__michorvath__ping-pong-ball-hit.wav"),
	    "scorePointHit": new _audioPlayer2.default("audio/sounds/349282__adam-n__coin-on-coins-10.wav"),
	    "breakableBrickHit": new _audioPlayer2.default("audio/sounds/42902__freqman__glass-break-4.wav"),
	    "lostInBlackHole": new _audioPlayer2.default("audio/sounds/206138__robinhood76__04673-small-short-sucking-whoosh.wav"),
	    "levelComplete": new _audioPlayer2.default("audio/sounds/337049__shinephoenixstormcrow__320655-rhodesmas-level-up-01.mp3"),
	    "blackHoleDisappear": new _audioPlayer2.default("audio/sounds/162461__kastenfrosch__bordtransmitter.mp3", { gainCoefficient: 2 }),
	    "gameOver": new _audioPlayer2.default("audio/sounds/339837__rocotilos__8-bit-game-over.wav"),
	    "menuButtonCursorHover": new _audioPlayer2.default("audio/sounds/198448__callum-sharp279__menu-scroll-selection-sound.wav")
	  },
	  play: function play(soundName) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    if (_gameSettings2.default.read().areSoundsOn) {
	      this.getPlayerFor(soundName).play(options);
	    }
	    return this.getPlayerFor(soundName);
	  },
	  getPlayerFor: function getPlayerFor(soundName) {
	    return this.sounds[soundName];
	  }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _globalAudioContext = __webpack_require__(6);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var AudioPlayer = function () {
	  function AudioPlayer(url) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    _classCallCheck(this, AudioPlayer);
	
	    this.url = url;
	
	    this.gainCoefficient = options["gainCoefficient"] || 1;
	
	    this.loop = options["loop"] || false;
	
	    this._loadBuffer();
	
	    this.status = "stopped";
	  }
	
	  _createClass(AudioPlayer, [{
	    key: "isLoaded",
	    value: function isLoaded() {
	      return this.buffer instanceof AudioBuffer;
	    }
	  }, {
	    key: "play",
	    value: function play() {
	      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	      if (this.isLoaded()) {
	        this._playSound(options);
	      } else {
	        this.waitToPlayWithOptions = options;
	      }
	      this.status = "playing";
	    }
	  }, {
	    key: "stop",
	    value: function stop() {
	      if (this.isLoaded) {
	        this.sourceNode && this.sourceNode.stop();
	      }
	      this.status = "stopped";
	    }
	  }, {
	    key: "_playSound",
	    value: function _playSound() {
	      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	      // build graph source -> gain -> compressor -> speakers
	      var sourceNode = (0, _globalAudioContext.getAudioContext)().createBufferSource();
	      this.sourceNode = sourceNode;
	      sourceNode.loop = this.loop;
	      var compressorNode = (0, _globalAudioContext.getAudioContext)().createDynamicsCompressor();
	      var gainNode = (0, _globalAudioContext.getAudioContext)().createGain();
	
	      var gain = 1;
	      if (typeof options["gain"] != 'undefined') {
	        gain = options["gain"];
	      }
	
	      gainNode.gain.value = gain * this.gainCoefficient;
	
	      sourceNode.buffer = this.buffer;
	      sourceNode.connect(gainNode);
	      gainNode.connect(compressorNode);
	      compressorNode.connect((0, _globalAudioContext.getAudioContext)().destination);
	
	      sourceNode.start();
	    }
	  }, {
	    key: "_loadBuffer",
	    value: function _loadBuffer() {
	      // Load buffer asynchronously
	      console.log('file : ' + this.url + " loading and decoding");
	
	      var request = new XMLHttpRequest();
	      request.open("GET", this.url, true);
	
	      request.responseType = "arraybuffer";
	
	      var audioPlayer = this;
	
	      request.onload = function () {
	        // Asynchronously decode the audio file data in request.response
	        (0, _globalAudioContext.getAudioContext)().decodeAudioData(request.response, function (buffer) {
	          console.log("Loaded and decoded track " + audioPlayer.url);
	          if (!buffer) {
	            console.error('error decoding file data: ' + audioPlayer.url);
	            return;
	          }
	
	          audioPlayer.buffer = buffer;
	          if (audioPlayer.waitToPlayWithOptions) {
	            audioPlayer._playSound(audioPlayer.waitToPlayWithOptions);
	          }
	        }, function (error) {
	          console.error('decodeAudioData error', error);
	        });
	      };
	
	      request.onprogress = function (e) {
	        if (e.total !== 0) {
	          var percent = e.loaded * 100 / e.total;
	          console.log("loaded " + percent + " % of file ");
	        }
	      };
	
	      request.onerror = function () {
	        console.error('BufferLoader: XHR error');
	      };
	
	      request.send();
	    }
	  }]);
	
	  return AudioPlayer;
	}();
	
	exports.default = AudioPlayer;
	;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var audioContextObject = {};
	
	function getAudioContext() {
	  if (!audioContextObject.audioCtx) {
	    audioContextObject.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	  }
	  return audioContextObject.audioCtx;
	}
	
	exports.getAudioContext = getAudioContext;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  settings: {
	    areSoundsOn: true
	  },
	  read: function read() {
	    return this.settings;
	  },
	  update: function update() {
	    var hash = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    this.settings = Object.assign(this.settings, hash);
	  },
	  toggleBoolean: function toggleBoolean(key) {
	    this.settings[key] = !this.settings[key];
	  }
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function drawAxis(ctx, w, h, x, y, theta, r) {
	  ctx.save();
	  ctx.beginPath();
	  ctx.strokeStyle = 'Orange';
	  ctx.fillStyle = 'Orange';
	  ctx.moveTo(x, 0);
	  ctx.lineTo(x, h);
	  ctx.stroke();
	  ctx.moveTo(0, y);
	  ctx.lineTo(w, y);
	  ctx.stroke();
	  ctx.fillText("0", w - 25, y + 25);
	  ctx.fillText("90", x - 30, h - 25);
	  ctx.fillText("180", 25, y - 25);
	  ctx.fillText("270", x + 25, 50);
	
	  ctx.beginPath();
	  ctx.strokeStyle = 'Red';
	  ctx.moveTo(x, y);
	  ctx.lineTo(x + r * Math.cos(theta), y + r * Math.sin(theta));
	  ctx.stroke();
	
	  ctx.restore();
	}
	
	function updateTelemetry(telemetryContainer, ball) {
	  telemetryContainer.innerHTML = "";
	  telemetryContainer.innerHTML += '<br/>Initial Speed: ' + ball.v;
	  telemetryContainer.innerHTML += '<br/>Initial Angle: ' + ball.angle * (180 / Math.PI);
	  telemetryContainer.innerHTML += '<br/>Current Speed: ' + ball.currentVelocity();
	  telemetryContainer.innerHTML += '<br/>Current Angle: ' + ball.currentAngle() * (180 / Math.PI);
	  telemetryContainer.innerHTML += '<br/>Coordiates: X = ' + ball.x + " Y = " + ball.y;
	  telemetryContainer.innerHTML += '<br/>Hit angle: ' + ball.hitAngle * (180 / Math.PI) + ' Positive: ' + (ball.hitAngle > 0 ? ball.hitAngle : ball.hitAngle + 2 * Math.PI) * (180 / Math.PI);
	  telemetryContainer.innerHTML += '<br/>Hit velocity: ' + ball.hitVelocity;
	  telemetryContainer.innerHTML += '<br/>vX: ' + ball.vX();
	  telemetryContainer.innerHTML += '<br/>vY: ' + ball.vY();
	
	  // var anglesStr = "";
	  // for(var i =0; i <= ball.hits.length - 1; i++ ) {
	  //   if (true) {
	  //     anglesStr += (Math.round(ball.hits[i].angleBetween * (180/ Math.PI)) + ' ');
	  //   }
	  // }
	  // telemetryContainer.innerHTML += ('<br/> Hit angles: ' + anglesStr);
	}
	
	function drawCollisionAngles(ctx, w, h, ball) {
	  ctx.save();
	  for (var i = 0; i < ball.hits.length - 1; i++) {
	    var hit = ball.hits[i];
	    if (true) {
	      ctx.beginPath();
	      ctx.strokeStyle = 'LightGreen';
	      ctx.lineWidth = 2;
	      ctx.fillText(Math.round(hit.angleBetween * (180 / Math.PI)), (hit.x + w / 2) / 2, (hit.y + h / 2) / 2);
	      ctx.moveTo(hit.x, hit.y);
	      ctx.lineTo(w / 2, h / 2);
	      ctx.stroke();
	    }
	  }
	  ctx.restore();
	}
	
	exports.drawAxis = drawAxis;
	exports.updateTelemetry = updateTelemetry;
	exports.drawCollisionAngles = drawCollisionAngles;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  internalData: function internalData() {
	    if (!this.internalDataIsSet) {
	      this.canvas = document.querySelector("#myCanvas");
	      this.context2d = this.canvas.getContext('2d');
	      this.internalDataIsSet = true;
	    }
	    return this;
	  },
	  getCanvas: function getCanvas() {
	    return this.internalData().canvas;
	  },
	  getContext2D: function getContext2D() {
	    return this.internalData().context2d;
	  }
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _graphical = __webpack_require__(11);
	
	var _graphical2 = _interopRequireDefault(_graphical);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var GraphicBall = function (_Graphical) {
	  _inherits(GraphicBall, _Graphical);
	
	  function GraphicBall(x, y, diameter, color) {
	    _classCallCheck(this, GraphicBall);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GraphicBall).call(this));
	
	    _this.x = x;
	    _this.y = y;
	    _this.radius = diameter / 2;
	    _this.color = color;
	    _this.hotSpotColor = '#E0E0E0';
	    return _this;
	  }
	
	  _createClass(GraphicBall, [{
	    key: 'draw',
	    value: function draw() {
	      var ctx = this.context();
	      ctx.save();
	      ctx.beginPath();
	
	      var innerRadius = 1,
	          outerRadius = this.radius * 1;
	
	      var gradient = ctx.createRadialGradient(this.x - this.radius * 0.3, this.y - this.radius * 0.3, innerRadius, this.x - this.radius * 0.3, this.y - this.radius * 0.3, outerRadius);
	      gradient.addColorStop(0, this.hotSpotColor);
	      gradient.addColorStop(1, this.color);
	      ctx.fillStyle = gradient;
	      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	
	      ctx.shadowOffsetX = 1;
	      ctx.shadowOffsetY = 1;
	      ctx.shadowColor = 'black';
	      ctx.shadowBlur = 3;
	
	      ctx.fill();
	      ctx.restore();
	    }
	  }]);
	
	  return GraphicBall;
	}(_graphical2.default);
	
	exports.default = GraphicBall;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _canvasData = __webpack_require__(9);
	
	var _canvasData2 = _interopRequireDefault(_canvasData);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Graphical = function () {
	  function Graphical() {
	    _classCallCheck(this, Graphical);
	  }
	
	  _createClass(Graphical, [{
	    key: 'context',
	    value: function context() {
	      return _canvasData2.default.getContext2D();
	    }
	  }, {
	    key: 'canvas',
	    value: function canvas() {
	      return _canvasData2.default.getCanvas();
	    }
	  }]);
	
	  return Graphical;
	}();
	
	exports.default = Graphical;
	;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _automaticBall = __webpack_require__(13);
	
	var _automaticBall2 = _interopRequireDefault(_automaticBall);
	
	var _playerBall = __webpack_require__(17);
	
	var _playerBall2 = _interopRequireDefault(_playerBall);
	
	var _mathUtils = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CompetitorBall = function (_AutomaticBall) {
	  _inherits(CompetitorBall, _AutomaticBall);
	
	  function CompetitorBall() {
	    _classCallCheck(this, CompetitorBall);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(CompetitorBall).apply(this, arguments));
	  }
	
	  _createClass(CompetitorBall, [{
	    key: 'findTarget',
	    value: function findTarget(targetsArray) {
	      return (0, _mathUtils.randomArrayValue)(targetsArray.filter(function (targetObject, index) {
	        return targetObject instanceof _playerBall2.default;
	      }));
	    }
	  }]);
	
	  return CompetitorBall;
	}(_automaticBall2.default);
	
	exports.default = CompetitorBall;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ball = __webpack_require__(14);
	
	var _ball2 = _interopRequireDefault(_ball);
	
	var _mathUtils = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var AIMING_TIME = 5 * 1000; // 5 seconds
	
	var AutomaticBall = function (_Ball) {
	  _inherits(AutomaticBall, _Ball);
	
	  function AutomaticBall() {
	    _classCallCheck(this, AutomaticBall);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(AutomaticBall).apply(this, arguments));
	  }
	
	  _createClass(AutomaticBall, [{
	    key: 'findTarget',
	    value: function findTarget(targetsArray) {
	      return (0, _mathUtils.randomArrayValue)(targetsArray);
	    }
	  }, {
	    key: 'actionLogic',
	    value: function actionLogic(targetsArray, delta) {
	      var aimingSlingEndCoordinates = void 0;
	      if (!this.target || !!this.target && this.target.isAlive == false) {
	        this.target = this.findTarget(targetsArray);
	        this.aimingTimeRemaining = AIMING_TIME;
	      }
	      if (this.target) {
	        if (this.isInLaunchPosition()) {
	          this.drawSelection();
	          if (!this.aiming) {
	            this.aiming = true;
	          };
	          if (this.aiming) {
	            this.aimingTimeRemaining -= delta;
	          }
	          this.angle = (0, _mathUtils.angleBetween2Lines)(this.x, this.y, this.target.x, this.target.y, this.x, this.y, this.x + 25, this.y);
	
	          aimingSlingEndCoordinates = (0, _mathUtils.findNewPointBy)(this.x, this.y, Math.PI + this.angle, 100);
	
	          this.drawSlingTo(aimingSlingEndCoordinates.x, aimingSlingEndCoordinates.y);
	          //console.log(this.aimingTimeRemaining);
	          //console.log(delta);
	          if (this.aimingTimeRemaining <= 0) {
	            this.aiming = false;
	            this.target = null;
	            this.v = 500;
	          }
	        } else {
	          this.aimingTimeRemaining = AIMING_TIME;
	        }
	      }
	    }
	  }]);
	
	  return AutomaticBall;
	}(_ball2.default);
	
	exports.default = AutomaticBall;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _mathUtils = __webpack_require__(3);
	
	var _constants = __webpack_require__(15);
	
	var _graphicBall = __webpack_require__(10);
	
	var _graphicBall2 = _interopRequireDefault(_graphicBall);
	
	var _sounds = __webpack_require__(4);
	
	var _sounds2 = _interopRequireDefault(_sounds);
	
	var _frameworkFunctions = __webpack_require__(16);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Ball = function (_GraphicBall) {
	  _inherits(Ball, _GraphicBall);
	
	  function Ball(x, y, diameter, color, angle, v, slingColor) {
	    _classCallCheck(this, Ball);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Ball).call(this, x, y, diameter, color));
	
	    _this.angle = angle;
	    _this.v = v;
	    _this.runTime = 0;
	    _this.hitVelocity = 0;
	    _this.hitAngle = 0;
	    _this.hits = [];
	    _this.newParams = {};
	    _this.slingColor = slingColor;
	    _this.uuid = (0, _mathUtils.generateUUID)();
	    return _this;
	  }
	
	  _createClass(Ball, [{
	    key: 'collisionSound',
	    value: function collisionSound() {
	      _sounds2.default.play("ballCollisionHit", { "gain": (0, _frameworkFunctions.calculateSoundGainForBallCollision)(this.v) });
	    }
	  }, {
	    key: 'resetPosition',
	    value: function resetPosition(x, y) {
	      this.x = x;
	      this.y = y;
	      this.angle = 0;
	      this.v = 0;
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      var ctx = this.context();
	      ctx.save();
	      ctx.beginPath();
	
	      var innerRadius = 1,
	          outerRadius = this.radius * 1;
	
	      var gradient = ctx.createRadialGradient(this.x - this.radius * 0.3, this.y - this.radius * 0.3, innerRadius, this.x - this.radius * 0.3, this.y - this.radius * 0.3, outerRadius);
	      gradient.addColorStop(0, '#E0E0E0');
	      gradient.addColorStop(1, this.color);
	      ctx.fillStyle = gradient;
	      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	
	      ctx.shadowOffsetX = 1;
	      ctx.shadowOffsetY = 1;
	      ctx.shadowColor = 'black';
	      ctx.shadowBlur = 3;
	
	      ctx.fill();
	      ctx.restore();
	    }
	  }, {
	    key: 'drawSelection',
	    value: function drawSelection() {
	      var ctx = this.context();
	      ctx.save();
	      ctx.beginPath();
	      if (this.isInLaunchPosition()) {
	        ctx.beginPath();
	        ctx.strokeStyle = this.slingColor;
	        ctx.lineWidth = 3;
	        ctx.arc(this.x, this.y, this.radius + 3, 0, 2 * Math.PI);
	        ctx.stroke();
	      };
	      ctx.restore();
	    }
	  }, {
	    key: 'drawSlingTo',
	    value: function drawSlingTo(toX, toY) {
	      var ctx = this.context();
	      ctx.save();
	      ctx.beginPath();
	      ctx.strokeStyle = this.slingColor;
	      ctx.lineWidth = 3;
	      ctx.moveTo(this.x, this.y);
	      ctx.lineTo(toX, toY);
	      ctx.stroke();
	    }
	  }, {
	    key: 'vX',
	    value: function vX() {
	      return this.v * Math.cos(this.angle);
	    }
	  }, {
	    key: 'vY',
	    value: function vY() {
	      return this.v * Math.sin(this.angle) + _constants.GRAVITY_ACCELERATION * this.runTime;
	    }
	  }, {
	    key: 'currentVelocity',
	    value: function currentVelocity() {
	      return Math.sqrt(this.vX() * this.vX() + this.vY() * this.vY());
	    }
	  }, {
	    key: 'currentAngle',
	    value: function currentAngle() {
	      var value = Math.atan2(this.vY(), this.vX());
	      return isNaN(value) ? 0 : value;
	    }
	  }, {
	    key: 'move',
	    value: function move(delta) {
	      // add horizontal increment to the x pos
	      // add vertical increment to the y pos
	
	      this.runTime += delta;
	
	      var incX = this.vX();
	      var incY = this.vY();
	
	      this.x += (0, _mathUtils.calcDistanceToMove)(delta, incX);
	      this.y += (0, _mathUtils.calcDistanceToMove)(delta, incY);
	    }
	  }, {
	    key: 'smallestCollisionAngle',
	    value: function smallestCollisionAngle(surfaceAngle) {
	      var smallestAngle = Math.abs(Math.atan2(Math.sin(surfaceAngle - this.currentAngle()), Math.cos(surfaceAngle - this.currentAngle())));
	      smallestAngle = smallestAngle > Math.PI / 2 ? Math.abs(Math.PI - smallestAngle) : smallestAngle;
	      return smallestAngle;
	    }
	  }, {
	    key: 'playCollisonSoundForAngle',
	    value: function playCollisonSoundForAngle(surfaceAngle) {
	      // if collision angle is more than 5 degrees (empyrical value)
	      if (this.smallestCollisionAngle(surfaceAngle) > 5 * (Math.PI / 180)) {
	        this.collisionSound();
	      }
	    }
	  }, {
	    key: 'collisionReset',
	    value: function collisionReset(surfaceAngle) {
	      this.playCollisonSoundForAngle(surfaceAngle);
	
	      var frictionReduction = 0.01; // ball rolls, velocity reduction factor per collision
	      var speedCollisionReduction = 0.1; // ball hits velocity reduction factor per collision
	      // TODO use speed this formula too http://stackoverflow.com/questions/9424459/calculate-velocity-and-direction-of-a-ball-to-ball-collision-based-on-mass-and-b
	      // Use speed reduction coefficient
	      // v -  coefficient * v * angleCoefficient
	      // v * (1 - coefficient * angleCoefficient)
	
	      this.runTime = 0;
	      this.angle = this.currentAngle();
	      this.hitAngle = this.angle;
	      this.hitVelocity = this.v;
	
	      var smallestAngle = this.smallestCollisionAngle(surfaceAngle);
	
	      this.hits.push({
	        angleBetween: smallestAngle,
	        angle: this.hitAngle,
	        x: this.x,
	        y: this.y
	      });
	
	      // You should use ball's hit side and angle to this side.
	      // So, means ball could glide both by x and y coodinates
	      // There are two situations gliding (rolling) and hit.
	      // Each one depends on angle and hit side
	      // x = smallestAngle / (Math.PI / 2)
	
	      // this.v = this.currentVelocity() - ((2 * smallestAngle) / Math.PI) * speedCollisionReduction - frictionReduction;
	      this.v = this.currentVelocity() * (1 - speedCollisionReduction * (2 * smallestAngle / Math.PI) - frictionReduction);
	
	      if (this.v < 1) {
	        this.v = 0;
	      }
	    }
	  }, {
	    key: 'isInLaunchPosition',
	    value: function isInLaunchPosition() {
	      return this.v == 0;
	    }
	  }]);
	
	  return Ball;
	}(_graphicBall2.default);
	
	exports.default = Ball;

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// Gravity
	// 9.8 m/s2
	// We use ms as time
	// Suppose that 1 px is 1 mm than
	// 1 m = 1000 mm
	// 9.8 * 1000 mm / (1000 ms * 1000 ms)
	// 9.8 * 1000 / ( 1000 * 1000 ) =0.0098 px/ms2
	var GRAVITY_ACCELERATION = 0.098;
	var GAME_AREA_BORDER = 100; // px
	var MAX_POWER_INIT = 100;
	var POWER_BOOST = 5;
	var GAME_NAME = "Ball Game v1.0";
	
	exports.GRAVITY_ACCELERATION = GRAVITY_ACCELERATION;
	exports.GAME_AREA_BORDER = GAME_AREA_BORDER;
	exports.MAX_POWER_INIT = MAX_POWER_INIT;
	exports.POWER_BOOST = POWER_BOOST;
	exports.GAME_NAME = GAME_NAME;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.calculateSoundGainForBallCollision = exports.updateBlackHoles = exports.checkBallControllable = exports.drawGameAreaBorder = exports.updateGates = exports.updatePlayerCursor = exports.clearCanvas = undefined;
	
	var _constants = __webpack_require__(15);
	
	var _collisionDetection = __webpack_require__(2);
	
	var _mathUtils = __webpack_require__(3);
	
	function calculateSoundGainForBallCollision(speed) {
	  var gainValue = speed / (_constants.POWER_BOOST * _constants.MAX_POWER_INIT);
	  if (gainValue > 1) {
	    gainValue = 1;
	  }
	  return gainValue;
	}
	
	function clearCanvas(ctx, canvas) {
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	function updatePlayerCursor(player, inputStates) {
	  // The player is just a circle, drawn at the mouse position
	  // Just to test circle/circle collision.
	
	  if (inputStates.mousePos) {
	    player.x = inputStates.mousePos.x;
	    player.y = inputStates.mousePos.y;
	
	    // draws a circle
	    // ctx.beginPath();
	    // ctx.arc(player.x, player.y, player.boundingCircleRadius, 0, 2*Math.PI);
	    // ctx.stroke();
	  }
	}
	
	function updateGates(gatesArray) {
	  for (var i = 0; i < gatesArray.length; i++) {
	    gatesArray[i].draw();
	  }
	}
	
	function updateBlackHoles(blackHolesArray, delta) {
	  blackHolesArray = blackHolesArray.filter(function (blackHole) {
	    return !blackHole.isDisappeared();
	  });
	  for (var i = 0; i < blackHolesArray.length; i++) {
	    blackHolesArray[i].draw(delta);
	  }
	
	  return blackHolesArray;
	}
	
	function drawGameAreaBorder(ctx, canvas) {
	  var w = canvas.width,
	      h = canvas.height;
	  ctx.save();
	  ctx.beginPath();
	  ctx.rect(0, 0, w, _constants.GAME_AREA_BORDER);
	  ctx.rect(0, h - _constants.GAME_AREA_BORDER, w, _constants.GAME_AREA_BORDER);
	  ctx.rect(0, _constants.GAME_AREA_BORDER, _constants.GAME_AREA_BORDER, h - 2 * _constants.GAME_AREA_BORDER);
	  ctx.rect(w - _constants.GAME_AREA_BORDER, _constants.GAME_AREA_BORDER, w - _constants.GAME_AREA_BORDER, h - 2 * _constants.GAME_AREA_BORDER);
	  ctx.fillStyle = "#707070";
	  ctx.fill();
	  ctx.strokeStyle = "#383838";
	  ctx.rect(_constants.GAME_AREA_BORDER, _constants.GAME_AREA_BORDER, w - 2 * _constants.GAME_AREA_BORDER, h - 2 * _constants.GAME_AREA_BORDER);
	  ctx.stroke();
	  ctx.fillStyle = '#00cc44';
	  ctx.font = "25px Arial";
	  ctx.fillText(_constants.GAME_NAME, 30, h - 30);
	  ctx.restore();
	}
	
	function checkBallControllable(ball, player, inputStates, powerBoost, ctx) {
	  if ((0, _collisionDetection.circleCollide)(player.x, player.y, player.boundingCircleRadius, ball.x, ball.y, ball.radius)) {
	    ball.drawSelection();
	  }
	
	  if (ball.isInLaunchPosition() && inputStates.mouseDownPos && (0, _collisionDetection.circleCollide)(inputStates.mouseDownPos.x, inputStates.mouseDownPos.y, player.boundingCircleRadius, ball.x, ball.y, ball.radius)) {
	    ball.drawSelection();
	
	    if (inputStates.mousedown) {
	
	      var powerInit = (0, _mathUtils.distanceBettweenToPoints)(ball.x, ball.y, inputStates.mousePos.x, inputStates.mousePos.y);
	      if (powerInit > _constants.MAX_POWER_INIT) {
	        powerInit = _constants.MAX_POWER_INIT;
	      }
	      var angle = (0, _mathUtils.angleBetween2Lines)(ball.x, ball.y, inputStates.mousePos.x, inputStates.mousePos.y, ball.x, ball.y, ball.x + 25, ball.y);
	
	      ball.newParams = {
	        angle: Math.PI + angle,
	        v: powerInit * powerBoost,
	        isSet: true
	      };
	
	      ball.drawSlingTo(ball.x + powerInit * Math.cos(2 * Math.PI + angle), ball.y + powerInit * Math.sin(2 * Math.PI + angle));
	
	      ctx.save();
	      ctx.fillStyle = "#33CC33";
	      ctx.fillText("Angle: " + ((2 * Math.PI - (Math.PI + angle)) * (180 / Math.PI)).toFixed(2), 470, 30);
	      ctx.fillText("Speed: " + ball.newParams.v.toFixed(2), 470, 55);
	      ctx.fillText("Power: " + powerInit.toFixed(2), 470, 80);
	      // ctx.beginPath();
	      // ctx.strokeStyle = 'LightGreen';
	      // ctx.lineWidth = 3;
	      // ctx.moveTo(ball.x, ball.y);
	      // ctx.lineTo(ball.x + powerInit * Math.cos(2*Math.PI+angle), ball.y + powerInit * Math.sin(2*Math.PI+angle));
	      // ctx.lineTo(ball.x - 500 * Math.cos(2*Math.PI+angle), ball.y - 500 * Math.sin(2*Math.PI+angle));
	      // ctx.lineTo(inputStates.mousePos.x, inputStates.mousePos.y);
	      //ctx.stroke();
	      // ctx.beginPath();
	      // ctx.strokeStyle = 'BlueViolet';
	      // ctx.fillStyle = 'BlueViolet';
	      // ctx.moveTo(ball.x, 0);
	      // ctx.lineTo(ball.x, h);
	      // ctx.stroke();
	      // ctx.moveTo(0, ball.y);
	      // ctx.lineTo(w, ball.y);
	      // ctx.stroke();
	      // ctx.fillText("0", w-25, ball.y+25);
	      // ctx.fillText("90", ball.x-30, h-25);
	      // ctx.fillText("180", 25, ball.y-25);
	      // ctx.fillText("270", ball.x+25, 50);
	      // ctx.fillStyle = 'Black';
	
	      ctx.restore();
	    }
	  }
	
	  if (ball.newParams.isSet && !inputStates.mousedown) {
	    ball.angle = ball.newParams.angle;
	    ball.v = ball.newParams.v;
	    ball.newParams.isSet = false;
	  }
	}
	
	exports.clearCanvas = clearCanvas;
	exports.updatePlayerCursor = updatePlayerCursor;
	exports.updateGates = updateGates;
	exports.drawGameAreaBorder = drawGameAreaBorder;
	exports.checkBallControllable = checkBallControllable;
	exports.updateBlackHoles = updateBlackHoles;
	exports.calculateSoundGainForBallCollision = calculateSoundGainForBallCollision;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _ball = __webpack_require__(14);
	
	var _ball2 = _interopRequireDefault(_ball);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var PlayerBall = function (_Ball) {
	  _inherits(PlayerBall, _Ball);
	
	  function PlayerBall() {
	    _classCallCheck(this, PlayerBall);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(PlayerBall).apply(this, arguments));
	  }
	
	  return PlayerBall;
	}(_ball2.default);
	
	exports.default = PlayerBall;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _automaticBall = __webpack_require__(13);
	
	var _automaticBall2 = _interopRequireDefault(_automaticBall);
	
	var _competitorBall = __webpack_require__(12);
	
	var _competitorBall2 = _interopRequireDefault(_competitorBall);
	
	var _mathUtils = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var FriendlyBall = function (_AutomaticBall) {
	  _inherits(FriendlyBall, _AutomaticBall);
	
	  function FriendlyBall() {
	    _classCallCheck(this, FriendlyBall);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(FriendlyBall).apply(this, arguments));
	  }
	
	  _createClass(FriendlyBall, [{
	    key: 'findTarget',
	    value: function findTarget(targetsArray) {
	      return (0, _mathUtils.randomArrayValue)(targetsArray.filter(function (targetObject, index) {
	        return targetObject instanceof _competitorBall2.default;
	      }));
	    }
	  }]);
	
	  return FriendlyBall;
	}(_automaticBall2.default);
	
	exports.default = FriendlyBall;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _ball = __webpack_require__(14);
	
	var _ball2 = _interopRequireDefault(_ball);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var NeutralBall = function (_Ball) {
	  _inherits(NeutralBall, _Ball);
	
	  function NeutralBall() {
	    _classCallCheck(this, NeutralBall);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(NeutralBall).apply(this, arguments));
	  }
	
	  return NeutralBall;
	}(_ball2.default);
	
	exports.default = NeutralBall;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _graphical = __webpack_require__(11);
	
	var _graphical2 = _interopRequireDefault(_graphical);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Brick = function (_Graphical) {
	  _inherits(Brick, _Graphical);
	
	  function Brick(x, y, width, height, color) {
	    _classCallCheck(this, Brick);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Brick).call(this));
	
	    _this.x = x;
	    _this.y = y;
	    _this.width = width;
	    _this.height = height;
	    _this.color = color;
	
	    _this.coordinatesHash = {
	      bottom: {
	        x1: _this.x,
	        y1: _this.y + _this.height,
	        x2: _this.x + _this.width,
	        y2: _this.y + _this.height
	      },
	      top: {
	        x1: _this.x,
	        y1: _this.y,
	        x2: _this.x + _this.width,
	        y2: _this.y
	      },
	      left: {
	        x1: _this.x,
	        y1: _this.y,
	        x2: _this.x,
	        y2: _this.y + _this.height
	      },
	      right: {
	        x1: _this.x + _this.width,
	        y1: _this.y,
	        x2: _this.x + _this.width,
	        y2: _this.y + _this.height
	      }
	    };
	    return _this;
	  }
	
	  _createClass(Brick, [{
	    key: 'draw',
	    value: function draw() {
	      var ctx = this.context();
	      ctx.save();
	      ctx.beginPath();
	
	      var gradientOffset = this.width > this.height ? this.height : this.width;
	
	      var gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
	      gradient.addColorStop(0, '#E0E0E0');
	      gradient.addColorStop(1, this.color);
	      ctx.fillStyle = gradient;
	
	      ctx.shadowOffsetX = 1;
	      ctx.shadowOffsetY = 1;
	      ctx.shadowColor = 'black';
	      ctx.shadowBlur = 3;
	
	      ctx.rect(this.x, this.y, this.width, this.height);
	      ctx.fill();
	      ctx.restore();
	    }
	  }, {
	    key: 'sideLineCoordinates',
	    value: function sideLineCoordinates(side) {
	      return this.coordinatesHash[side];
	    }
	  }, {
	    key: 'drawCollision',
	    value: function drawCollision(sides) {
	      var ctx = this.context();
	      ctx.save();
	      ctx.beginPath();
	      ctx.fillStyle = 'rgba(255, 0, 0 , 0.5)';
	      ctx.rect(this.x, this.y, this.width, this.height);
	      ctx.fill();
	      ctx.strokeStyle = 'LightGreen';
	      ctx.lineWidth = 3;
	      for (var i = 0; i < sides.length; i++) {
	        ctx.beginPath();
	        var lineCoordinates = this.sideLineCoordinates(sides[i]);
	        ctx.moveTo(lineCoordinates.x1, lineCoordinates.y1);
	        ctx.lineTo(lineCoordinates.x2, lineCoordinates.y2);
	        ctx.stroke();
	      }
	
	      ctx.restore();
	    }
	  }]);
	
	  return Brick;
	}(_graphical2.default);
	
	exports.default = Brick;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _brick = __webpack_require__(20);
	
	var _brick2 = _interopRequireDefault(_brick);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SquareBrick = function (_Brick) {
	  _inherits(SquareBrick, _Brick);
	
	  function SquareBrick(x, y, size, color) {
	    _classCallCheck(this, SquareBrick);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(SquareBrick).call(this, x, y, size, size, color));
	  }
	
	  return SquareBrick;
	}(_brick2.default);
	
	exports.default = SquareBrick;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _graphical = __webpack_require__(11);
	
	var _graphical2 = _interopRequireDefault(_graphical);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Gate = function (_Graphical) {
	  _inherits(Gate, _Graphical);
	
	  function Gate(x, y, diameter, text, color, type) {
	    _classCallCheck(this, Gate);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Gate).call(this));
	
	    _this.x = x;
	    _this.y = y;
	    _this.radius = diameter / 2;
	    _this.text = text;
	    _this.color = color;
	    _this.type = type; // start, finish
	    return _this;
	  }
	
	  _createClass(Gate, [{
	    key: "draw",
	    value: function draw() {
	      var ctx = this.context();
	      ctx.save();
	      ctx.beginPath();
	
	      ctx.fillStyle = "black";
	      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	      ctx.strokeStyle = "#808080";
	      ctx.lineWidth = 3;
	
	      ctx.stroke();
	      ctx.fill();
	
	      ctx.fillStyle = this.color;
	      ctx.font = Math.ceil(this.radius * 1.5).toString() + "px Arial";
	      ctx.fillText(this.text, this.x - this.radius / 2, this.y + this.radius / 2);
	
	      ctx.restore();
	    }
	  }]);
	
	  return Gate;
	}(_graphical2.default);
	
	exports.default = Gate;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _constants = __webpack_require__(15);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	var _graphical = __webpack_require__(11);
	
	var _graphical2 = _interopRequireDefault(_graphical);
	
	var _mathUtils = __webpack_require__(3);
	
	var _graphicBall = __webpack_require__(10);
	
	var _graphicBall2 = _interopRequireDefault(_graphicBall);
	
	var _sounds = __webpack_require__(4);
	
	var _sounds2 = _interopRequireDefault(_sounds);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var BlackHole = function (_Graphical) {
	  _inherits(BlackHole, _Graphical);
	
	  function BlackHole(x, y, diameter, contentsToCollapseNumber) {
	    _classCallCheck(this, BlackHole);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BlackHole).call(this));
	
	    _this.x = x;
	    _this.y = y;
	    _this.radius = diameter / 2;
	    _this.initialRadius = _this.radius;
	    _this.status = "active";
	    _this.contents = [];
	    _this.contentsToCollapseNumber = contentsToCollapseNumber;
	    return _this;
	  }
	
	  _createClass(BlackHole, [{
	    key: 'collapseRate',
	    value: function collapseRate() {
	      return this.radius / this.initialRadius;
	    }
	  }, {
	    key: 'calculateNewCollapseRadius',
	    value: function calculateNewCollapseRadius() {
	      if (!!this.contentsToCollapseNumber) {
	        if (this.contentsToCollapseNumber >= this.contents.length) {
	          return Math.floor((1 - this.contents.length / this.contentsToCollapseNumber) * this.initialRadius);
	        } else {
	          return 0;
	        }
	      }
	    }
	  }, {
	    key: 'draw',
	    value: function draw(delta) {
	      if (this.isCollapsing()) {
	        this.collapse(delta);
	      }
	
	      var ctx = this.context();
	      ctx.save();
	      ctx.beginPath();
	
	      var innerRadius = this.radius * 0.3,
	          outerRadius = this.radius * 1;
	
	      var gradient = ctx.createRadialGradient(this.x, this.y, innerRadius, this.x, this.y, outerRadius);
	      gradient.addColorStop(0, "black");
	      gradient.addColorStop(0.5, (0, _mathUtils.hex2rgb)('#08088A', 0.3));
	      gradient.addColorStop(1, (0, _mathUtils.hex2rgb)('#FFFF00', 0.2));
	      ctx.fillStyle = gradient;
	      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	
	      ctx.fill();
	
	      if (this.contentsToCollapseNumber) {
	        ctx.fillStyle = (0, _mathUtils.hex2rgb)('#F5F6CE', 0.5);
	        ctx.font = "12px Arial";
	        ctx.fillText(this.contents.length + " / " + this.contentsToCollapseNumber, this.x + this.radius / 2, this.y + this.radius / 2);
	      }
	
	      ctx.restore();
	      this.drawContents(delta);
	    }
	  }, {
	    key: 'setBallInside',
	    value: function setBallInside(ball) {
	      var innerBall = new _graphicBall2.default(ball.x, ball.y, 2 * ball.radius, ball.color);
	      innerBall.initialColor = innerBall.color;
	      innerBall.initialHotSpotColor = innerBall.hotSpotColor;
	
	      this.contents.push(innerBall);
	
	      if (this.shouldCollapse()) {
	        this.startCollapse();
	      }
	    }
	  }, {
	    key: 'drawContents',
	    value: function drawContents(delta) {
	      var contentItem = void 0;
	      for (var i = 0; i < this.contents.length; i++) {
	        contentItem = this.contents[i];
	        contentItem.radius = contentItem.radius * this.collapseRate();
	        contentItem.color = (0, _mathUtils.hex2rgb)(contentItem.initialColor, this.collapseRate());
	        contentItem.hotSpotColor = (0, _mathUtils.hex2rgb)(contentItem.initialHotSpotColor, this.collapseRate());
	
	        var offsetsXY = (0, _mathUtils.moveFromToLocationOffsetsXY)(contentItem.x, contentItem.y, this.x, this.y, (0, _mathUtils.calcDistanceToMove)(300, delta));
	        if (Math.abs(contentItem.x - this.x) > 5) {
	          contentItem.x += offsetsXY[0];
	        } else {
	          contentItem.x = this.x;
	        }
	
	        if (Math.abs(contentItem.y - this.y) > 5) {
	          contentItem.y += offsetsXY[1];
	        } else {
	          contentItem.y = this.y;
	        }
	
	        if (!(contentItem.x == this.x && contentItem.y == this.y)) {
	          contentItem.draw();
	        }
	      }
	    }
	  }, {
	    key: 'startCollapse',
	    value: function startCollapse() {
	      if (this.shouldCollapse()) {
	        this.status = "collapse";
	      }
	    }
	  }, {
	    key: 'shouldCollapse',
	    value: function shouldCollapse() {
	      return this.contents.length > 0;
	    }
	  }, {
	    key: 'isCollapsing',
	    value: function isCollapsing() {
	      return this.status == "collapse";
	    }
	  }, {
	    key: 'isDisappeared',
	    value: function isDisappeared() {
	      return this.status == "disappeared";
	    }
	  }, {
	    key: 'collapse',
	    value: function collapse(delta) {
	      if (this.radius > 3 && this.status == "collapse") {
	        var newRadius = this.calculateNewCollapseRadius();
	        if (this.radius > newRadius) {
	          this.radius = this.radius - 0.01 * delta;
	        }
	      } else {
	        _sounds2.default.play("blackHoleDisappear");
	        this.status = "disappeared";
	      }
	    }
	  }]);
	
	  return BlackHole;
	}(_graphical2.default);
	
	exports.default = BlackHole;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _graphical = __webpack_require__(11);
	
	var _graphical2 = _interopRequireDefault(_graphical);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var ScorePoint = function (_Graphical) {
	  _inherits(ScorePoint, _Graphical);
	
	  function ScorePoint(x, y, type) {
	    _classCallCheck(this, ScorePoint);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ScorePoint).call(this));
	
	    _this.x = x;
	    _this.y = y;
	    _this.radius = 7;
	    _this.type = type;
	
	    switch (type) {
	      case "gold":
	        _this.weight = 100;
	        _this.color = "#FFD700";
	        break;
	      case "silver":
	        _this.weight = 50;
	        _this.color = "#c0c0c0";
	        break;
	      case "steel":
	        _this.weight = 10;
	        _this.color = "#3CA7BC";
	        break;
	    }
	    return _this;
	  }
	
	  _createClass(ScorePoint, [{
	    key: "draw",
	    value: function draw() {
	      var ctx = this.context();
	      ctx.save();
	      ctx.beginPath();
	
	      ctx.fillStyle = this.color;
	      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	
	      ctx.shadowOffsetX = 1;
	      ctx.shadowOffsetY = 1;
	      ctx.shadowColor = 'black';
	      ctx.shadowBlur = 3;
	
	      ctx.fill();
	      ctx.restore();
	    }
	  }]);
	
	  return ScorePoint;
	}(_graphical2.default);
	
	exports.default = ScorePoint;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _graphical = __webpack_require__(11);
	
	var _graphical2 = _interopRequireDefault(_graphical);
	
	var _collisionDetection = __webpack_require__(2);
	
	var _sounds = __webpack_require__(4);
	
	var _sounds2 = _interopRequireDefault(_sounds);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var MenuButton = function (_Graphical) {
	  _inherits(MenuButton, _Graphical);
	
	  function MenuButton(x, y, w, h, text) {
	    var isVisible = arguments.length <= 5 || arguments[5] === undefined ? true : arguments[5];
	
	    _classCallCheck(this, MenuButton);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MenuButton).call(this));
	
	    _this.x = x;
	    _this.y = y;
	    _this.text = text;
	    _this.w = w;
	    _this.h = h;
	    _this.state = "released"; // 'clicked', 'released'
	    _this.isVisible = isVisible;
	    _this.isHover = false;
	    _this.isHoverPrev = false;
	    return _this;
	  }
	
	  _createClass(MenuButton, [{
	    key: 'fontSize',
	    value: function fontSize() {
	      return 7 * this.h / 10;
	    }
	  }, {
	    key: 'updatePosition',
	    value: function updatePosition(x, y) {
	      this.x = x;
	      this.y = y;
	    }
	  }, {
	    key: 'draw',
	    value: function draw() {
	      var ctx = this.context();
	      ctx.save();
	      ctx.beginPath();
	
	      ctx.rect(this.x, this.y, this.w, this.h);
	      ctx.fillStyle = "grey";
	      ctx.fill();
	
	      ctx.fillStyle = "#C8C8C8";
	      ctx.font = this.fontSize() + "px Arial";
	      ctx.fillText(this.text, this.x + 5, this.y + this.fontSize());
	      ctx.restore();
	    }
	  }, {
	    key: 'drawSelection',
	    value: function drawSelection() {
	      var ctx = this.context();
	      ctx.save();
	      ctx.beginPath();
	
	      ctx.rect(this.x, this.y, this.w, this.h);
	      ctx.fillStyle = 'rgba(0, 255, 0 , 0.1)';
	      ctx.fill();
	
	      ctx.fillStyle = "#33CC33";
	      ctx.font = this.fontSize() + "px Arial";
	      ctx.fillText(this.text, this.x + 5, this.y + this.fontSize());
	      ctx.restore();
	    }
	  }, {
	    key: 'playCursorHoverSound',
	    value: function playCursorHoverSound() {
	      if (!this.hasPlayedHoverSound) {
	        this.hasPlayedHoverSound = true;
	        _sounds2.default.play("menuButtonCursorHover");
	      }
	    }
	  }, {
	    key: 'processCursor',
	    value: function processCursor(player, inputStates) {
	      if (player.x && player.y && (0, _collisionDetection.circRectsOverlap)(this.x, this.y, this.w, this.h, player.x, player.y, 1)) {
	        this.drawSelection();
	
	        this.playCursorHoverSound();
	
	        if (inputStates.mouseDownPos && inputStates.mouseDownPos.x == player.x && inputStates.mouseDownPos.y == player.y) {
	          this.click();
	        }
	
	        if (inputStates.mouseUpPos && inputStates.mouseUpPos.x == player.x && inputStates.mouseUpPos.y == player.y) {
	          this.release();
	        }
	      } else {
	        this.hasPlayedHoverSound = false;
	      }
	    }
	  }, {
	    key: 'click',
	    value: function click() {
	      this.state = "clicked";
	    }
	  }, {
	    key: 'releaseHandler',
	    value: function releaseHandler() {
	      // Assign some code here outside of button
	    }
	  }, {
	    key: 'release',
	    value: function release() {
	      if (this.state === "clicked") {
	        this.state = "released";
	        // console.log("Menu Button release: " + this.text);
	        this.releaseHandler();
	      }
	    }
	  }]);
	
	  return MenuButton;
	}(_graphical2.default);
	
	exports.default = MenuButton;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _graphical = __webpack_require__(11);
	
	var _graphical2 = _interopRequireDefault(_graphical);
	
	var _menuButton = __webpack_require__(25);
	
	var _menuButton2 = _interopRequireDefault(_menuButton);
	
	var _canvasData = __webpack_require__(9);
	
	var _canvasData2 = _interopRequireDefault(_canvasData);
	
	var _constants = __webpack_require__(15);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Menu = function (_Graphical) {
	  _inherits(Menu, _Graphical);
	
	  function Menu(title, xOffset, yOffset) {
	    var buttonSpacing = arguments.length <= 3 || arguments[3] === undefined ? 3 : arguments[3];
	
	    _classCallCheck(this, Menu);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Menu).call(this));
	
	    _this.title = title;
	    _this.buttons = [];
	    var w = _this.canvas().width;
	    _this.xOffset = w / 2 - 195;
	    _this.yOffset = _constants.GAME_AREA_BORDER + 55;
	    _this.buttonSpacing = buttonSpacing;
	    return _this;
	  }
	
	  _createClass(Menu, [{
	    key: 'addButton',
	    value: function addButton(title, clickHandler) {
	      var isVisible = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	      var width = arguments.length <= 3 || arguments[3] === undefined ? 390 : arguments[3];
	      var height = arguments.length <= 4 || arguments[4] === undefined ? 50 : arguments[4];
	
	      var button = new (Function.prototype.bind.apply(_menuButton2.default, [null].concat(_toConsumableArray(this._buttonCoordinatesByIndex(height, this.buttons.length)), [width, height, title, isVisible])))();
	      button.releaseHandler = clickHandler;
	      this.buttons.push(button);
	      return button;
	    }
	  }, {
	    key: '_buttonCoordinatesByIndex',
	    value: function _buttonCoordinatesByIndex(height, index) {
	      return [this.xOffset, this.yOffset + (this.buttonSpacing + height) * index];
	    }
	  }, {
	    key: 'visibleButtons',
	    value: function visibleButtons() {
	      return this.buttons.filter(function (button) {
	        return button.isVisible;
	      });
	    }
	
	    // TODO player and inputStates should be imported as singleton objects
	
	  }, {
	    key: 'draw',
	    value: function draw(player, inputStates) {
	      var ctx = this.context();
	      var w = this.canvas().width;
	      ctx.save();
	      ctx.beginPath();
	      ctx.fillStyle = "#33CC33";
	      ctx.font = "70px Arial";
	      ctx.fillText(this.title, 35, 70);
	      ctx.rect(w / 2 - 200, _constants.GAME_AREA_BORDER + 50, 400, 400);
	      ctx.strokeStyle = "grey";
	      ctx.lineWidth = 5;
	      ctx.stroke();
	      ctx.restore();
	
	      var visibleBtns = this.visibleButtons();
	
	      for (var i = 0; i < visibleBtns.length; i++) {
	        var _visibleBtns$i;
	
	        // update button position
	        (_visibleBtns$i = visibleBtns[i]).updatePosition.apply(_visibleBtns$i, _toConsumableArray(this._buttonCoordinatesByIndex(visibleBtns[i].h, i)));
	        visibleBtns[i].draw();
	        // Draw button that was selected by user
	        visibleBtns[i].processCursor(player, inputStates);
	      }
	    }
	  }]);
	
	  return Menu;
	}(_graphical2.default);
	
	exports.default = Menu;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _levelsData = __webpack_require__(28);
	
	var _levelsData2 = _interopRequireDefault(_levelsData);
	
	var _brick = __webpack_require__(20);
	
	var _brick2 = _interopRequireDefault(_brick);
	
	var _squareBrick = __webpack_require__(21);
	
	var _squareBrick2 = _interopRequireDefault(_squareBrick);
	
	var _breakableBrick = __webpack_require__(29);
	
	var _breakableBrick2 = _interopRequireDefault(_breakableBrick);
	
	var _scorePoint = __webpack_require__(24);
	
	var _scorePoint2 = _interopRequireDefault(_scorePoint);
	
	var _gate = __webpack_require__(22);
	
	var _gate2 = _interopRequireDefault(_gate);
	
	var _blackHole = __webpack_require__(23);
	
	var _blackHole2 = _interopRequireDefault(_blackHole);
	
	var _competitorBall = __webpack_require__(12);
	
	var _competitorBall2 = _interopRequireDefault(_competitorBall);
	
	var _friendlyBall = __webpack_require__(18);
	
	var _friendlyBall2 = _interopRequireDefault(_friendlyBall);
	
	var _neutralBall = __webpack_require__(19);
	
	var _neutralBall2 = _interopRequireDefault(_neutralBall);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Level = function () {
	  function Level(number) {
	    _classCallCheck(this, Level);
	
	    this.number = number;
	  }
	
	  _createClass(Level, [{
	    key: 'loadBricks',
	    value: function loadBricks() {
	      var bricks = [],
	          squareBricks = [],
	          breakableBricks = [];
	
	      if ((0, _levelsData2.default)(this.number)["bricks"]) {
	        bricks = (0, _levelsData2.default)(this.number)["bricks"].map(function (brick_args) {
	          return new (Function.prototype.bind.apply(_brick2.default, [null].concat(_toConsumableArray(brick_args))))();
	        });
	      }
	
	      if ((0, _levelsData2.default)(this.number)["square_bricks"]) {
	        squareBricks = (0, _levelsData2.default)(this.number)["square_bricks"].map(function (brick_args) {
	          return new (Function.prototype.bind.apply(_squareBrick2.default, [null].concat(_toConsumableArray(brick_args))))();
	        });
	      }
	
	      if ((0, _levelsData2.default)(this.number)["breakable_bricks"]) {
	        breakableBricks = (0, _levelsData2.default)(this.number)["breakable_bricks"].map(function (brick_args) {
	          return new (Function.prototype.bind.apply(_breakableBrick2.default, [null].concat(_toConsumableArray(brick_args))))();
	        });
	      }
	
	      return bricks.concat(squareBricks).concat(breakableBricks);
	    }
	  }, {
	    key: 'loadGates',
	    value: function loadGates() {
	      return (0, _levelsData2.default)(this.number)["gates"].map(function (gate_args) {
	        return new (Function.prototype.bind.apply(_gate2.default, [null].concat(_toConsumableArray(gate_args))))();
	      });
	    }
	  }, {
	    key: 'loadScorePoints',
	    value: function loadScorePoints() {
	      var scorePoints = [];
	      if ((0, _levelsData2.default)(this.number)["score_points"]) {
	        scorePoints = (0, _levelsData2.default)(this.number)["score_points"].map(function (score_point_args) {
	          return new (Function.prototype.bind.apply(_scorePoint2.default, [null].concat(_toConsumableArray(score_point_args))))();
	        });
	      }
	
	      return scorePoints;
	    }
	  }, {
	    key: 'loadBalls',
	    value: function loadBalls() {
	      var balls = [];
	      if ((0, _levelsData2.default)(this.number)["balls"]) {
	        balls = (0, _levelsData2.default)(this.number)["balls"].map(function (ball_args) {
	          switch (ball_args[0]) {
	            case "competitor":
	              return new _competitorBall2.default(ball_args[1], ball_args[2], 20, "#0000FF", 0, 0, "#cc33ff");
	            case "neutral":
	              return new _neutralBall2.default(ball_args[1], ball_args[2], 20, "#848484", 0, 0, "#848484");
	            case "friendly":
	              return new _friendlyBall2.default(ball_args[1], ball_args[2], 20, "#868A08", 0, 0, "#31B404");
	          }
	        });
	      }
	
	      return balls;
	    }
	  }, {
	    key: 'loadBlackHoles',
	    value: function loadBlackHoles() {
	      var blackHoles = [];
	      if ((0, _levelsData2.default)(this.number)["black_holes"]) {
	        blackHoles = (0, _levelsData2.default)(this.number)["black_holes"].map(function (black_hole_args) {
	          return new (Function.prototype.bind.apply(_blackHole2.default, [null].concat(_toConsumableArray(black_hole_args))))();
	        });
	      }
	
	      return blackHoles;
	    }
	  }, {
	    key: 'hasNextLevel',
	    value: function hasNextLevel() {
	      return !!(0, _levelsData2.default)(this.number + 1);
	    }
	  }, {
	    key: 'getNextLevel',
	    value: function getNextLevel() {
	      if (this.hasNextLevel()) {
	        return new Level(this.number + 1);
	      }
	    }
	  }]);
	
	  return Level;
	}();
	
	exports.default = Level;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = levelsData;
	
	var _constants = __webpack_require__(15);
	
	var _canvasData = __webpack_require__(9);
	
	var _canvasData2 = _interopRequireDefault(_canvasData);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function startGateParams(x, y) {
	  return [x, y, 23, "A", "#A8A8A8", "start"];
	}
	
	function finishGateParams(x, y) {
	  return [x, y, 23, "Z", "#009900", "finish"];
	}
	
	function levelsData(level) {
	  var canvas = _canvasData2.default.getCanvas();
	  var w = canvas.width;
	  var h = canvas.height;
	
	  return [{
	    "bricks": [[_constants.GAME_AREA_BORDER + 30, _constants.GAME_AREA_BORDER + 30, 300, 20, "#0099FF"], [_constants.GAME_AREA_BORDER + 350, _constants.GAME_AREA_BORDER + 250, 100, 20, "#0099FF"], [_constants.GAME_AREA_BORDER + 30, _constants.GAME_AREA_BORDER + 52, 20, 380, "#0099FF"], [_constants.GAME_AREA_BORDER + 30, _constants.GAME_AREA_BORDER + 480, 20, 20, "#0099FF"]],
	    "breakable_bricks": [[w - _constants.GAME_AREA_BORDER - 20, _constants.GAME_AREA_BORDER + 50, 20, 20, "#ffffff"], [w - _constants.GAME_AREA_BORDER - 40, _constants.GAME_AREA_BORDER + 50, 20, 20, "#ffffff"], [w - _constants.GAME_AREA_BORDER - 60, _constants.GAME_AREA_BORDER + 50, 20, 20, "#ffffff"], [w - _constants.GAME_AREA_BORDER - 20, _constants.GAME_AREA_BORDER + 70, 20, 20, "#ffffff"], [w - _constants.GAME_AREA_BORDER - 40, _constants.GAME_AREA_BORDER + 70, 20, 20, "#ffffff"], [w - _constants.GAME_AREA_BORDER - 60, _constants.GAME_AREA_BORDER + 70, 20, 20, "#ffffff"], [w - _constants.GAME_AREA_BORDER - 80, _constants.GAME_AREA_BORDER + 70, 20, 20, "#ffffff"], [w - _constants.GAME_AREA_BORDER - 100, _constants.GAME_AREA_BORDER + 70, 20, 20, "#ffffff"], [w - _constants.GAME_AREA_BORDER - 120, _constants.GAME_AREA_BORDER + 70, 20, 20, "#ffffff"], [w - _constants.GAME_AREA_BORDER - 140, _constants.GAME_AREA_BORDER + 70, 20, 20, "#ffffff"], [w - _constants.GAME_AREA_BORDER - 160, _constants.GAME_AREA_BORDER + 70, 20, 20, "#ffffff"], [w - _constants.GAME_AREA_BORDER - 180, _constants.GAME_AREA_BORDER + 70, 20, 20, "#ffffff"]],
	    "square_bricks": [[w / 2 - 25, h / 2 - 25, 50, "Grey"], [w / 2 + 70, h / 2 + 190, 30, "Orange"], [w / 2 + 101, h / 2 + 160, 30, "Green"], [w / 2 + 131, h / 2 + 130, 30, "Purple"], [w / 2 + 161, h / 2 + 100, 30, "#CC3399"], [w / 2 + 191, h / 2 + 219, 30, "#00CC33"], [w / 2 - 70, h / 2 - 50, 30, "Orange"], [w / 2 - 101, h / 2 + 100, 30, "Green"], [w / 2 - 131, h / 2 - 100, 30, "Purple"], [w / 2 - 161, h / 2 + 150, 30, "#CC3399"], [w - _constants.GAME_AREA_BORDER - 100, _constants.GAME_AREA_BORDER + 30, 30, "#00CC33"]],
	    "score_points": [[w / 2 + 135, h / 2 + 55, "gold"], [w / 2 - 70, h / 2 - 70, "gold"], [w / 2 - 35, h / 2 - 10, "gold"], [w / 2 - 175, h / 2 - 175, "silver"], [_constants.GAME_AREA_BORDER + 15, _constants.GAME_AREA_BORDER + 15, "steel"], [_constants.GAME_AREA_BORDER + 75, _constants.GAME_AREA_BORDER + 205, "steel"], [_constants.GAME_AREA_BORDER + 75, _constants.GAME_AREA_BORDER + 235, "steel"], [_constants.GAME_AREA_BORDER + 75, _constants.GAME_AREA_BORDER + 265, "steel"], [_constants.GAME_AREA_BORDER + 75, _constants.GAME_AREA_BORDER + 295, "steel"], [_constants.GAME_AREA_BORDER + 75, _constants.GAME_AREA_BORDER + 325, "steel"], [_constants.GAME_AREA_BORDER + 45, _constants.GAME_AREA_BORDER + 15, "gold"], [_constants.GAME_AREA_BORDER + 75, _constants.GAME_AREA_BORDER + 15, "gold"], [w - _constants.GAME_AREA_BORDER - 55, _constants.GAME_AREA_BORDER + 15, "gold"], [w - _constants.GAME_AREA_BORDER - 85, _constants.GAME_AREA_BORDER + 15, "gold"], [_constants.GAME_AREA_BORDER + 15, _constants.GAME_AREA_BORDER + 45, "gold"], [_constants.GAME_AREA_BORDER + 15, _constants.GAME_AREA_BORDER + 75, "silver"], [_constants.GAME_AREA_BORDER + 15, _constants.GAME_AREA_BORDER + 105, "gold"], [w - _constants.GAME_AREA_BORDER - 15, h - _constants.GAME_AREA_BORDER - 15, "gold"], [w - _constants.GAME_AREA_BORDER - 75, h - _constants.GAME_AREA_BORDER - 105, "gold"]],
	    "gates": [startGateParams(w / 2, h - _constants.GAME_AREA_BORDER - 10),
	    //startGateParams(w/2, (GAME_AREA_BORDER+15)),
	    finishGateParams(w - _constants.GAME_AREA_BORDER - 15, _constants.GAME_AREA_BORDER + 15)],
	    "black_holes": [[_constants.GAME_AREA_BORDER + 255, _constants.GAME_AREA_BORDER + 120, 100, 3]],
	    "balls": [
	    // ["neutral", GAME_AREA_BORDER + 45, GAME_AREA_BORDER  + 55],
	    // ["neutral", GAME_AREA_BORDER + 45, GAME_AREA_BORDER  + 65],
	    // ["neutral", GAME_AREA_BORDER + 45, GAME_AREA_BORDER  + 75],
	    ["neutral", _constants.GAME_AREA_BORDER + 175, _constants.GAME_AREA_BORDER + 345], ["friendly", _constants.GAME_AREA_BORDER + 325, _constants.GAME_AREA_BORDER + 430], ["competitor", _constants.GAME_AREA_BORDER + 45, _constants.GAME_AREA_BORDER + 470]]
	  }, {
	    "bricks": [[w - _constants.GAME_AREA_BORDER - 120, _constants.GAME_AREA_BORDER + 50, 20, 450, "#600080"], [w - _constants.GAME_AREA_BORDER - 200, _constants.GAME_AREA_BORDER, 20, 300, "#cc5200"], [_constants.GAME_AREA_BORDER, _constants.GAME_AREA_BORDER + 30, 250, 20, "#6600cc"], [_constants.GAME_AREA_BORDER + 120, _constants.GAME_AREA_BORDER + 52, 20, 54, "#0080ff"], [_constants.GAME_AREA_BORDER + 178, _constants.GAME_AREA_BORDER + 86, 50, 20, "#0080ff"], [_constants.GAME_AREA_BORDER + 230, _constants.GAME_AREA_BORDER + 52, 20, 54, "#0080ff"], [_constants.GAME_AREA_BORDER + 73, _constants.GAME_AREA_BORDER + 140, 225, 20, "#6600cc"], [_constants.GAME_AREA_BORDER, _constants.GAME_AREA_BORDER + 250, 250, 20, "#e6e600"], [_constants.GAME_AREA_BORDER + 50, _constants.GAME_AREA_BORDER + 100, 20, 100, "#39e600"], [w - _constants.GAME_AREA_BORDER - 50, _constants.GAME_AREA_BORDER + 30, 50, 30, "#0066cc"], [w - _constants.GAME_AREA_BORDER - 100, _constants.GAME_AREA_BORDER + 120, 50, 30, "#ffcc00"], [w - _constants.GAME_AREA_BORDER - 50, _constants.GAME_AREA_BORDER + 210, 50, 30, "#0066cc"], [w - _constants.GAME_AREA_BORDER - 100, _constants.GAME_AREA_BORDER + 300, 50, 30, "#ffcc00"], [w - _constants.GAME_AREA_BORDER - 50, _constants.GAME_AREA_BORDER + 390, 50, 30, "#0066cc"]],
	    "square_bricks": [[_constants.GAME_AREA_BORDER + 20, _constants.GAME_AREA_BORDER + 350, 30, "#ff6699"], [_constants.GAME_AREA_BORDER + 100, _constants.GAME_AREA_BORDER + 350, 30, "#e6004c"], [_constants.GAME_AREA_BORDER + 180, _constants.GAME_AREA_BORDER + 350, 30, "#ff6699"], [_constants.GAME_AREA_BORDER + 260, _constants.GAME_AREA_BORDER + 350, 30, "#e6004c"], [_constants.GAME_AREA_BORDER + 62, _constants.GAME_AREA_BORDER + 420, 30, "#ff6699"], [_constants.GAME_AREA_BORDER + 142, _constants.GAME_AREA_BORDER + 420, 30, "#e6004c"], [_constants.GAME_AREA_BORDER + 222, _constants.GAME_AREA_BORDER + 420, 30, "#ff6699"], [_constants.GAME_AREA_BORDER + 302, _constants.GAME_AREA_BORDER + 420, 30, "#e6004c"], [w - _constants.GAME_AREA_BORDER - 153, _constants.GAME_AREA_BORDER + 50, 30, "#00e673"], [w - _constants.GAME_AREA_BORDER - 153, _constants.GAME_AREA_BORDER + 150, 30, "#00e673"], [w - _constants.GAME_AREA_BORDER - 153, _constants.GAME_AREA_BORDER + 250, 30, "#00e673"], [w - _constants.GAME_AREA_BORDER - 153, _constants.GAME_AREA_BORDER + 350, 30, "#00e673"]],
	    "score_points": [[w / 2 + 230, h / 2 + 130, "gold"], [w / 2 + 230, h / 2 + 0, "gold"], [w / 2 + 170, h / 2 + 130, "silver"], [w / 2 + 170, h / 2 + 90, "silver"], [w / 2 + 170, h / 2 - 150, "silver"], [w / 2 - 70, h / 2 - 70, "gold"], [w / 2 - 35, h / 2 - 10, "gold"], [w / 2 - 175, h / 2 - 175, "silver"]],
	    "gates": [startGateParams(w - _constants.GAME_AREA_BORDER - 15, h - _constants.GAME_AREA_BORDER - 10), finishGateParams(_constants.GAME_AREA_BORDER + 15, _constants.GAME_AREA_BORDER + 15)]
	  }, {
	    "bricks": [[_constants.GAME_AREA_BORDER + 150, _constants.GAME_AREA_BORDER + 240, 200, 20, "#0080ff"], [_constants.GAME_AREA_BORDER + 130, _constants.GAME_AREA_BORDER + 100, 20, 260, "#33cc33"], [_constants.GAME_AREA_BORDER + 130, _constants.GAME_AREA_BORDER, 20, 65, "#33cc33"], [_constants.GAME_AREA_BORDER + 130, h - _constants.GAME_AREA_BORDER - 65, 20, 65, "#33cc33"], [_constants.GAME_AREA_BORDER + 352, _constants.GAME_AREA_BORDER + 100, 20, 377, "#33cc33"], [_constants.GAME_AREA_BORDER + 352, _constants.GAME_AREA_BORDER, 20, 65, "#33cc33"], [_constants.GAME_AREA_BORDER, h - _constants.GAME_AREA_BORDER - 65, 100, 20, "#00cc66"]],
	    "square_bricks": [[w / 2 - 15, _constants.GAME_AREA_BORDER + 295, 30, "#33cc33"], [w / 2 + 58, _constants.GAME_AREA_BORDER + 480, 20, "#e6004c"], [w / 2, _constants.GAME_AREA_BORDER + 480, 20, "#e6004c"], [w / 2 - 60, _constants.GAME_AREA_BORDER + 480, 20, "#e6004c"], [w / 2 + 58, _constants.GAME_AREA_BORDER + 435, 20, "#e6004c"], [w / 2, _constants.GAME_AREA_BORDER + 435, 20, "#e6004c"], [w / 2 - 60, _constants.GAME_AREA_BORDER + 435, 20, "#e6004c"], [w / 2 + 58, _constants.GAME_AREA_BORDER + 388, 20, "#e6004c"], [w / 2, _constants.GAME_AREA_BORDER + 388, 20, "#e6004c"], [w / 2 - 60, _constants.GAME_AREA_BORDER + 388, 20, "#e6004c"], [_constants.GAME_AREA_BORDER + 98, _constants.GAME_AREA_BORDER + 290, 30, "#ffff00"], [_constants.GAME_AREA_BORDER + 50, _constants.GAME_AREA_BORDER + 190, 30, "#ffff00"], [_constants.GAME_AREA_BORDER, _constants.GAME_AREA_BORDER + 90, 30, "#ffff00"]],
	    "breakable_bricks": [[w / 2 - 65, _constants.GAME_AREA_BORDER + 265, 20, 20, "#ffffff"], [w / 2 - 65, _constants.GAME_AREA_BORDER + 295, 20, 20, "#ffffff"], [w / 2 - 65, _constants.GAME_AREA_BORDER + 325, 20, 20, "#ffffff"], [w / 2 - 65, _constants.GAME_AREA_BORDER + 355, 20, 20, "#ffffff"], [w / 2 - 35, _constants.GAME_AREA_BORDER + 355, 20, 20, "#ffffff"], [w / 2 - 5, _constants.GAME_AREA_BORDER + 355, 20, 20, "#ffffff"], [w / 2 + 25, _constants.GAME_AREA_BORDER + 355, 20, 20, "#ffffff"], [w / 2 + 55, _constants.GAME_AREA_BORDER + 355, 20, 20, "#ffffff"], [w / 2 + 55, _constants.GAME_AREA_BORDER + 265, 20, 20, "#ffffff"], [w / 2 + 55, _constants.GAME_AREA_BORDER + 295, 20, 20, "#ffffff"], [w / 2 + 55, _constants.GAME_AREA_BORDER + 325, 20, 20, "#ffffff"]],
	    "gates": [startGateParams(w / 2, h / 2 + 30), finishGateParams(w / 2, h / 2 - 30)]
	  }][level - 1];
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _brick = __webpack_require__(20);
	
	var _brick2 = _interopRequireDefault(_brick);
	
	var _mathUtils = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var BreakableBrick = function (_Brick) {
	  _inherits(BreakableBrick, _Brick);
	
	  function BreakableBrick() {
	    _classCallCheck(this, BreakableBrick);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(BreakableBrick).apply(this, arguments));
	  }
	
	  _createClass(BreakableBrick, [{
	    key: 'draw',
	    value: function draw() {
	      var ctx = this.context();
	      ctx.save();
	      ctx.beginPath();
	
	      ctx.fillStyle = (0, _mathUtils.hex2rgb)(this.color, 0.3);
	
	      ctx.shadowOffsetX = 1;
	      ctx.shadowOffsetY = 1;
	      ctx.shadowColor = 'black';
	      ctx.shadowBlur = 3;
	
	      ctx.rect(this.x, this.y, this.width, this.height);
	      ctx.fill();
	      ctx.strokeStyle = '#a9c3f0';
	      ctx.strokeRect(this.x, this.y, this.width, this.height);
	      ctx.restore();
	    }
	  }]);
	
	  return BreakableBrick;
	}(_brick2.default);
	
	exports.default = BreakableBrick;

/***/ }
/******/ ]);
//# sourceMappingURL=game.js.map