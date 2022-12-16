import { Coordinate } from "src/app/common/utils";
import { isValue } from "utils/Utils";
import { ChessCell, connectBoard, IChessCell } from "../chess-utils/utils";
import { ChessRules } from "../chess-business-rules/chess-rules";

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

     public couldMoveSquare = "#09f7e175";
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
     public focusedCell: ChessCell = null;
     public chessRules: ChessRules = new ChessRules();

     // Can add a hash map for simplification.
     public pieceMap: { [key: string] : ChessCell };
   
     constructor(grid, resolution, c, r, ctx) {
      this.resolution = resolution;
      this.COLS = c;
      this.ROWS = r;
      this.grid = grid;
      this.ctx = ctx;

      this.pieceMap = (this.grid.flat())
       .reduce((acc, cur, idx) => {
        acc[cur.coordinate.chessCoordinate] = cur; 
        return acc;
      }, {});
       // console.log(this.pieceMap);
      this.calculateRange(this.grid);
      connectBoard(this.pieceMap);
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
           const cell: ChessCell = this.grid[col][row];
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

           if (cell.canMoveToOrAttack) 
           {
              this.ctx.fillStyle = this.couldMoveSquare;
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

     public resetAllSquares = () => {
        Object.values(this.pieceMap).forEach((c: ChessCell) => {
          c.isAlive = false;
          c.redSquareActivated = false;
          c.canMoveToOrAttack = false;
        });
     }

     public resetAllYellowSquares = () => {
        Object.values(this.pieceMap).forEach((c: ChessCell) => {
          c.isAlive = false;
        });
     }

     public resetAllRedSquares = () => {
        Object.values(this.pieceMap).forEach((c: ChessCell) => {
          c.redSquareActivated = false;
        });
     }

     public unSelectedOldSelectedSquares = () => {
      Object.values(this.pieceMap).forEach((c: ChessCell) => {
        c.canMoveToOrAttack = false;
      });
     }

     public areRedSquaresActive = (): boolean => {
       return Object.values(this.pieceMap).some(cell => cell.redSquareActivated === true)
     }

    public isYellowSquareActive = (): boolean => {
      return Object.values(this.pieceMap).some(cell => cell.isAlive === true)
    }

    public focusSquare = (cell: ChessCell) => {
          // console.log(cell.coordinate.chessCoordinate);
          // We need to toggle the cell.
          cell.isAlive = !cell.isAlive;
          // we need to make the sqaure active
          if (isValue(cell.piece)) {
            cell.piece.FindMoves(cell);
          }

      // we need to also make sure that paths it can move or attack are also
      // highlighted

      this.focusedCell = cell;
    }

    public unFocusOldSquare = (cell: ChessCell) => {
      cell.isAlive = false;
      if (isValue(cell.piece)){
        this.unSelectedOldSelectedSquares();
      }
    }

    public focusNewSquare = (cell: ChessCell) => {
      // first unfocus old square
      if (isValue(cell.piece)) {
        this.unFocusOldSquare(this.focusedCell);
      }
      
      // Second focus new square
      this.focusSquare(cell);
    }

    public movePieceToSquare = (cell) => {
      // Primitive movement will if will be 
      // focused.piece to cell.piece;

      let piece = this.focusedCell.piece;
      cell.piece = piece;
      this.focusedCell.piece = null;
      this.focusedCell = null;
      this.resetAllSquares();
      this.draw();
    }

    public clickSquare = (x, y, e, isLeftClick) => {

      /*
         Items we need to cover when handling a click. 


         Note: 

         For determining intent to move piece, you need to have a focused cell
         And then you
      */
      let cell: ChessCell = this.grid[x][y];
      console.log(cell);
      console.log(this.focusedCell);
      let piece = cell.piece;
      if (isLeftClick) 
      {
        if (isValue(piece)) 
        { 
            // We need to reset all redsquares just in case. 
            this.resetAllRedSquares();
            // if no square is selected select square and focus
            if (this.focusedCell === null) { this.focusSquare(cell); }
            // If the square was clicked as the previous square
            else if (this.focusedCell.coordinate.chessCoordinate === cell.coordinate.chessCoordinate) { this.unFocusOldSquare(cell); }
            // We know it's not the same cell, also we know The pieces are different colors. 
            else if (this.focusedCell != null && this.focusedCell.piece.pieceColor != cell.piece.pieceColor && cell.canMoveToOrAttack) { this.movePieceToSquare(cell); }
            // In this else if sqaure block, 
            // Focusing new square that was clicked, so basically focus new square and unfocus old square
            else { this.focusNewSquare(cell); }
            // After all operations we update the previous cell
        }
        else if (this.focusSquare != null && cell.canMoveToOrAttack) { this.movePieceToSquare(cell); }
        // Clicked a square and we need to unofus all squares 
        else 
        {
          this.resetAllSquares();
          this.focusedCell = null;
        }
      }
      else 
      {
        cell.redSquareActivated = !cell.redSquareActivated;
      }
    }
   }

