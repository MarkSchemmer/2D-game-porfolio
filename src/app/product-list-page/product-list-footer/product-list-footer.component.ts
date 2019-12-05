import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { setProductCode } from "src/store/actions/productActions";
import { getProductPageState, ProductPageState } from "src/store/reducers/productListReducer";
declare var $: any;

@Component({
  selector: "app-product-list-footer",
  templateUrl: "./product-list-footer.component.html",
  styleUrls: ["../product-list-page.component.scss", "./product-list-footer.component.scss"]
})
export class ProductListFooterComponent implements OnInit {

  isChecked: boolean;

  constructor(private store: Store<ProductPageState>) { }

  ngOnInit() {
    this.store.pipe(select(getProductPageState)).subscribe(
        (productCode: boolean) => this.isChecked = productCode
      );
  }

  checkBoxClicked = (value: boolean) => this.store.dispatch(setProductCode(value));

  handleClick = () => $("#productModal").modal("show");

}
