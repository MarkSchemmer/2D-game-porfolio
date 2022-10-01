import { Coordinate } from "src/app/common/utils";

export class ChessGrid {
    // dimension of each square
     public thickness = 1;
     public black = "#000";
     // Highlighted yellow square
     public yellowSquare = "#fff35f";
     // Highlighted red square
     public redSquare = "";

     public resolution;
     public COLS;
     public ROWS;

     public grid;
     public ctx;

     public sqaureIsFocused = false;

     public currentFocusedSquare: Coordinate = null;


     prevX;
     prevY;
   
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
           if (cell.isAlive) 
           { 
              this.ctx.fillStyle = this.yellowSquare;
              this.ctx.fill(); 
           }
         }
       }
     }

     resetAllSquares = (prevX, prevY, x, y) => {
      for (let col = 0; col < this.grid.length; col++) {
        for (let row = 0; row < this.grid[col].length; row++) {
          const cell: IChessCell = this.grid[col][row];
          cell.isAlive = false;
        }
      }
     }

     public clickSquare = (x, y, e) => {
        // If focused square is null, then nothing is selected. 
        if (this.currentFocusedSquare === null) 
        {
          this.grid[x][y].isAlive = !this.grid[x][y].isAlive;
          this.currentFocusedSquare = new Coordinate(x, y);
        } else if (this.currentFocusedSquare.x === x && this.currentFocusedSquare.y === y) {
          // clicking the same square, meaning we need to toggle it again. 
          this.grid[x][y].isAlive = !this.grid[x][y].isAlive;
        } else {
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
        
        // this.resetAllSquares(this.prevX, this.prevY, x, y);
        this.draw();
     }

   }

   interface IChessCell {
        xRange: number
        yRange: number
        isAlive: boolean
   }

   class ChessCell implements IChessCell {
        public xRange: number;
        public yRange: number;
        public isAlive: boolean = false;
        constructor() { }
   }