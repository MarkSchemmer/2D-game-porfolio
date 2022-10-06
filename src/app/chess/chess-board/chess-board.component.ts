import { Component, OnDestroy, OnInit } from "@angular/core";
import { genChessBoard, IChessCell, Mouse } from "../chess-utils/utils";
import { ChessGrid } from "../chessGrid/chessGrid";
declare var $: any;

@Component({
  selector: "app-chess",
  templateUrl: "./chess-board.component.html",
  styleUrls: ["./chess-board.component.scss"]
})
export class ChessBoardComponent implements OnInit, OnDestroy {

  public boardDimensions: number = 800;
  public squareDimensions: number = this.boardDimensions / 8;
  public canvas = null;
  public ctx = null;
  public resolution: number = 100;
  public chessBoard: ChessGrid = null;

  public mouseData: Mouse = null;
  
  constructor() {}
  
  ngOnInit() {
    this.initialGame();
  }
  
  ngOnDestroy() {}
  startGame = () => {}
  stopGame = () => {}
  initialGame = () => {
    // Get the board, and it's context.
    this.canvas = document.getElementById("chess-board");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.boardDimensions;
    this.canvas.height = this.boardDimensions;
    // document.onkeydown = this.handleKeyboardStrokes;
    // // document.onkeyup = this.handleKeyboardStrokes;
    document.onclick = this.handleBoardClick
    // document.ondblclick = evt => { evt.preventDefault(); }

    // Initialize board and draw. 
    this.chessBoard = new ChessGrid(genChessBoard(), this.resolution, 8, 8, this.ctx);
    this.chessBoard.draw();
    this.mouseData = new Mouse(this.canvas, $("canvas"), this.resolution, this.chessBoard);

    // Disables right click.
    this.canvas.addEventListener("contextmenu", evt => {
      // console.log(evt);
      evt.preventDefault();
      this.handleBoardClick(evt);
    }, false);

    // this.canvas.addEventListener("dblclick", evt => { evt.preventDefault(); });
  }

  handleBoardClick = e => {
      e.preventDefault();
      let isLeftClick = e.type === "click"; // if type then right click if click then left click. 
      // property name: 'type'
      // contextmenu -> right click.
      // click -> left click
      // e.preventDefault();
      // console.log(e);
      
      const x = e.pageX - this.canvas.offsetLeft;
      const y = e.pageY - this.canvas.offsetTop;
      const indexOfX = Math.floor(x / this.resolution);
      const indexOfY = Math.floor(y / this.resolution); 
      try 
      {
        if (this.chessBoard.grid[indexOfX][indexOfY]) 
        {
            // console.log(`${indexOfX}-${indexOfY}`);
            // Hightlight the square
            // let chessCell: IChessCell = this.chessBoard.grid[indexOfX][indexOfY];
            // chessCell.isAlive = true;
            // this.chessBoard.draw();
            this.chessBoard.clickSquare(indexOfX, indexOfY, e, isLeftClick);
        }
        else 
        {
          // console.log("here in the else block. ");
          if (this.chessBoard.isYellowSquareActive()) {
            this.chessBoard.resetAllYellowSquares();
          }
        }
      } 
      catch(ex) 
      {
        // A click was outside of the chess grid
        // uncheck focused yellow sqaures. 
        this.chessBoard.resetAllYellowSquares();
        this.chessBoard.draw();
        console.log(ex);
      }
  }

  handleMouseDown = e => {

  }
}

// Todos
/*


    You can click one square to focus piece then click that said square again
    un-focus it or you can click outside of the board and then clear the focus

    You can click multiple squares right-click and turn multiple squares red

    Please note that a click outside the board won't un-focus red squares
    But 1 red click will un-focus all red sqaures

    Also 1 left click will unfocus on all red squares. 






    1. Draw board with colors - DONE
    2. Have ability to click square and highlight - DONE
    3. Have images and draw pieces - DONE
    4. Create pieces and then way for generating board - DONE

    5. Create scan for possible moves
    6. Allow movement with mouse clicks
    7. Only activate yellow if piece is on square
    8. show preivous moves, and save move state
    9. Learn chess notation, and write 
    10. Detect if check
    11. Detect if checkmate
    12. Implement drag and drop
    13. Implement arrow directions for learning.

    Idea for handling mouse movements on board to track mouse. 

      var canvas = document.getElementById("canvas");
      var ctx = canvas.getContext("2d");

      var canvasOffset = $("#canvas").offset();
      var offsetX = canvasOffset.left;
      var offsetY = canvasOffset.top;

      function handleMouseDown(e) {
          mouseX = parseInt(e.clientX - offsetX);
          mouseY = parseInt(e.clientY - offsetY);
          $("#downlog").html("Down: " + mouseX + " / " + mouseY);

          // Put your mousedown stuff here

      }

      function handleMouseUp(e) {
          mouseX = parseInt(e.clientX - offsetX);
          mouseY = parseInt(e.clientY - offsetY);
          $("#uplog").html("Up: " + mouseX + " / " + mouseY);

          // Put your mouseup stuff here
      }

      function handleMouseOut(e) {
          mouseX = parseInt(e.clientX - offsetX);
          mouseY = parseInt(e.clientY - offsetY);
          $("#outlog").html("Out: " + mouseX + " / " + mouseY);

          // Put your mouseOut stuff here
      }

      function handleMouseMove(e) {
          mouseX = parseInt(e.clientX - offsetX);
          mouseY = parseInt(e.clientY - offsetY);
          $("#movelog").html("Move: " + mouseX + " / " + mouseY);

          // Put your mousemove stuff here

      }

      $("#canvas").mousedown(function (e) {
          handleMouseDown(e);
      });
      $("#canvas").mousemove(function (e) {
          handleMouseMove(e);
      });
      $("#canvas").mouseup(function (e) {
          handleMouseUp(e);
      });
      $("#canvas").mouseout(function (e) {
          handleMouseOut(e);
      });
*/
