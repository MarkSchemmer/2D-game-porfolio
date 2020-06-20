import { GameObj } from "./IGlobalGameObjectProps";

interface IShip {
    shipWidth: number;
    shipHeight: number;
    x: number;
    y: number;
    drawTriangle: () => void;
}

export class Ship implements IShip, GameObj {

    public shipWidth = 10;
    public shipHeight = 10;
    public triangleY = this.shipHeight / 2 - this.shipWidth / 2;
    
    public shipColor = "#ffffff";

    public x: number;
    public y: number;
    public ctx = null;

    // Will need value to know how to point the rotation of the ship
    // Primitive value will just be a triangle

    // Need to know how to find which direction is north

    constructor(width, height, ctx) {
        this.x = width;
        this.y = height;
        this.ctx = ctx;
    }

    drawTriangle = () => {
        this.ctx.beginPath();
        // this.ctx.fillStyle = this.shipColor;
        this.ctx.strokeStyle = this.shipColor;
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.x + this.shipWidth, this.y + this.shipHeight);
        this.ctx.lineTo(this.x - this.shipWidth, this.y + this.shipHeight);
        this.ctx.closePath();
        // this.ctx.fill();
        this.ctx.stroke();
    }

    draw = () => {
        this.drawTriangle();
    }

    moveShip = () => {
        // should account for directional movement and rotational as well
        // Also account for is booster is on or not
        // Also take into account for leftover energy that has been already applied... 

        // For the moment were going to just upate the x axis with the engine to get the ship
        // Moving in a primitive way... without any controls... 
        this.x += 2;
    }

}
