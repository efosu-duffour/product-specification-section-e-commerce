import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, describe, afterEach, it, expect } from "vitest";
import { Inventory, InventoryService, Size } from "../src/services/inventory.service";

const mockInventories: Inventory[] = [
    {
        "product_id": "autumnal-knitwear",
        "sku": "ak-blue-xs",
        "color": "blue",
        "size": "xs",
        "list_price": 100,
        "discount": null,
        "discount_percentage": 10,
        "sale_price": 90,
        "sold": 35,
        "stock": 15
      },
      {
        "product_id": "autumnal-knitwear",
        "sku": "ak-blue-sm",
        "color": "blue",
        "size": "sm",
        "list_price": 100,
        "discount": null,
        "discount_percentage": 10,
        "sale_price": 90,
        "sold": 30,
        "stock": 20
      },
      {
        "product_id": "autumnal-knitwear",
        "sku": "ak-blue-md",
        "color": "blue",
        "size": "md",
        "list_price": 100,
        "discount": null,
        "discount_percentage": 10,
        "sale_price": 90,
        "sold": 25,
        "stock": 25
      },
      {
        "product_id": "autumnal-knitwear",
        "sku": "ak-blue-lg",
        "color": "blue",
        "size": "lg",
        "list_price": 100,
        "discount": null,
        "discount_percentage": 10,
        "sale_price": 90,
        "sold": 20,
        "stock": 30
      },
      {
        "product_id": "autumnal-knitwear",
        "sku": "ak-blue-xl",
        "color": "blue",
        "size": "xl",
        "list_price": 100,
        "discount": null,
        "discount_percentage": 10,
        "sale_price": 90,
        "sold": 15,
        "stock": 35
      },
      {
        "product_id": "autumnal-knitwear",
        "sku": "ak-brown-xs",
        "color": "brown",
        "size": "xs",
        "list_price": 100,
        "discount": null,
        "discount_percentage": 10,
        "sale_price": 90,
        "sold": 40,
        "stock": 10
      },
      {
        "product_id": "autumnal-knitwear",
        "sku": "ak-brown-sm",
        "color": "brown",
        "size": "sm",
        "list_price": 100,
        "discount": null,
        "discount_percentage": 10,
        "sale_price": 90,
        "sold": 35,
        "stock": 15
      },
      {
        "product_id": "autumnal-knitwear",
        "sku": "ak-brown-md",
        "color": "brown",
        "size": "md",
        "list_price": 100,
        "discount": null,
        "discount_percentage": 10,
        "sale_price": 90,
        "sold": 30,
        "stock": 20
      },
      {
        "product_id": "autumnal-knitwear",
        "sku": "ak-brown-lg",
        "color": "brown",
        "size": "lg",
        "list_price": 100,
        "discount": null,
        "discount_percentage": 10,
        "sale_price": 90,
        "sold": 25,
        "stock": 25
      },
      {
        "product_id": "autumnal-knitwear",
        "sku": "ak-brown-xl",
        "color": "brown",
        "size": "xl",
        "list_price": 100,
        "discount": null,
        "discount_percentage": 10,
        "sale_price": 90,
        "sold": 20,
        "stock": 30
      },
      {
        "product_id": "autumnal-knitwear",
        "sku": "ak-yellow-xs",
        "color": "yellow",
        "size": "xs",
        "list_price": 100,
        "discount": null,
        "discount_percentage": 10,
        "sale_price": 90,
        "sold": 35,
        "stock": 15
      },
      {
        "product_id": "autumnal-knitwear",
        "sku": "ak-yellow-sm",
        "color": "yellow",
        "size": "sm",
        "list_price": 100,
        "discount": null,
        "discount_percentage": 10,
        "sale_price": 90,
        "sold": 30,
        "stock": 20
      },
      {
        "product_id": "autumnal-knitwear",
        "sku": "ak-yellow-md",
        "color": "yellow",
        "size": "md",
        "list_price": 100,
        "discount": null,
        "discount_percentage": 10,
        "sale_price": 90,
        "sold": 25,
        "stock": 25
      },
      {
        "product_id": "autumnal-knitwear",
        "sku": "ak-yellow-lg",
        "color": "yellow",
        "size": "lg",
        "list_price": 100,
        "discount": null,
        "discount_percentage": 10,
        "sale_price": 90,
        "sold": 20,
        "stock": 30
      },
      {
        "product_id": "autumnal-knitwear",
        "sku": "ak-yellow-xl",
        "color": "yellow",
        "size": "xl",
        "list_price": 100,
        "discount": null,
        "discount_percentage": 10,
        "sale_price": 90,
        "sold": 15,
        "stock": 35
      },
      {
        "product_id": "azure-attitude-shades",
        "sku": "aas-blue",
        "color": "blue",
        "size": null,
        "list_price": 45,
        "discount": null,
        "discount_percentage": null,
        "sale_price": 45,
        "sold": 65,
        "stock": 435
      },
]

const inventoriesInterceptor = http.get('/data/inventory.json', () => {
    return HttpResponse.json<Inventory[]>(mockInventories);
})

const inventoriesMockServer = setupServer(inventoriesInterceptor);

describe('Inventory Service', () => {
    beforeAll(() => {
        inventoriesMockServer.listen({onUnhandledRequest: 'error'});
    })

    afterAll(() => {
        inventoriesMockServer.close();
    })

    afterEach(() => {
        inventoriesMockServer.resetHandlers();
    })

    it('should be a singleton', () => {
        const inventoryService_1 = new InventoryService();
        const inventoryService_2 = new InventoryService();
        expect(inventoryService_1).toBe(inventoryService_2);
        expect(inventoryService_1.createdAt).toBe(inventoryService_2.createdAt);
    })

    it('should fetch the right inventories', async () => {
        const inventoryService = new InventoryService();
        let inventories: Inventory[] = inventoryService.inventories;
        expect(inventories).toEqual([]); 

        await inventoryService.init();
        inventories = inventoryService.inventories;
        expect(inventories).toEqual(mockInventories);
    })

    

    it('should get the right inventories of the specified product ID', async () => {
        const inventoryService = new InventoryService();
        await inventoryService.init();
        const autumnalInventories: Inventory[] = inventoryService.getInventoriesByID('autumnal-knitwear');
        expect(autumnalInventories).toEqual(
            [
                {
                    "product_id": "autumnal-knitwear",
                    "sku": "ak-blue-xs",
                    "color": "blue",
                    "size": "xs",
                    "list_price": 100,
                    "discount": null,
                    "discount_percentage": 10,
                    "sale_price": 90,
                    "sold": 35,
                    "stock": 15
                  },
                  {
                    "product_id": "autumnal-knitwear",
                    "sku": "ak-blue-sm",
                    "color": "blue",
                    "size": "sm",
                    "list_price": 100,
                    "discount": null,
                    "discount_percentage": 10,
                    "sale_price": 90,
                    "sold": 30,
                    "stock": 20
                  },
                  {
                    "product_id": "autumnal-knitwear",
                    "sku": "ak-blue-md",
                    "color": "blue",
                    "size": "md",
                    "list_price": 100,
                    "discount": null,
                    "discount_percentage": 10,
                    "sale_price": 90,
                    "sold": 25,
                    "stock": 25
                  },
                  {
                    "product_id": "autumnal-knitwear",
                    "sku": "ak-blue-lg",
                    "color": "blue",
                    "size": "lg",
                    "list_price": 100,
                    "discount": null,
                    "discount_percentage": 10,
                    "sale_price": 90,
                    "sold": 20,
                    "stock": 30
                  },
                  {
                    "product_id": "autumnal-knitwear",
                    "sku": "ak-blue-xl",
                    "color": "blue",
                    "size": "xl",
                    "list_price": 100,
                    "discount": null,
                    "discount_percentage": 10,
                    "sale_price": 90,
                    "sold": 15,
                    "stock": 35
                  },
                  {
                    "product_id": "autumnal-knitwear",
                    "sku": "ak-brown-xs",
                    "color": "brown",
                    "size": "xs",
                    "list_price": 100,
                    "discount": null,
                    "discount_percentage": 10,
                    "sale_price": 90,
                    "sold": 40,
                    "stock": 10
                  },
                  {
                    "product_id": "autumnal-knitwear",
                    "sku": "ak-brown-sm",
                    "color": "brown",
                    "size": "sm",
                    "list_price": 100,
                    "discount": null,
                    "discount_percentage": 10,
                    "sale_price": 90,
                    "sold": 35,
                    "stock": 15
                  },
                  {
                    "product_id": "autumnal-knitwear",
                    "sku": "ak-brown-md",
                    "color": "brown",
                    "size": "md",
                    "list_price": 100,
                    "discount": null,
                    "discount_percentage": 10,
                    "sale_price": 90,
                    "sold": 30,
                    "stock": 20
                  },
                  {
                    "product_id": "autumnal-knitwear",
                    "sku": "ak-brown-lg",
                    "color": "brown",
                    "size": "lg",
                    "list_price": 100,
                    "discount": null,
                    "discount_percentage": 10,
                    "sale_price": 90,
                    "sold": 25,
                    "stock": 25
                  },
                  {
                    "product_id": "autumnal-knitwear",
                    "sku": "ak-brown-xl",
                    "color": "brown",
                    "size": "xl",
                    "list_price": 100,
                    "discount": null,
                    "discount_percentage": 10,
                    "sale_price": 90,
                    "sold": 20,
                    "stock": 30
                  },
                  {
                    "product_id": "autumnal-knitwear",
                    "sku": "ak-yellow-xs",
                    "color": "yellow",
                    "size": "xs",
                    "list_price": 100,
                    "discount": null,
                    "discount_percentage": 10,
                    "sale_price": 90,
                    "sold": 35,
                    "stock": 15
                  },
                  {
                    "product_id": "autumnal-knitwear",
                    "sku": "ak-yellow-sm",
                    "color": "yellow",
                    "size": "sm",
                    "list_price": 100,
                    "discount": null,
                    "discount_percentage": 10,
                    "sale_price": 90,
                    "sold": 30,
                    "stock": 20
                  },
                  {
                    "product_id": "autumnal-knitwear",
                    "sku": "ak-yellow-md",
                    "color": "yellow",
                    "size": "md",
                    "list_price": 100,
                    "discount": null,
                    "discount_percentage": 10,
                    "sale_price": 90,
                    "sold": 25,
                    "stock": 25
                  },
                  {
                    "product_id": "autumnal-knitwear",
                    "sku": "ak-yellow-lg",
                    "color": "yellow",
                    "size": "lg",
                    "list_price": 100,
                    "discount": null,
                    "discount_percentage": 10,
                    "sale_price": 90,
                    "sold": 20,
                    "stock": 30
                  },
                  {
                    "product_id": "autumnal-knitwear",
                    "sku": "ak-yellow-xl",
                    "color": "yellow",
                    "size": "xl",
                    "list_price": 100,
                    "discount": null,
                    "discount_percentage": 10,
                    "sale_price": 90,
                    "sold": 15,
                    "stock": 35
                  },
            ]
        );
    })

    it('should get the right sizes of inventory', async () => {
        const inventoryService = new InventoryService();
        await inventoryService.init();

        const sizes: Size[] = inventoryService.getSizes();
        expect(sizes).toEqual([
            'xs', 'sm', 'md', 'lg', 'xl'
        ])
    })

    it('should get the right sizes of the inventory specified by color', async () => {
        const inventoryService = new InventoryService();
        await inventoryService.init();

        const sizes: Size[] = inventoryService.getSizesByColor('blue');
        expect(sizes).toEqual([
            'xs', 'sm', 'md', 'lg', 'xl'
        ])
    })
})