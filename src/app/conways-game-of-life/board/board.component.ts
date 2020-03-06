import { Component, OnInit } from "@angular/core";
import { genConwaysBoard, Cell } from "../Util/ConwaysUtils";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit {
  public COLS;
  public ROWS;
  public grid; 
  public canvas;
  public ctx;
  public resolution = 40;
  public board;

  constructor() { }

  ngOnInit() {
    this.canvas = document.getElementById("board");
    this.canvas.addEventListener("click", this.handleBoardClick);
    this.canvas.width = 400;
    this.canvas.height = 400;
    this.ctx = this.canvas.getContext("2d");
    this.COLS = this.canvas.width / this.resolution;
    this.ROWS = this.canvas.height / this.resolution;
    this.grid = genConwaysBoard(this.COLS, this.ROWS);
    this.board = new Grid(this.grid, this.ctx, this.resolution);
    this.board.draw();
  }

  public handleBoardClick = e => {
    const x = e.pageX - this.canvas.offsetLeft;
    const y = e.pageY - this.canvas.offsetTop;
    if (y >= 0 && y <= y + this.resolution) {
      const indexOfX = Math.floor(x / this.resolution);
      const indexOfY = Math.floor(y / this.resolution);
      
      this.grid[indexOfX][indexOfY].isAlive = true;
      this.board.draw();
    }
    // Need to identify which square was hit?
  }

}

/*
  How to clear the screen
*/

class Grid {
 // dimension of each square
  public width = 10;
  public height = 5;
  public thickness = 1;
  public grid;
  public black = "#000";
  public resolution;

  public ctx;

  constructor(grid, ctx, resolution) {
    this.grid = grid;
    this.ctx = ctx;
    this.resolution = resolution;
    this.calculateRange();
  }

  public calculateRange = () => {
    for (let col = 0; col < this.grid.length; col++) {
      for (let row = 0; row < this.grid[col].length; row++) {
        const cell: Cell = this.grid[col][row];
        cell.xRange = (col * this.resolution);
        cell.yRange = (row * this.resolution);
      }
    }

    console.log(this.grid);
  }

  public draw = () => {
    for (let col = 0; col < this.grid.length; col++) {
      for (let row = 0; row < this.grid[col].length; row++) {
        const cell: Cell = this.grid[col][row];
        this.ctx.beginPath();
        // maybe get the x and y and store that in the cell it self... 
        this.ctx.rect(col * this.resolution, row * this.resolution, this.resolution, this.resolution);
        this.ctx.stroke();

        if (cell.isAlive) { this.ctx.fill(); }
      }
    }
  }
}
