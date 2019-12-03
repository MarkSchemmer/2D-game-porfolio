import { fakeListData } from "fake-json-data/product-list-page-data";
import { Product } from "schemas/product-list/product-list-schema";
import { R } from "schemas/rType";
import { ProductAction } from "../actions/productActions";

export const productList = (state: R<Product[]> = fakeListData, action: ProductAction): R<Product[]> => {
    switch (action.type) {
        default: {
            return state;
        }
    }
};
