import { listOfProductImages, Product, ProductPreparation } from "schemas/product-list/product-list-schema";
import { R } from "schemas/rType";
import { generateRandomGuid } from "utils/Utils";

const generateFakeProductlistData = (): R<Product[]> => {
    const productsInPreparation: R<Product[]> = listOfProductImages
    .map((prod: ProductPreparation) => {
        const id = generateRandomGuid();
        const product: Product = {
            ...prod,
            id,
            productIdCode: `(${id})-${name}`,
        };
        return product;
    });
    return productsInPreparation;
};

export const fakeListData: R<Product[]> = generateFakeProductlistData(); // starter data that is will be mutated...
