import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PlayerType, Square } from "schemas/tic-tac-toe-page/square.schema";
import { SquaresAndList, TicTacToePageState, Winner } from "../reducers/ticTacToePageReducer";

export type SquareSelector = SquaresAndList & Winner;

export const ticTacToeSelector: string = "tictactoe";

const getTicTacToeState = createFeatureSelector<TicTacToePageState>(ticTacToeSelector);

export const getSquares = createSelector(
    getTicTacToeState,
    state => state.squareList
);

export const getPlayStep = createSelector(
    getTicTacToeState,
    state => state.playStep
);

export const getWinner = createSelector(
    getTicTacToeState,
    state => state.winner
);

export const getStepAndSquares = createSelector(
    getSquares,
    getPlayStep,
    getWinner,
    (squareList: Square[], playStep: number, winner: PlayerType) => {
        const squareListAndStep: SquareSelector = {
            squareList,
            playStep,
            winner
        };
        return squareListAndStep;
    }
);
