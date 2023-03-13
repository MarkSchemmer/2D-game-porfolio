import { isValue } from "utils/Utils";
import { ChessCell } from "../chess-utils/utils";
import { Piece, PieceName, IPiece, PieceColor } from "./Piece";

class Rook extends Piece {
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