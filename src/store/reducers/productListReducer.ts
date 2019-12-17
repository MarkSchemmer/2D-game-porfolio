import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Product } from "schemas/product-list/product-list-schema";
import { R } from "schemas/rType";
import { ProductAction, ProductEnums } from "../actions/productActions";

export const productsSelector: string = "products";

// Main state interface for ProductPage
export interface ProductPageState {
    productList: R<Product[]>;
    productCode: boolean;
    productToEdit: R<Product>;
}

export interface ProductAndList {
    product: R<Product>;
    productList: R<Product[]>;
}

export interface ProductPageStateReducer {
    productList: (state: R<Product[]>, action: ProductAction<R<Product[]>>) => R<Product[]>;
    productCode: (state: boolean, action: ProductAction<boolean>) => boolean;
    productToEdit: (state: R<Product>, action: ProductAction<R<Product>>) => R<Product>;
}

// Reducers
export const productList = (state: R<Product[]> = [], action: ProductAction<R<Product[]>>): R<Product[]> => {
    switch (action.type) {
        case ProductEnums.GET_PRODUCT_LIST: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

export const productCode = (state: boolean = false, action: ProductAction<boolean>): boolean => {
    switch (action.type) {
        case ProductEnums.SET_PRODUCT_CODE: {
            return !action.payload;
        }
        default: {
            return state;
        }
    }
};

export const productToEdit = (state: R<Product> = null, action: ProductAction<R<Product>>): R<Product> => {
    switch (action.type) {
        case ProductEnums.PRODUCT_TO_EDIT: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

// Selectors
const getProductFeatureState = createFeatureSelector<ProductPageState>(productsSelector);

export const getProductPageState = createSelector(
    getProductFeatureState,
    state => state.productCode
);

export const getProductListPageState = createSelector(
    getProductFeatureState,
    state => state.productList
);

export const getProductToSelectPageState = createSelector(
    getProductFeatureState,
    state => state.productToEdit
);

export const getProductAndProductList = createSelector(
    getProductToSelectPageState,
    getProductListPageState,
    (product: R<Product>, prodList: R<Product[]>) => {
        const productAndList: ProductAndList = {
            product,
            productList: prodList
        };

        return productAndList;
    }
);

export const ProductPageRootReducer: ProductPageStateReducer = {
    productList,
    productCode,
    productToEdit,
};
