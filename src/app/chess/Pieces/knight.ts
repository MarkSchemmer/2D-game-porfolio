import { isValue } from "utils/Utils";
import { ChessCell } from "../chess-utils/utils";
import { Piece, PieceName, IPiece, PieceColor } from "./Piece";

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