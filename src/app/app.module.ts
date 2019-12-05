import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "src/environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ProductListPageModule } from "./product-list-page/product-list-page-module.module";
import { StaticFooterComponent } from "./static-footer/static-footer.component";
import { StaticHeaderComponent } from "./static-header/static-header.component";
import { WelcomePageComponent } from "./welcome-page/welcome-page.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    StaticHeaderComponent,
    StaticFooterComponent,
    WelcomePageComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    StoreModule.forRoot({  }),
    StoreDevtoolsModule.instrument({
      name: "acme multi purpose project",
      maxAge: 25,
      logOnly: environment.production,
    }),
    ProductListPageModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
