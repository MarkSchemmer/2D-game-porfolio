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
  public boardDimensions = 800; // If I want a smaller board... 

  public boardWidth;
  public boardHeight;

  public fullElement;

  // board context
  public ctx = null;

  public gameObject = null;

  constructor() { }

  ngOnInit(): void {
    this.initializeBoardAndContext();
    this.initializeGameObject();

    this.prepGameBeforeStart();
  }

  public gameLooper = fn => {

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
  }

  public initializeGameObject = (): void => {
    this.gameObject = gameObject(this.boardWidth / 2, this.boardHeight - 75, this.ctx);
    this.ship = this.gameObject.ship;
  }

  public prepGameBeforeStart = (): void => {
    // Draw ship
    this.ship.drawTriangle();
  }
}
