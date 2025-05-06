import { ProductColor} from "./inventory.service";
import { ProductID } from "./products.service";

export type ProductImage = {
  product_id: ProductID;
  color: ProductColor;
  image_url: ImageUrl;
  [a: string]: string;
};

export type ImageUrl = string;


export type ProductImagesByColor = {
  color: ProductColor;
  images: ImageUrl[];
};

export type ProductFirstImageWithColor = {
  color: ProductColor;
  image: ImageUrl;
};

const SESSIONNAME = "sn-product-images";

export class ProductImagesService {
  private _productsImages?: ProductImage[];
  createdAt?: number;
  private _PRODUCTIMAGEAPI = import.meta.env.BASE_URL + 'data/product-images.json';
  
  constructor() {
    if (ProductImagesService._INSTANCE) return ProductImagesService._INSTANCE;
    else {
      this.createdAt = Date.now();
      ProductImagesService._INSTANCE = this;
    }
  }

  async init(): Promise<void> {
    // Fetches the product's images from server or cache
    const cachedProductImages = sessionStorage.getItem(SESSIONNAME);
    if (cachedProductImages && cachedProductImages.length !== 0) {
      this._productsImages = JSON.parse(cachedProductImages);
    } else {
      this._productsImages = await this._fetchProductImages();
      sessionStorage.setItem(SESSIONNAME, JSON.stringify(this._productsImages));
    }
  }

  private async _fetchProductImages(): Promise<ProductImage[]> {
    // Fetches images json from cache if not fetch from server, cache and store it in the local variable
    let fetchedProductImages: ProductImage[] = [];
    try {
      const response = await fetch(this._PRODUCTIMAGEAPI);
      const json: ProductImage[] = await response.json();
      fetchedProductImages = json;
    } catch (err: unknown) {
      console.warn(err);
    }


    return fetchedProductImages;
  }

  get productsImages(): ProductImage[] {
    if (!this._productsImages) return [];
    return this._productsImages;
  }

  getProductImagesByID(id: ProductID): ProductImagesByColor[] {
    const productImageByColor: Map<ProductColor, ImageUrl[]> = new Map();

    if (!this._productsImages) return [];
    for (let i = 0; i < this._productsImages.length; i++) {
      const productImage = this._productsImages[i];
      const color = productImage.color;
      if (productImage.product_id !== id) continue;

      productImageByColor.set(color, [
        ...(productImageByColor.get(color) ?? []),
        productImage.image_url,
      ]);
    }

    return Array.from(productImageByColor, ([color, images]) => ({
      color,
      images,
    }));
  }

  static getFirstImageWithColor(
    productImages: ProductImagesByColor[]
  ): ProductFirstImageWithColor[] {
    // Gets the first image specified color
    return productImages.map(({color, images}) => {
      return {
        color,
        image: images[0],
      };
    });
  }

  getFirstImageByID(id: ProductID): ImageUrl[] {
    // Return only the first image of each color of the given product ID
    const registeredColors: Set<string> = new Set();
    const result: ImageUrl[] = [];
    for (let i = 0; i < this.productsImages.length; i++) {
      const produtImage = this.productsImages[i];
      if (produtImage.product_id !== id || registeredColors.has(produtImage.color)) continue;

      result.push(produtImage.image_url);
      registeredColors.add(produtImage.color);
    }
    return result;
  }

  static getImagesByColor(
    productImages: ProductImagesByColor[],
    color: ProductColor
  ): ImageUrl[] {
    // Get product's images by the specified color
    const productImage = productImages.find(productImage => productImage.color === color);
    if (!productImage) return [];
    return productImage.images;
  }


  getImagesByColor(id: ProductID, color: ProductColor): ImageUrl[] {
    const result: ImageUrl[] = [];
    for (let i = 0; i < this.productsImages.length; i++) {
        const productImage = this.productsImages[i];
        if (productImage.product_id !== id || productImage.color !== color) continue;
        result.push(productImage.image_url);
    }
    return result;
  }

  private static _INSTANCE: ProductImagesService | null = null;
}
