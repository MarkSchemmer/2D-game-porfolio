// A piece needs to know how to move, 
// Going to be base class for all
import { isValue, range } from "utils/Utils";
import { ChessCell } from "./utils";
import { ChessRules } from "../chess-business-rules/chess-rules";

export enum PieceDirections { 
    FORWARD, BACKWARDS, 
    LEFT, RIGHT, 
    DIAGONALFORWARDLEFT, DIAGONALFORWARDRIGHT, 
    DIAGONALBACKWARDSLEFT, DIAGONALBACKWARDSRIGHT
}

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
    public chessRules: ChessRules = new ChessRules();
    public PieceName: PieceName;
    public hasMoved: boolean = false;

    constructor(image, pieceColor) {
        this.image = image;
        this.pieceColor = pieceColor;
    }

    public draw = (ctx, xRange, yRange) => {
        if (this.hasRun === false) {
            this.imageObj.src = this.image;
            this.imageObj.onload = () => { 
                ctx.drawImage(this.imageObj, xRange - 5, yRange - 5, 60, 60);
            }
            this.hasRun = true;
        } else {
            this.imageObj.onload = null;
            this.imageObj.src = this.image;
            ctx.drawImage(this.imageObj, xRange - 5, yRange - 5, 60, 60);
        }
    }

    public getRightSquare = () => {

    }

    public TryGetPiece = (fn) => {
        try {
            return fn();
        } catch(e) {
            console.log(e);
            return null;
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

    public getChessPiecesSquares = (baseCell: ChessCell, cell: ChessCell, direction: PieceDirections, predicate : (baseCell: ChessCell, newCell: ChessCell) => boolean) => {
        while(isValue(cell)) 
        {
            if (cell.cellIsEmpty()) 
            {
                cell.makeCellAttack();
                cell = getPieceFromDirection(cell, direction);
            } 
            else
            {
                if (predicate(baseCell, cell))
                    cell.makeCellAttack();
                
                cell = null;
            }
        }
    }

    public getAllVerticalCells = (cell: ChessCell) => {
        // get Chess Pieces Squares is a 
        this.getChessPiecesSquares(cell, this.TryGetPiece(
            () => cell.chessMovementPatterns.Right
        ), PieceDirections.RIGHT, this.chessRules.isNotSameColor);

        this.getChessPiecesSquares(cell, this.TryGetPiece(
            () => cell.chessMovementPatterns.Left
        ), PieceDirections.LEFT, this.chessRules.isNotSameColor);
    }

    public getAllDiagonals = (cell: ChessCell) => {
        // Chess pieces diagonally right
        this.getChessPiecesSquares(cell, this.TryGetPiece(
            () =>  cell.chessMovementPatterns.ForwardsDiagonalRight
        ), PieceDirections.DIAGONALFORWARDRIGHT, this.chessRules.isNotSameColor);

        // Chess pieces diagonally right
        this.getChessPiecesSquares(cell, this.TryGetPiece(
            () => cell.chessMovementPatterns.ForwardsDiagonalLeft
        ), PieceDirections.DIAGONALFORWARDLEFT, this.chessRules.isNotSameColor);


        // Chess pieces diagonally backwards right
        this.getChessPiecesSquares(cell, this.TryGetPiece(
            () => cell.chessMovementPatterns.BackwardsDiagonalRight
        ), PieceDirections.DIAGONALBACKWARDSRIGHT, this.chessRules.isNotSameColor);

        // Chess pieces diagonally backwards left
        this.getChessPiecesSquares(cell, this.TryGetPiece(
            () => cell.chessMovementPatterns.BackwardsDiagonalLeft
        ), PieceDirections.DIAGONALBACKWARDSLEFT, this.chessRules.isNotSameColor);
    }

    public getAllHorizontals = (cell: ChessCell) => {
        // Chess pieces forwards
        this.getChessPiecesSquares(cell, this.TryGetPiece(
            () => cell.chessMovementPatterns.Forward
        ), PieceDirections.FORWARD, this.chessRules.isNotSameColor);

        // Chess pieces backwards
        this.getChessPiecesSquares(cell, this.TryGetPiece(
            () => cell.chessMovementPatterns.Backwards
        ), PieceDirections.BACKWARDS, this.chessRules.isNotSameColor);
    }
}

class Pond extends Piece {
    public weight: number = 1;
    public imageObj = new Image();
    public poolOfSquaresThatCanMoveOrAttack = [];

    constructor(image, pieceColor) {
        super(image, pieceColor);
        this.PieceName = PieceName.POND;
    }

    public pondHelper = (cell: ChessCell) => {

        let whichColor = cell.piece.pieceColor === PieceColor.WHITE;
        let next, nextNext;

        next = this.TryGetPiece(
            () =>  whichColor ? cell.chessMovementPatterns.Forward : cell.chessMovementPatterns.Backwards
        );

        nextNext = this.TryGetPiece(
            () => whichColor ? next.chessMovementPatterns.Forward : next.chessMovementPatterns.Backwards
        );

        let left = this.TryGetPiece(
            () => next.chessMovementPatterns.Left
        );

        let right = this.TryGetPiece(
            () => next.chessMovementPatterns.Right
        );

        if (isValue(left) && this.chessRules.canPondAttack(cell, left)) {
            left.makeCellAttack();
            this.poolOfSquaresThatCanMoveOrAttack.push(left);
        }

        if (isValue(right) && this.chessRules.canPondAttack(cell, right)) {
            right.makeCellAttack();
            this.poolOfSquaresThatCanMoveOrAttack.push(right);
        }

        if (this.chessRules.canPondMove2SpacesOnFirstMove(cell, next, nextNext)) 
        {
            next.makeCellAttack();
            nextNext.makeCellAttack();
            this.poolOfSquaresThatCanMoveOrAttack = [ ...this.poolOfSquaresThatCanMoveOrAttack, next, nextNext ];
            // this.hasMoved = true;
        } 
        else if (this.chessRules.canPondMove1SpaceForward(cell, next)) {
            next.makeCellAttack();
            this.poolOfSquaresThatCanMoveOrAttack.push(next);
        }
    }

    public FindMoves = (cell: ChessCell) => {
        this.pondHelper(cell);
    }

    public UnSelectMoves = (c: ChessCell) => {

        this.poolOfSquaresThatCanMoveOrAttack.forEach((cell: ChessCell) => {
            cell.makeCellNotAttack();
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
        this.PieceName = PieceName.ROOK;
    }

    public rookHelper = (cell: ChessCell) => {
        this.getAllVerticalCells(cell);
        this.getAllHorizontals(cell);
    }

    public FindMoves = (cell: ChessCell) => {
        // console.log("white rook here, let's find moves.");
        // console.log(cell.coordinate.chessCoordinate);
        this.rookHelper(cell);
        // console.log("finished.");
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
        this.PieceName = PieceName.BISHOP;
    }

    public bishopHelper = (cell: ChessCell) => {
        this.getAllDiagonals(cell);
    }

    public FindMoves = (cell: ChessCell) => {
        // console.log("white rook here, let's find moves.");
        // console.log(cell.coordinate.chessCoordinate);
        this.bishopHelper(cell);
        // console.log("finished.");
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
    public poolOfSquaresThatCanMoveOrAttack = [];

    constructor(image, pieceColor) {
        super(image, pieceColor);
        this.PieceName = PieceName.KNIGHT;
    }

    public FindMoves = (cell: ChessCell) => {
        this.getKnightMoves(cell);
        console.log("found knight moves. ");
    }

    public UnSelectMoves = (c: ChessCell) => {
        this.poolOfSquaresThatCanMoveOrAttack.forEach((cell: ChessCell) => {
            cell.canMoveToOrAttack = false;
        });

        this.poolOfSquaresThatCanMoveOrAttack = [];
    }

    public getKnightMoves = (cell: ChessCell) => {
        // Need to get forward -> left and right
        let f: ChessCell = this.TryGetPiece(
            () => cell.chessMovementPatterns.Forward.chessMovementPatterns.Forward
        );

        let validF : Boolean = isValue(f);
        let fr: ChessCell = validF ? this.TryGetPiece(() => f.chessMovementPatterns.Right) : null;
        let fl: ChessCell = validF ? this.TryGetPiece(() => f.chessMovementPatterns.Left) : null;

        // Need to get backwards -> left and right

        let  b: ChessCell = this.TryGetPiece(
            () => cell.chessMovementPatterns.Backwards.chessMovementPatterns.Backwards
        );

        let validB: Boolean = isValue(b);
        let bl: ChessCell = validB ? this.TryGetPiece(() => b.chessMovementPatterns.Left) : null;
        let br: ChessCell = validB ? this.TryGetPiece(() => b.chessMovementPatterns.Right) : null;

        let l: ChessCell = this.TryGetPiece(
            () => cell.chessMovementPatterns.Left.chessMovementPatterns.Left
        );

        let validL: Boolean = isValue(l);
        let lf: ChessCell = validL ? this.TryGetPiece(() => l.chessMovementPatterns.Forward) : null;
        let lb: ChessCell = validL ? this.TryGetPiece(() => l.chessMovementPatterns.Backwards) : null;


        let r: ChessCell = this.TryGetPiece(
            () => cell.chessMovementPatterns.Right.chessMovementPatterns.Right
        );

        let validR = isValue(r);
        let rf: ChessCell = validR ? this.TryGetPiece(() => r.chessMovementPatterns.Forward) : null;
        let rb: ChessCell = validB ? this.TryGetPiece(() => r.chessMovementPatterns.Backwards) : null;

        this.poolOfSquaresThatCanMoveOrAttack = [
            fr, fl, bl, br, lf, lb, rf, rb
        ].filter(
            (cell: ChessCell) => this.chessRules.canKnightMove(cell)
        );

        this.poolOfSquaresThatCanMoveOrAttack.forEach(cell => cell.canMoveToOrAttack = true);
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

    public poolOfSquaresThatCanMoveOrAttack = [];

    constructor(image, pieceColor) {
        super(image, pieceColor);
        this.PieceName = PieceName.KING;
    }

    public getKingMoves = (cell: ChessCell) => {
        let left, right, forward, backward, diagforwardleft, 
        diagforwardright, diagbackwardsleft, diagbackwardsright;

        left = this.TryGetPiece(
            () => cell.chessMovementPatterns.Left
        );

        right = this.TryGetPiece(
            () => cell.chessMovementPatterns.Right
        );

        forward = this.TryGetPiece(
            () => cell.chessMovementPatterns.Forward
        );

        backward = this.TryGetPiece(
            () => cell.chessMovementPatterns.Backwards
        );

        diagforwardleft = this.TryGetPiece(
            () => cell.chessMovementPatterns.ForwardsDiagonalLeft
        );

        diagforwardright = this.TryGetPiece(
            () => cell.chessMovementPatterns.ForwardsDiagonalRight
        );

        diagbackwardsleft = this.TryGetPiece(
            () => cell.chessMovementPatterns.BackwardsDiagonalLeft
        );

        diagbackwardsright = this.TryGetPiece(
            () => cell.chessMovementPatterns.BackwardsDiagonalRight
        );


        this.poolOfSquaresThatCanMoveOrAttack = [
            left, right, forward, backward, diagforwardleft, 
            diagforwardright, diagbackwardsleft, diagbackwardsright
        ].filter((c: ChessCell) => isValue(c));


        this.poolOfSquaresThatCanMoveOrAttack.forEach((c:ChessCell) => {
            if (this.KingRules(c)) {
                c.canMoveToOrAttack = true;
            }
        });

    }

    public KingRules = (c: ChessCell): boolean => {
        return this.chessRules.canKingMove(c);
    }

    public FindMoves = (cell: ChessCell) => {
        this.getKingMoves(cell);
        console.log("found King moves. ");
    }

    public UnSelectMoves = (cell: ChessCell) => {
        this.poolOfSquaresThatCanMoveOrAttack.forEach((cell: ChessCell) => {
            cell.canMoveToOrAttack = false;
        });

        this.poolOfSquaresThatCanMoveOrAttack = [];
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
        this.PieceName = PieceName.QUEEN;
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
                // console.log("default.");
                return null;
            }
        }
    }
}

// export const PieceDirectionGetter = ()

export const TryGetFunc = (fn) => {
    try {
        return fn();
    } catch(e) {
        // console.log(e);
        return null;
    }
}

export const getPieceFromDirection = (cell: ChessCell, direction: PieceDirections) => {
    switch(direction) {
        case PieceDirections.FORWARD: {
            return cell.chessMovementPatterns.Forward;
        } 
        case PieceDirections.BACKWARDS: {
            return cell.chessMovementPatterns.Backwards;
        }
        case PieceDirections.LEFT: {
            return cell.chessMovementPatterns.Left;
        }
        case PieceDirections.RIGHT: {
            return cell.chessMovementPatterns.Right;
        }
        case PieceDirections.DIAGONALFORWARDLEFT: {
            return cell.chessMovementPatterns.ForwardsDiagonalLeft;
        }
        case PieceDirections.DIAGONALFORWARDRIGHT: {
            return cell.chessMovementPatterns.ForwardsDiagonalRight;
        }
        case PieceDirections.DIAGONALBACKWARDSRIGHT: {
            return cell.chessMovementPatterns.BackwardsDiagonalRight;
        }
        case PieceDirections.DIAGONALBACKWARDSLEFT: {
            return cell.chessMovementPatterns.BackwardsDiagonalLeft;
        }
        default: {
            return null;
        }
    }
}