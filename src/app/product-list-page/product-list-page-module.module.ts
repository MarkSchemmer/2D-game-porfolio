import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { ProductPageRootReducer, ProductPageStateReducer, productsSelector } from "src/store/reducers/productListReducer";
import { AddProductFormComponent } from "./add-product-form/add-product-form.component";
import { ProductListEditFormComponent } from "./product-list-edit-form/product-list-edit-form.component";
import { ProductListFooterComponent } from "./product-list-footer/product-list-footer.component";
import { ProductListItemComponent } from "./product-list-item/product-list-item.component";
import { ProductListPageComponent } from "./product-list-page.component";
import { ProductListComponent } from "./product-list/product-list.component";

type rootReducer = ProductPageStateReducer;

const featureReducer: rootReducer = {
  ...ProductPageRootReducer
};

@NgModule({
  declarations: [
      ProductListPageComponent,
      ProductListComponent,
      ProductListItemComponent,
      ProductListFooterComponent,
      AddProductFormComponent,
      ProductListEditFormComponent
  ],
  imports: [ CommonModule, StoreModule.forFeature(productsSelector, featureReducer), FormsModule, DragDropModule ],
  bootstrap: [
    ProductListPageComponent
  ]
})
export class ProductListPageModule { }
