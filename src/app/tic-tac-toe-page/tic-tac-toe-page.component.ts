import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { R } from "schemas/rType";
import { PlayerType } from "schemas/tic-tac-toe-page/square.schema";
import { ticTacToeEnums, updateGamePhase } from "src/store/actions/ticTacToeActions";
import { GamePhases, TicTacToePageState } from "src/store/reducers/ticTacToePageReducer";
import { getGamePhases } from "src/store/selectors/tictactoeSelectors";
/*
    Play against ai or play against user.

    In order to update updateGamePhase
*/

@Component({
  selector: "app-tic-tac-toe-page",
  templateUrl: "./tic-tac-toe-page.component.html",
  styleUrls: ["./tic-tac-toe-page.component.scss"]
})
export class TicTacToePageComponent implements OnInit {

  gp: GamePhases = null;

  constructor(
    private store: Store<R<TicTacToePageState>>
  ) { }

  ngOnInit() {
    this.store.pipe(select(getGamePhases))
      .subscribe(gamePhase => {
          this.gp = gamePhase;
      });
  }

  playUser = () => {
    this.store.dispatch(updateGamePhase(
      {...this.gp, phaseOne: undefined,
      playAgainstUser: true, startGame: true, ai: undefined },
      ticTacToeEnums.UPDATE_GAMEPHASE
    ));
  }

  playAI = () => {
    this.store.dispatch(updateGamePhase(
      {...this.gp, phaseOne: undefined,
        phaseTwo: undefined, playAgainstUser: false },
      ticTacToeEnums.UPDATE_GAMEPHASE
    ));
  }

  selectX = () => {
    this.store.dispatch(updateGamePhase(
        { ...this.gp, phaseOne: undefined,
        phaseTwo: null, startGame: true, ai: PlayerType.PlayerX },
        ticTacToeEnums.UPDATE_GAMEPHASE
    ));
  }

  selectO = () => {
    this.store.dispatch(updateGamePhase(
      {...this.gp, phaseOne: undefined,
        phaseTwo: null, startGame: true, ai: PlayerType.PlayerY },
      ticTacToeEnums.UPDATE_GAMEPHASE
    ));
  }
}
