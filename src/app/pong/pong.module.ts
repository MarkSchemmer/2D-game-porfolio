import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PongBoardComponent } from "./pong-board/pong-board.component";

@NgModule({
  declarations: [PongBoardComponent],
  imports: [
    CommonModule
  ]
})
export class PongModule { }
