// A piece needs to know how to move, 
// Going to be base class for all
import { isValue, range } from "utils/Utils";
import { ChessCell } from "../chess-utils/utils";
import { ChessRules } from "../chess-business-rules/chess-rules";
import { WhiteRook, BlackRook } from "./rook";
import { WhitePond, BlackPond, Pond } from "./pond";
import { WhiteQueen, BlackQueen } from "./queen";
import { WhiteKing, BlackKing } from "./king";
import { WhiteKnight, BlackKnight } from "./knight";
import { WhiteBishop, BlackBishop } from "./bishop";

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

    public isSameColor = (otherPiece: Piece): boolean => {
        return this.pieceColor === otherPiece.pieceColor;
    }

    public isNotSameColor = (otherPiece: Piece): boolean => {
        return !this.isSameColor(otherPiece);
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

    public getChessPiecesSquares = (baseCell: ChessCell, cell: ChessCell, direction: PieceDirections, predicate : (baseCell: PieceColor, newCell: PieceColor) => boolean) => {
        while(isValue(cell)) 
        {
            if (cell.cellIsEmpty()) 
            {
                cell.makeCellAttack();
                cell = getPieceFromDirection(cell, direction);
            } 
            else
            {
                if (predicate(baseCell.piece.pieceColor, cell.piece.pieceColor))
                    cell.makeCellAttack();
                
                cell = null;
            }
        }
    }

    public getAllVerticalCells = (cell: ChessCell) => {
        // get Chess Pieces Squares is a 
        this.getChessPiecesSquares(cell, this.TryGetPiece(
            () => cell.chessMovementPatterns.Right
        ), PieceDirections.RIGHT, notSameColorPredicate);

        this.getChessPiecesSquares(cell, this.TryGetPiece(
            () => cell.chessMovementPatterns.Left
        ), PieceDirections.LEFT, notSameColorPredicate);
    }

    public getAllDiagonals = (cell: ChessCell) => {
        // Chess pieces diagonally right
        this.getChessPiecesSquares(cell, this.TryGetPiece(
            () =>  cell.chessMovementPatterns.ForwardsDiagonalRight
        ), PieceDirections.DIAGONALFORWARDRIGHT, notSameColorPredicate);

        // Chess pieces diagonally right
        this.getChessPiecesSquares(cell, this.TryGetPiece(
            () => cell.chessMovementPatterns.ForwardsDiagonalLeft
        ), PieceDirections.DIAGONALFORWARDLEFT, notSameColorPredicate);


        // Chess pieces diagonally backwards right
        this.getChessPiecesSquares(cell, this.TryGetPiece(
            () => cell.chessMovementPatterns.BackwardsDiagonalRight
        ), PieceDirections.DIAGONALBACKWARDSRIGHT, notSameColorPredicate);

        // Chess pieces diagonally backwards left
        this.getChessPiecesSquares(cell, this.TryGetPiece(
            () => cell.chessMovementPatterns.BackwardsDiagonalLeft
        ), PieceDirections.DIAGONALBACKWARDSLEFT, notSameColorPredicate);
    }

    public getAllHorizontals = (cell: ChessCell) => {
        // Chess pieces forwards
        this.getChessPiecesSquares(cell, this.TryGetPiece(
            () => cell.chessMovementPatterns.Forward
        ), PieceDirections.FORWARD, notSameColorPredicate);

        // Chess pieces backwards
        this.getChessPiecesSquares(cell, this.TryGetPiece(
            () => cell.chessMovementPatterns.Backwards
        ), PieceDirections.BACKWARDS, notSameColorPredicate);
    }
}

// Make 8 black ponds.
export const blackPonds = range(1, 8).map(() => new Pond("../chess-images/black-pond.png", PieceColor.BLACK));
// Make 8 white ponds.
export const whitePonds = range(1, 8).map(() => new Pond("../chess-images/white-pond.png", PieceColor.WHITE));

export class ChessPieceFactory {
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

export let notSameColorPredicate = (_baseCell: PieceColor, _newCell: PieceColor) => { 
    try {
            return _baseCell !== _newCell;
    }
   catch(err) {
    alert(err);
   }
}