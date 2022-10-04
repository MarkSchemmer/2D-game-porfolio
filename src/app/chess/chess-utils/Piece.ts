// A piece needs to know how to move, 
// Going to be base class for all
import { range } from "utils/Utils";

export enum PieceColor {
    WHITE = "WHITE",
    BLACK = "BLACK"
}

export interface IPiece {
    weight: number;
    image: string;
    pieceColor: PieceColor;
}

export class Piece implements IPiece {
    public weight: number;
    public image: string;
    public pieceColor: PieceColor;
    public imageObj = new Image();
    public draw = (ctx, xRange, yRange) => { }

    constructor(image, pieceColor) {
        this.image = image;
        this.pieceColor = pieceColor;
    }
}

class Pond extends Piece {
    public weight: number = 1;
    public hasRun: boolean = false;
    public imageObj = new Image();
    constructor(image, pieceColor) {
        super(image, pieceColor);
    }

    public draw = (ctx, xRange, yRange) => {
        if (this.hasRun === false) {
            this.imageObj.src = this.image;
            this.imageObj.onload = () => { 
                ctx.drawImage(this.imageObj, xRange - 5, yRange - 5, 60, 60);
            }
            this.hasRun = !this.hasRun
        } else {
            this.imageObj.src = this.image;
            ctx.drawImage(this.imageObj, xRange - 5, yRange - 5, 60, 60);
        }
    }
}

export class WhitePond extends Pond implements IPiece {
    constructor() {
        super(`assets/chess-images/white-pond.png`, PieceColor.WHITE);
    }
}

export class Rook extends Piece {
    public weight: number = 5;
    constructor(image, pieceColor) {
        super(image, pieceColor);
    }
}

export class Bishop extends Piece {
    public weight: number = 3;
    constructor(image, pieceColor) {
        super(image, pieceColor);
    }
}

export class Knight extends Piece {
    public weight: number = 3;
    constructor(image, pieceColor) {
        super(image, pieceColor);
    }
}

export class King extends Piece {
    public weight: number = Infinity;
    constructor(image, pieceColor) {
        super(image, pieceColor);
    }
}

export class Queen extends Piece {
    public weight: number = 10;
    constructor(image, pieceColor) {
        super(image, pieceColor);
    }
}

// Make 8 black ponds.
export const blackPonds = range(1, 8).map(() => new Pond("../chess-images/black-pond.png", PieceColor.BLACK));
// Make 8 white ponds.
export const whitePonds = range(1, 8).map(() => new Pond("../chess-images/white-pond.png", PieceColor.WHITE));

export class ChessPieceFactory {
    WhitePond = () => {
        return new WhitePond();
    }
}