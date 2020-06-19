import { Ship } from "./ship";

export const gameObject = (w, h, ctx) => ({
    ship: new Ship(w, h, ctx)
});
