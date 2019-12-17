import { Component, NgZone, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Product } from "schemas/product-list/product-list-schema";
import { R } from "schemas/rType";
import { handleEdit, setProductList } from "src/store/actions/productActions";
import { getProductAndProductList, ProductAndList } from "src/store/reducers/productListReducer";
import { filterListById, isValue, updateItemInList } from "utils/Utils";

@Component({
  selector: "app-product-list-edit-form",
  templateUrl: "./product-list-edit-form.component.html",
  styleUrls: [
               "../product-list-page.component.scss",
               "./product-list-edit-form.component.scss"
  ]
})
export class ProductListEditFormComponent implements OnInit {

  product: Product = null;

  productList: R<Product[]> = null;

  constructor(
    private store: Store<Product>,
    private ngZone: NgZone,
    ) { }

  ngOnInit() {
    this.store.pipe(
      select(getProductAndProductList)
    ).subscribe(
        (productAndList: ProductAndList) =>  {
          this.ngZone.run(() => {
            const { product, productList } = productAndList;
            this.product = { ...product };
            this.productList = productList;
          });
        }
      );

    console.log(this.product);

    console.log(this.isValidProduct());
  }

  isValidProduct = () => isValue(this.product) && isValue(this.product.id);

  edit = () => {
    this.store.dispatch(
      setProductList(updateItemInList(this.product, this.productList))
    );
    this.cancel();
  }

  cancel = () => {
        handleEdit(this.store)(null);
  }

  delete = () => {
    this.store.dispatch(
        setProductList(filterListById(this.product.id, this.productList))
    );
    this.cancel();
  }
}
