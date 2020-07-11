import { angleToRadians } from "../Util-Asteroids";

export class Shell {
    public ctx;
    public angle = 0;
    public shellColor = "red";

    public lx = 25;
    public ly = 9;
    public lvx = 1;
    public lvy = 1;

    public vx = 0;
    public vy = 0;

    public lw = 2;
    public lh = 2;

    public shellDamage = 25;

    public hasHitAsteroid = false;

    constructor(x, y, ctx, angle) {
        this.lx = x;
        this.ly = y;
        this.lvx = Math.cos(angleToRadians(angle));
        this.lvy = Math.sin(angleToRadians(angle));
        this.ctx = ctx;
        this.angle = angle;
        this.lvx += this.vx;
        this.lvy += this.vy;
        this.drawShell();
    }

    drawShell = () => {
        this.ctx.fillStyle = this.shellColor;
        this.ctx.fillRect(this.lx, this.ly, this.lw, this.lh);
    }

    calcNextShellPath = () => {
        this.lx += this.lvx * 10;
        this.ly += this.lvy * 10;
    }
}
