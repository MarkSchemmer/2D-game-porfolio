import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss']
})
export class SnakeComponent implements OnInit {


  public ctx;
  public snakeBoard;

  public snake;

  private readonly RESOLUTION = 12;

  private readonly BOARD_DIMENSIONS = 800;

  constructor() { }

  ngOnInit() {
    this.initialGameSetup();
  }

  gameLoop = () => {

  }

  initialGameSetup = () => {
    // Get the board, and it's context.
    this.snakeBoard = document.getElementById("snake-board");
    this.ctx = this.snakeBoard.getContext("2d");

    this.snakeBoard.width = this.BOARD_DIMENSIONS;
    this.snakeBoard.height = this.BOARD_DIMENSIONS;

    this.snake = new Snake(this.ctx, this.RESOLUTION);
  }
}

class Snake {
  private ctx;
  private readonly black = "#000";

  private readonly snakeBodyDimensions = 50;

  private readonly res;

  constructor(ctx, RESOLUTION){
    this.ctx = ctx;
    this.res = RESOLUTION;
    this.drawSnakeStartingPos();
  }

  drawSnakeStartingPos = () => {
    this.ctx.beginPath();
    this.ctx.rect(400, 400, 1 * this.res, 1 * this.res);
    this.ctx.fillStyle = this.black;
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawSnake = () => {
    
  }
}

/*
  - Create a GameLoop Interface 

*/
