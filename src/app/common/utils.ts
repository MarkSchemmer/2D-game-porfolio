import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

// Common interface for keystroke directions
export enum KeyStroke {
    ArrowUp = "ArrowUp",
    P = "P", 
    S = "S",
    ArrowLeft = "ArrowLeft",
    ArrowRight = "ArrowRight",
    R = "R"
}

export class Coordinate { 
    public x: number; 
    public y: number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export enum Directions {
    NORTH = "N",
    EAST = "E",
    SOUTH = "S",
    WEST = "W"
};

export let getRandomInt = (max) =>  {
    return Math.floor(Math.random() * max);
}