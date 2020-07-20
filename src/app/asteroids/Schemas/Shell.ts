import { angleToRadians } from "../Util-Asteroids";

export class Shell {
    public ctx;
    public angle = 0;
    public shellColor = "red";

    public lx = 45;
    public ly = 9;
    public lvx = 1;
    public lvy = 1;

    public vx = 0;
    public vy = 0;

    public lw = 2;
    public lh = 12;

    public shellDamage = 50;

    public hasHitAsteroid = false;

    public shipXdelta;
    public shipYdelta;

    constructor(x, y, ctx, angle, shipXdelta, shipYdelta) {
        this.lx = x;
        this.ly = y;
        this.lvx = Math.cos(angleToRadians(angle));
        this.lvy = Math.sin(angleToRadians(angle));
        this.ctx = ctx;
        this.angle = angle;
        this.lvx += this.vx;
        this.lvy += this.vy;
        this.drawShell();

        this.shipXdelta = shipXdelta;
        this.shipYdelta = shipYdelta;

        console.log(shipXdelta);
        console.log(shipYdelta);

        console.log(this.lvx);
        console.log(this.lvy);
    }

    drawShell = () => {
        this.ctx.fillStyle = this.shellColor;
        this.ctx.fillRect(this.lx, this.ly, this.lw, this.lh);
    }

    calcNextShellPath = () => {
        this.lx += (this.lvx * 15) + this.shipXdelta;
        this.ly += (this.lvy * 15) + this.shipYdelta;
    }
}
