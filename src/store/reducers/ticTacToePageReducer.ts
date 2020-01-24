import { R } from "schemas/rType";
import { MoveHistory, PlayerType, Square } from "schemas/tic-tac-toe-page/square.schema";
import { deepClone, generateBoard, genGamePhases } from "utils/tic-tac-toe/Utils";
import { TicTacToeAction, ticTacToeEnums } from "../actions/ticTacToeActions";

export interface TicTacToePageState {
    squareList: R<Square[][]>;
    playStep: number;
    winner: PlayerType;
    moveHistory: R<MoveHistory[]>;
    gamePhases: R<GamePhases>;
}

export interface SquaresAndList {
    squareList: R<Square[][]>;
    playStep: number;
    moveHistory: R<MoveHistory[]>;
}

export interface Winner {
    winner: PlayerType;
}

export interface GamePhases {
    startGame: boolean;
    phaseOne: boolean;
    phaseTwo: boolean;
    playAgainstUser: boolean;
    ai: PlayerType;
}

export const gamePhases = (state: R<GamePhases> = genGamePhases(),
                           action: TicTacToeAction<R<GamePhases>>): R<GamePhases> => {
    switch (action.type) {
        case ticTacToeEnums.UPDATE_GAMEPHASE: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

const gameBoardStart = deepClone([ generateBoard() ]);

export const squareList = (state: R<Square[][]> = gameBoardStart,
                           action: TicTacToeAction<R<Square[][]>>): R<Square[][]> => {
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
        case ticTacToeEnums.MAKE_TIE: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

export const moveHistory = (state: R<MoveHistory[]> = [ new MoveHistory(0, null, gameBoardStart) ],
                            action: TicTacToeAction<R<MoveHistory[]>>): R<MoveHistory[]> => {
    switch (action.type) {
        case ticTacToeEnums.SET_MOVE_HISTORY: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

export interface TicTacToePageReducer {
    squareList: (state: R<Square[][]>, action: TicTacToeAction<R<Square[][]>>) => R<Square[][]>;
    playStep: (state: number, action: TicTacToeAction<number>) => number;
    winner: (state: PlayerType, action: TicTacToeAction<PlayerType>) => PlayerType;
    moveHistory: (state: R<MoveHistory[]>, action: TicTacToeAction<R<MoveHistory[]>>) => R<MoveHistory[]>;
    gamePhases: (state: R<GamePhases>, action: TicTacToeAction<R<GamePhases>>) => R<GamePhases>;
}

export const TicTacToeRootReducer: TicTacToePageReducer = {
    squareList,
    playStep,
    winner,
    moveHistory,
    gamePhases
};

// reducer to clear global state:
export const clearState = reducer => (state, action) => {
    // this is for play again
    if (action.type === ticTacToeEnums.CLEAR_STATE) {
        const gp = state.tictactoe.gamePhases;
        state = {
        };
        // tslint:disable-next-line: no-string-literal
        state["tictactoe"] = {};
        // tslint:disable-next-line: no-string-literal
        state.tictactoe["gamePhases"] = gp;
        state.tictactoe.gamePhases = gp;
    }
    // this is for back to menu
    if (action.type === ticTacToeEnums.BACK_TO_MENU) {
        state = {};
    }

    return reducer(state, action);
};
