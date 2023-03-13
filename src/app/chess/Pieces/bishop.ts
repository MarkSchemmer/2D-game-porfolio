import { ChessCell } from "../chess-utils/utils";
import { Piece, PieceName, IPiece, PieceColor } from "./Piece";

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