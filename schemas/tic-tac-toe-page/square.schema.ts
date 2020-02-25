import { R } from "schemas/rType";
import { generateRandomGuid } from "../../utils/Utils";

export enum PlayerType {
    PlayerX = "X",
    PlayerY = "O",
    Tie = "Tie Game"
}

export interface ISquare {
    id: string;
    playerType?: PlayerType;
    isWinningSquare: boolean;
}

export class Square implements ISquare {

    readonly id: string;
    playerType: PlayerType = null;
    isWinningSquare: boolean = false;
    coordinateIndex: string = null;

    constructor(coordinateIndex?: number) {
        this.id = generateRandomGuid();
        this.coordinateIndex = squareCoordinates[coordinateIndex];
    }
}

export const squareCoordinates = {
    0: "(0, 0)",
    1: "(0, 1)",
    2: "(0, 2)",
    3: "(1, 0)",
    4: "(1, 1)",
    5: "(1, 2)",
    6: "(2, 0)",
    7: "(2, 1)",
    8: "(2, 2)"
};

export class MoveHistory {

    coordinate: string = null;
    player: PlayerType = null;
    step: number = null;

    copyOfBoard: R<Square[][]>;

    public currentMove: boolean = null;

    constructor(playStep: number, coor: string, copyOfBoard: R<Square[][]>) {
        this.player = whichPlayerType(n => n % 2 === 0 ? true : false, playStep);
        this.coordinate = coor;
        this.step = playStep;
        this.copyOfBoard = copyOfBoard;
     }

     displayMoveText = (): string => {
         if (this.step === 0) { return "Game Start: "; }
         return `Player: ${this.player}: ${this.coordinate}, move#:${(this.step).toString()}`;
     }
}

export const whichPlayerType = (fn, step: number): PlayerType =>
                fn(step) ? PlayerType.PlayerX : PlayerType.PlayerY;
