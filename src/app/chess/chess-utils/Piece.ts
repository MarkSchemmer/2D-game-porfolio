// A piece needs to know how to move, 
// Going to be base class for all
import { NullTemplateVisitor } from "@angular/compiler";
import { range } from "utils/Utils";

export enum PieceName {
    ROOK,
    POND,
    BISHOP,
    QUEEN,
    KING,
    KNIGHT
}

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
    public hasRun: boolean = false;

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

    constructor(image, pieceColor) {
        this.image = image;
        this.pieceColor = pieceColor;
    }
}

class Pond extends Piece {
    public weight: number = 1;
    public imageObj = new Image();
    constructor(image, pieceColor) {
        super(image, pieceColor);
    }
}

export class WhitePond extends Pond implements IPiece {
    constructor() {
        super(`assets/chess-images/white-pond.png`, PieceColor.WHITE);
    }
}

export class BlackPond extends Pond implements IPiece {
    constructor() {
        super(`assets/chess-images/black-pond.png`, PieceColor.BLACK);
    }
}

export class Rook extends Piece {
    public weight: number = 5;
    constructor(image, pieceColor) {
        super(image, pieceColor);
    }
}

export class WhiteRook extends Rook implements IPiece {
    constructor() {
        super(`assets/chess-images/white-rook.png`, PieceColor.WHITE);
    }
}

export class BlackRook extends Rook implements IPiece {
    constructor() {
        super(`assets/chess-images/black-rook.png`, PieceColor.BLACK);
    }
}



export class Bishop extends Piece {
    public weight: number = 3;
    constructor(image, pieceColor) {
        super(image, pieceColor);
    }
}

export class WhiteBishop extends Bishop implements IPiece {
    constructor() {
        super(`assets/chess-images/white-bishop.png`, PieceColor.WHITE);
    }
}

export class BlackBishop extends Bishop implements IPiece {
    constructor() {
        super(`assets/chess-images/black-bishop.png`, PieceColor.BLACK);
    }
}

export class Knight extends Piece {
    public weight: number = 3;
    constructor(image, pieceColor) {
        super(image, pieceColor);
    }
}

export class WhiteKnight extends Knight implements IPiece {
    constructor() {
        super(`assets/chess-images/white-knight.png`, PieceColor.WHITE);
    }
}

export class BlackKnight extends Knight implements IPiece {
    constructor() {
        super(`assets/chess-images/black-knight.png`, PieceColor.BLACK);
    }
}

export class King extends Piece {
    public weight: number = Infinity;
    constructor(image, pieceColor) {
        super(image, pieceColor);
    }
}

export class WhiteKing extends King implements IPiece {
    constructor() {
        super(`assets/chess-images/white-king.png`, PieceColor.WHITE);
    }
}

export class BlackKing extends King implements IPiece {
    constructor() {
        super(`assets/chess-images/black-king.png`, PieceColor.BLACK);
    }
}

export class Queen extends Piece {
    public weight: number = 10;
    constructor(image, pieceColor) {
        super(image, pieceColor);
    }
}

export class WhiteQueen extends Queen implements IPiece {
    constructor() {
        super(`assets/chess-images/white-queen.png`, PieceColor.WHITE);
    }
}

export class BlackQueen extends Queen implements IPiece {
    constructor() {
        super(`assets/chess-images/black-queen.png`, PieceColor.BLACK);
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

    PieceGenerator = (pieceName: PieceName, pieceColor: PieceColor) => {
        switch(pieceName) {
            case PieceName.POND: {
                return pieceColor === PieceColor.WHITE ? new WhitePond() : new BlackPond();
            }
            case PieceName.ROOK: {
                return pieceColor === PieceColor.WHITE ? new WhiteRook() : new BlackRook();
            }
            case PieceName.BISHOP: {
                return pieceColor === PieceColor.WHITE ? new WhiteBishop() : new BlackBishop();
            }
            case PieceName.KNIGHT: {
                return pieceColor === PieceColor.WHITE ? new WhiteKnight() : new BlackKnight();
            }
            case PieceName.QUEEN: {
                return pieceColor === PieceColor.WHITE ? new WhiteQueen() : new BlackQueen();
            }
            case PieceName.KING: {
                return pieceColor === PieceColor.WHITE ? new WhiteKing() : new BlackKing();
            }
            default: {
                console.log("default.");
                return null;
            }
        }
    }
}