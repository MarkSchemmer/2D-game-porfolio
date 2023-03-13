import { ChessCell } from "../chess-utils/utils";
import { Piece, PieceName, IPiece, PieceColor } from "./Piece";

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