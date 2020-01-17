import { R } from "schemas/rType";
import { MoveHistory, PlayerType, Square } from "schemas/tic-tac-toe-page/square.schema";

export enum ticTacToeEnums {
    SET_SQUARE = "SET_SQUARE",
    SET_PLAY_STEP = "SET_PLAY_STEP",
    SET_WINNER = "SET_WINNER",
    SET_MOVE_HISTORY = "SET_MOVE_HISTORY",
    CLEAR_STATE = "CLEAR_STATE",
    MAKE_TIE = "MAKE_TIE"
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

export const setMoveHistory = (value: R<MoveHistory[]>): TicTacToeAction<R<MoveHistory[]>> => ({
    type: ticTacToeEnums.SET_MOVE_HISTORY,
    payload: value
});

export const clearGlobalState = () => ({
    type: ticTacToeEnums.CLEAR_STATE,
    payload: null
});

export const genericDispatch = (value: R<any>, type: ticTacToeEnums): TicTacToeAction<R<any>> => ({
    type,
    payload: value
});
