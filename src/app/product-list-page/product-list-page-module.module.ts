import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ProductListFooterComponent } from "./product-list-footer/product-list-footer.component";
import { ProductListItemComponent } from "./product-list-item/product-list-item.component";
import { ProductListPageComponent } from "./product-list-page.component";
import { ProductListComponent } from "./product-list/product-list.component";

@NgModule({
  declarations: [ ProductListPageComponent, ProductListComponent, ProductListItemComponent, ProductListFooterComponent ],
  imports: [ CommonModule ],
  bootstrap: [
    ProductListPageComponent
  ]
})
export class ProductListPageModule { }
