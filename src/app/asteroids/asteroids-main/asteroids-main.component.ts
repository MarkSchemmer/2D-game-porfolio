import { Component, OnInit } from "@angular/core";
import { isValue } from "utils/Utils";
import { Asteroid } from "../Schemas/asteroid";
import { Directions } from "../Schemas/Game-Direction-Types";
import { gameObject } from "../Schemas/game-object";
import { giveTextForDiv } from "../Schemas/GameNotesAndOtherInstructions";
import { Ship } from "../Schemas/ship";
import { asteroidRandomGenerator, asteroidsCollisons } from "../Util-Asteroids";

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
  public eng;
  public frames = 50;
  public boardDimensions = 800;
  public xc = this.boardDimensions / 2;
  public yc = this.boardDimensions / 2;
  public x = this.xc;
  public y = this.yc;
  public vx = 0;
  public vy = 0;
  public frict = 0.99;
  public writeGameActiveText: string;

  public asteroids: Asteroid[] = [];

  constructor() { }

  ngOnInit(): void {
    this.initializeBoardAndContext();
    this.initializeGameObject();
    this.prepGameBeforeStart();
    this.loop();
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
      this.writeGameActiveText = giveTextForDiv(this.eng);
    }
  }

  nextCalculations = () => {
    this.ship.calculateShipsNextPosition();
    this.ship.calcNextPositionOfShells();
    this.ship.filterOutAllLasersThatHaveHitAsteroid();
    this.filterOutAllDestroyedAsteroids();
    // Calculate board text showing if game is running or not
    this.writeGameActiveText = giveTextForDiv(this.eng);
  }

  // DrawEverything
  public loop = () => {
    this.nextCalculations();
    this.handleXYFrictions();
    this.outOfBorders();
    this.space();
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.ship.getShipAngleInRadians());

    if (this.ship.shipControls.forwardForce) {
      this.ship.ogienZdupy();
    }

    this.ship.draw();
    this.ctx.restore();
    this.ship.drawAllShells();

    // Will be deleted later for dummy asteroid
    this.drawAsteroids();

    // Test is shell hitting asteroid
    this.hasShellHitAnyAsteroid(this.ship.shells);
  }

  public handleXYFrictions = () => {
    this.ship.xyAndFriction();
    this.asteroidHandleXYFriction();
    const newXY = this.ship.getXY();
    this.x = newXY.x;
    this.y = newXY.y;
  }

  public initializeBoardAndContext = (): void => {
    this.board = document.getElementById("aster");
    this.ctx = this.board.getContext("2d");
    
    this.boardWidth = this.boardDimensions;
    this.boardHeight = this.boardDimensions;

    // Need to write some notes on how to get full width of screen
    this.board.width = this.boardWidth;
    this.board.height = this.boardHeight;

    // Assign functions for document
    document.onkeydown = this.handleKeyDown;
    document.onkeyup = this.handleKeyUp;
    document.onkeypress = this.handleKeyPress;
  }

  public initializeGameObject = (): void => {
    this.gameObject = gameObject(this.boardWidth / 2, this.boardHeight - 75, this.ctx, this.x, this.y);
    this.ship = this.gameObject.ship;
    this.asteroids = asteroidRandomGenerator(this.ctx);
    
    // [ ...Array(5).keys() ].map(() => new Asteroid(this.ctx));

    // Function to draw whether the game is paused or active
    this.writeGameActiveText = giveTextForDiv(this.eng);
  }

  public prepGameBeforeStart = (): void => {
    this.writeGameActiveText = giveTextForDiv(this.eng);
  }

  public clearBoard = () => {
    this.ctx.clearRect(0, 0, this.ctx.canvas.height, this.ctx.canvas.width);
  }

  public space = () => {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.boardDimensions, this.boardDimensions);
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

  public outOfBorders = () => {
    this.shipOutOfBorders();
    this.asteroidsHandleOutOfBorders();
  }

public asteroidsHandleOutOfBorders = () => this.asteroids.forEach(aster => aster.handleAsteroidBorder());

public asteroidHandleXYFriction = () => {
  this.asteroids.forEach(aster => aster.asteroidXYFriction());
    // Account for when Asteroids collide
  asteroidsCollisons(this.asteroids);
}

public drawAsteroids = () => this.asteroids.forEach(aster => aster.draw());

public hasShellHitAnyAsteroid = shells => this.asteroids.forEach(aster => aster.hasShellHitAsteroid(shells));

public filterOutAllDestroyedAsteroids = () => {
  this.asteroids = this.asteroids.filter(aster => {
    return aster.asteroidHealth > 0;
  });
}

public shipOutOfBorders = () => {
  if (this.x > this.boardDimensions) {
    this.x = this.x - this.boardDimensions;
  }

  if (this.x < 0) {
    this.x = this.boardDimensions;
  }

  if (this.y > this.boardDimensions) {
    this.y = this.y - this.boardDimensions;
  }

  if (this.y < 0) {
    this.y = this.boardDimensions;
  }

  this.ship.setXY(
    this.x, this.y
  );
}

  public handleKeyUp = e => {
    // Uncomment when you want to see what key code is being pressed
    // console.log(e.keyCode);
    switch (e.keyCode) {
      case Directions.Left: {
        this.ship.shipControls.left = false;
        break;
      }
      case Directions.Right: {
        this.ship.shipControls.right = false;
        break;
      }
      case Directions.ForwardThrusters: {
        this.ship.shipControls.forwardForce = false;
        break;
      }
      case Directions.Fire: {
        this.ship.shipControls.fire = false;
        break;
      }
      default: {
        // log and forget
      }
    }
  }

  public handleKeyDown = e => {
    // Uncomment when you want to see what key code is being pressed
    // console.log(e.keyCode);
    switch (e.keyCode) {
      case Directions.Left: {
        this.ship.shipControls.left = true;
        break;
      }
      case Directions.Right: {
        this.ship.shipControls.right = true;
        break;
      }
      case Directions.ForwardThrusters: {
        this.ship.shipControls.forwardForce = true;
        break;
      }
      case Directions.Fire: {
        this.ship.shipControls.fire = true;
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
