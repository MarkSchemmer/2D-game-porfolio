import { Component, OnInit } from "@angular/core";
import { isValue } from "utils/Utils";
import { Cell, genConwaysBoard } from "../Util/ConwaysUtils";

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
    this.board = new Grid(this.grid, this.resolution);
    this.board.draw(this.grid, this.ctx);
  }

  public handleBoardClick = e => {
    const x = e.pageX - this.canvas.offsetLeft;
    const y = e.pageY - this.canvas.offsetTop;
    if (y >= 0 && y <= y + this.resolution) {
      const indexOfX = Math.floor(x / this.resolution);
      const indexOfY = Math.floor(y / this.resolution);   
      this.grid[indexOfX][indexOfY].isAlive =  !this.grid[indexOfX][indexOfY].isAlive;
      this.board.draw(this.grid, this.ctx);
      // console.log(this.grid);
    }
    // Need to identify which square was hit?
  }

  public nextGen = () => {
    const newGrid = this.board.calculateNextGeneration(this.grid);
    this.grid = newGrid;
    this.board.draw(this.grid, this.ctx);
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
  public black = "#000";
  public resolution;

  constructor(grid, resolution) {
    this.resolution = resolution;
    this.calculateRange(grid);
  }

  public getNeighbors = (grid, col, row): Cell[] => {
    const topNeighbor = grid[col] && grid[col][row - 1] || null;
    const bottomNeighbor = grid[col] && grid[col][row + 1] || null;
    const leftNeighbor = grid[col - 1] && grid[col - 1][row] || null;
    const rightNeighbor = grid[col + 1] && grid[col + 1][row] || null;
    const upperRight = grid[col - 1] && grid[col - 1][row - 1] || null;
    const upperLeft = grid[col - 1] && grid[col - 1][row - 1] || null;
    const lowerRight = grid[col - 1] && grid[col - 1][row + 1] || null;
    const lowerLeft = grid[col - 1] && grid[col - 1][row + 1] || null;
    const neighbors = [ 
              topNeighbor, bottomNeighbor, 
              leftNeighbor, rightNeighbor, 
              upperLeft, upperRight, 
              lowerRight, lowerLeft 
           ];
    // if (col === 4 && row === 4) { console.log(neighbors); }
    const newNeighbors = neighbors.filter(c => c && c.isAlive === true);
    return newNeighbors;    
  }

  public calculateNextGeneration = grid => {
    console.log(
      grid.map(col => col.map(c => c.isAlive)).reduce((acc, cur) => acc.concat(cur)).filter(c => c === true)
    );
    for (let col = 0; col < grid.length; col++) {
      for (let row = 0; row < grid[col].length; row++) {

          const cell: Cell = grid[col][row];
          // get function for getting neighbors
          const neighbors = this.getNeighbors(grid, col, row);
          if (col === 4 && row === 4) {
            // console.log(neighbors);
            // console.log(grid);
          }
          if (cell.isAlive && neighbors.length === 2 || neighbors.length === 3) {
          } else if (cell.cellIsDead() && neighbors.length >= 2) {
             cell.isAlive = true;
          } else if (cell.isAlive) {
            cell.isAlive = false;
          }
      }
    }
    console.log(
      grid.map(col => col.map(c => c.isAlive)).reduce((acc, cur) => acc.concat(cur)).filter(c => c === true)
    );
    return grid;
  }

  public calculateRange = grid => {
    for (let col = 0; col < grid.length; col++) {
      for (let row = 0; row < grid[col].length; row++) {
        const cell: Cell = grid[col][row];
        cell.xRange = (col * this.resolution);
        cell.yRange = (row * this.resolution);
      }
    }
  }

  public draw = (grid, ctx) => {
    for (let col = 0; col < grid.length; col++) {
      for (let row = 0; row < grid[col].length; row++) {
        ctx.clearRect(col * this.resolution, row * this.resolution, this.resolution, this.resolution);
        const cell: Cell = grid[col][row];
        ctx.beginPath();
        // maybe get the x and y and store that in the cell it self... 
        ctx.rect(col * this.resolution, row * this.resolution, this.resolution, this.resolution);
        ctx.stroke();
        if (cell.isAlive) { ctx.fill(); }
      }
    }
  }
}

/*
  Rules: 
    The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in
    one of two possible states, alive or dead, (or populated and unpopulated, respectively). Every cell interacts 
    with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At 
    each step in time, the following transitions occur:

    Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    Any live cell with two or three live neighbours lives on to the next generation.
    Any live cell with more than three live neighbours dies, as if by overpopulation.
    Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    These rules, which compare the behavior of the automaton to real life, can be condensed into the following:

    Any live cell with two or three neighbors survives.
    Any dead cell with three live neighbors becomes a live cell.
    All other live cells die in the next generation. Similarly, all other dead cells stay dead.
    The initial pattern constitutes the seed of the system. The first generation is created by applying the 
    above rules simultaneously to every cell in the seed; births and deaths occur simultaneously, and the 
    discrete moment at which this happens is sometimes called a tick. Each generation is a pure function of 
    the preceding one. The rules continue to be applied repeatedly to create further generations.

*/
