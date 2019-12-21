import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Square } from "schemas/tic-tac-toe-page/square.schema";
import { SquaresAndList, TicTacToePageState } from "../reducers/ticTacToePageReducer";

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

export const getStepAndSquares = createSelector(
    getSquares,
    getPlayStep,
    (squareList: Square[], playStep: number) => {
        const squareListAndStep: SquaresAndList = {
            squareList,
            playStep
        };
        return squareListAndStep;
    }
);
