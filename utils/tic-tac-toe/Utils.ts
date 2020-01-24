import { R } from "schemas/rType";
import { GamePhases } from "src/store/reducers/ticTacToePageReducer";
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

export const genGamePhases = (): GamePhases => ({
    startGame: null,
    phaseOne: null,
    phaseTwo: null,
    playAgainstUser: null,
    ai: null
});

export const createSquare = (item, index): Square => new Square(index);
export const getWinningSquare = (square: Square): boolean => square.isWinningSquare;

export const generateBoard = () => range(1, 9).map(createSquare);

export const isSetAWinner = (arr: Square[]) => arr.every(getWinningSquare);

export const ai = "X" as PlayerType;
export const human = "O" as PlayerType;

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

export const whichPlayerType = (fn, step: number): PlayerType =>
                fn(step) ? PlayerType.PlayerX : PlayerType.PlayerY;

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

export const thunk = (fn, ...args) => {
    return () => fn(...args);
};

export const convertBoard = (board: Square[]): Square[][] => {
    return [
        [ board[0], board[1], board[2] ],
        [ board[3], board[4], board[5] ],
        [ board[6], board[7], board[8] ]
    ];
};

export const flattenBoard = (board: Square[][]): Square[] => {
    return board.reduce((acc, cur) => acc.concat(cur), []);
};

export const PlayerTypeWinners = {
    X: 1,
    O: -1,
    "Tie Game": 0
};

export const PlayerTypeWinnersOthers = {
    X: -1,
    O: 1,
    "Tie Game": 0
};

const miniMaxHasAnybodyWon = (squareArray: R<Square[]>, setsToCheck: number[][] = winningSeriesInArray) => {
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

    return isNonEmptyArray(result.total) ? result.total[0].playerType : miniMaxIsTie(squareArray) ? PlayerType.Tie : null;
};

export const miniMaxIsTie = (board: R<Square[]>): boolean => {
    return isNullOrUndefined(hasAnyBodyWon(board))
                && allSquaresHaveValue(board);
};

export const miniMax = (board: Square[], depth, isMaximizing) => {
    const result = miniMaxHasAnybodyWon(board);
    // console.log(result);
    if (result !== null) {
        return PlayerTypeWinners[result];
    }

    if (isMaximizing) {
        let bestScore: any = -Infinity;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < board.length; i++) {
            if (isNullOrUndefined(board[i].playerType)) {
                board[i].playerType = ai;
                // tslint:disable-next-line: prefer-const
                let score = miniMax(board, depth + 1, false);
                board[i].playerType = null;

                bestScore = Math.max(score, bestScore);
            }
        }

        return bestScore;
    } else {
        let bestScore: any = Infinity;

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < board.length; i++) {
            if (isNullOrUndefined(board[i].playerType)) {
                board[i].playerType = human;
                // tslint:disable-next-line: prefer-const
                let score = miniMax(board, depth + 1, true);
                board[i].playerType = null;

                bestScore = Math.min(score, bestScore);
            }
        }

        return bestScore;
    }
};

// Need to setup a way to score for O

export const miniMaxOther = (board: Square[], depth, isMaximizing) => {
    // console.log("miniMaxOther...");
    const result = miniMaxHasAnybodyWon(board);
    // console.log(result);
    if (result !== null) {
        return PlayerTypeWinnersOthers[result];
    }

    if (isMaximizing) {
        let bestScore: any = -Infinity;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < board.length; i++) {
            if (isNullOrUndefined(board[i].playerType)) {
                board[i].playerType = human;
                // tslint:disable-next-line: prefer-const
                let score = miniMaxOther(board, depth + 1, false);
                board[i].playerType = null;

                bestScore = Math.max(score, bestScore);
            }
        }

        return bestScore;
    } else {
        let bestScore: any = Infinity;

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < board.length; i++) {
            if (isNullOrUndefined(board[i].playerType)) {
                board[i].playerType = ai;
                // tslint:disable-next-line: prefer-const
                let score = miniMaxOther(board, depth + 1, true);
                board[i].playerType = null;

                bestScore = Math.min(score, bestScore);
            }
        }

        return bestScore;
    }
};
