import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { TicTacToeRootReducer } from "src/store/reducers/ticTacToePageReducer";
import { ticTacToeSelector } from "src/store/selectors/tictactoeSelectors";
import { BoardComponent } from "./board/board.component";
import { SquareComponent } from "./square/square.component";
import { TicTacToePageComponent } from "./tic-tac-toe-page.component";

@NgModule({
  declarations: [
    TicTacToePageComponent,
    BoardComponent,
    SquareComponent,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(ticTacToeSelector, TicTacToeRootReducer)
  ],
  bootstrap: [
    TicTacToePageComponent
  ]
})
export class TicTacToeModule { }
