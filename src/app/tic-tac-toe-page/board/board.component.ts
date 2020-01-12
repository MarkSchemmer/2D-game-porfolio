import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { R } from "schemas/rType";
import { PlayerType, Square } from "schemas/tic-tac-toe-page/square.schema";
import { setPlayStep, setSquare, setWinner } from "src/store/actions/ticTacToeActions";
import { TicTacToePageState } from "src/store/reducers/ticTacToePageReducer";
import { getStepAndSquares, SquareSelector } from "src/store/selectors/tictactoeSelectors";
import { generateBoard, hasAnyBodyWon, whichPlayerType } from "utils/tic-tac-toe/Utils";
import { isValue } from "utils/Utils";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"]
})
export class BoardComponent implements OnInit {

  squares: R<Square[]> = [];
  playStep: number = null;
  winner: PlayerType = null;

  constructor(
    private store: Store<R<TicTacToePageState>>
  ) { }

  ngOnInit() {
    this.store.pipe(select(getStepAndSquares)).subscribe(
      (response: SquareSelector) => (
                            this.squares = response.squareList,
                            this.playStep = response.playStep,
                            this.winner = response.winner
                          ));
  }

  handleSquareClick = (square: Square) => {

    if (isValue(square.playerType) || isValue(this.winner)) { return; }

    this.store.dispatch(
      setSquare(
        this.squares.map((sq: Square) => {
          return sq.id === square.id ?
          (sq.playerType = whichPlayerType(this.playStep), sq)
          : sq;
        })
      )
    );

    this.store.dispatch(setPlayStep(this.playStep + 1));

    const anyBodyWon = hasAnyBodyWon(this.squares);

    if (anyBodyWon) {
      const { total, setOfWinningSquares } = anyBodyWon;

      this.store.dispatch(
        setSquare(
          this.squares.map((sq: Square, idx: number) => {
            return setOfWinningSquares.includes(idx) ?
            (sq.isWinningSquare = true, sq) : sq;
          })
        )
      );

      this.store.dispatch(setWinner(total[0].playerType));
    }

  }

  playAgain = () => {
    this.store.dispatch(setSquare(generateBoard()));
    this.store.dispatch(setWinner(null));
    this.store.dispatch(setPlayStep(0));
  }
}
