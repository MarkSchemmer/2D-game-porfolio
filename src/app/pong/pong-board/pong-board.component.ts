import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-pong-board",
  templateUrl: "./pong-board.component.html",
  styleUrls: ["./pong-board.component.scss"]
})
export class PongBoardComponent implements OnInit {

  public pongBoard;
  public ctx;
  public boardDimensions = 800;
  public resolution = 20;

  public paddleWidth = 10;
  public paddleHeight = 175;
  public startingPaddleYPos = (800 / 2) - (this.paddleHeight - 50);

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

  constructor() { }

  ngOnInit() {
    this.pongBoard = document.getElementById("pong-board");
    document.onkeydown = this.handleKeyDown;

    this.pongBoard.width = this.boardDimensions;
    this.pongBoard.height = this.boardDimensions;

    this.ctx = this.pongBoard.getContext("2d");
    this.leftPaddle = new Paddle(this.paddleWidth, this.paddleHeight, this.ctx, this.leftPaddleYPosition);
    this.rightAIPaddle = new Paddle(this.paddleWidth, this.paddleHeight, this.ctx, this.rightPaddleYAIPostition, true);

    this.ball = new Ball(this.ctx, this.ballRadius);

    this.leftPaddle.startingPositionOfPaddle();
    this.rightAIPaddle.startingPositionOfPaddle();
    this.ball.drawBall(this.x, this.y);

    setInterval(this.gameLoop, this.gameSpeed);
  }

  /*
      1. Need to tell when ball hits left paddle -> done
      2. Then need to change the x delta... -> done

      before we proceed to 3:
        Need to add affect of paddling moving down or up... 

      3. Need to figure out if paddle was moving 
      up or down and this will effect the y delta -> Done

      4. Need to have the ball bounce of all walls and -> Done

  */

  changeBallDeltaX = () => this.ballXDelta = this.ballXDelta * -1;
  changeBallDeltaYVerticalBorders = () => this.ballYDelta = this.ballYDelta * -1;

  changeBallDeltaY = (paddleY) => {
    const paddleCenter = paddleY + this.paddleHeight / 2;
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

    if (ballRightBorder) { this.changeBallDeltaX(); return; }

    if (ballLeftBorder) {
      // for the moment just change the direction... 
      // But later on will add point and pause and will  let user click to
      // start timer and then game will start again... 
      this.changeBallDeltaX(); 
      return;
    }

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

    // Hit's vertical top border or hit's veritical bottom border
    if (ballHitVerticalBorders) { this.changeBallDeltaYVerticalBorders(); return; }
  }

  calculateAIPaddleMovement = () => {
      if (this.x > 300 && this.ballXDelta < 0) {     
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

  /*
      373.75 - 295 = 78.75
      36.25 - 5 = 31.25
  */ 

  handleBallMovement = () => {
    this.ctx.clearRect(0, 0, 800, 800);
    
    this.ball.drawBall(this.x, this.y);

    // console.log(this.y, "Ball Y coordinate:");
    const paddleAIYCoordinate = this.rightAIPaddle.getPaddleYPosition();
    // console.log(paddleAIYCoordinate);

    // Need to get the difference between Ball.Y and Paddle.Y
    // console.log(Math.abs(this.y - paddleAIYCoordinate));

    // Need to calulate ball direction and move 
    // AI paddle to position closer to where the ball is going... 
    this.calculateAIPaddleMovement();
    // console.log(this.x);
    // console.log(this.y, "Ball Y");
    // console.log(this.leftPaddle.getPaddleYPosition(), "Paddle Y position");
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

  handleKeyDown = (e: KeyboardEvent) => {
    const code = e.keyCode;
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
        console.log(e.keyCode);
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
  private yPosition;

  private paddleYChange = 10;

  changePaddleYDelta = () => {
    this.paddleYChange = this.paddleYChange * -1;
  }

  constructor(width, height, ctx, yPosition, isAi = false) {
    this.height = height;
    this.width = width;
    this.ctx = ctx;
    this.yPosition = yPosition;

    if (isAi) { this.spaceFromBoard = 780; }
  }

  getPaddleYPosition = () => {
    return this.yPosition;
  }

  getPaddleXPosition = () => {
    return this.spaceFromBoard;
  }

  startingPositionOfPaddle = () => {
    this.ctx.beginPath();
    this.ctx.rect(this.spaceFromBoard, this.yPosition, this.width, this.height);
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

/*
    Some notable goals for this project, 
*/

/*
      Todos: 

      Now when all this is done... things to look into:
      animation of ball and paddle... -> Done noted it as a bug

      Adding score system and what happens when the ball hits 
      either left or right side need to add scoring system

      Finally AI which will just calculate where ball is going to hit  
      and the paddle must adjust for that position... 

      Also need to add countdown state... 
      and a menu for when the game needs to be reset

      Add a state for when game ends, end game menu.

      Add AI paddle and then program AI to be able to react
      to the change of the ball... 

      ----------------------------------------------------
      ----------------------------------------------------

      Bug: When user pushs on up or down key, the paddle 
      moves up then stops, rememdy: would be adding event for
      when key is pressed down 
*/
