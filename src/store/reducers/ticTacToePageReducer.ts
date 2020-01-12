import { R } from "schemas/rType";
import { PlayerType, Square } from "schemas/tic-tac-toe-page/square.schema";
import { generateBoard } from "utils/tic-tac-toe/Utils";
import { TicTacToeAction, ticTacToeEnums } from "../actions/ticTacToeActions";

export interface TicTacToePageState {
    squareList: R<Square[]>;
    playStep: number;
    winner: PlayerType;
}

export interface SquaresAndList {
    squareList: R<Square[]>;
    playStep: number;
}

export interface Winner {
    winner: PlayerType;
}

export const squareList = (state: R<Square[]> = generateBoard(), action: TicTacToeAction<R<Square[]>>): R<Square[]> => {
    switch (action.type) {
        case ticTacToeEnums.SET_SQUARE: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

export const playStep = (state: number = 0, action: TicTacToeAction<number>): number => {
    switch (action.type) {
        case ticTacToeEnums.SET_PLAY_STEP: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

export const winner = (state: PlayerType = null, action: TicTacToeAction<PlayerType>): PlayerType => {
    switch (action.type) {
        case ticTacToeEnums.SET_WINNER: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

export interface TicTacToePageReducer {
    squareList: (state: R<Square[]>, action: TicTacToeAction<R<Square[]>>) => R<Square[]>;
    playStep: (state: number, action: TicTacToeAction<number>) => number;
    winner: (state: PlayerType, action: TicTacToeAction<PlayerType>) => PlayerType;
}

export const TicTacToeRootReducer: TicTacToePageReducer = {
    squareList,
    playStep,
    winner
};
