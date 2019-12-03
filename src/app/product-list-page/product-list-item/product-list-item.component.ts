import { Component, Input, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Product } from "schemas/product-list/product-list-schema";

@Component({
  selector: "app-product-list-item",
  templateUrl: "./product-list-item.component.html",
  styleUrls: [
              "../product-list-page.component.scss",
              "./product-list-item.component.scss"
        ]
})
export class ProductListItemComponent implements OnInit {

  @Input() product: Product;

  shouldShow: boolean;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.store.pipe(select("products")).subscribe(products => {
      this.shouldShow = products.productCode;
    });
  }

}
