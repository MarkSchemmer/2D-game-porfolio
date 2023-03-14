import { isValue } from "utils/Utils";
import { Piece, PieceColor } from "../chess-utils/Piece";
import { ChessCoordinate, ChessMovement, getCellColor, chessCellColor } from "../chess-utils/utils";


export interface IChessCell {
    cellsColor: string;
    xRange: number;
    yRange: number;
    isAlive: boolean;
    redSquareActivated: boolean;
    coordinate: ChessCoordinate;
    letterText: string;
    numberText: string;
    piece: Piece;
}

export class ChessCell implements IChessCell {
    // Chess green base black square: #769656
    // Chess white base white square: #eeeed2
    public whiteColor: string = "#769656";
    public blackColor: string = "#eeeed2";
    public xRange: number;
    public yRange: number;
    // chagne isAlive to userFocusedSqaure
    public isAlive: boolean = false;
    public redSquareActivated: boolean = false;

    public canMoveToOrAttack: boolean = false;

    // Coordinate of square in chessboard.
    public coordinate: ChessCoordinate = null;
    public cellsColor: string = null;
    public letterText: string = null;
    public numberText: string = null;
    public piece: Piece = null;
    public row: number;
    public col: number;
    public chessMovementPatterns: ChessMovement = new ChessMovement();

    public makeCellAttack = () => {
        this.canMoveToOrAttack = true;
    };

    public makeCellNotAttack = () => {
        this.canMoveToOrAttack = false;
    };

    public cellIsEmpty = (): boolean => {
        return this.piece === null;
    };

    public cellIsNotEmpty = (): boolean => {
        return !this.cellIsEmpty();
    };

    public connectToNeighbors = (cell: ChessCell, pieceMap: { [key: string]: ChessCell; }) => {

        // leftNeighbor
        let leftCellCoordinate = cell.coordinate.getLeftCell();
        let leftCell = isValue(leftCellCoordinate) ? pieceMap[leftCellCoordinate] : null;

        // Right Neighbor
        let rightCellCoordinate = cell.coordinate.getRightCell();
        let rightCell = isValue(rightCellCoordinate) ? pieceMap[rightCellCoordinate] : null;

        // Forward Neighbor
        let forwardCellCoordinate = cell.coordinate.getForwardCell();
        let forwardCell = isValue(forwardCellCoordinate) ? pieceMap[forwardCellCoordinate] : null;

        // Backwards Neighbor
        let backwardsCellCoordinate = cell.coordinate.getBackwardsCell();
        let backwardsCell = isValue(backwardsCellCoordinate) ? pieceMap[backwardsCellCoordinate] : null;

        // Diagonal Forward Right Neighbor
        let forwardDiagonalRightCoordinate = cell.coordinate.getForwardsDiagonalRightCell();
        let diagonalForwardRightCell = isValue(forwardDiagonalRightCoordinate) ? pieceMap[forwardDiagonalRightCoordinate] : null;

        // Diagonal Forward Left Neighbor
        let forwardDiagonalLeftCoordinate = cell.coordinate.getForwardsDiagonalLeftCell();
        let diagonalForwardLeftCell = isValue(forwardDiagonalLeftCoordinate) ? pieceMap[forwardDiagonalLeftCoordinate] : null;

        // Diagonal Backwards Right Neighbor
        let backwardsDiagonalRightCoordinate = cell.coordinate.getBackwardsDiagonalRightCell();
        let backwardsDiagonalRightCell = isValue(backwardsDiagonalRightCoordinate) ? pieceMap[backwardsDiagonalRightCoordinate] : null;

        // Diagonal Backwards Left Neighbor
        let backwardsDiagonalLeftCoordinate = cell.coordinate.getBackwardsDiagonalLeftCell();
        let backwardsDiagonalLeftCell = isValue(backwardsDiagonalLeftCoordinate) ? pieceMap[backwardsDiagonalLeftCoordinate] : null;

        cell.chessMovementPatterns.Left = leftCell;
        cell.chessMovementPatterns.Right = rightCell;
        cell.chessMovementPatterns.Forward = forwardCell;
        cell.chessMovementPatterns.Backwards = backwardsCell;
        cell.chessMovementPatterns.ForwardsDiagonalRight = diagonalForwardRightCell;
        cell.chessMovementPatterns.ForwardsDiagonalLeft = diagonalForwardLeftCell;
        cell.chessMovementPatterns.BackwardsDiagonalRight = backwardsDiagonalRightCell;
        cell.chessMovementPatterns.BackwardsDiagonalLeft = backwardsDiagonalLeftCell;
    };

    setRowCol = (row, col) => {
        this.row = row;
        this.col = col;
    };

    constructor(chessCoordinate: ChessCoordinate, cellColor: chessCellColor, piece: Piece = null) {
        this.coordinate = chessCoordinate;
        this.cellsColor = cellColor === chessCellColor.WHITE ? this.whiteColor : this.blackColor;
        this.piece = piece;
    }
}
