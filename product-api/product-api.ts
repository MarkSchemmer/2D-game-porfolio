import { Observable } from "rxjs";
import { fakeListData } from "../fake-json-data/product-list-page-data";
import { Product } from "../schemas/product-list/product-list-schema";

let rootData: Product[] = fakeListData as Product[];

export const getProducts = (): Observable<Product[]> => {
    return new Observable<Product[]>(observer => {
        setTimeout(() => {
            observer.next(rootData);
        }, 200);
    });
};

export const deleteProductById = (id: string): Observable<Product[]> => {
    return new Observable<Product[]>(observer => {
        setTimeout(() => {
            rootData = rootData.filter((product: Product) => product.id !== id);
            observer.next(rootData);
        });
    });
};

export const addProduct = (product: Product): Observable<Product[]> => {
    return new Observable<Product[]>(observer => {
        setTimeout(() => {
            rootData = rootData.concat(product);
            observer.next(rootData);
        });
    });
};
