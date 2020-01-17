import { R } from "schemas/rType";
import { MoveHistory, PlayerType, Square } from "../../schemas/tic-tac-toe-page/square.schema";
import { isNonEmptyArray, isNullOrUndefined, range } from "../Utils";

interface HasAnybodyWon {
    total: Square[];
    setOfWinningSquares: number[];
}

export const winningSeriesInArray = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

export const createSquare = (item, index): Square => new Square(index);
export const getWinningSquare = (square: Square): boolean => square.isWinningSquare;

export const generateBoard = () => range(1, 9).map(createSquare);

export const isSetAWinner = (arr: Square[]) => arr.every(getWinningSquare);

export const hasAnyBodyWon = (squareArray: R<Square[]>, setsToCheck: number[][] = winningSeriesInArray): HasAnybodyWon => {

    const starter: HasAnybodyWon = {
        total: [],
        setOfWinningSquares: []
    };

    const result: HasAnybodyWon = setsToCheck.reduce(
        (total: HasAnybodyWon, currentItem: number[]) => {
            const setOfSquares = currentItem.map((item: number) => squareArray[item]);

            const hasXWon = setOfSquares.every(sq => sq.playerType === PlayerType.PlayerX);
            const hasYWon = setOfSquares.every(sq => sq.playerType === PlayerType.PlayerY);

            return hasXWon || hasYWon ? { total: [...setOfSquares], setOfWinningSquares: currentItem } : total;
         }, starter);
    return isNonEmptyArray(result.total) ? result : null;
};

export const whichPlayerType = (step: number): PlayerType =>
                step % 2 === 0 ? PlayerType.PlayerX : PlayerType.PlayerY;

export const deepClone = obj => {
    return JSON.parse(JSON.stringify(obj));
};

const allSquaresHaveValue = (board: R<Square[]>): boolean => {
    return board.every(sq => sq.playerType === PlayerType.PlayerX || sq.playerType === PlayerType.PlayerY);
};

export const isTie = (board: R<Square[][]>): boolean => {
    return isNullOrUndefined(hasAnyBodyWon(board[board.length - 1]))
                && allSquaresHaveValue(board[board.length - 1]);
};

export const updateNewMoveHistory = (hist: R<MoveHistory[]>, step: number) => {
    const newHist = hist.map(ob => ({...ob } as MoveHistory) )
    .map(htObj => {
        htObj.currentMove = false;
        return htObj;
    });

    newHist[step].currentMove = true;

    return newHist as R<MoveHistory[]>;
};

/*
    Need to make deepClone that is not using JSON.parse strategy
    Make a curry function using bind()
    Make a pipe function using bind()
    Make a partial curry using bind()

*/
