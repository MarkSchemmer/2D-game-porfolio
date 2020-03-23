import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "src/environments/environment";
import { clearState } from "src/store/reducers/ticTacToePageReducer";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ConwaysGameOfLifeModule } from "./conways-game-of-life/conways-game-of-life.module";
import { PongModule } from "./pong/pong.module";
import { ProductListPageModule } from "./product-list-page/product-list-page-module.module";
import { SolitairePageModule } from "./solitaire-page/solitaire-page.module";
import { StaticFooterComponent } from "./static-footer/static-footer.component";
import { StaticHeaderComponent } from "./static-header/static-header.component";
import { TicTacToeModule } from "./tic-tac-toe-page/tic-tac-toe.module";
import { WelcomePageComponent } from "./welcome-page/welcome-page.component";

@NgModule({
  declarations: [
    AppComponent,
    StaticHeaderComponent,
    StaticFooterComponent,
    WelcomePageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    StoreModule.forRoot( {}, { metaReducers: [clearState] }),
    StoreDevtoolsModule.instrument({
      name: "acme multi purpose project",
      maxAge: 25,
      logOnly: environment.production,
    }),
    ProductListPageModule,
    TicTacToeModule,
    SolitairePageModule,
    BrowserAnimationsModule,
    ConwaysGameOfLifeModule,
    PongModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
