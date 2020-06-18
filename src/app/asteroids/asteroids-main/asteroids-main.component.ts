import { Component, OnInit } from "@angular/core";
import { gameObject } from "../Schemas/game-object";

@Component({
  selector: "app-asteroids-main",
  templateUrl: "./asteroids-main.component.html",
  styleUrls: ["./asteroids-main.component.scss"]
})
export class AsteroidsMainComponent implements OnInit {

  public ship = null;
  public board = null;

  public boardWidth = null;
  public boardHeight = null;

  // board context
  public ctx = null;

  public gameObject = null;

  constructor() { }

  ngOnInit(): void {
    this.initializeBoardAndContext();
  }

  public gameLooper = fn => {

  }

  public initializeBoardAndContext = (): void => {
    this.board = document.getElementById("aster");
    this.ctx = this.board.getContext("2d");

    // Get board width and height
    this.boardWidth = this.board.offsetWidth;
    this.boardHeight = this.board.offsetHeight;
  }

  public initializeGameObject = (): void => {
    this.gameObject = gameObject(this.boardWidth, this.boardHeight, this.ctx);
    this.ship = this.gameObject.ship;
  }
}
