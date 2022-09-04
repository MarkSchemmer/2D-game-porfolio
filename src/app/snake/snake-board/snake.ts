import { Coordinate, Directions, getRandomInt, KeyStroke } from "src/app/common/utils";

export class Snake {
    private ctx;
    private readonly boardDimensions
    private snakeBody: SnakeBodyParts[] = [];
    public delta: number = 12;
    public snakeBodyCount = 5;
    public snakeBodySize = 12;
    public keyStrokeIterations: Directions[] = [];
    public foodAlive: Coordinate = null;
    public restartGame;

    public DirectionController: Directions[] = [
        Directions.NORTH,
        Directions.EAST,
        Directions.SOUTH,
        Directions.WEST
    ];


    constructor(ctx, RESOLUTION, boardDimensions, snakeDelta, fn) {
      this.ctx = ctx;
      this.boardDimensions = boardDimensions;
      this.delta = snakeDelta;
      let north = Directions.NORTH;
      this.restartGame = fn;
      
      this.snakeBody = [
        new SnakeBodyParts(Directions.NORTH, new Coordinate(400, 400), this.delta, this.boardDimensions),
        new SnakeBodyParts(north, new Coordinate(400, 412), this.delta, this.boardDimensions),
        new SnakeBodyParts(north, new Coordinate(400, 424), this.delta, this.boardDimensions),
        new SnakeBodyParts(north, new Coordinate(400, 436), this.delta, this.boardDimensions),
        new SnakeBodyParts(north, new Coordinate(400, 448), this.delta, this.boardDimensions)
      ];
      this.drawSnakeStartingPos(this.snakeBody);
    }
  
    moveSnake = (input: KeyStroke = null, hasEaten) => {

        // Need to map snake body...

        /*
                Algorithm for transforming snake is as...

                1. morph direction of snake head, 
                2. store prev bodypart and next bodypart, 
                3. move head on current transform, then pass prev
                4. and manipulate every BodyPart at a time over every iteration
        
        */

        let head = this.snakeBody[0];
        let x = head.coor.x;
        let y = head.coor.y;
        let dir = head.directionPath;
        let idx = head.currentDirectionIndex;

        let newHead = new SnakeBodyParts(
            dir, new Coordinate(x, y), this.delta, this.boardDimensions, idx
        );

        if (input === KeyStroke.ArrowLeft)
        {
            newHead.Rotate90DegreeLeft();
        } 
        else if (input === KeyStroke.ArrowRight) 
        {
            newHead.Rotate90DegreeRight();
        }

        newHead.MoveBodyPartOnDirection();

          /*
                Movement of snake..
                        +x -> moving right
                        -x -> moving left
                        +y -> moving down
                        -y -> moving up
        */ 

        this.snakeBody = [newHead, ...this.snakeBody]; 

        if (hasEaten === false || hasEaten === null) {
            this.snakeBody.pop();
        }
        

        console.log(this.snakeBody.length);

        return this.snakeBody;
    }

    drawFood = () => {
        if (this.foodAlive != null) {
            let green = "#00FF00";
            this.ctx.beginPath();
            const {x, y} = this.foodAlive;
            this.ctx.rect(x, y, 12, 12);
            this.ctx.fillStyle = green;
            this.ctx.fill();
            this.ctx.closePath();
        }
    }
  
    drawSnakeStartingPos = (snake) => {
        
      const colors = ["#ff0000", "#ffb900", "#0202f6", "#02fb03", "#ffd6f3"];
      (snake).forEach((bodyPart: SnakeBodyParts, idx: number) => {
        // console.log(bodyPart.coor);
        this.ctx.beginPath();
        const {x, y} = bodyPart.coor;
        this.ctx.rect(x, y, 12, 12);
        this.ctx.fillStyle = colors[idx];
        this.ctx.fill();
        this.ctx.closePath();
      });
    }

    hasOverLapped = (minA, maxA, minB, maxB) => {
        return minB <= maxA && minA <= maxB;
    }

    HasEaten = (input: KeyStroke) => {

        let head = this.snakeBody[0];

        let hLeft = head.coor.x;
        let hRight = hLeft + 12;

        let fLeft = this.foodAlive.x;
        let fRight = fLeft + 12;

        let hBottom = head.coor.y;
        let hTop = hBottom + 12;

        let fBottom = this.foodAlive.y;
        let fTop = fBottom + 12;

        let hasOverLapped = this.hasOverLapped(hLeft, hRight, fLeft, fRight) &&
                            this.hasOverLapped(hBottom, hTop, fBottom, fTop);

        if (hasOverLapped)
        {
            this.foodAlive = null;
            return true;
        }

        return false;
    }

    snakeEatenItself = () => {
       let [h, ...rest] = this.snakeBody;

        let hasOverlapped = rest.some((pt) => h.coor.x === pt.coor.x && h.coor.y === pt.coor.y);

        if(hasOverlapped){
            alert("Snake has eaten itself. ");
            return true;
        }

        return false;
    }



    GenerateFood = () => {
        if (this.foodAlive === null) {
            let x = getRandomInt(750);
            let y = getRandomInt(750);
            this.foodAlive = new Coordinate(x,y);
        } else {
            return this.foodAlive;
        }
    }
  
    drawSnake = (input: KeyStroke) => {
      let endGame = this.snakeEatenItself();
      if (endGame) {
        this.restartGame();
      } else {
        this.GenerateFood();
        let hasEaten = this.HasEaten(input);
        this.snakeBody = this.moveSnake(input, hasEaten);
        this.drawFood();
        this.drawSnakeStartingPos(this.snakeBody);
      }
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
    public prevCoorinate: Coordinate;

    public DirectionController: Directions[] = [
        Directions.NORTH,
        Directions.EAST,
        Directions.SOUTH,
        Directions.WEST
    ];

    constructor(dir: Directions, coor: Coordinate, delta: number, boardDimensions, currDirectrionIdx: number = 0) {
        this.directionPath = dir;
        this.coor = coor;
        this.delta = delta;
        this.boardDimensions = boardDimensions;
        this.currentDirectionIndex = currDirectrionIdx;
    }

    Rotate90DegreeRight = () => {
        this.currentDirectionIndex = this.currentDirectionIndex + 1;
        if (this.currentDirectionIndex > 3) {
            this.currentDirectionIndex = 0;
        } 

        
        this.directionPath = this.DirectionController[this.currentDirectionIndex];
        return this.directionPath;
    }

    Rotate90DegreeRightPure = (idx: number) => {
        let index = idx + 1;

        if (index > 3) {
            index = 0;
        } 
        
        return this.DirectionController[index];
    }

    Rotate90DegreeLeftPure = (idx: number) => {
        let index = idx - 1;

        if (index < 0) {
            index = 3;
        }
        
        return this.DirectionController[index];
    }

    Rotate90DegreeLeft = () => {
        this.currentDirectionIndex = this.currentDirectionIndex - 1;
        if (this.currentDirectionIndex < 0) {
            this.currentDirectionIndex = 3;
        }

        
        this.directionPath = this.DirectionController[this.currentDirectionIndex];
        return this.directionPath;
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
        this.coor.x = this.coor.x - this.delta;
    }

    MoveBodyPartOnDirection = () => {
        this.handleCoorDinateBorderOnMap();
        // this.storePreviousCoordinates();
        this.handleDirectionMovement();
    }

    handleCoorDinateBorderOnMap = () => {
        if (this.coor.x >= this.boardDimensions) {
            this.coor.x = 0;
        } else if(this.coor.x <= 0) {
            this.coor.x = this.boardDimensions;
        }
    
        if (this.coor.y >= this.boardDimensions) {
            this.coor.y = 0;
        } else if (this.coor.y <= 0) {
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