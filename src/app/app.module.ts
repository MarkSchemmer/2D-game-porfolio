import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { productList } from "src/store/reducers/productListReducer";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ProductListPageModule } from "./product-list-page/product-list-page-module.module";
import { StaticFooterComponent } from "./static-footer/static-footer.component";
import { StaticHeaderComponent } from "./static-header/static-header.component";
import { WelcomePageComponent } from "./welcome-page/welcome-page.component";

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
    StoreModule.forRoot({ ProductList: productList }),
    ProductListPageModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
