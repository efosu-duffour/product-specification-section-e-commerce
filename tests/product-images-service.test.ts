/**
 * @vite-environment jsdom
 */

import {
  ImageUrl,
  ProductFirstImageWithColor,
  ProductImage,
  ProductImagesByColor,
  ProductImagesService,
} from "../src/services/product-images.service";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, describe, afterEach, it, expect } from "vitest";

const productImages: ProductImage[] = [
  {
    product_id: "elemental-book",
    color: "red",
    image_url: "https://www.elemental-book-red-1.png",
  },

  {
    product_id: "elemental-book",
    color: "red",
    image_url: "https://www.elemental-book-red-2.png",
  },

  {
    product_id: "elemental-book",
    color: "blue",
    image_url: "https://www.elemental-book-blue-1.png",
  },

  {
    product_id: "elemental-book",
    color: "blue",
    image_url: "https://www.elemental-book-blue-2.png",
  },

  {
    product_id: "elemental-pen",
    color: "red",
    image_url: "https://www.elemental-pen-red-1.png",
  },
];

const productImagesInterceptor = http.get("/data/product-images.json", () => {
  return HttpResponse.json<ProductImage[]>(productImages);
});

const productImageServer = setupServer(productImagesInterceptor);

describe("Product Images Service", () => {
  beforeAll(() => {
    productImageServer.listen({ onUnhandledRequest: "error" });
  });

  afterEach(() => {
    productImageServer.resetHandlers();
  });

  afterAll(() => {
    productImageServer.close();
  });

  it("should be a singleton class", async () => {
    const productImagesService_1 = new ProductImagesService();
    const productImagesService_2 = new ProductImagesService();
    expect(productImagesService_1).toBe(productImagesService_2);
    expect(productImagesService_1.createdAt).toBe(
      productImagesService_2.createdAt
    );
  });

  it("should return the right product's images fetched", async () => {
    const productImageService = new ProductImagesService();
    expect(productImageService.productsImages).toEqual([]);

    await productImageService.init(); // Fetches the Data
    expect(productImageService.productsImages).toEqual(productImages);
  });

  it("should provide the product's colors with their corresponding images", async () => {
    const productImageService = new ProductImagesService();
    await productImageService.init(); // Fetches the Data
    expect(productImageService.getProductImagesByID("elemental-book")).toEqual([
      {
        color: "red",
        images: [
          "https://www.elemental-book-red-1.png",
          "https://www.elemental-book-red-2.png",
        ],
      },
      {
        color: "blue",
        images: [
          "https://www.elemental-book-blue-1.png",
          "https://www.elemental-book-blue-2.png",
        ],
      },
    ]);
  });

  it("should provide the first image with the specified color", async () => {
    const productImageService = new ProductImagesService();
    await productImageService.init(); // Fetches the Data

    const elementalBookProductImages: ProductImagesByColor[] =
      productImageService.getProductImagesByID("elemental-book");
    const firstImagesByColor: ProductFirstImageWithColor[] =
      ProductImagesService.getFirstImageWithColor(elementalBookProductImages);
    expect(firstImagesByColor).toEqual([
      {
        color: "red",
        image: "https://www.elemental-book-red-1.png",
      },
      {
        color: "blue",
        image: "https://www.elemental-book-blue-1.png",
      },
    ]);
  });

  it("should provide all the first image of each color by the specified product ID", async () => {
    const productImageService = new ProductImagesService();
    await productImageService.init(); // Fetches the Data

    const elementalBooksFirstImages: ImageUrl[] =
      productImageService.getFirstImageByID("elemental-book");
    expect(elementalBooksFirstImages).toEqual([
      "https://www.elemental-book-red-1.png",
      "https://www.elemental-book-blue-1.png",
    ]);
  });

  it('should provide all the images associated with the specified color', async () => {
    const productImageService = new ProductImagesService();
    await productImageService.init(); // Fetches the Data

    const elementalBooksProductImages: ProductImagesByColor[] = productImageService.getProductImagesByID('elemental-book');
    const elementalImagesForRed: ImageUrl[] = ProductImagesService.getImagesByColor(elementalBooksProductImages, 'red');
    expect(elementalImagesForRed).toEqual([
      "https://www.elemental-book-red-1.png",
      "https://www.elemental-book-red-2.png"
    ]);
  });

  it('should provide all the images associated with the specified color by the ID', async () => {
    const productImageService = new ProductImagesService();
    await productImageService.init(); // Fetches the Data

    const elementalImagesForRed: ImageUrl[] = productImageService.getImagesByColor('elemental-book', 'red');
    expect(elementalImagesForRed).toEqual([
      "https://www.elemental-book-red-1.png",
      "https://www.elemental-book-red-2.png"
    ])
  })

  it('should provide the first image with each color of the product id', async () => {
    const productImageService = new ProductImagesService();
    await productImageService.init(); // Fetches the Data

    const elementalFirstImagesWithColors = productImageService.getFirstImageByColor('elemental-book', 'red');
    expect(elementalFirstImagesWithColors).toEqual( "https://www.elemental-book-red-1.png");
  })
});
