import { Coordinate } from "src/app/common/utils";
import { ChessCoordinate, IChessCell } from "../chess-utils/utils";

/*

  I'm needing to write horizontal -> either a - h

  On the vertical 1 - 8


  Chess green base black square: #769656

  Chess white base white square: #eeeed2

  The way for prouducing 

*/

export class ChessGrid {
    // dimension of each square
     public thickness = 1;
     public black = "#000";
     // Highlighted yellow square
     public yellowSquare = "#fff576bd";
     // Highlighted red square
     // rgb(236 126 106); convert into hex -> 
     public redSquare = "#ec7e6ac7";
     public resolution;
     public COLS;
     public ROWS;
     public grid;
     public ctx;
     public sqaureIsFocused = false;
     public currentFocusedSquare: Coordinate = null;
   
     constructor(grid, resolution, c, r, ctx) {
       this.resolution = resolution;
       this.calculateRange(grid);
       this.COLS = c;
       this.ROWS = r;
       this.grid = grid;
       this.ctx = ctx;
     }
   
     public calculateRange = grid => {
       for (let col = 0; col < grid.length; col++) {
         for (let row = 0; row < grid[col].length; row++) {
           const cell: IChessCell = grid[col][row];
           cell.xRange = (col * this.resolution);
           cell.yRange = (row * this.resolution);
         }
       }
     }
   
     public draw = () => {
       for (let col = 0; col < this.grid.length; col++) {
         for (let row = 0; row < this.grid[col].length; row++) {
           this.ctx.clearRect(col * this.resolution, row * this.resolution, this.resolution, this.resolution);
           const cell: IChessCell = this.grid[col][row];
           this.ctx.beginPath();
           this.ctx.rect(col * this.resolution, row * this.resolution, this.resolution, this.resolution);
           this.ctx.stroke();
           
           this.ctx.fillStyle = cell.cellsColor;
           this.ctx.fill();
           
           if (cell.isAlive) 
           { 
              this.ctx.fillStyle = this.yellowSquare;
              this.ctx.fill(); 
           }

           if (cell.redSquareActivated) 
           {
              this.ctx.fillStyle = this.redSquare;
              this.ctx.fill();
           }

           if (cell.letterText != null) 
           {
              this.ctx.fillStyle = this.black;
              this.ctx.font = "20px Arial";
              this.ctx.fillText(cell.letterText, cell.xRange + 8, cell.yRange + 20);
           }

           if (cell.numberText != null) 
           {
              //console.log(cell.numberText);
              this.ctx.fillStyle = this.black;
              this.ctx.font = "20px Arial";
              this.ctx.fillText(cell.numberText, cell.xRange + 80, 795);
           }

           if (cell.piece != null) 
           {
              cell.piece.draw(this.ctx, cell.xRange + 25, cell.yRange + 25);
           }
         }
       }
     }

     resetAllSquares = () => {
      for (let col = 0; col < this.grid.length; col++) {
        for (let row = 0; row < this.grid[col].length; row++) {
          const cell: IChessCell = this.grid[col][row];
          cell.isAlive = false;
          cell.redSquareActivated = false;
        }
      }
     }

     resetAllYellowSquares = () => {
      for (let col = 0; col < this.grid.length; col++) {
        for (let row = 0; row < this.grid[col].length; row++) {
          const cell: IChessCell = this.grid[col][row];
          cell.isAlive = false;
        }
      }
     }

     resetAllRedSquares = (prevX, prevY, x, y) => {
      for (let col = 0; col < this.grid.length; col++) {
        for (let row = 0; row < this.grid[col].length; row++) {
          const cell: IChessCell = this.grid[col][row];
          cell.isAlive = false;
        }
      }
     }

     areRedSquaresActive = (): boolean => {
       return this.grid.some(cells => cells.some(cell => cell.redSquareActivated === true));
     }

     isYellowSquareActive = (): boolean => {
      return this.grid.some(cells => cells.some(cell => cell.isAlive === true));
    }

     public clickSquare = (x, y, e, isLeftClick) => {
        // this.grid[x][y].coordinate.LogCoordinate(); // just log the coordinate. 
        if (isLeftClick) 
        {
            if (this.areRedSquaresActive()) 
            {
              this.resetAllSquares();
            }
            else 
            {
                  let cell = this.grid[x][y];
                  // If focused square is null, then nothing is selected. 
                  if (this.currentFocusedSquare === null && cell.piece !== null) 
                  {
                    this.grid[x][y].isAlive = !this.grid[x][y].isAlive;
                    this.currentFocusedSquare = new ChessCoordinate(x, y);
                  } else if (this.currentFocusedSquare.x === x && this.currentFocusedSquare.y === y) {
                    // clicking the same square, meaning we need to toggle it again. 
                    this.grid[x][y].isAlive = !this.grid[x][y].isAlive;
                  }
                  else if (cell.piece === null) {
                    if (this.currentFocusedSquare !== null) {
                        // turn old square of
                        let oldX = this.currentFocusedSquare.x;
                        let oldY = this.currentFocusedSquare.y;
                        this.grid[oldX][oldY].isAlive = false;
                    }
                  } 
                  else {
                    // selecting a new square, we need to access the old square and then turn it false.
                    // Then we need to select the new sqaure.

                    // turn old square of
                    let oldX = this.currentFocusedSquare.x;
                    let oldY = this.currentFocusedSquare.y;
                    this.grid[oldX][oldY].isAlive = false;

                    // Update new focused square
                    this.currentFocusedSquare.x = x;
                    this.currentFocusedSquare.y = y;
                    this.grid[x][y].isAlive = true;
                    // console.log(`${x}-${y}`);
                  }
            }
        }
        else 
        {
          if (this.isYellowSquareActive()) 
          {
            this.resetAllYellowSquares();
          }
          // console.log("right click");
          this.grid[x][y].redSquareActivated = !this.grid[x][y].redSquareActivated;
        }
        
        // this.resetAllSquares(this.prevX, this.prevY, x, y);
        this.draw();
     }
   }

