import { Component, Input, OnInit } from "@angular/core";
import { Product } from "schemas/product-list/product-list-schema";

@Component({
  selector: "app-product-list-item",
  templateUrl: "./product-list-item.component.html",
  styleUrls: ["./product-list-item.component.scss"]
})
export class ProductListItemComponent implements OnInit {

  @Input() product: Product;

  constructor() { }

  ngOnInit() {
  }

}
