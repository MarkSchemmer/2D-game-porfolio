// import { Directions } from "src/app/asteroids/Schemas/Game-Direction-Types";
import { Coordinate, Directions, KeyStroke } from "src/app/common/utils";

export class Snake {
    private ctx;
    private readonly black = "#000";
    private readonly snakeBodyDimensions = 50
    private readonly res;
    private readonly boardDimensions
    private snakeBody: SnakeBodyParts[] = [];
    public delta: number = 0.5;


    constructor(ctx, RESOLUTION, boardDimensions, snakeDelta){
      this.ctx = ctx;
      this.res = RESOLUTION;
      this.boardDimensions = boardDimensions;
      this.delta = snakeDelta;
      let north = Directions.NORTH;
      
      this.snakeBody = [
        new SnakeBodyParts(Directions.NORTH, new Coordinate(400, 400), this.delta, this.boardDimensions),
        new SnakeBodyParts(north, new Coordinate(400, 412), this.delta, this.boardDimensions),
        new SnakeBodyParts(north, new Coordinate(400, 424), this.delta, this.boardDimensions),
        new SnakeBodyParts(north, new Coordinate(400, 436), this.delta, this.boardDimensions),
        new SnakeBodyParts(north, new Coordinate(400, 448), this.delta, this.boardDimensions)
      ]
      this.drawSnakeStartingPos();
    }
  
    moveSnake = (input: KeyStroke = null) => {

        // Need to map snake body...

        /*
                Algorithm for transforming snake is as...

                1. morph direction of snake head, 
                2. store prev bodypart and next bodypart, 
                3. move head on current transform, then pass prev
                4. and manipulate every BodyPart at a time over every iteration
        
        */

        let prev: Coordinate = null;

        

        this.snakeBody = this.snakeBody.map((currentBodyPart: SnakeBodyParts, index: number) => {
            // Need to store current for next iteration
            // let prev: SnakeBodyParts = {...currentBodyPart}
            // test if we're on head
            // console.log(prev);
            if (index === 0) {
                prev = currentBodyPart.coor;
                if (input === KeyStroke.ArrowLeft) {
                   currentBodyPart.directionPath = currentBodyPart.Rotate90DegreeLeft();     
                } else if (input === KeyStroke.ArrowRight) {
                 currentBodyPart.directionPath = currentBodyPart.Rotate90DegreeRight();
               }

               // Move body part with new path.
               // Then return this new direction.
               let temp = currentBodyPart.coor;
               // currentBodyPart.coor = prev;
               prev = temp;
               currentBodyPart.MoveBodyPartOnDirection();
               return currentBodyPart;
            } else {
                let temp = currentBodyPart.coor;
                currentBodyPart.coor = prev;
                prev = temp;
                return currentBodyPart;
            }
        });

        this.snakeBody.forEach(body => console.log(body.coor));
        alert("read console. ");
    }
  
    drawSnakeStartingPos = () => {
      this.ctx.beginPath();
      this.snakeBody.forEach((bodyPart: SnakeBodyParts) => {
        const {x, y} = bodyPart.coor;
        this.ctx.rect(x, y, 1 * this.res, 1 * this.res);
        this.ctx.fillStyle = this.black;
        this.ctx.fill();
      });
      this.ctx.closePath();
    }
  
    drawSnake = (input: KeyStroke) => {
      // If input is left, then we rotate head 90 degrees left
      // If input is right then we rotate head 90 degrees right
      // Move snake then draw snake.
      this.moveSnake(input);
      this.drawSnakeStartingPos();
    }
  }


  /*
  
          Movement of snake..

            +x -> moving right
            -x -> moving left
            +y -> moving down
            -y -> moving up
  
  
  */ 

  class SnakeBodyParts {
    public prevDir: Directions;
    public directionPath: Directions = null; // Default should be North?
    public coor: Coordinate = null;
    public delta: number = 0.5 // defaulted to this value...
    public currentDirectionIndex = 0;
    private boardDimensions: number;

    public DirectionController: Directions[] = [
        Directions.NORTH,
        Directions.EAST,
        Directions.SOUTH,
        Directions.WEST
    ];

    constructor(dir: Directions, coor: Coordinate, delta: number, boardDimensions) {
        this.directionPath = dir;
        this.coor = coor;
        this.delta = delta;
        this.boardDimensions = boardDimensions;
    }


    Rotate90DegreeRight = () => {
        this.currentDirectionIndex = this.currentDirectionIndex + 1;
        if (this.currentDirectionIndex > 3) {
            this.currentDirectionIndex = 0;
        } 

        
        this.directionPath = this.DirectionController[this.currentDirectionIndex];
        return this.directionPath;
        // alert("We are going: " +this.directionPath.toString());
    }

    Rotate90DegreeLeft = () => {
        this.currentDirectionIndex = this.currentDirectionIndex - 1;
        if (this.currentDirectionIndex < 0) {
            this.currentDirectionIndex = 3;
        }

        
        this.directionPath = this.DirectionController[this.currentDirectionIndex];
        return this.directionPath;
        // alert("We are going: " + this.directionPath.toString());
    }

    MoveNorth = () => {
        this.coor.y = this.coor.y - this.delta;
    }

    MoveEast = () => {
        this.coor.x = this.coor.x + this.delta;
    }

    MoveSouth = () => {
        this.coor.y = this.coor.y + this.delta;
    }

    MoveWest = () => {
        this.coor.x = this.coor.x - this.delta
    }

    MoveBodyPartOnDirection = () => {
        this.handleCoorDinateBorderOnMap();
        this.handleDirectionMovement();
    }

    handleCoorDinateBorderOnMap = () => {
        if (this.coor.x > this.boardDimensions) {
            this.coor.x = 0;
        } else if(this.coor.x < 0) {
            this.coor.x = this.boardDimensions;
        }
    
        if (this.coor.y > this.boardDimensions) {
            this.coor.y = 0;
        } else if (this.coor.y < 0) {
            this.coor.y = this.boardDimensions;
        }
    }

    handleDirectionMovement = () => {
        const direction = this.directionPath;
        switch(direction) {
            case Directions.NORTH: {
                this.MoveNorth();
                break;
            }
            case Directions.EAST: {
                this.MoveEast();
                break;
            }
            case Directions.SOUTH: {
                this.MoveSouth();
                break;
            }
            case Directions.WEST: {
                this.MoveWest();
                break;
            }
            default: {
                // log and forget for moment.
                console.log("For some reason we have direction here... This is an error");
                throw new Error("Errrrrrrrrrrrr, we need a valid direction. ");
            }
        }
    }

  }