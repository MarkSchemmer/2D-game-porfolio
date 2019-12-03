import { Product } from "schemas/product-list/product-list-schema";
import { R } from "schemas/rType";

interface StoreState {
    ProductList: Product[];
}

export type ReduxStoreState = R<StoreState>;
