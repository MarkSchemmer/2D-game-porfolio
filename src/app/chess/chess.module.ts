import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ChessBoardComponent } from "./chess-board/chess-board.component";

@NgModule({
  declarations: [ChessBoardComponent],
  imports: [
    CommonModule
  ]
})
export class ChessModule { }