export type CollectionID = string;
export type CollectionName = string;
export type CollectionDescription = string;
export type CollectionImage = string;
export type CreatedAt = string;

export type Collection = {
    collection_id: CollectionID;
    name: CollectionName;
    description: CollectionDescription;
    image_url: CollectionImage;
    created_at: CreatedAt;
}

const SESSIONNAME = 'sn-collections';
export class CollectionsService {
    createdAt?: number;
    private _collections: Collection[] = [];
    private _COLLECTIONSAPI = import.meta.env.BASE_URL + 'data/collections.json';

    get collections(): Collection[] {
        return this._collections;
    }

    constructor() {
        if(CollectionsService._INSTANCE) return CollectionsService._INSTANCE;
        else {
            this.createdAt = Date.now();
            CollectionsService._INSTANCE = this;
        }
    }

    async init(): Promise<Collection[]> {
        // Fetches the collections from server or cache
        const cachedCollections = sessionStorage.getItem(SESSIONNAME);
        if (cachedCollections && cachedCollections.length != 0) {
          this._collections = JSON.parse(cachedCollections);
        } else {
          this._collections = await this._fetchInventories();
          sessionStorage.setItem(SESSIONNAME, JSON.stringify(this._collections));
        }

        return this._collections;
      }
    
      private async _fetchInventories(): Promise<Collection[]> {
        // Fetches collections json from cache if not fetch from server, cache and store it in the local variable
        let fetchedCollections: Collection[] = [];
        try {
          const response = await fetch(this._COLLECTIONSAPI);
          const json: Collection[] = await response.json();
          fetchedCollections = json;
        } catch (err: unknown) {
          console.warn(err);
        }
    
        return fetchedCollections;
      }

   private static _INSTANCE: CollectionsService | null = null;
}