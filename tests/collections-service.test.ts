import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, describe, afterEach, it, expect } from "vitest";
import { Collection, CollectionsService } from "../src/services/collections.service";



const mockCollections: Collection[] = [
    {
      "collection_id": "cozy",
      "name": "Cozy Comfort",
      "description": "Plush fabrics and soothing designs",
      "image_url": "https://vaqybtnqyonvlwtskzmv.supabase.co/storage/v1/object/public/e-commerce-track-images/collections/cozy-comfort.jpg",
      "created_at": "2024-01-01"
    },
    {
      "collection_id": "urban",
      "name": "Urban Oasis",
      "description": "For the city dwellers",
      "image_url": "https://vaqybtnqyonvlwtskzmv.supabase.co/storage/v1/object/public/e-commerce-track-images/collections/urban-oasis.jpg",
      "created_at": "2024-01-01"
    },
    {
      "collection_id": "fresh",
      "name": "Fresh Fusion",
      "description": "Contemporary styles and patterns",
      "image_url": "https://vaqybtnqyonvlwtskzmv.supabase.co/storage/v1/object/public/e-commerce-track-images/collections/fresh-fusion.jpg",
      "created_at": "2024-01-01"
    }
  ];
  

const collectionsInterceptor = http.get('/data/collections.json', () => {
    return HttpResponse.json<Collection[]>(mockCollections);
})

const collectionsMockServer = setupServer(collectionsInterceptor);

describe('Collection Service', () => {
    beforeAll(() => {
        collectionsMockServer.listen({onUnhandledRequest: 'error'});
    })

    afterAll(() => {
        collectionsMockServer.close();
    })

    afterEach(() => {
        collectionsMockServer.resetHandlers();
    })

    it('should be a singleton', () => {
        const collectionsService_1 = new CollectionsService();
        const collectionsService_2 = new CollectionsService();
        expect(collectionsService_1).toBe(collectionsService_2);
        expect(collectionsService_1.createdAt).toEqual(collectionsService_2.createdAt);
    })

    it('should fetch the right collections', async () => {
        const collectionsService = new CollectionsService();
        let collections: Collection[] = collectionsService.collections;
        expect(collections).toEqual([]); 

        await collectionsService.init();
        collections = collectionsService.collections;
        expect(collections).toEqual(mockCollections);
    })

    
})