import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Product, ProductPreparation } from "schemas/product-list/product-list-schema";
import { R } from "schemas/rType";
import { setProductList } from "src/store/actions/productActions";
import { getProductListPageState, ProductPageState } from "src/store/reducers/productListReducer";
import { generateProductWithNameAndImageUrl, hideProductModal } from "utils/Utils";

@Component({
  selector: "app-add-product-form",
  templateUrl: "./add-product-form.component.html",
  styleUrls: ["../product-list-page.component.scss", "./add-product-form.component.scss", ]
})
export class AddProductFormComponent implements OnInit {

  productPreparation: ProductPreparation;
  prodList: R<Product[]>;

  generateProductPrep = (): ProductPreparation => {
    const productPreparation: ProductPreparation = {
          name: "",
          imageUrl: ""
    };

    return productPreparation;
  }

  resetProductPreparation = () => this.productPreparation = this.generateProductPrep();

  closeModal = () => hideProductModal();

  handleSubmit = () => {
    const { name, imageUrl } = this.productPreparation;
    const genProduct: R<Product> = generateProductWithNameAndImageUrl(name, imageUrl);
    // Need to update store, and then reset value then close modal
    // Need to add a value for pollyfill for jquery $ then update code using it...
    // create method closing modal here in this class
    this.store.dispatch(
      setProductList( [ ...this.prodList, genProduct ] )
    );
    this.closeModal();
    this.resetProductPreparation();
  }

  handleClose = () => {
    this.closeModal();
    this.resetProductPreparation();
  }

  constructor(
    private store: Store<ProductPageState>
  ) { }

  ngOnInit() {
    this.productPreparation = this.generateProductPrep();

    // select product list
    this.store.pipe(select(getProductListPageState)).subscribe(
      products => this.prodList = products,
    );
  }
}
