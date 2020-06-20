import { Component, OnInit } from "@angular/core";
import { gameObject } from "../Schemas/game-object";
import { Ship } from "../Schemas/ship";

@Component({
  selector: "app-asteroids-main",
  templateUrl: "./asteroids-main.component.html",
  styleUrls: ["./asteroids-main.component.scss"]
})
export class AsteroidsMainComponent implements OnInit {

  public ship: Ship = null;
  public board = null;

  public boardWidth;
  public boardHeight;

  public fullElement;

  // board context
  public ctx = null;

  public gameObject = null;

  public pause = false;
  public eng;

  constructor() { }

  ngOnInit(): void {
    this.initializeBoardAndContext();
    this.initializeGameObject();

    this.prepGameBeforeStart();
  }

  public start = () => {
    if (!this.eng) {
      this.eng = window.requestAnimationFrame(this.loop);
    }
  }

  public stop = () => {
    if (this.eng) {
      window.cancelAnimationFrame(this.eng);
      this.eng = undefined;
    }
  }

  // need a start engine and a stop engine type functions

  nextCalculations = () => {
    this.ship.moveShip();
  }

  reDrawObjects = () => {
    this.ship.draw();
  }

  public loop = () => {
    this.eng = undefined;
    // must calculate next positons for all objects
    this.nextCalculations();
    // clear screen
    this.clearBoard();
    // re-draw and update all objects
    this.reDrawObjects();

    // repeat
    this.start();
  }

  public initializeBoardAndContext = (): void => {
    this.board = document.getElementById("aster");
    this.ctx = this.board.getContext("2d");

    const mainContainer = document.getElementById("main");
    this.boardWidth = mainContainer.offsetWidth;
    this.boardHeight = mainContainer.offsetHeight;

    // Need to write some notes on how to get full width of screen
    this.board.width = this.boardWidth;
    this.board.height = this.boardHeight;

    // Assign functions for document
    document.onkeydown = this.handleKeyDown;
    document.onkeyup = this.handleKeyUp;
    document.onkeypress = this.handleKeyPress;
  }

  public initializeGameObject = (): void => {
    this.gameObject = gameObject(this.boardWidth / 2, this.boardHeight - 75, this.ctx);
    this.ship = this.gameObject.ship;
  }

  public prepGameBeforeStart = (): void => {
    // Draw ship
    this.ship.drawTriangle();
  }

  public clearBoard = () => {
    this.ctx.clearRect(0, 0, this.boardWidth, this.boardHeight);
  }

  public handleKeyUp = e => {
    // console.log("handleKeyUp: ", e.keyCode);
  }

  public handleKeyDown = e => {
    // Handle key presses 
    // So directional key presses 
    // Wether to show engine fume or not ect... 
    // console.log("handleKeyDown: ", e.keyCode);
  }

  public handleKeyPress = e => {
    // which will handle instructions such as
    // stop, start, instructions menu, new game ect... 
    console.log("handleKeyPress: ", e.keyCode);

    if (e.keyCode === 112) {
      this.stop();
      return;
    }

    if (e.keyCode === 115) {
      this.start();
      return;
    }
  }
}
