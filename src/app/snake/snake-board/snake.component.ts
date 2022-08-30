import { Component, OnInit } from '@angular/core';
import { Coordinate, KeyStroke } from 'src/app/common/utils';
import { Snake } from './snake';

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
  private readonly gameSpeed = 1000;
  public runner: Boolean = false;
  public gameLooper = null;
  public userInputForIteration: KeyStroke = null;
  public snakeDelta: number = 12;

  public fpsInterval;
  public then;
  public startTime;

  public fps = 10;

  constructor() {

   }

  ngOnInit() {
    this.initialGameSetup();
  }

   startAnimating = () => {
    this.fpsInterval = 1000 / this.fps;
    this.then = Date.now();
    this.startTime = this.then;
    this.runner = true;
    this.startGame();
  }

  startGame = () => {
    // this.runner = true;
    this.gameLooper = requestAnimationFrame(this.gameLoop);
  }

  stopGame = () => {
    cancelAnimationFrame(this.gameLooper);
    this.gameLooper = null;
    this.runner = false;
  }

  cleanBoard = () => {
    this.ctx.clearRect(0, 0, 800, 800);
  }
  gameLoop = () => {
    // game loop guard. 
    if(this.runner === false || this.gameLooper === null) return;
    let now = Date.now();
    let elapsed = now - this.then;

    if (elapsed > this.fpsInterval) {
      this.then = now - (elapsed % this.fpsInterval);
      // Take UserInput.
      let userInput = this.userInputForIteration;
      // calculate
        // taking user game input.
      this.handleUserInput(userInput);
      // moving game objects
      // clean
      // re-draw
      this.draw(userInput);
      // Reset user input to null so no uneeded commands are used on accident.
      this.userInputForIteration = null;
    }

    this.startGame();
  }

  draw = (input: KeyStroke = null) => {
    // clean board
    this.cleanBoard();
    // draw snake
    this.snake.drawSnake(input);
  }

  handleUserInput = (userInput: KeyStroke) => {
    switch(userInput) {
      case KeyStroke.S: {
        if (this.gameLooper === null) {
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
        // console.log("No valid user input for this iteration. ");
      }
    }
  }

  handleKeyboardStrokes = (key) => {
    // use for starting and stoping game. 
    // Snake Controls
    
    const value: string = key.key.toLowerCase();
    // console.log(value);

    switch(value) {
      case KeyStroke.P.toLowerCase(): {
        this.userInputForIteration = KeyStroke.P;
        if (this.gameLooper != null) {
          this.stopGame(); 
          // console.log(this.runner);
        }
        break;
      }
      case KeyStroke.S.toLowerCase(): {
        this.userInputForIteration = KeyStroke.S;
        if (this.gameLooper === null || this.runner === false) {
          this.startAnimating();
          // console.log(this.runner);
        }
        break;
      }
      case KeyStroke.R.toLowerCase(): {
        this.userInputForIteration = KeyStroke.R;
        break;
      }
      case KeyStroke.ArrowLeft.toLowerCase(): {
        this.userInputForIteration = KeyStroke.ArrowLeft;
        break;
      }
      case KeyStroke.ArrowRight.toLowerCase(): {
        this.userInputForIteration = KeyStroke.ArrowRight;
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
    this.snake = new Snake(this.ctx, this.RESOLUTION, this.BOARD_DIMENSIONS, this.snakeDelta);

    // attach event listener for keydown.
    // window.addEventListener("keydown", this.handleKeyboardStrokes);
    // window.addEventListener("keyup", this.handleKeyboardStrokes);

    document.onkeydown = this.handleKeyboardStrokes;
    // document.onkeyup = this.handleKeyboardStrokes;
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
