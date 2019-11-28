import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ProductListPageComponent } from "./product-list-page/product-list-page.component";
import { StaticFooterComponent } from "./static-footer/static-footer.component";
import { StaticHeaderComponent } from "./static-header/static-header.component";
import { WelcomePageComponent } from "./welcome-page/welcome-page.component";

@NgModule({
  declarations: [
    AppComponent,
    StaticHeaderComponent,
    StaticFooterComponent,
    WelcomePageComponent,
    ProductListPageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
