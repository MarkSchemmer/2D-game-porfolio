import { Component, OnInit } from '@angular/core';
import { Coordinate, KeyStroke } from 'src/app/common/utils';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss']
})
export class SnakeComponent implements OnInit {
  public ctx;
  public snakeBoard;
  public snake: Snake;
  private readonly RESOLUTION = 12;
  private readonly BOARD_DIMENSIONS = 800;
  private readonly gameSpeed = 150;
  public runner: Boolean = false;
  public gameLooper = null;
  public userInputForIteration: KeyStroke = null;



  constructor() {

   }

  ngOnInit() {
    this.initialGameSetup();
  }

  startGame = () => {
    this.runner = true;
    this.gameLooper = setInterval(this.gameLoop, this.gameSpeed)
  }

  stopGame = () => {
    this.runner = false;
    clearInterval(this.gameLooper);
    this.gameLooper = null;
  }

  cleanBoard = () => {
    this.ctx.clearRect(0, 0, 800, 800);
  }

  gameLoop = () => {
    // game loop guard. 
    if(this.runner === false || this.gameLooper === null) return;
    // Take UserInput.
    let userInput = this.userInputForIteration; 
    // calculate
      // taking user game input.
    this.handleUserInput(userInput);
    // moving game objects
    // clean
    // re-draw
    this.draw();
    // Reset user input to null so no uneeded commands are used on accident.
    this.userInputForIteration = null;

    this.startGame();
  }

  draw = () => {
    // clean board
    this.cleanBoard();
    // draw snake
    this.snake.drawSnake();
  }

  handleUserInput = (userInput: KeyStroke) => {
    switch(userInput) {
      case KeyStroke.S: {
        if (this.gameLooper === null) {
          console.log("game started.");
          this.startGame();
        }
        break;
      }
      case KeyStroke.P: {
        console.log("game stopped.");
        this.stopGame();
        break;
      }
      default: {
        console.log("No valid user input for this iteration. ");
      }
    }
  }

  handleKeyboardStrokes = (key) => {
    // use for starting and stoping game. 
    // Snake Controls

    console.log(key);
    
    const value: string = key.key.toLowerCase();

    console.log(value);

    switch(value) {
      case KeyStroke.P.toLowerCase(): {
        this.userInputForIteration = KeyStroke.P;
        if (this.gameLooper != null) {
          this.stopGame(); 
          console.log(this.runner);
        }
        break;
      }
      case KeyStroke.S.toLowerCase(): {
        this.userInputForIteration = KeyStroke.S;
        if (this.gameLooper === null || this.runner === false) {
          this.startGame();
          console.log(this.runner);
        }
        break;
      }
      case KeyStroke.R.toLowerCase(): {
        break;
      }
      case KeyStroke.ArrowLeft.toLowerCase(): {
        break;
      }
      case KeyStroke.ArrowRight.toLowerCase(): {
        break;
      }
      default: {
        // log and forget.
        // /console.log(value);
      }
    }
  }

  initialGameSetup = () => {
    // Get the board, and it's context.
    this.snakeBoard = document.getElementById("snake-board");
    this.ctx = this.snakeBoard.getContext("2d");
    this.snakeBoard.width = this.BOARD_DIMENSIONS;
    this.snakeBoard.height = this.BOARD_DIMENSIONS;
    this.snake = new Snake(this.ctx, this.RESOLUTION, this.BOARD_DIMENSIONS);

    // attach event listener for keydown.
    // window.addEventListener("keydown", this.handleKeyboardStrokes);
    // window.addEventListener("keyup", this.handleKeyboardStrokes);

    document.onkeydown = this.handleKeyboardStrokes;
    document.onkeyup = this.handleKeyboardStrokes;
  }
}

class Snake {
  private ctx;
  private readonly black = "#000";
  private readonly snakeBodyDimensions = 50
  private readonly res;
  private readonly boardDimensions

  private snakeBody: Coordinate;

  constructor(ctx, RESOLUTION, boardDimensions){
    this.ctx = ctx;
    this.res = RESOLUTION;
    this.boardDimensions = boardDimensions;
    this.snakeBody = new Coordinate(400, 400);
    this.drawSnakeStartingPos();
  }

  moveSnake = () => {

    if (this.snakeBody.x > this.boardDimensions) {
      this.snakeBody.x = 0;
    } else if(this.snakeBody.x < 0) {
      this.snakeBody.x = this.boardDimensions;
    }

    if (this.snakeBody.y > this.boardDimensions) {
      this.snakeBody.y = 0;
    } else if (this.snakeBody.y < 0) {
      this.snakeBody.y = this.boardDimensions;
    }

    /// this.snakeBody.x = this.snakeBody.x + 0.5;
    this.snakeBody.y = this.snakeBody.y + 0.5;
  }

  drawSnakeStartingPos = () => {
    const {x, y} = this.snakeBody;
    this.ctx.beginPath();
    this.ctx.rect(x, y, 1 * this.res, 1 * this.res);
    this.ctx.fillStyle = this.black;
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawSnake = () => {
    // Move snake then draw snake.
    this.moveSnake();
    this.drawSnakeStartingPos();
  }
}

/* *Notes for game TODOS.*

  - Create a GameLoop Interface 
  - Create a common tool library



  Movement of snake..

  +x -> moving right
  -x -> moving left
  +y -> moving down
  -y -> moving up

*/
