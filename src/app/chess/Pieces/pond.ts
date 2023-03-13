import { isValue } from "utils/Utils";
import { ChessCell } from "../chess-utils/utils";
import { Piece, PieceName, PieceColor, IPiece } from "./Piece";

export class Pond extends Piece {
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