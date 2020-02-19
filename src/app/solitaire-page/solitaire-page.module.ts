import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BoardComponent } from "./board/board.component";
import { CardComponent } from "./card/card.component";

@NgModule({
  declarations: [ BoardComponent, CardComponent ],
  imports: [ BrowserModule ]
})
export class SolitairePageModule { }
