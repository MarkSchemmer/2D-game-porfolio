import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { setProductCode } from "src/store/actions/productActions";

/*
  I'm currently able to dispatch an action to reducer successfully each time I click,

  need to wire up the data so I can

*/

@Component({
  selector: "app-product-list-footer",
  templateUrl: "./product-list-footer.component.html",
  styleUrls: ["../product-list-page.component.scss", "./product-list-footer.component.scss"]
})
export class ProductListFooterComponent implements OnInit {

  isChecked: boolean;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.store.pipe(select("products")).subscribe(products => {
      this.isChecked = products.productCode;
    });
  }

  checkBoxClicked = (value: boolean) => this.store.dispatch(setProductCode(value));

}
