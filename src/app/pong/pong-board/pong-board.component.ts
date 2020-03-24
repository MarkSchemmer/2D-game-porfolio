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
  public ball;

  public ballDirection = false;
  public ballDelta = 10;

  constructor() { }

  ngOnInit() {
    this.pongBoard = document.getElementById("pong-board");
    window.addEventListener("onkeydown", this.handleKeyPress);

    document.onkeydown = this.handleKeyDown;

    document.onkeypress = this.handleKeyPress;

    document.onclick = () => {
      this.ballDirection = !this.ballDirection;
    };

    this.pongBoard.width = this.boardDimensions;
    this.pongBoard.height = this.boardDimensions;

    this.ctx = this.pongBoard.getContext("2d");
    this.leftPaddle = new Paddle(this.paddleWidth, this.paddleHeight, this.ctx, this.resolution);
    this.ball = new Ball(this.ctx);
    this.leftPaddle.startingPositionOfPaddle();
    this.ball.drawBall(this.x, this.y);

    setInterval(this.gameLoop, 50);
  }

  handleBallChange = () => {
    if (this.ballDirection) {
      // this.x -= this.ballDelta;
    } else {
      // this.x += this.ballDelta;
    }
  }

  handleBallMovement = () => {
    this.ctx.clearRect(0, 0, 800, 800);
    
    this.ball.drawBall(this.x, this.y);
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
    switch(code) {
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
  public raidus = 10;
  public PI = Math.PI;
  public ballColor = "#07a";

  public ctx;

  constructor(ctx) {
    this.ctx = ctx;
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
  private readonly resolution;

  private readonly spaceFromBoard = 10;
  private yPosition;

  constructor(width, height, ctx, res) {
    this.height = height;
    this.width = width;
    this.ctx = ctx;
    this.resolution = res;
    this.yPosition = (800 / 2) - (this.height - 50);
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
      this.yPosition +=  10;
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
      this.yPosition -=  10;
      this.ctx.beginPath();
      this.ctx.fillStyle = this.black;
      this.ctx.rect(this.spaceFromBoard, this.yPosition, this.width, this.height);
      this.ctx.fill();
      this.ctx.closePath();
    }
  }
}
