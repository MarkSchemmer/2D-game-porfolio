
export enum ProductEnums {
    ADD_PRODUCT = "ADD_PRODUCT",
    DELETE_PRODUCT = "DELETE_PRODUCT",
    SET_PRODUCT_CODE = "SET_PRODUCT_CODE",
}

export interface ProductAction {
    type: ProductEnums;
    payload: unknown;
}

export const setProductCode = (value: boolean): ProductAction => ({
    type: ProductEnums.SET_PRODUCT_CODE,
    payload: value,
});
