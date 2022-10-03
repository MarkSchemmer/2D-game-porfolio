
// A piece needs to know how to move, 
// Going to be base class for all

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
    constructor(weight, image, pieceColor) {
        this.weight = weight;
        this.image = image;
        this.pieceColor = pieceColor;
    }
}

export class Pond extends Piece {
    constructor(weight, image, pieceColor) {
        super(weight, image, pieceColor);
    }
}

export class Rook extends Piece {
    constructor(weight, image, pieceColor) {
        super(weight, image, pieceColor);
    }
}

export class Bishop extends Piece {
    constructor(weight, image, pieceColor) {
        super(weight, image, pieceColor);
    }
}

export class Knight extends Piece {
    constructor(weight, image, pieceColor) {
        super(weight, image, pieceColor);
    }
}

export class King extends Piece {
    constructor(weight, image, pieceColor) {
        super(weight, image, pieceColor);
    }
}

export class Queen extends Piece {
    constructor(weight, image, pieceColor) {
        super(weight, image, pieceColor);
    }
}


