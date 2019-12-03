import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "schemas/product-list/product-list-schema";
import { ProductService } from "../../product-list-page/product.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["../product-list-page.component.scss", "./product-list.component.scss"]
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  constructor(private prodService: ProductService) { }

  ngOnInit() {
    const productObservable: Observable<Product[]> = this.prodService.getProducts();

    productObservable.subscribe((productData: Product[]) => {
      this.products = productData;
    });
  }

}
