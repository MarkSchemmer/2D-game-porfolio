import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { productCode, productList, productsSelector } from "src/store/reducers/productListReducer";
import { AddProductFormComponent } from "./add-product-form/add-product-form.component";
import { ProductListFooterComponent } from "./product-list-footer/product-list-footer.component";
import { ProductListItemComponent } from "./product-list-item/product-list-item.component";
import { ProductListPageComponent } from "./product-list-page.component";
import { ProductListComponent } from "./product-list/product-list.component";

const featureReducer = {
  productCode,
  productList,
};

@NgModule({
  declarations: [
      ProductListPageComponent,
      ProductListComponent,
      ProductListItemComponent,
      ProductListFooterComponent,
      AddProductFormComponent
  ],
  imports: [ CommonModule, StoreModule.forFeature(productsSelector, featureReducer) ],
  bootstrap: [
    ProductListPageComponent
  ]
})
export class ProductListPageModule { }
