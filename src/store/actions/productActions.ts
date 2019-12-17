import { Store } from "@ngrx/store";
import { Product } from "schemas/product-list/product-list-schema";
import { R } from "schemas/rType";

export enum ProductEnums {
    ADD_PRODUCT = "ADD_PRODUCT",
    DELETE_PRODUCT = "DELETE_PRODUCT",
    SET_PRODUCT_CODE = "SET_PRODUCT_CODE",
    GET_PRODUCT_LIST = "GET_PRODUCT_LIST",
    PRODUCT_TO_EDIT = "PRODUCT_TO_EDIT"
}

export interface ProductAction<T> {
    readonly type: ProductEnums;
    readonly payload: T;
}

export const setProductCode = (value: boolean): ProductAction<boolean> => ({
    type: ProductEnums.SET_PRODUCT_CODE,
    payload: value,
});

export const setProductList = (value: R<Product[]>): ProductAction<R<Product[]>> => ({
    type: ProductEnums.GET_PRODUCT_LIST,
    payload: value,
});

export const setProductToEdit = (value: R<Product>): ProductAction<R<Product>> => ({
    type: ProductEnums.PRODUCT_TO_EDIT,
    payload: value,
});

export const handleEdit = (store: Store<Product>) => {
    return (value: Product) => {
      return store.dispatch(setProductToEdit(value));
    };
};
