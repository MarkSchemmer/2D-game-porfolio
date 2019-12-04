import { Product } from "schemas/product-list/product-list-schema";

export enum ProductEnums {
    ADD_PRODUCT = "ADD_PRODUCT",
    DELETE_PRODUCT = "DELETE_PRODUCT",
    SET_PRODUCT_CODE = "SET_PRODUCT_CODE",
    GET_PRODUCT_LIST = "GET_PRODUCT_LIST",
}

export interface ProductAction {
    type: ProductEnums;
    payload: unknown;
}

export const setProductCode = (value: boolean): ProductAction => ({
    type: ProductEnums.SET_PRODUCT_CODE,
    payload: value,
});

export const setProductList = (value: Product[]): ProductAction => ({
    type: ProductEnums.GET_PRODUCT_LIST,
    payload: value,
});
