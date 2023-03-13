import { isValue } from "utils/Utils";
import { ChessCell } from "../chess-utils/utils";
import { Piece, PieceName, IPiece, PieceColor } from "./Piece";

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