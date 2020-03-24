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

  public x = 400;
  public y = 375;

  public leftPaddle;
  public leftPaddleYPosition = (800 / 2) - (this.paddleHeight - 50);

  public ball;
  public ballRadius = 10;

  public ballXDelta = 10;

  public gameSpeed = 45;

  constructor() { }

  ngOnInit() {
    this.pongBoard = document.getElementById("pong-board");
    window.addEventListener("onkeydown", this.handleKeyPress);

    document.onkeydown = this.handleKeyDown;

    document.onkeypress = this.handleKeyPress;

    document.onclick = () => {
      this.ballXDelta = this.ballXDelta * -1;
    };

    this.pongBoard.width = this.boardDimensions;
    this.pongBoard.height = this.boardDimensions;

    this.ctx = this.pongBoard.getContext("2d");
    this.leftPaddle = new Paddle(this.paddleWidth, this.paddleHeight, this.ctx, this.leftPaddleYPosition);
    this.ball = new Ball(this.ctx, this.ballRadius);
    this.leftPaddle.startingPositionOfPaddle();
    this.ball.drawBall(this.x, this.y);

    setInterval(this.gameLoop, this.gameSpeed);
  }

  /*
      1. Need to tell when ball hits left paddle -> done
      2. Then need to change the x delta... -> done

      before we proceed to 3:
        Need to add affect of paddling moving down or up... 

      3. Need to figure out if paddle was moving 
      up or down and this will effect the y delta 

      4. Need to have the ball bounce of all walls and 

      Now when all this is done... things to look into:
      animation of ball and paddle... 

      Adding score system and what happens when the ball hits 
      either left or right side need to add scoring system

      Finally AI which will just calculate where ball is going to hit  
      and the paddle must adjust for that position... 

      Also need to add countdown state... 
      and a menu for when the game needs to be reset

      Add a state for when game ends, end game menu.
  */

  changeBallDeltX = () => this.ballXDelta = this.ballXDelta * -1;

  handleBallChange = () => {
    const ballRightBorder = Math.abs(this.x + this.ballRadius) >= this.boardDimensions;

    // ballLeftBorder will be used to determine if AI has scored point or not
    // And whether the game should pause and count down
    const ballLeftBorder = (this.x - this.ballRadius) <= 0;

    const paddleX = this.leftPaddle.getPaddleXPosition();
    const paddleY = this.leftPaddle.getPaddleYPosition();

    // Determine if ball has hit left paddle
    const ballHitLeftPaddle = this.x  >= paddleX && 
                              this.x <= paddleX + this.paddleWidth && 
                              this.y >= paddleY && 
                              this.y <= paddleY + this.paddleHeight;

    if (ballRightBorder || ballHitLeftPaddle) { this.changeBallDeltX(); }

    if (ballLeftBorder) {
      // for the moment just change the direction... 
      // But later on will add point and pause and will  let user click to
      // start timer and then game will start again... 
      this.changeBallDeltX();
    }

    // This is where we calculate X delta 
    this.x -= this.ballXDelta;

    // Need to calculate the y delta
  }

  handleBallMovement = () => {
    this.ctx.clearRect(0, 0, 800, 800);
    
    this.ball.drawBall(this.x, this.y);
    // console.log(this.x);
    console.log(this.y, "Ball Y");
    console.log(this.leftPaddle.getPaddleYPosition(), "Paddle Y position");
    this.leftPaddle.drawPaddle();

    // change direction of ball???
    this.handleBallChange();
  }

  gameLoop = () => {
    this.handleBallMovement();
  }

  handleKeyPress = e => {
    console.log("Hold key down:");
    console.log(e);
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

  private readonly spaceFromBoard = 10;
  private yPosition;

  private paddleYChange = 10;

  changePaddleYDelta = () => {
    this.paddleYChange = this.paddleYChange * -1;
  }

  constructor(width, height, ctx, yPosition) {
    this.height = height;
    this.width = width;
    this.ctx = ctx;
    this.yPosition = yPosition;
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
