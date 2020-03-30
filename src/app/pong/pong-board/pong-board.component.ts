import { Component, OnDestroy, OnInit } from "@angular/core";
import { isValue } from "utils/Utils";

const initGameState = {
  boardDimensions: 800,
  resolution: 20,
  paddleWidth: 10,
  paddleHeight: 175,
  ballRadius: 10,
  ball: null,
  x: 400,
  y: 375,
  ballXDelta: 10,
  ballYDelta: 0,
  leftPaddle: null,
  rightAIPaddle: null,
  startingPaddleYPos: 350,
  gameSpeed: 45,
  gameLooper: null,
  playerScores: {
    playerOneScore: 0,
    aiScore: 0
  },
  aiBallDetectionVision: 400,

};

@Component({
  selector: "app-pong-board",
  templateUrl: "./pong-board.component.html",
  styleUrls: ["./pong-board.component.scss"]
})
export class PongBoardComponent implements OnInit, OnDestroy {

  public pongBoard;
  public ctx;
  public boardDimensions = 800;
  public resolution = 20;

  public paddleWidth = 10;
  public paddleHeight = 175;
  public startingPaddleYPos = (800 / 2) - (this.paddleHeight - 25);

  public ball;
  public ballRadius = 10;

  public x = 400;
  public y = 375;

  public ballXDelta = 10;
  public ballYDelta = 0;

  public leftPaddle;
  public leftPaddleYPosition = this.startingPaddleYPos;

  public rightAIPaddle;
  public rightPaddleYAIPostition = this.startingPaddleYPos;

  public gameSpeed = 45;

  public aiScore = 0;
  public playerOneScore = 0;

  public aiBallDetectionVision = 400;

  public startGame = false;

  // Will hold key code to determine if paddle can move
  public canMovePaddle = null;

  public gameLooper;

  constructor() { }

  ngOnInit() {
    this.setupGame();
  }

  ngOnDestroy() {
    this.stopGame();
  }

  incrementScore = player => {
      if (player === Players.ai) {
        this.aiScore++;
      }

      if (player === Players.playerOne) {
        this.playerOneScore++;
      }
  }

  startNewGame = () => {
    this.start();
    this.startGame = true;
  }

  increaseDifficultyOfGameForPlayer = () => {
      // ai now has more vision 
      this.aiBallDetectionVision = this.aiBallDetectionVision - 15;

      // AI paddle now moves faster
      this.rightAIPaddle.increasePaddleMovementSpeed();

      // Increase game speed by 5 milliseconds
      this.gameSpeed = this.gameSpeed - 10;
  }

  setupGame = () => {
      this.pongBoard = document.getElementById("pong-board");
      document.onkeydown = this.handleKeyDown;
      document.onkeyup = this.handleKeyUp;

      this.pongBoard.width = this.boardDimensions;
      this.pongBoard.height = this.boardDimensions;

      this.ctx = this.pongBoard.getContext("2d");
      this.leftPaddle = new Paddle(this.paddleWidth, this.paddleHeight, this.ctx, this.leftPaddleYPosition);
      this.rightAIPaddle = new Paddle(this.paddleWidth, this.paddleHeight, this.ctx, this.rightPaddleYAIPostition, true);

      this.ball = new Ball(this.ctx, this.ballRadius);

      this.leftPaddle.startingPositionOfPaddle();
      this.rightAIPaddle.startingPositionOfPaddle();
      this.ball.drawBall(this.x, this.y);

      this.start();
  }

  start = () => {
    this.gameLooper = setInterval(this.gameLoop, this.gameSpeed);
  }

  stopGame = () => {
    clearInterval(this.gameLooper);
    this.gameLooper = null;
  }

  clearEntireBoard = () => {
    this.ctx.clearRect(0, 0, 800, 800);
  }

  didAPlayerWin = () => {
    if (this.aiScore === 3) {
      this.restartGame();
      this.startGame = null;
      alert("AI wins!");
      return true;
    }

    if (this.playerOneScore === 3) {
      this.restartGame();
      this.startGame = null;
      alert("Player One Wins! ");
      return true;
    }
  }

  nextRound = (fnForScore) => {
    fnForScore();
    // determine if someone has scored and won the game
    if (!isValue(this.didAPlayerWin())) {
      this.resetBoard();
      this.start();
    }
  }

  resetBoard = () => {
    const { boardDimensions, paddleWidth, paddleHeight, 
      startingPaddleYPos, ballXDelta, ballYDelta, x, y, gameSpeed } = initGameState;

    this.boardDimensions = boardDimensions;
    this.paddleHeight = paddleHeight;
    this.paddleWidth = paddleWidth;
    this.leftPaddleYPosition = startingPaddleYPos;
    this.rightPaddleYAIPostition = startingPaddleYPos;
    this.ballXDelta = ballXDelta;
    this.ballYDelta = ballYDelta;
    this.x = x;
    this.y = y;

    this.stopGame();
    this.clearEntireBoard();
    this.pongBoard = document.getElementById("pong-board");
    this.ctx = this.pongBoard.getContext("2d");

    this.pongBoard.width = this.boardDimensions;
    this.pongBoard.height = this.boardDimensions;

    this.leftPaddle = new Paddle(this.paddleWidth, this.paddleHeight, this.ctx, this.leftPaddleYPosition);
    this.rightAIPaddle = new Paddle(this.paddleWidth, this.paddleHeight, this.ctx, this.rightPaddleYAIPostition, true);

    this.leftPaddle.startingPositionOfPaddle();
    this.rightAIPaddle.startingPositionOfPaddle();
    this.ball.drawBall(this.x, this.y);
  }

  restartGame = () => {
    const { boardDimensions, paddleWidth, paddleHeight, 
      startingPaddleYPos, ballXDelta, ballYDelta, x, y, 
      playerScores, aiBallDetectionVision, gameSpeed } = initGameState;

    const { aiScore, playerOneScore } = playerScores;

    this.aiScore = aiScore;
    this.playerOneScore = playerOneScore;

    this.boardDimensions = boardDimensions;
    this.paddleHeight = paddleHeight;
    this.paddleWidth = paddleWidth;
    this.leftPaddleYPosition = startingPaddleYPos;
    this.rightPaddleYAIPostition = startingPaddleYPos;
    this.ballXDelta = ballXDelta;
    this.ballYDelta = ballYDelta;
    this.x = x;
    this.y = y;
    this.gameSpeed = gameSpeed;

    this.aiBallDetectionVision = aiBallDetectionVision;

    this.stopGame();
    this.clearEntireBoard();
    this.pongBoard = document.getElementById("pong-board");
    this.ctx = this.pongBoard.getContext("2d");

    this.pongBoard.width = this.boardDimensions;
    this.pongBoard.height = this.boardDimensions;

    this.leftPaddle = new Paddle(this.paddleWidth, this.paddleHeight, this.ctx, this.leftPaddleYPosition);
    this.rightAIPaddle = new Paddle(this.paddleWidth, this.paddleHeight, this.ctx, this.rightPaddleYAIPostition, true);

    this.ball = new Ball(this.ctx, this.ballRadius);

    this.leftPaddle.startingPositionOfPaddle();
    this.rightAIPaddle.startingPositionOfPaddle();
    this.ball.drawBall(this.x, this.y);
  }

  changeBallDeltaX = () => this.ballXDelta = this.ballXDelta * -1;
  changeBallDeltaYVerticalBorders = () => this.ballYDelta = this.ballYDelta * -1;

  changeBallDeltaY = (paddleY) => {
    const paddleCenter = Math.abs(Math.floor(paddleY + this.paddleHeight / 2));
    const d = paddleCenter - this.y;
    this.ballYDelta += d * -0.1;
  }

  updateBallCoordinates = () => {
    // This is where we calculate X delta 
    this.x -= this.ballXDelta;
    // Need to calculate the y delta
    this.y -= this.ballYDelta;
  }

  handleBallChange = () => {
    const ballRightBorder = Math.abs(this.x + this.ballRadius) >= this.boardDimensions;
    const ballHitVerticalBorders = this.y - this.ballRadius <= 0 || this.y + this.ballRadius >= 800;

    // ballLeftBorder will be used to determine if AI has scored point or not
    // And whether the game should pause and count down
    const ballLeftBorder = (this.x - this.ballRadius) <= 0;

    const paddleX = this.leftPaddle.getPaddleXPosition();
    const paddleY = this.leftPaddle.getPaddleYPosition();

    const paddleXAI = this.rightAIPaddle.getPaddleXPosition();
    const paddleYAI = this.rightAIPaddle.getPaddleYPosition();

    // Determine if ball has hit left paddle
    const ballHitLeftPaddle = this.x  >= paddleX && 
                              this.x <= paddleX + this.paddleWidth && 
                              this.y >= paddleY && 
                              this.y <= paddleY + this.paddleHeight;

    // Need to determine when ball hits right paddle
    // before that we need to add code that moves ai paddle to where ball
    // is moving 

    if (ballHitLeftPaddle) { 
       this.changeBallDeltaX(); 
       this.changeBallDeltaY(paddleY);
       return;
    }

    const ballHitRightPaddle = this.x >= paddleXAI &&
                               this.x <= paddleXAI + this.paddleWidth &&
                               this.y >= paddleYAI &&
                               this.y <= paddleYAI + this.paddleHeight;
    
    if (ballHitRightPaddle) {
       this.changeBallDeltaX();
       this.changeBallDeltaY(paddleYAI);
       return;
    }

    // Hit's vertical top border or hit's veritical bottom border
    if (ballHitVerticalBorders) { this.changeBallDeltaYVerticalBorders(); return; }

    if (ballLeftBorder) {
      this.nextRound(
        () => this.incrementScore(Players.ai)
      );
      return;
    }

    if (ballRightBorder) {
      
      // increase difficulty of game
      this.increaseDifficultyOfGameForPlayer();
      console.log("Player One has scored");
      this.nextRound(
        () => this.incrementScore(Players.playerOne)
      );
      return;
    }
  }

  calculateAIPaddleMovement = () => {
      if (this.x > this.aiBallDetectionVision && this.ballXDelta < 0) {     
        const rightPaddleAIY = this.rightAIPaddle.getPaddleYPosition();
        const isHittingMiddle = rightPaddleAIY;
        // must get the difference between the two and should be
        const isInRange = Math.abs((this.y - 75) - isHittingMiddle) < 10;
        if (isInRange) { return; }
        if (this.y - 75 < isHittingMiddle) {
          this.rightAIPaddle.movePaddleUp();
        } else if (this.y - 75 > isHittingMiddle) {
          this.rightAIPaddle.movePaddleDown();
        }
      }
  }

  handleBallMovement = () => {
    this.ctx.clearRect(0, 0, 800, 800);
    
    this.shouldPaddleMove(this.canMovePaddle);

    this.ball.drawBall(this.x, this.y);
    // Need to calulate ball direction and move 
    // AI paddle to position closer to where the ball is going... 
    this.calculateAIPaddleMovement();

    this.leftPaddle.drawPaddle();

    // draw AI paddle
    this.rightAIPaddle.drawPaddle();

    // change direction of ball???
    this.handleBallChange();

    // update ball
    this.updateBallCoordinates();
  }

  gameLoop = () => {
    this.handleBallMovement();
  }

  handleKeyUp = (e: KeyboardEvent) => {
    this.canMovePaddle = null;
  }

  handleKeyDown = (e: KeyboardEvent) => {
    this.canMovePaddle = e.keyCode;
  }

  shouldPaddleMove = code => {
    switch (code) {
      // move up
      case 38: {
        this.leftPaddle.movePaddleUp();
        break;
      } 
      // movedown
      case 40: {
        this.leftPaddle.movePaddleDown();
        break;
      }
      default: {
        // log and forget
        // console.log(code);
      }
    }
  }
}

class Ball {
  public raidus;
  public PI = Math.PI;
  public ballColor = "#07a";

  public ctx;

  constructor(ctx, radius) {
    this.ctx = ctx;
    this.raidus = radius;
  }

  drawBall = (x, y) => {
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.raidus, 0, this.PI * 2);
    this.ctx.fillStyle = this.ballColor;
    this.ctx.fill();
    this.ctx.closePath();
  }
}

class Paddle {
  private readonly height;
  private readonly width;
  private readonly ctx;
  private readonly black = "#000";

  private spaceFromBoard = 10;
  private originalYPos;
  private yPosition;

  private paddleYChange = 10;

  private isAi;

  changePaddleYDelta = () => {
    this.paddleYChange = this.paddleYChange * -1;
  }

  constructor(width, height, ctx, yPosition, isAi = false) {
    this.height = height;
    this.width = width;
    this.ctx = ctx;

    this.yPosition = yPosition;
    this.originalYPos = yPosition;
    this.isAi = isAi;

    if (isAi) { this.spaceFromBoard = 780; }
  }

  increasePaddleMovementSpeed = () => {
    if (this.isAi) {
      if (this.paddleYChange < 0) {
        this.paddleYChange = (this.paddleYChange * -1) + 1.5;
      } else {
        this.paddleYChange = this.paddleYChange + 1.5;
      }
    }
  }

   getPaddleYChange = () => {
     return this.paddleYChange;
   }

  getPaddleYPosition = () => {
    return this.yPosition;
  }

  getPaddleXPosition = () => {
    return this.spaceFromBoard;
  }

  startingPositionOfPaddle = () => {
    this.ctx.beginPath();
    this.ctx.rect(this.spaceFromBoard, this.originalYPos, this.width, this.height);
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawPaddle = () => {
    this.ctx.beginPath();
    this.ctx.rect(this.spaceFromBoard, this.yPosition, this.width, this.height);
    this.ctx.fillStyle = this.black;
    this.ctx.fill();
    this.ctx.closePath();
  }

  strokeAndFillPaddle = () => {
    this.ctx.stroke();
    this.ctx.fill();
  }

  movePaddleDown = () => {  
    const pos = (this.yPosition + (this.height + 10));
    if (pos < 800) {
      if (this.paddleYChange > 0) { this.changePaddleYDelta(); }
      this.yPosition -=  this.paddleYChange;
      this.ctx.beginPath();
      this.ctx.fillStyle = this.black;
      this.ctx.rect(this.spaceFromBoard, this.yPosition, this.width, this.height);
      this.ctx.fill();
      this.ctx.closePath();
     }
  }

  movePaddleUp = () => {
    const pos = this.yPosition - 10;
    if (pos > 0) {
      if (this.paddleYChange < 0) { this.changePaddleYDelta(); }
      this.yPosition -= this.paddleYChange;
      this.ctx.beginPath();
      this.ctx.fillStyle = this.black;
      this.ctx.rect(this.spaceFromBoard, this.yPosition, this.width, this.height);
      this.ctx.fill();
      this.ctx.closePath();
    }
  }
}

enum Players {
  ai = "ai",
  playerOne = "playerOne"
}
