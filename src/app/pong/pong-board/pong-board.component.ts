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

  public leftPaddle;

  constructor() { }

  ngOnInit() {
    this.pongBoard = document.getElementById("pong-board");
    window.addEventListener("onkeydown", this.handleKeyPress);

    document.onkeydown = this.handleKeyPress;

    this.pongBoard.width = this.boardDimensions;
    this.pongBoard.height = this.boardDimensions;

    this.ctx = this.pongBoard.getContext("2d");
    this.leftPaddle = new Paddle(this.paddleWidth, this.paddleHeight, this.ctx, this.resolution);
    this.leftPaddle.startingPositionOfPaddle();
  }

  handleKeyPress = e => {
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

  }

  clearCurrentPaddlePosition = () => {
    this.ctx.clearRect(0, 0, 800, 800);
  }

  strokeAndFillPaddle = () => {
    this.ctx.stroke();
    this.ctx.fill();
  }

  movePaddleDown = () => {  
    const pos = (this.yPosition + (this.height + 10));
    if (pos < 800) { 
      this.yPosition +=  10;
      this.clearCurrentPaddlePosition();
      this.ctx.beginPath();
      this.ctx.rect(this.spaceFromBoard, this.yPosition, this.width, this.height);
      this.ctx.fill();
      this.ctx.closePath();
     }
  }

  movePaddleUp = () => {
    const pos = this.yPosition - 10;
    if (pos > 0) {
      this.clearCurrentPaddlePosition();
      this.yPosition -=  10;
      this.ctx.beginPath();
      this.ctx.rect(this.spaceFromBoard, this.yPosition, this.width, this.height);
      this.ctx.fill();
      this.ctx.closePath();
    }
  }
}
