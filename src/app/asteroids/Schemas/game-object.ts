import { Ship } from "./ship";

export const gameObject = (w, h, ctx, x, y) => ({
    ship: new Ship(w, h, ctx, x, y)
});
