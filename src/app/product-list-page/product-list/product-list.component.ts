import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Product } from "schemas/product-list/product-list-schema";
import { R } from "schemas/rType";
import { setProductList } from "src/store/actions/productActions";
import { ProductService } from "../../product-list-page/product.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["../product-list-page.component.scss", "./product-list.component.scss"]
})
export class ProductListComponent implements OnInit {

  products: R<Product[]> = [];

  constructor(private prodService: ProductService, private store: Store<any>) { }

  ngOnInit() {
    const productObservable: Observable<Product[]> = this.prodService.getProducts();

    productObservable.subscribe((productData: Product[]) => {
      this.store.dispatch(setProductList(productData));
    });

    this.store.pipe(select("products")).subscribe(products => {
      this.products = products.productList;
    });
  }

}
