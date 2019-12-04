import { Product } from "schemas/product-list/product-list-schema";
import { R } from "schemas/rType";
import { ProductAction, ProductEnums } from "../actions/productActions";

export const productList = (state: R<Product[]> = [], action: ProductAction): R<Product[]> => {
    switch (action.type) {
        case ProductEnums.GET_PRODUCT_LIST: {
            const prodList: R<Product[]> = action.payload as Product[];
            return prodList;
        }
        default: {
            return state;
        }
    }
};

export const productCode = (state: boolean = false, action: ProductAction) => {
    switch (action.type) {
        case ProductEnums.SET_PRODUCT_CODE: {
            return !action.payload;
        }
        default: {
            return state;
        }
    }
};
