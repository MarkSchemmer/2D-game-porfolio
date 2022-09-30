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
        console.log(` Jquery ${this.x} - ${this.y}`);

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

export interface IChessCell {
    xRange: number
    yRange: number
    isAlive: boolean
}

export class ChessCell implements IChessCell {
    public xRange: number;
    public yRange: number;
    public isAlive: boolean = false;
    constructor() { }
}

export class Piece {

}

export let genChessBoard = () => {
    return range(1, 8).map(
        () => range(1, 8).map(() => new ChessCell())
    );
}