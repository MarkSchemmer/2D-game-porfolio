// A piece needs to know how to move, 
// Going to be base class for all
import { isValue, range } from "utils/Utils";
import { ChessCell } from "./utils";

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
    public unSelectOldMovesFn: () => void;

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

    public FindMoves = (cell: ChessCell) => {
        // console.log("base moves here, basically log and forget.");
        // console.log(cell.coordinate.chessCoordinate);
    }

    public UnSelectMoves = (cell: ChessCell) => {
        // console.log("Here in the base class. ");
        // console.log("Need to unselect all squares here. ");
    }

    public getAllVerticalCells = (cell: ChessCell) => {
        // We should look left and right...
        let right = cell.chessMovementPatterns.Right;
        let left = cell.chessMovementPatterns.Left;

        // Look Right
        while(isValue(right)) {
            right.canMoveToOrAttack = !right.canMoveToOrAttack;
            right = right.chessMovementPatterns.Right;
        }

        // Look Left
        while (isValue(left)) {
            left.canMoveToOrAttack = !left.canMoveToOrAttack;
            left = left.chessMovementPatterns.Left;
        }
    }

    public getAllDiagonals = (cell: ChessCell) => {
        // forward right
        let diagForwardRight = cell.chessMovementPatterns.ForwardsDiagonalRight;

        while (isValue(diagForwardRight)) {
            diagForwardRight.canMoveToOrAttack = !diagForwardRight.canMoveToOrAttack;
            diagForwardRight = diagForwardRight.chessMovementPatterns.ForwardsDiagonalRight;
        }

        // forward left
        let diagForwardLeft = cell.chessMovementPatterns.ForwardsDiagonalLeft;

        while (isValue(diagForwardLeft)) {
            diagForwardLeft.canMoveToOrAttack = !diagForwardLeft.canMoveToOrAttack;
            diagForwardLeft = diagForwardLeft.chessMovementPatterns.ForwardsDiagonalLeft;
        }

        // backwards right 
        let diagBackwardsRight = cell.chessMovementPatterns.BackwardsDiagonalRight;

        while (isValue(diagBackwardsRight)) {
            diagBackwardsRight.canMoveToOrAttack = !diagBackwardsRight.canMoveToOrAttack;
            diagBackwardsRight = diagBackwardsRight.chessMovementPatterns.BackwardsDiagonalRight;
        }

        // backwards left
        let diagBackwardsLeft = cell.chessMovementPatterns.BackwardsDiagonalLeft;

        while (isValue(diagBackwardsLeft)) {
            diagBackwardsLeft.canMoveToOrAttack = !diagBackwardsLeft.canMoveToOrAttack;
            diagBackwardsLeft = diagBackwardsLeft.chessMovementPatterns.BackwardsDiagonalLeft;
        }
    }

    public getAllHorizontals = (cell: ChessCell) => {
        let forwards = cell.chessMovementPatterns.Forward;
        let backwards = cell.chessMovementPatterns.Backwards;

        while (isValue(forwards)) {
            forwards.canMoveToOrAttack = !forwards.canMoveToOrAttack;
            forwards = forwards.chessMovementPatterns.Forward;
        }

        while (isValue(backwards)) {
            backwards.canMoveToOrAttack = !backwards.canMoveToOrAttack;
            backwards = backwards.chessMovementPatterns.Backwards;
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
    public hasMoved: boolean = false;

    public poolOfSquaresThatCanMoveOrAttack = [];

    constructor(image, pieceColor) {
        super(image, pieceColor);
    }

    public pondHelper = (cell: ChessCell) => {

        let next, nextNext;

        if (cell.piece.pieceColor === PieceColor.WHITE) 
        {
            next = cell.chessMovementPatterns.Forward;
            nextNext = next && next.chessMovementPatterns.Forward;
        } 
        else 
        {
            next = cell.chessMovementPatterns.Backwards;
            nextNext = next && next.chessMovementPatterns.Backwards;
        }

        let left = next.chessMovementPatterns.Left;
        let right = next.chessMovementPatterns.Right;

        if (isValue(left)) {
            left.canMoveToOrAttack = true;
            this.poolOfSquaresThatCanMoveOrAttack.push(left);
        }

        if (isValue(right)) {
            right.canMoveToOrAttack = true;
            this.poolOfSquaresThatCanMoveOrAttack.push(right);
        }

        if (this.hasMoved === false) 
        {
            next.canMoveToOrAttack = true;
            nextNext.canMoveToOrAttack = true;
            this.poolOfSquaresThatCanMoveOrAttack = [ ...this.poolOfSquaresThatCanMoveOrAttack, next, nextNext ];

        } else {
            next.canMoveToOrAttack = true;
            this.poolOfSquaresThatCanMoveOrAttack.push(next);
        }

    }

    public FindMoves = (cell: ChessCell) => {
        this.pondHelper(cell);
    }

    public UnSelectMoves = (c: ChessCell) => {

        this.poolOfSquaresThatCanMoveOrAttack.forEach((cell: ChessCell) => {
            cell.canMoveToOrAttack = false;
        });

        this.poolOfSquaresThatCanMoveOrAttack = [];

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

    public rookHelper = (cell: ChessCell) => {
        this.getAllVerticalCells(cell);
        this.getAllHorizontals(cell);
    }

    public FindMoves = (cell: ChessCell) => {
        // console.log("white rook here, let's find moves.");
        // console.log(cell.coordinate.chessCoordinate);
        this.rookHelper(cell);
        console.log("finished.");
    }

    public UnSelectMoves = (cell: ChessCell) => {
            // We should look left and right...
            // console.log(cell);
            let right = cell.chessMovementPatterns.Right;
            let left = cell.chessMovementPatterns.Left;
    
            // Look Right
            while(isValue(right)) {
                right.canMoveToOrAttack = false;
                right = right.chessMovementPatterns.Right;
            }
    
            // Look Left
            while (isValue(left)) {
                left.canMoveToOrAttack = false;
                left = left.chessMovementPatterns.Left;
            }

            let forwards = cell.chessMovementPatterns.Forward;
            let backwards = cell.chessMovementPatterns.Backwards;
    
            while (isValue(forwards)) {
                forwards.canMoveToOrAttack = false;
                forwards = forwards.chessMovementPatterns.Forward;
            }
    
            while (isValue(backwards)) {
                backwards.canMoveToOrAttack = false;
                backwards = backwards.chessMovementPatterns.Backwards;
            }
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

    public bishopHelper = (cell: ChessCell) => {
        this.getAllDiagonals(cell);
    }

    public FindMoves = (cell: ChessCell) => {
        // console.log("white rook here, let's find moves.");
        // console.log(cell.coordinate.chessCoordinate);
        this.bishopHelper(cell);
        console.log("finished.");
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

    public queenHelper = (cell: ChessCell) => {
        this.getAllDiagonals(cell);
        this.getAllHorizontals(cell);
        this.getAllVerticalCells(cell);
    }

    public FindMoves = (cell: ChessCell) => {
        // console.log("white rook here, let's find moves.");
        // console.log(cell.coordinate.chessCoordinate);
        this.queenHelper(cell);
        console.log("finished.");
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