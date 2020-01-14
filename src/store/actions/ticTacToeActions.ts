import { R } from "schemas/rType";
import { PlayerType, Square } from "schemas/tic-tac-toe-page/square.schema";

export enum ticTacToeEnums {
    SET_SQUARE = "SET_SQUARE",
    SET_PLAY_STEP = "SET_PLAY_STEP",
    SET_WINNER = "SET_WINNER"
}

export interface TicTacToeAction<T> {
    readonly type: ticTacToeEnums;
    readonly payload: T;
}

export const setSquare = (value: R<Square[][]>): TicTacToeAction<R<Square[][]>> => ({
    type: ticTacToeEnums.SET_SQUARE,
    payload: value
});

export const setPlayStep = (value: number): TicTacToeAction<number> => ({
    type: ticTacToeEnums.SET_PLAY_STEP,
    payload: value
});

export const setWinner = (value: PlayerType): TicTacToeAction<PlayerType> => ({
    type: ticTacToeEnums.SET_WINNER,
    payload: value
});
