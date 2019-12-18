import { generateRandomGuid } from "utils/Utils";

enum PlayerType {
    PlayerX = "X",
    PlayerType = "O"
}

interface ISquare {
    id: string;
    playerType?: PlayerType;
    isWinningSquare: boolean;
}

export class Square implements ISquare {

    readonly id: string;
    playerType: PlayerType = null;
    isWinningSquare: boolean = false;

    constructor() {
        this.id = generateRandomGuid();
    }
}
