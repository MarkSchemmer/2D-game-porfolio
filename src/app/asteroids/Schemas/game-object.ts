
class Ship {
    public x: number;
    public y: number;
    public ctx = null;

    // Will need value to know how to point the rotation of the ship
    // Primitive value will just be a triangle

    // Need to know how to find which direction is north

    constructor(width, height, ctx) {
        this.x = width / 2;
        this.y = height - 50;
        this.ctx = ctx;
    }
}

export const gameObject = (w, h, ctx) => ({
    ship: new Ship(w, h, ctx)
});
