import { Product } from "schemas/product-list/product-list-schema";
import { R } from "schemas/rType";

export enum ProductEnums {
    ADD_PRODUCT = "ADD_PRODUCT",
    DELETE_PRODUCT = "DELETE_PRODUCT",
    SET_PRODUCT_CODE = "SET_PRODUCT_CODE",
    GET_PRODUCT_LIST = "GET_PRODUCT_LIST",
}

export interface ProductAction<T> {
    type: ProductEnums;
    payload: T;
}

export const setProductCode = (value: boolean): ProductAction<boolean> => ({
    type: ProductEnums.SET_PRODUCT_CODE,
    payload: value,
});

export const setProductList = (value: R<Product[]>): ProductAction<R<Product[]>> => ({
    type: ProductEnums.GET_PRODUCT_LIST,
    payload: value,
});
