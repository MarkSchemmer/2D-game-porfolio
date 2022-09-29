import { Component, OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: "app-chess",
  templateUrl: "./chess-board.component.html",
  styleUrls: ["./chess-board.component.scss"]
})
export class ChessBoardComponent implements OnInit, OnDestroy {

  public boardDimensions: number = 800;
  public canvas = null;
  public ctx = null;
  
  constructor() { }
  
  ngOnInit() {
    this.initialGame();
  }
  
  ngOnDestroy() { }


  startGame = () => {

  }

  stopGame = () => {

  }

  initialGame = () => {
    // Get the board, and it's context.
    this.canvas = document.getElementById("chess-board");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.boardDimensions;
    this.canvas.height = this.boardDimensions;
    // document.onkeydown = this.handleKeyboardStrokes;
    // // document.onkeyup = this.handleKeyboardStrokes;
  }
}
