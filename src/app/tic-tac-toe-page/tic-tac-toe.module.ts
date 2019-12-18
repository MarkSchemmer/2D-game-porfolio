import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
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
    CommonModule
  ],
  bootstrap: [
    TicTacToePageComponent
  ]
})
export class TicTacToeModule { }
