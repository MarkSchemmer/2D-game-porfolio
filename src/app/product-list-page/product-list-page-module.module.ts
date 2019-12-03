import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ProductListItemComponent } from "./product-list-item/product-list-item.component";
import { ProductListPageComponent } from "./product-list-page.component";
import { ProductListComponent } from "./product-list/product-list.component";

@NgModule({
  declarations: [ ProductListPageComponent, ProductListComponent, ProductListItemComponent ],
  imports: [ CommonModule ]
})
export class ProductListPageModule { }
