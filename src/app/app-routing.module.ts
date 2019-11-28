import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductListPageComponent } from "./product-list-page/product-list-page.component";
import { WelcomePageComponent } from "./welcome-page/welcome-page.component";

const routes: Routes = [
  {path: "", component: WelcomePageComponent},
  {path: "product-list-page", component: ProductListPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
