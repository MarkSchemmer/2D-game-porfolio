import { PlayerType, Square } from "../../../schemas/tic-tac-toe-page/square.schema";
import { createSquare, generateBoard, hasAnyBodyWon, isSetAWinner } from "../../../utils/tic-tac-toe/Utils";
import { range } from "../../../utils/Utils";

describe("First dummy test", () => {
    it("true === true ?", () => {
        expect(true).toBe(true);
    });

    it("Is set a winner", () => {
        const dummyWinningSet = generateSmallSquareSet();
        expect(isSetAWinner(dummyWinningSet)).toBe(true);
    });

    it("Is set a not a winner", () => {
        const dummyWinningSet = generateSmallSquareSet();
        dummyWinningSet[0].isWinningSquare = false;
        expect(isSetAWinner(dummyWinningSet)).toBe(false);
    });

    it("Generating board does it have the right length and right type", () => {
        const board = generateBoard();
        expect(board.length).toBe(9);
        board.forEach(item => {
            expect(item instanceof Square).toBe(true);
            expect(item.isWinningSquare).toBe(false);
            expect(item.playerType).toBe(null);
        });
    });

    it("hasAnyBodyWon function does it work?", () => {
        const board = generateBoardWithWinningSet();
        expect(hasAnyBodyWon(board)).toBeTruthy();
    });
});

const setSquareWithWinningSquareAndIsX = (square: Square): Square => ({
    ...square,
    isWinningSquare: true,
    playerType: PlayerType.PlayerX
});

const generateSmallSquareSet = () => range(1, 3).map(() => setSquareWithWinningSquareAndIsX(createSquare()));

const generateBoardWithWinningSet = () => {
    const board = generateBoard();
    const [a, b, c] = generateSmallSquareSet();

    return [ a, b, c, ...board.slice(3) ];
};
