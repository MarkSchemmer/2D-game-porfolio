import { fakeListData } from "fake-json-data/product-list-page-data";
import { Product } from "schemas/product-list/product-list-schema";
import { R } from "schemas/rType";
import { ProductAction, ProductEnums } from "../actions/productActions";

export const productList = (state: R<Product[]> = fakeListData, action: ProductAction): R<Product[]> => {
    switch (action.type) {
        default: {
            return state;
        }
    }
};

export const productCode = (state: boolean = false, action: ProductAction) => {
    switch (action.type) {
        case ProductEnums.SET_PRODUCT_CODE: {
            console.log("Hello from reducer in product code;");
            return !action.payload;
        }
        default: {
            return state;
        }
    }
};
