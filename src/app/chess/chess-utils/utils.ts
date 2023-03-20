import { Coordinate } from "src/app/common/utils";
import { isValue, range } from "utils/Utils"
import { ChessGrid } from "../chessGrid/chessGrid";
import { PieceName } from "./Piece";
import { ChessCell, IChessCell } from "../ChessCell/ChessCell";
import { defaultChessLocations } from "./defaultChessLocations";

export let letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
export let numbers = range(1, 8);

export let pieceName: PieceName[] = [
    PieceName.POND,
    PieceName.BISHOP,
    PieceName.KNIGHT,
    PieceName.ROOK,
    PieceName.QUEEN,
    PieceName.KING
];

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

export class ChessMovement {
    constructor() { }
    Left: ChessCell;
    Right: ChessCell;
    Forward: ChessCell;
    Backwards: ChessCell;
    ForwardsDiagonalRight: ChessCell;
    ForwardsDiagonalLeft: ChessCell;
    BackwardsDiagonalLeft: ChessCell;
    BackwardsDiagonalRight: ChessCell;
}

export let genChessBoard = () => {
    // xIndex row
    // yIndex col
    let board =  range(1, 8).map((x, xIndex) => {
        let chessCell: ChessCell = null;
        let indexes = range(1, 8).map((y, yIndex) => {
            let chessCoord = new ChessCoordinate(x, y);
            let cellColor = getCellColor(x, y);
            let stringChessCoord = chessCoord.chessCoordinate;
            let piece = stringChessCoord in defaultChessLocations ? defaultChessLocations[stringChessCoord] : null;
            console.log(stringChessCoord);
            chessCell = new ChessCell(chessCoord, cellColor, piece);
            chessCell.setRowCol(xIndex, yIndex);
            if (x === 1) { chessCell.letterText = (yIndex + 1).toString(); }
            return chessCell;
        });
        indexes.reverse();
        return indexes;
    });

    board.forEach((line, idx) => line[line.length - 1].numberText = letters[idx])

    return board;
}


export let connectBoard = (pieceMap: { [key: string] : ChessCell }) => {
    Object.values(pieceMap).forEach((cell: ChessCell) => {
        cell.connectToNeighbors(cell, pieceMap);
    });
}
 
export enum chessCellColor {
    WHITE = "WHITE",
    BLACK = "BLACK"
}

export class ChessCoordinate extends Coordinate {
    public letters = ["a", "b", "c", "d", "e", "f", "g", "h"];

    public letterToNumbMapper = this.letters
    .reduce(
        (acc, cur, idx) => {
            acc[cur] = idx + 1 
            return acc;
        }
        ,{});

    public chessX: string;
    public chessCoordinate: string;
    public x: number;
    public y: number;

    constructor(x, y) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.chessX = this.letters[this.x - 1];
        this.chessCoordinate = `${this.chessX}-${y}`;
    }

    // for x I can just use the this.chessX
    // And for y, I can just use this.y.   

    private changeX = (increment = true) => {
        try {
            let xChess = this.chessCoordinate.split("-")[0];
            let xChessNumbToRight = this.letterToNumbMapper[xChess] + (increment ? 0 : -2);
            let res = this.letters[xChessNumbToRight];
            return isValue(res) ? res : null;
        } catch(e) {
            console.log(e);
            return null;
        }
    }

    private changeY = (increment = true) => {
        try {
            let [xChess, yChess] = this.chessCoordinate.split("-");
            let numbYChess = Number(yChess) + (increment ? 1 : -1);
            if (numbYChess < 0 || numbYChess > 8) return null;
            return numbYChess; 
        } 
        catch(e) {
            console.log(e); 
            return null; 
        }
    }

    private formatChessCoordinate = (x, y) => {
        return isValue(x) && isValue(y) ? `${x}-${y}` : null;
    }; 

    public LogCoordinate = () => {
        console.log(this.chessCoordinate);
        return this.chessCoordinate;
    }

    public getLeftCell = () => {
        return this.formatChessCoordinate(this.changeX(false), this.y);
    }

    public getRightCell = () => {
        return this.formatChessCoordinate(this.changeX(), this.y);
    }

    public getForwardCell = () => {
        return this.formatChessCoordinate(this.chessX, this.changeY())
    }

    public getBackwardsCell = () => {
        return this.formatChessCoordinate(this.chessX, this.changeY(false));
    }

    public getForwardsDiagonalRightCell = () => {
        // Need to increment x and y
        return this.formatChessCoordinate(this.changeX(), this.changeY());
    }

    public getForwardsDiagonalLeftCell = () => {
        // Need to increment Y
        // Need to decrement X
        return this.formatChessCoordinate(this.changeX(false), this.changeY());
    }

    public getBackwardsDiagonalRightCell = () => {
        // Need increment X
        // Decrement Y
        return this.formatChessCoordinate(this.changeX(), this.changeY(false));
    }

    public getBackwardsDiagonalLeftCell = () => {
        // Decrement X and Y
        return this.formatChessCoordinate(this.changeX(false), this.changeY(false));
    }
}

export let getCellColor = (x, y): chessCellColor => {
    // Need to revert this later on to: 
    // x % 2 === 1 && y % 2 === 1 || x % 2 === 0 && y % 2 === 0 ? chessCellColor.BLACK : chessCellColor.WHITE;
    return x % 2 === 1 && y % 2 === 1 || x % 2 === 0 && y % 2 === 0 ? chessCellColor.WHITE : chessCellColor.BLACK;
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
