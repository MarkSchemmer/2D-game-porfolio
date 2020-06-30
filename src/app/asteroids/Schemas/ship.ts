import { calculateXSin, calculateYCos } from "../physicis/physicis-library";
import { GameObj } from "./IGlobalGameObjectProps";

interface IPoint {
    x: number;
    y: number;
    set: (x: number, y: number) => void;
    translate: (p: IPoint) => void;
    rotate: (radians: number) => void;
}

export class Point implements IPoint {
    
    public x: number;
    public y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    public set = (x: number, y: number): void => {
        this.x = x;
        this.y = y;
    }

    public translate = (p: Point): void => {
        this.x += p.x;
        this.y += p.y;
    }

    public rotate = (angle: number): void => {
        this.set(
          this.x * Math.cos(angle) - this.y * Math.sin(angle),
          this.x * Math.sin(angle) + this.y * Math.cos(angle)
        );
    }
}

class ShipControles {
    public left = false;
    public right = false;
    public forwardForce = false;
}

export class Ship implements GameObj {
    public curve = 0.5;
    public curve1 = 0.25;
    public curve2  = 0.75;
    public radius = 10;
    public shipColor = "#ffffff";
    public ctx = null;
    public angle = 0.5 * Math.PI / 2;
    public sides = 3;

    public canvas = document.getElementById("aster");

    public shipControls: ShipControles = new ShipControles();

    // Need to track ship points...
    // Track center and both bottom points
    public shipCenterPoint: Point;
    public shipPoints: Point[];

    public rowRight = 0.5 * Math.PI / 10;
    public rowLeft = -this.rowRight;

    public rotation = 0;

    public force = 0;

    public angleToTrack = -Math.PI / 2;

    public matrix = [1, 0, 0, 1, 0, 0];

    // Will need value to know how to point the rotation of the ship
    // Primitive value will just be a triangle

    // Need to know how to find which direction is north
    // To do this we can add curves to denote what is the bottom side

    constructor(width, height, ctx) {
        this.ctx = ctx;
        this.shipCenterPoint = new Point(width, height / 2);
        this.shipPoints = this.getRegularPolygonPoints();
        this.translate();
        this.rotate(-Math.PI / 2);
        this.draw();
    }

    public translate = 
    (x = this.shipCenterPoint.x, y = this.shipCenterPoint.y, ctx = this.ctx, matrix = this.matrix) => {
        matrix[4] += matrix[0] * x + matrix[2] * y;
        matrix[5] += matrix[1] * x + matrix[3] * y;
        ctx.translate(x, y);
        const newCoordinates = this.getXYOfShip();
        this.shipCenterPoint.set(
            newCoordinates.x,
            newCoordinates.y
        );
    }

    public calcNextTranslate = 
    (x, y, matrix) => {
        matrix[4] += matrix[0] * x + matrix[2] * y;
        matrix[5] += matrix[1] * x + matrix[3] * y;
        const newCoordinates = this.getXYOfShip(matrix);
        return newCoordinates;
    }

    public rotate = (radians, matrix = this.matrix) => {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const m11 = matrix[0] * cos + matrix[2] * sin;
        const m12 = matrix[1] * cos + matrix[3] * sin;
        const m21 = -matrix[0] * sin + matrix[2] * cos;
        const m22 = -matrix[1] * sin + matrix[3] * cos;
        matrix[0] = m11;
        matrix[1] = m12;
        matrix[2] = m21;
        matrix[3] = m22;
        this.ctx.rotate(radians);
    }

    public getXYOfShip = 
    (matrix = this.matrix) => {
        const newX = matrix[0] + matrix[2] + matrix[4];
        const newY = matrix[1] + matrix[3] + matrix[5];
        return { x: newX, y: newY };
    }

    public calcForce = () => {
        const oldForce = this.force;
        const forwardForce = this.shipControls.forwardForce;
        const force = oldForce < 10 && forwardForce 
        ? (this.force += 2, this.force) : forwardForce 
        ? this.force : oldForce > 0 
        ? (this.force -= 0.75, this.force) : this.force < 0 
        ? (this.force = 0, this.force) : this.force;
        const nextProjectCoordinates = this.calcNextTranslate(force, 0, [ ...this.matrix ]);
        const projectedNextY = nextProjectCoordinates.y;
        const projectedNextX = nextProjectCoordinates.x;
        const isShipInsideBorders = this.shipIsInsideBorders(projectedNextX, projectedNextY);

        if ((forwardForce || oldForce > 0) && isShipInsideBorders) {
            this.translate(force, 0);
        }
    }

    public calcForceDecrease = () => {
        const oldForce = this.force;
        if (this.force > 0) {
            this.force -= 0.75;
        }

        if (this.force < 0) {
            this.force = 0;
        }

        return oldForce;
    }

    public draw = () => {
        this.drawPolygon2();
    }

    public rotateRight = () => {
        this.rotate(this.rowRight);
    }
 
    public rotateLeft = () => {
        this.rotate(this.rowLeft);
    }

    public calculateShipsNextPosition = () => {
        // console.log(`x: ${x}, y: ${y}`);
        console.log(this.matrix);
        if (this.shipControls.left) {
            this.rotateLeft();
        } else if (this.shipControls.right) {
            this.rotateRight();
        }

        this.calcForce(); // calculating next movement and moving.
    }

    public shipIsInsideBorders = (x, y) => y > 0 && y < 800 && x > 0 && x < 800;

    // Building polygon, a triangle is a polygon...
    public getRegularPolygonPoints = 
    (center = this.shipCenterPoint, numSides = this.sides, sideLength = this.radius): Point[] => {
        const points = [];
        const alpha = 2 * Math.PI / numSides;  
        for (let i = 0; i < numSides; i++) {
          points.push(new Point( 
            center.x + sideLength * Math.cos(alpha * i),
            center.y + sideLength * Math.sin(alpha * i))
          );
        }  
        return points;
      }

    public drawPolygon(ctx = this.ctx, points = this.shipPoints) {
        ctx.beginPath();
        const x0 = points[0].x, y0 = points[0].y;
        ctx.moveTo(x0, y0); 
        // for (let i = 1; i < points.length; i++) {
        //   ctx.lineTo(points[i].x, points[i].y);
        // }
        const set1 = points[1], set2 = points[2];
        const x1 = set1.x, y1 = set1.y, x2 = set2.x, y2 = set2.y;
        // The base point, will need to create an angle in an arc
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        // ctx.arc(points[0].x, points[0].y); 
        //  close the shape
        ctx.lineWidth = 1;
        // ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#ffffff";
        // ctx.fill();
        ctx.closePath();
        ctx.stroke();
      }

      public drawPolygon2(ctx = this.ctx, points = this.shipPoints) {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.shipColor;
        ctx.fillStyle = this.shipColor;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        ctx.moveTo(this.radius, 0);

        ctx.quadraticCurveTo(
            Math.cos(this.angle) * this.radius * this.curve2,
            Math.sin(this.angle) * this.radius * this.curve2,
            Math.cos(Math.PI - this.angle) * this.radius,
            Math.sin(Math.PI - this.angle) * this.radius
        ); 

        ctx.quadraticCurveTo(-this.radius * this.curve, 0, 
            Math.cos(Math.PI + this.angle) * this.radius,
            Math.sin(Math.PI + this.angle) * this.radius
        );

        ctx.quadraticCurveTo( 
            Math.cos(-this.angle) * this.radius * this.curve2,
            Math.sin(-this.angle) * this.radius * this.curve2,
            this.radius, 0
        );

        // ctx.fill();
        ctx.stroke();

        ctx.beginPath();

        // Center guide for control point
        // ctx.lineWidth = 1;
        // ctx.strokeStyle = this.shipColor;
        ctx.moveTo(Math.cos(-this.angle) * this.radius, Math.sin(-this.angle) * this.radius, 0);
        // ctx.arc(this.radius * this.curve - this.radius, 0, this.radius / 50, 0, 2 * Math.PI);
        ctx.lineTo(0, 0);
        ctx.lineTo(Math.cos(this.angle) * this.radius, Math.sin(this.angle) * this.radius);
        ctx.moveTo(-this.radius, 0);
        ctx.lineTo(0, 0);
        // ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(
            Math.cos(this.angle) * this.radius * this.curve2,
            Math.sin(this.angle) * this.radius * this.curve2,
            this.radius / 40, 0, 2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();

        ctx.arc(
            Math.cos(-this.angle) * this.radius * this.curve2,
            Math.sin(-this.angle) * this.radius * this.curve2,
            this.radius / 40, 0, 2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();

        ctx.arc(this.radius * this.curve - this.radius, 0, this.radius / 50, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }

    public rotatePolygon = 
    (polygonPoints = this.shipPoints, angle = this.angle, pointAround = this.shipCenterPoint): void => {
        const pointAroundInv = new Point(-pointAround.x, -pointAround.y);
        
        for (let i = 0; i < polygonPoints.length; i++) {
          polygonPoints[i].translate(pointAroundInv); //  translate to origin
          polygonPoints[i].rotate(angle); //  rotate
          polygonPoints[i].translate(pointAround); // translate back to it's original position
        }
      }
}
