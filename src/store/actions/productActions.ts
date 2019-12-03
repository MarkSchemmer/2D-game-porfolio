
export enum ProductEnums {
    ADD_PRODUCT = "ADD_PRODUCT",
    DELETE_PRODUCT = "DELETE_PRODUCT"
}

export interface ProductAction {
    type: ProductEnums;
    payload: unknown;
}
