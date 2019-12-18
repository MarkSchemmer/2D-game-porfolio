import { Square } from "schemas/tic-tac-toe-page/square.schema";
import { isNonEmptyArray, range } from "utils/Utils";

const winningSeriesInArray = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const createSquare = (): Square => new Square();
const getWinningSquare = (square: Square): boolean => square.isWinningSquare;

export const generateBoard = () => range(1, 9).map(createSquare);

export const isSetAWinner = (arr: Square[]) => arr.every(getWinningSquare);

export const hasAnyBodyWon = (squareArray: Square[], setsToCheck: number[][] = winningSeriesInArray): Square[] => {
    const result: Square[] = setsToCheck.reduce(
        (total: Square[], currentItem: number[]) => {
            const setOfSquares = currentItem.map((item: number) => squareArray[item]);
            const hasWinner = isSetAWinner(setOfSquares);
            return hasWinner ? [ ...setOfSquares ] : total;
         }, []);
    return isNonEmptyArray(result) ? result : null;
};
