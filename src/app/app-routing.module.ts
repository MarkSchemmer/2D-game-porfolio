import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AsteroidsMainComponent } from "./asteroids/asteroids-main/asteroids-main.component";
import { BoardComponent as ConWaysGameOfLifeBoard } from "./conways-game-of-life/board/board.component";
import { PongBoardComponent } from "./pong/pong-board/pong-board.component";
import { ProductListPageComponent } from "./product-list-page/product-list-page.component";
import { BoardComponent } from "./solitaire-page/board/board.component";
import { TicTacToePageComponent } from "./tic-tac-toe-page/tic-tac-toe-page.component";
import { WelcomePageComponent } from "./welcome-page/welcome-page.component";
import { SnakeComponent } from "./snake/snake-board/snake.component";

const routes: Routes = [
  { path: "", component: WelcomePageComponent },
  { path: "product-list-page", component: ProductListPageComponent },
  { path: "tic-tac-toe", component: TicTacToePageComponent },
  { path: "solitaire", component: BoardComponent },
  { path: "cgol", component: ConWaysGameOfLifeBoard },
  { path: "classic-pong", component: PongBoardComponent },
  { path: "asteroids", component: AsteroidsMainComponent },
  { path: "snake", component: SnakeComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
