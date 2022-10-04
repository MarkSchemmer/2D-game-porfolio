import { Coordinate } from "src/app/common/utils";
import { range } from "utils/Utils"
import { ChessGrid } from "../chessGrid/chessGrid";
import { ChessPieceFactory, IPiece, Piece, PieceColor } from "./Piece";

export let letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
export let numbers = range(1, 8);

export class Mouse {
    x: number = null;
    y: number = null;
    res: number;

    canvasOffset: any;
    offsetX: any;
    offsetY: any;
    public canvas;
    public jCanvas;

    public chessBoard: ChessGrid = null;

    constructor(canvas, jCanvas, res, chessBoard) {
        this.canvas = canvas;
        this.offsetX = this.canvas.offsetLeft
        this.offsetY = this.canvas.offsetTop
        this.jCanvas = jCanvas
        this.res = res;
        this.chessBoard = chessBoard;
    }
}

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
    // Coordinate of square in chessboard.
    public coordinate: ChessCoordinate = null;
    public cellsColor: string = null;
    public letterText: string = null;
    public numberText: string = null;
    public piece: any = null;

    constructor(x, y) 
    {
      this.coordinate = new ChessCoordinate(x, y);
      this.cellsColor = getCellColor(x, y) === chessCellColor.WHITE ? this.whiteColor : this.blackColor;
    }
}



export let genChessBoard = () => {
    let board =  range(1, 8).map((x, xIndex) => {
        let chessCell: ChessCell = null;
        let indexes = range(1, 8).map((y, yIndex) => {
            chessCell = new ChessCell(x, y);
            if (x === 1) { chessCell.letterText = (yIndex + 1).toString()}
            return chessCell;
        });

        indexes.reverse();
        return indexes;
    });

    board.forEach((line, idx) => line[line.length - 1].numberText = letters[idx])

    let chessPieceFactory = new ChessPieceFactory();

    // Place white ponds.
    let whitePondLocations = letters.map(letter => letter + 2);
    whitePondLocations.forEach(location => {
        let chessCell = getCell(location, board);
        if (chessCell != null) {
            chessCell.piece = chessPieceFactory.WhitePond();
        }
        
    });

    return board;
}

enum chessCellColor {
    WHITE = "WHITE",
    BLACK = "BLACK"
}

export class ChessCoordinate extends Coordinate {
    public letters = ["a", "b", "c", "d", "e", "f", "g", "h"];

    public chessX: string;

    constructor(x, y) {
        super(x, y);
        this.chessX = this.letters[this.x - 1];
    }

    public LogCoordinate = () => {
        console.log(`${this.chessX} - ${this.y}`);
    }
}

export let getCellColor = (x, y): chessCellColor => {
    return x % 2 === 1 && y % 2 === 1 || x % 2 === 0 && y % 2 === 0 ? chessCellColor.BLACK : chessCellColor.WHITE;
}


export let getCell = (chessCoordinate: string, grid) => {
    let chessX = chessCoordinate.split("")[0];
    let y = parseInt(chessCoordinate.split("")[1]);
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
          const cell: IChessCell = grid[col][row];
            if (cell.coordinate.chessX === chessX && cell.coordinate.y === y) {
                return cell;
            }
        }
    }

    return null;
 }