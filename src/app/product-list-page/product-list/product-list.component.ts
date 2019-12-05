import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Product } from "schemas/product-list/product-list-schema";
import { R } from "schemas/rType";
import { setProductList } from "src/store/actions/productActions";
import { getProductListPageState, ProductPageState } from "src/store/reducers/productListReducer";
import { ProductService } from "../../product-list-page/product.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["../product-list-page.component.scss", "./product-list.component.scss"]
})
export class ProductListComponent implements OnInit {

  products: R<Product[]> = [];

  constructor(private prodService: ProductService, private store: Store<ProductPageState>) { }

  drop(event: CdkDragDrop<Product[]>) {
    const newList: Product[] = [...this.products];
    moveItemInArray(newList, event.previousIndex, event.currentIndex);
    this.store.dispatch(setProductList(newList));
  }

  ngOnInit() {
    const productObservable: Observable<R<Product[]>> = this.prodService.getProducts();

    productObservable.subscribe((productData: R<Product[]>) => {
      this.store.dispatch(setProductList(productData));
    });

    this.store.pipe(select(getProductListPageState)).subscribe(
        (products: R<Product[]>) => this.products = products
    );
  }

}
