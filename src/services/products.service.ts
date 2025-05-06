export type Category = string;
export type ProductName = string;
export type ProductID = string;
export type Description = string;
export type Collection = string;
export type CreatedAt = string;

export type Product = {
  product_id: ProductID;
  name: ProductName;
  description: Description;
  category: Category;
  collection: Collection;
  created_at: CreatedAt;
};

const SESSIONNAME = "sn-products";
export class ProductsService {
  createdAt?: number;
  private _products: Product[] = [];
  private _PRODUCTSAPI = import.meta.env.BASE_URL + 'data/products.json';

  get products(): Product[] {
    return this._products;
  }

  constructor() {
    if (ProductsService._INSTANCE) return ProductsService._INSTANCE;
    else {
      this.createdAt = Date.now();
      ProductsService._INSTANCE = this;
    }
  }

  private static _INSTANCE: ProductsService | null = null;

  async init(): Promise<void> {
    // Fetches the products from server or cache
    const cachedProducts = sessionStorage.getItem(SESSIONNAME);
    if (cachedProducts && cachedProducts.length !== 0) {
      this._products = JSON.parse(cachedProducts);
    } else {
      this._products = await this._fetchProducts();
      sessionStorage.setItem(SESSIONNAME, JSON.stringify(this._products));
    }
  }

  private async _fetchProducts(): Promise<Product[]> {
    // Fetches products json from cache if not fetch from server, cache and store it in the local variable
    let fetchedProducts: Product[] = [];
    try {
      const response = await fetch(this._PRODUCTSAPI);
      const json: Product[] = await response.json();
      fetchedProducts = json;
    } catch (err: unknown) {
      console.warn(err);
    }

    return fetchedProducts;
  }

  static getIDsByCategory(products: Product[], category: Category): ProductID[] {
    // Get the products ID with the specified Category
    const productIDs: ProductID[] = [];
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        if (product.category !== category) continue;

        productIDs.push(product.product_id);
    }
    return productIDs;
  }

  getIDsByCategory(category: Category): ProductID[] {
    // Get the products ID with the specified Category
    return ProductsService.getIDsByCategory(this._products, category);
  }

  static getIDsByCollection(products: Product[], collection: Collection): ProductID[] {
    // Get the products ID with the specified collection
    const productIDs: ProductID[] = [];
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        if (product.collection !== collection) continue;

        productIDs.push(product.product_id);
    }
    return productIDs;
  }

  getIDsByCollection(collection: Collection): ProductID[] {
    // Get the products ID with the specified collection
    return ProductsService.getIDsByCollection(this._products, collection);
  }

  static getProductsByCreatedAt(products: Product[], predicate: (createdAt: CreatedAt) => boolean): Product[] {
    // Get the product according to when they were created
    return products.filter(product => predicate(product.created_at));
  }

  getProductsByCreatedAt(predicate: (createdAt: CreatedAt) => boolean): Product[] {
    // Get the product according to when they were created
    return ProductsService.getProductsByCreatedAt(this._products, predicate);
  }

  static getProductsByCategory(products: Product[], category: Category): Product[] {
    // Gets the products according to the specified category
    return products.filter(product => product.category === category);
  }

  getProductsByCategory(category: Category): Product[] {
    return ProductsService.getProductsByCategory(this._products, category);
  }

  static getProductsByCollection(products: Product[], collection: Collection): Product[] {
    // Gets the products according to the specified collection
    return products.filter(product => product.collection === collection);
  }

  getProductsByCollection(collection: Collection): Product[] {
    return ProductsService.getProductsByCollection(this._products, collection);
  }
}
