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

    public shipControls: ShipControles = new ShipControles();

    // Need to track ship points...
    // Track center and both bottom points
    public shipCenterPoint: Point;
    public shipPoints: Point[];

    public rowRight = 0.5 * Math.PI / 10;
    public rowLeft = -this.rowRight;

    public rotation = 0;

    // Will need value to know how to point the rotation of the ship
    // Primitive value will just be a triangle

    // Need to know how to find which direction is north
    // To do this we can add curves to denote what is the bottom side

    constructor(width, height, ctx) {
        this.ctx = ctx;
        this.shipCenterPoint = new Point(width, height / 2);
        this.shipPoints = this.getRegularPolygonPoints();
        const {x, y} = this.shipCenterPoint;
        this.ctx.translate(x, y);
        this.ctx.rotate(-Math.PI / 2);
        this.draw();
    }

    draw = () => {
        this.drawPolygon2();
    }

    rotateRight = () => { 
        this.ctx.rotate(this.rowRight);
    }

    rotateLeft = () => {
        this.ctx.rotate(this.rowLeft);
    }

    public calculateShipsNextPosition = () => {
        if (this.shipControls.left) {
            this.rotateLeft();
        } else if (this.shipControls.right) {
            this.rotateRight();
        }

        if (this.shipControls.forwardForce) {
            // calculate (x, y) center point 
            /*
                Calculate curve and how forward force 
                can push ship forwards and backwards
            */

            // Maybe just translate on a constant... 
            this.ctx.translate(10, 0); // translate it
            this.ctx.restore(); // restore back to last saved... 
        }
    }

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

        // Center guide for control point
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.shipColor;
        ctx.moveTo(-this.radius, 0);
        ctx.lineTo(0, 0);
        ctx.arc(this.radius * this.curve - this.radius, 0, this.radius / 50, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
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
