import { R } from "schemas/rType";

interface GameDirections {
    Left: number;
    Right: number;
    ForwardThrusters: number;
    Fire: number;
}

export const Directions: R<GameDirections> = {
    Left: 37,
    Right: 39,
    ForwardThrusters: 38,
    Fire: 32
};
