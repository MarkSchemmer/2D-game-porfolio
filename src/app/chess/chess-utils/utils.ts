import { Coordinate } from "src/app/common/utils";
import { isValue, range } from "utils/Utils"
import { ChessGrid } from "../chessGrid/chessGrid";
import { ChessPieceFactory, IPiece, Piece, PieceColor, PieceName, WhitePond } from "./Piece";

export let letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
export let numbers = range(1, 8);
export const chessPieceFactory = new ChessPieceFactory();

let a1Tog8 = letters.map(l => l+"-1");
let a1Toa8 = numbers.map(n => "a-"+n);

class PieceDirectionSetup {

    pieceColor: PieceColor;
    pieceName: PieceName;
    pieceLocations: string[]

    constructor(pieceColor: PieceColor, pieceName: PieceName, pieceLocations: string[]){
        this.pieceColor = pieceColor;
        this.pieceName = pieceName;
        this.pieceLocations = pieceLocations;
    }
}

let pieceName: PieceName[] = [
    PieceName.POND,
    PieceName.BISHOP,
    PieceName.KNIGHT,
    PieceName.ROOK,
    PieceName.QUEEN,
    PieceName.KING
];

let genWhitePiecesSetup = () => {
    let whitePondLocations = letters.map(letter => (letter + 2).toString())
    let whitePonds = new PieceDirectionSetup(PieceColor.WHITE, PieceName.POND, whitePondLocations);

    let whiteRookLocations = ["a", "h"].map(letter => (letter + 1).toString());
    let whiteRooks = new PieceDirectionSetup(PieceColor.WHITE, PieceName.ROOK, whiteRookLocations);

    let whiteBishopLocations = ["c", "f"].map(letter => (letter + 1).toString());
    let whiteBishops = new PieceDirectionSetup(PieceColor.WHITE, PieceName.BISHOP, whiteBishopLocations);

    let whiteKnightLocations = ["b", "g"].map(letter => (letter + 1).toString());
    let whiteKnights = new PieceDirectionSetup(PieceColor.WHITE, PieceName.KNIGHT, whiteKnightLocations);

    return [
        whitePonds,
        whiteRooks,
        whiteBishops,
        whiteKnights,
        new PieceDirectionSetup(PieceColor.WHITE, PieceName.QUEEN, ["d1"]),
        new PieceDirectionSetup(PieceColor.WHITE, PieceName.KING, ["e1"]),
    ];
}

let genBlackPiecesSetup = () => {
    let blackPondLocations = letters.map(letter => (letter + 7).toString())
    let blackPonds = new PieceDirectionSetup(PieceColor.BLACK, PieceName.POND, blackPondLocations);

    let blackRookLocations = ["a", "h"].map(letter => (letter + 8).toString());
    let blackRooks = new PieceDirectionSetup(PieceColor.BLACK, PieceName.ROOK, blackRookLocations);

    let blackBishopLocations = ["c", "f"].map(letter => (letter + 8).toString());
    let blackBishops = new PieceDirectionSetup(PieceColor.BLACK, PieceName.BISHOP, blackBishopLocations);

    let blackKnightLocations = ["b", "g"].map(letter => (letter + 8).toString());
    let blackKnights = new PieceDirectionSetup(PieceColor.BLACK, PieceName.KNIGHT, blackKnightLocations);

    return [
        blackPonds,
        blackRooks,
        blackBishops,
        blackKnights,
        new PieceDirectionSetup(PieceColor.BLACK, PieceName.QUEEN, ["d8"]),
        new PieceDirectionSetup(PieceColor.BLACK, PieceName.KING, ["e8"]),
    ];
}

let listDirections : PieceDirectionSetup[] = [
    ...genWhitePiecesSetup(),
    ...genBlackPiecesSetup()
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

    setRowCol = (row, col) => {
        this.row = row;
        this.col = col;
    }

    constructor(x, y) 
    {
      this.coordinate = new ChessCoordinate(x, y);
      this.cellsColor = getCellColor(x, y) === chessCellColor.WHITE ? this.whiteColor : this.blackColor;
    }
}

export let genChessBoard = () => {
    // xIndex row
    // yIndex col
    let board =  range(1, 8).map((x, xIndex) => {
        let chessCell: ChessCell = null;
        let indexes = range(1, 8).map((y, yIndex) => {
            chessCell = new ChessCell(x, y);
            chessCell.setRowCol(xIndex, yIndex);
            if (x === 1) { chessCell.letterText = (yIndex + 1).toString(); }
            return chessCell;
        });
        indexes.reverse();
        return indexes;
    });

    board.forEach((line, idx) => line[line.length - 1].numberText = letters[idx])

    let pieceSetter = setChessPieces(board, chessPieceFactory);

    // Place white pieces
    listDirections.forEach(directions => {
        pieceSetter(directions);
    });

    return board;
}

export let connectBoard = (pieceMap) => {
    // console.log(pieceMap);
    // console.log(a1Toa8);
    a1Tog8.forEach((chessCoordiante, idx, arr) => {
        try {
            let currentCell: ChessCell = pieceMap[chessCoordiante];
            // console.log(currentCell);
            let previousCell: ChessCell = pieceMap[arr[idx - 1]];
            let nextCell: ChessCell = pieceMap[arr[idx + 1]];
    
            currentCell.chessMovementPatterns.Left = previousCell;
            currentCell.chessMovementPatterns.Right = nextCell;
    
            if (isValue(previousCell)) {
                previousCell.chessMovementPatterns.Right = currentCell;
            }
    
            if (isValue(nextCell)) {
                nextCell.chessMovementPatterns.Left = currentCell;
            }
        } catch(e) { console.log(e); }

    });

    a1Toa8.forEach((chessCoordinate, idx, arr) => {
        try {
            let currentCell: ChessCell = pieceMap[chessCoordinate];
            // console.log(currentCell);
            let previousCell: ChessCell = pieceMap[arr[idx - 1]];
            let nextCell: ChessCell = pieceMap[arr[idx + 1]];
    
            currentCell.chessMovementPatterns.Backwards = previousCell;
            currentCell.chessMovementPatterns.Forward = nextCell;
    
            if (isValue(previousCell)) {
                previousCell.chessMovementPatterns.Forward = currentCell;
            }
    
            if (isValue(nextCell)) {
                nextCell.chessMovementPatterns.Backwards  = currentCell;
            }
        } catch(e) { console.log(e); }
    });
} 



let setChessPieces = (board, chessPieceFactory) => (directions: PieceDirectionSetup) => {
    directions.pieceLocations.forEach(location => {
        let chessCell = getCell(location, board);
        if (chessCell != null) {
            chessCell.piece = chessPieceFactory.PieceGenerator(directions.pieceName, directions.pieceColor);
        }
    });
}

enum chessCellColor {
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
            let xChessNumbToRight = this.letterToNumbMapper[xChess] + (increment ? 1 : -1);
            return this.letters[xChessNumbToRight];

        } catch(e) {
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
        catch(e) { return null; }
    }

    private formatChessCoordinate = (x, y) => `${x}-${y}`; 

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
