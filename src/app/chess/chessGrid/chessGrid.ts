import { Coordinate } from "src/app/common/utils";
import { isValue } from "utils/Utils";
import { connectBoard } from "../chess-utils/utils";
import { ChessCell, IChessCell } from "../ChessCell/ChessCell";
import { ChessRules } from "../chess-business-rules/chess-rules";
import { Piece, PieceColor, PieceName } from "../chess-utils/Piece";

/*
  I'm needing to write horizontal -> either a - h

  On the vertical 1 - 8

  Chess green base black square: #769656

  Chess white base white square: #eeeed2

  The way for prouducing 
*/

export class ChessGrid {

    public blackInCheck: boolean = false;
    public whiteInCheck: boolean = false;
    public whiteInCheckMate: boolean = false;
    public blackInCheckMate: boolean = false;
    public whosMoveisIt: PieceColor = PieceColor.WHITE;

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
     public ctx;
     public grid;
     public sqaureIsFocused = false;
     public currentFocusedSquare: Coordinate = null;
     public focusedCell: ChessCell = null;
     public chessRules: ChessRules = new ChessRules();

     public blackKing: ChessCell = null;
     public whiteKing: ChessCell = null;

     // Can add a hash map for simplification.
     public pieceMap: { [key: string] : ChessCell };
   
     constructor(grid, resolution, c, r, ctx) {
      this.resolution = resolution;
      this.COLS = c;
      this.ROWS = r;
      this.grid = grid;
      this.ctx = ctx;

      this.pieceMap = (grid.flat())
       .reduce((acc, cur, idx) => {
        acc[cur.coordinate.chessCoordinate] = cur; 
        return acc;
      }, {});
       // console.log(this.pieceMap);
      this.calculateRange(this.grid);
      connectBoard(this.pieceMap);

      this.blackKing = this.findBlackKing();
      this.whiteKing = this.findWhiteKing();

      // console.log(this.blackKing);
     }

     public changeWhosMoveItIs = () => {
        if (this.whosMoveisIt === PieceColor.WHITE) {
          this.whosMoveisIt = PieceColor.BLACK;
        } else {
          this.whosMoveisIt = PieceColor.WHITE;
        }
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

     public findBlackKing = () => this.FindPieces(PieceColor.BLACK, PieceName.KING)[0];

     public findWhiteKing = () => this.FindPieces(PieceColor.WHITE, PieceName.KING)[0];

     public FindPieces = (color: PieceColor, pieceName: PieceName) => {
        return Object.values(this.pieceMap).filter((c: ChessCell) => {
           return c.piece && c.piece.PieceName === pieceName && c.piece.pieceColor === color;
        });
     }

     public FindAllPiecesOfSameColor = (color: PieceColor) => {
      // console.log(this.pieceMap);
      return Object.values(this.pieceMap).filter((c: ChessCell) => {
        return c.piece && c.piece.pieceColor === color;
      });
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
          if (isValue(cell.piece) && cell.isAlive) {
            cell.piece.FindMoves(cell);
            this.focusedCell = cell;
          } else {
            this.unFocusOldSquare(cell);
          }

      // we need to also make sure that paths it can move or attack are also
      // highlighted
      this.focusedCell = cell;
    }

    public unFocusOldSquare = (cell: ChessCell) => {
      cell.isAlive = false;
      if (isValue(cell.piece)) {
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

      // focused cell moving to cell

        // Primitive movement will if will be 
        // focused.piece to cell.piece;
        let FocusedPastPieceCoordinate = this.focusedCell.coordinate.chessCoordinate;
        let FocusedPiece = this.focusedCell.piece;


        this.pieceMap[cell.coordinate.chessCoordinate].piece = null;
        cell.piece = null;

        cell.piece = FocusedPiece;
        this.pieceMap[cell.coordinate.chessCoordinate].piece = FocusedPiece;

        cell.piece.hasMoved = true;
        this.pieceMap[cell.coordinate.chessCoordinate].piece.hasMoved = true;

        this.focusedCell.piece = null;
        this.focusedCell = null;

        // this.pieceMap[FocusedPastPieceCoordinate].piece = null;

        this.resetAllSquares();
        this.draw();
    }

    public clickSquare = (x, y, e, isLeftClick) => {
      /*
          Logic for finding check will not interupt the game as of now, 

          it will only just log and alert for the moment. 
      */

      // this.chessRules.KingCheck(king, allPieces);
      /*

          Things I need to know before we can logically code this out

            - Check if were in check, if were not in check then we can make a move

          Logic for 'check', can check opposing team

          Logic, can't move if in check, if in check you must move out of check

          Logic
      
      */


      /*
         Items we need to cover when handling a click. 


         Note: 

         For determining intent to move piece, you need to have a focused cell
         And then you
      */
      let c: ChessCell = this.grid[x][y];
      let cell: ChessCell = this.pieceMap[c.coordinate.chessCoordinate];
      // console.log(cell);
      // console.log(this.focusedCell);
      let piece = cell.piece;
      let isValidPiece = isValue(piece);
      // Allows user to actually make a move, only move a piece if it is in fact it's turn.
      // How do we determine whos move it is? 
      // White goes first
      // Then Black
      // ect... flip flopping the turn.
      let pieceColor: PieceColor = this.focusedCell === null ? null : this.focusedCell.piece.pieceColor;
      let canMove: boolean = pieceColor !== null && pieceColor === this.whosMoveisIt;
      // Here we need to realize if we are in check
      // We need to determine if we can make a move out of check
      // if we are in check, then move out of check or look for 'check-mate' detection
      // if we are not in check, then just make a normal move
      // algorithm for searching for check
      // algorithm for getting out of check
      if (isLeftClick) 
      {
        if (isValidPiece) 
        { 
            console.log(cell);
            // We need to reset all redsquares just in case. 
            this.resetAllRedSquares();
            // if no square is selected select square and focus
            if (this.focusedCell === null) { this.focusSquare(cell); }
            // If the square was clicked as the previous square
            else if (this.focusedCell.coordinate.chessCoordinate === cell.coordinate.chessCoordinate) { this.focusSquare(cell); }
            // We know it's not the same cell, also we know The pieces are different colors. 
            else if (this.focusedCell != null && this.focusedCell.piece.pieceColor != cell.piece.pieceColor && cell.canMoveToOrAttack && canMove) { 
              this.movePieceToSquare(cell);
              let king = this.whosMoveisIt === PieceColor.WHITE ? this.findBlackKing(): this.findWhiteKing();
              let allPieces = this.FindAllPiecesOfSameColor(this.whosMoveisIt === PieceColor.WHITE ? PieceColor.WHITE : PieceColor.BLACK);
              this.chessRules.KingCheck(king, allPieces);
              this.changeWhosMoveItIs();
            }
            // In this else if sqaure block, 
            // Focusing new square that was clicked, so basically focus new square and unfocus old square
            else { this.focusNewSquare(cell); }
            // After all operations we update the previous cell
        }
        else if (this.focusSquare != null && cell.canMoveToOrAttack && canMove) { 
          this.movePieceToSquare(cell); 
          let king = this.whosMoveisIt === PieceColor.WHITE ? this.findBlackKing(): this.findWhiteKing();
          let allPieces = this.FindAllPiecesOfSameColor(this.whosMoveisIt === PieceColor.WHITE ? PieceColor.WHITE : PieceColor.BLACK);
          this.chessRules.KingCheck(king, allPieces);
          this.changeWhosMoveItIs();
        }
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

