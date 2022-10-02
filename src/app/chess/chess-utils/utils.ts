import { Coordinate } from "src/app/common/utils";
import { range } from "utils/Utils"
import { ChessGrid } from "../chessGrid/chessGrid";
declare var $: any;



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

        this.jCanvas.mousedown(e => {
            this.updateMouseCoordinates(e);
        });

        this.jCanvas.mousemove(e => {
            this.updateMouseCoordinates(e);
        });
    }



    updateMouseCoordinates = e => {
        this.x = Math.floor((e.pageX - this.canvas.offsetLeft) / this.res);
        this.y = Math.floor((e.pageY - this.canvas.offsetTop) / this.res);
        // console.log(` Jquery ${this.x} - ${this.y}`);

        try 
        {
            if (this.chessBoard.grid[this.x][this.y]) {
                let chessCell: IChessCell = this.chessBoard.grid[this.x][this.y];
                // chessCell.isAlive = true;
                // this.chessBoard.draw();
            }
        }
        catch(ex) 
        {
            // log and forget.
        }
    }
}

/*
    Pond: 
        url('https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png')
*/

export class Piece {

}

export interface IChessCell {
    cellsColor: string;
    xRange: number;
    yRange: number;
    isAlive: boolean;
    redSquareActivated: boolean;
    coordinate: Coordinate;
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
    public coordinate: Coordinate = null;

    public cellsColor: string = null;

    constructor(x, y) 
    {
      this.coordinate = new Coordinate(x, y);

      this.cellsColor = getCellColor(x, y) === chessCellColor.WHITE ? this.whiteColor : this.blackColor;
      
    }
}

export let genChessBoard = () => {
    return range(1, 8).map(
        x => range(1, 8).map(y => new ChessCell(x, y))
    );
}

enum chessCellColor {
    WHITE = "WHITE",
    BLACK = "BLACK"
}

export let getCellColor = (x, y): chessCellColor => {

    /*
    
        x = ((j % 2 == 1 && input1[1] % 2 == 1) || (input1[1] % 2 == 0 && j % 2 == 0)) ? "black" : "white";

        var input2 = cell2.ToCharArray();
        int k;
        xaxis.TryGetValue(input2[0], out k);

        y = ((k % 2 == 1 && input2[1] % 2 == 1) || (input2[1] % 2 == 0 && k % 2 == 0)) ? "black" : "white";

        return x == y ? true : false;
    
    
    
    
    */

    return x % 2 === 1 && y % 2 === 1 || x % 2 === 0 && y % 2 === 0 ? chessCellColor.BLACK : chessCellColor.WHITE;
}