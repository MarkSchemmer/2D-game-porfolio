import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SnakeComponent } from "./snake-board/snake.component";

@NgModule({
  declarations: [SnakeComponent],
  imports: [
    CommonModule
  ]
})
export class SnakeModule { }