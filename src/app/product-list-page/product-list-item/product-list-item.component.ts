import { Component, Input, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Product } from "schemas/product-list/product-list-schema";
import { R } from "schemas/rType";
import { setProductList } from "src/store/actions/productActions";
import { getProductListPageState, getProductPageState, ProductPageState } from "src/store/reducers/productListReducer";

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

  showMenu: boolean = false;

  productList: R<Product[]>;

  constructor(private store: Store<ProductPageState>) { }

  ngOnInit() {
    this.store.pipe(select(getProductPageState)).subscribe(
        productCode => this.shouldShow = productCode
    );

    this.store.pipe(select(getProductListPageState)).subscribe(
        products => this.productList = products
    );
  }

  onHoverShow = () => {
    this.showMenu = true;
  }

  onLeave = () => {
    this.showMenu = false;
  }

  handleDeleteClick = () => {
    this.store.dispatch(setProductList(
      this.productList.filter(prod => prod.id !== this.product.id)
    ));
  }

}
