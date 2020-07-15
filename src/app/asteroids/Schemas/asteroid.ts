import { 
    distanceFormula, 
    genNumbBetweenRange, 
    genRandomDirectionForAsteroid, 
    regularpolygon } from "../Util-Asteroids";
import { Shell } from "./Shell";

export class Asteroid {
    public ctx;
    public radius;
    public dtx;
    public dty;
    public sides; 
    public ax = 0;
    public ay = genNumbBetweenRange(0, 800);
    public vx = 0;
    public vy = 0;
    public frict = 0.99;
    public asteroidColor = "white";
    public boardDimensions = 800;
    public asteroidHealth = 100;

    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.dtx = genRandomDirectionForAsteroid();
        this.dty = genRandomDirectionForAsteroid();
        this.sides = genNumbBetweenRange(7, 10);
        this.radius = genNumbBetweenRange(20, 30);
        this.ax = x;
        this.ay = y;
    }

    public draw = () => {
        this.ctx.strokeStyle = this.asteroidColor;
        regularpolygon(this.ctx, this.ax, this.ay, this.radius, this.sides);
        this.ctx.stroke();
    }

    public changeAsteroidDirection = () => {

        /*
            Need to remove collision method to Util-Asteroids.ts file
            Basically a better calulation of where the asteroid 
            Should bounce to

            Will add a better collision maths later so it's a tad more realistic... 

            For the moment this basic implementation will do... 
        */

        this.dtx = this.dtx * -1;
        this.dty = this.dty * -1;
    }

    public asteroidXYFriction = () => {
        this.ax += this.dtx; // Just for extra speed
        this.ay += this.dty;
    }

    public handleAsteroidBorder = () => {
        if (this.ax > this.boardDimensions) {
            this.ax = this.ax - this.boardDimensions;
        }

        if (this.ax < 0) {
            this.ax = this.boardDimensions;
        }

        if (this.ay > this.boardDimensions) {
            this.ay = this.ay - this.boardDimensions;
        }

        if (this.ay < 0) {
            this.ay = this.boardDimensions;
        }
    }

    public hasShellHitAsteroid = (shells: Shell[]) => {
        shells.forEach(shell => {
            const distance = distanceFormula(this.ax, this.ay, shell.lx, shell.ly);
            if (distance + Math.ceil(Math.sqrt(shell.lw * 2)) <= this.radius) {
                this.asteroidHealth -= shell.shellDamage;
                shell.hasHitAsteroid = true;
            }
        });
    }
}
