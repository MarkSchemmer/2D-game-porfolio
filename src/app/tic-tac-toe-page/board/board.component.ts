import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { R } from "schemas/rType";
import { MoveHistory, PlayerType, Square } from "schemas/tic-tac-toe-page/square.schema";
import { clearGlobalState, setMoveHistory, setPlayStep, setSquare, setWinner } from "src/store/actions/ticTacToeActions";
import { TicTacToePageState } from "src/store/reducers/ticTacToePageReducer";
import { getStepAndSquares, SquareSelector } from "src/store/selectors/tictactoeSelectors";
import { hasAnyBodyWon, whichPlayerType } from "utils/tic-tac-toe/Utils";
import { isValue } from "utils/Utils";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit {

  board: R<Square[][]> = null;
  squares: R<Square[]> = [];
  playStep: number = null;
  winner: PlayerType = null;
  moveHistory: R<MoveHistory[]> = [];

  constructor(
    private store: Store<R<TicTacToePageState>>
  ) { }

  ngOnInit() {
    this.store.pipe(select(getStepAndSquares))
    .subscribe(
      (response: SquareSelector) => (
          this.board = response.squareList,
          this.playStep = response.playStep,
          this.winner = response.winner,
          this.squares = response.squareList[this.playStep],
          this.moveHistory = response.moveHistory
    ));
  }

  handleSquareClick = (square: Square) => {

    if (isValue(square.playerType) || isValue(this.winner)) { return; }

    let copyOfBoard = this.board.slice(0, this.playStep + 1);
    const newBoard = copyOfBoard[this.playStep].map((sq: Square) => {
      return sq.id === square.id ?
      (sq.playerType = whichPlayerType(this.playStep), sq)
      : sq;
    });
    copyOfBoard = [ ...copyOfBoard, newBoard ];

    this.store.dispatch( setSquare( copyOfBoard ) );

    this.store.dispatch(setPlayStep(this.playStep + 1));

    const anyBodyWon = hasAnyBodyWon(newBoard);

    this.store.dispatch(setMoveHistory(
        [ ...this.moveHistory, new MoveHistory(this.playStep, square.coordinateIndex) ]
    ));

    if (anyBodyWon) {

      const { total, setOfWinningSquares } = anyBodyWon;

      const highlightWinningBoard =  copyOfBoard[this.playStep].map((sq: Square, idx: number) => {
        return setOfWinningSquares.includes(idx) ?
        (sq.isWinningSquare = true, sq) : sq;
      });

      this.store.dispatch(
        setSquare( [ ...copyOfBoard, highlightWinningBoard ] )
      );

      this.store.dispatch(setWinner(total[0].playerType));
    }
  }

  playAgain = () => {
    // this.store.dispatch( setSquare( [ generateBoard() ] ) );
    // this.store.dispatch(setWinner(null));
    // this.store.dispatch(setPlayStep(0));
    this.store.dispatch(clearGlobalState());
  }
}
