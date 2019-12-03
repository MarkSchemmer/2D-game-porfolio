
const baseImageUrl = "../../fake-json-data/product-images";

export interface Product {
    id: string;
    name: string;
    productIdCode: string;
    imageUrl: string;
}

/*
    Note(Mark): list of products:
        1. asus laptop
        2. New ford gt
        3. New Android phone
        4. Linus Tarvalds clone
        5. Liberal tears
*/

export interface ProductPreparation {
    name: string;
    imageUrl: string;
}

export const listOfProductImages: ProductPreparation[] = [
    {
      name: "Asus zenbook",
      imageUrl: baseImageUrl + "/asus_zenbook.png",
    },
    {
      name: "Ford GT",
      imageUrl: baseImageUrl + "/ford-gt.jfif",
    },
    {
      name: "Android phone",
      imageUrl: baseImageUrl + "/android.jfif",
    },
    {
      name: "Linus Tarvalds clone",
      imageUrl: baseImageUrl + "/linus-torvalds.jfif",
    },
    {
      name: "Liberal tears",
      imageUrl: baseImageUrl + "libtard.jfif",
    }
];

export type prodcutListPayload = Product[];
