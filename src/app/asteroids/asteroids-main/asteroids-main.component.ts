import { Component, OnInit } from "@angular/core";
import { isValue } from "utils/Utils";
import { gameObject } from "../Schemas/game-object";
import { Ship } from "../Schemas/ship";

@Component({
  selector: "app-asteroids-main",
  templateUrl: "./asteroids-main.component.html",
  styleUrls: ["./asteroids-main.component.scss"]
})
export class AsteroidsMainComponent implements OnInit {

  public ship: Ship = null;
  // canvas
  public board = null;
  public boardWidth;
  public boardHeight;
  // board context
  public ctx = null;
  public gameObject = null;
  public pause = false;
  public eng;
  public frames = 50;

  constructor() { }

  ngOnInit(): void {
    this.initializeBoardAndContext();
    this.initializeGameObject();
    this.prepGameBeforeStart();
  }

  public start = () => {
    if (!this.eng) {
      this.eng = setInterval(this.loop, this.frames);
    }
  }

  public stop = () => {
    if (this.eng) {
      clearInterval(this.eng);
      this.eng = undefined;
    }
  }

  nextCalculations = () => {
    this.ship.calculateShipsNextPosition();
  }

  reDrawObjects = () => {
    this.ship.draw();
  }

  public loop = () => {
    // must calculate next positons for all objects
    this.nextCalculations();
    // // clear screen
    this.clearCanvas(this.board);
    // re-draw and update all objects
    this.reDrawObjects();
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
    // this.ship.drawTriangle();
  }

  public clearBoard = () => {
    this.ctx.clearRect(0, 0, this.ctx.canvas.height, this.ctx.canvas.width);
  }

  public clearCanvas(canvas) {
      const ctx = canvas.getContext("2d");
      ctx.save();
      ctx.globalCompositeOperation = "copy";
      ctx.strokeStyle = "transparent";
      ctx.beginPath();
      ctx.lineTo(0, 0);
      ctx.stroke();
      ctx.restore();
  }

  public handleKeyUp = e => {
    switch (e.keyCode) {
      case 81: {
        this.ship.shipControls.left = false;
        break;
      }
      case 87: {
        this.ship.shipControls.right = false;
        break;
      }
      case 38: {
        this.ship.shipControls.forwardForce = false;
        break;
      }
      default: {
        // log and forget
      }
    }
  }

  public handleKeyDown = e => {
    switch (e.keyCode) {
      case 81: {
        this.ship.shipControls.left = true;
        break;
      }
      case 87: {
        this.ship.shipControls.right = true;
        break;
      }
      case 38: {
        this.ship.shipControls.forwardForce = true;
        break;
      }
      default: {
        // log and forget
      }
    }
  }

  public handleKeyPress = e => {
    // which will handle instructions such as
    // stop, start, instructions menu, new game ect... 
    // console.log("handleKeyPress: ", e.keyCode);

    switch (e.keyCode) {
      case 112: {
        const fn = isValue(this.eng) ? this.stop : this.start;
        fn(); // pollyFill then invoke function... 
        break;
      }
      case 113: {
        // console.log("rotating left: ");
        // this.ship.rotateLeft();
        break;
      }
      case 119: {
        // console.log("rotating right: ");
        // this.ship.rotateRight();
        break;
      }
      case 99: {
        // this.clearBoard();
        // this.clearCanvas(this.board);
        break;
      }
      default: {
        return;
      }
        // log and forget
    }
  }
}
