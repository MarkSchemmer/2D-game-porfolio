import { angleToRadians } from "../Util-Asteroids";
import { GameObj } from "./IGlobalGameObjectProps";
import { Shell } from "./Shell";

export class ShipControles {
    public left = false;
    public right = false;
    public forwardForce = false;
    public fire = false;
}

export class Ship implements GameObj {
    public curve = 0.5;
    public curve1 = 0.25;
    public curve2  = 0.75;
    public radius = 10;
    public shipColor = "#ffffff";
    public shipBlasterColor = "red";
    public ctx = null;
    public angle = 0.5 * Math.PI / 2;
    public sides = 3;
    public shipControls: ShipControles = new ShipControles();
    public shells: Shell[] = [];

    public shipAngle = 270;
    public x;
    public y;
    public vx = 0;
    public vy = 0;
    public dv = 0.2;
    public maxVel = 8;
    public dt = 1;
    public frict = 0.99;
    public shipFireRate = -20;

    constructor(width, height, ctx, x, y) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
    }

    public filterOutAllLasersThatHaveHitAsteroid = () => {
        this.shells = this.shells.filter(shell => shell.hasHitAsteroid === false);
    }

    public incrementAngle = () => {
        this.shipAngle += 5;
        if (this.shipAngle > 360) {
            this.shipAngle = 0;
        }
    }
    
    public decrementAngle = () => {
        this.shipAngle -= 5;
        if (this.shipAngle > 360) {
            this.shipAngle = 0;
        }

        if (this.shipAngle < -360) {
            this.shipAngle = 0;
        }
    }

    public xyVelocity = () => {
        this.vx += this.dv * Math.cos(angleToRadians(this.shipAngle)); // friction;
        this.vy += this.dv * Math.sin(angleToRadians(this.shipAngle)); // friction;

        if (Math.abs(this.vx) > this.maxVel) {
            this.vx = this.vx < 0 ? -this.maxVel : this.maxVel;
        }

        if (Math.abs(this.vy) > this.maxVel) {
            this.vy = this.vy < 0 ? -this.maxVel : this.maxVel;
        }
    }

    public getXY = () => {
        return {
            x: this.x,
            y: this.y
        };
    }

    public setXY = (x, y) => {
        this.x = x;
        this.y = y;
    }

    public xyAndFriction = () => {        
        this.x += this.vx * this.dt;
        this.y += this.vy * this.dt;
        
        this.vx *= this.frict;
        this.vy *= this.frict;      
    }

    public calcShellsAndFire = () => {
        this.shipFireRate += 20;
        if (this.shipControls.fire && this.shipFireRate > 60) {
            const x = this.x;
            const y = this.y;
            const newShell = new Shell(x, y, this.ctx, this.shipAngle, this.vx, this.vy);
            this.shells.push(newShell);
            this.shipFireRate = -20;
        }
    }

    public filterOutShellsOfBorder = () => {
        this.shells = this.shells.filter(shell => {
            return shell.ly > 0 && shell.ly < 800 && shell.lx > 0 && shell.lx < 800;
        });
    }

    public calcNextPositionOfShells = () => {
        this.shells.forEach(s => {
            s.calcNextShellPath();
        });
    }

    public drawAllShells = () => {
        this.shells.forEach(s => {
            s.drawShell();
        });

        this.filterOutShellsOfBorder();
    }

    public draw = () => {
        this.drawPolygon();
    }

    public getShipAngleInRadians = () => {
        return angleToRadians(this.shipAngle);
    }

    public rotateRight = () => {
        this.incrementAngle();
    }
 
    public rotateLeft = () => {
        this.decrementAngle();
    }

    public calculateShipsNextPosition = () => {
        if (this.shipControls.left) {
            this.rotateLeft();
        } else if (this.shipControls.right) {
            this.rotateRight();
        }

        if (this.shipControls.forwardForce) {
            this.xyVelocity();
        }

        this.calcShellsAndFire(); // calculating shells next position in path
    }

      public drawPolygon(ctx = this.ctx) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.shipColor;
        ctx.fillStyle = this.shipColor;
        ctx.beginPath();
        // ctx.arc(0, 0, this.radius, 0, 2 * Math.PI); Need to test later
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

        // ctx.fill(); -> Need to test later
        ctx.stroke();

        ctx.beginPath();

        // Center guide for control point
        ctx.moveTo(Math.cos(-this.angle) * this.radius, Math.sin(-this.angle) * this.radius, 0);
        // ctx.arc(this.radius * this.curve - this.radius, 0, this.radius / 50, 0, 2 * Math.PI);
        ctx.lineTo(0, 0);
        ctx.lineTo(Math.cos(this.angle) * this.radius, Math.sin(this.angle) * this.radius);
        ctx.moveTo(-this.radius, 0);
        ctx.lineTo(0, 0);
        // ctx.closePath(); -> Need to test what happens when you close path
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

        ctx.closePath();
        ctx.fill();
      }

       public ogienZdupy = (context = this.ctx) => {
        context.fillStyle = this.shipBlasterColor;
        context.beginPath();
        context.moveTo(-8, 0);
        context.lineTo(-12, -10);
        context.lineTo(-25, 0);
        context.lineTo(-12, 10);
        context.lineTo(-8, 0);
        context.strokeStyle = this.shipBlasterColor;
        context.stroke();
        context.fill();
    }
}
