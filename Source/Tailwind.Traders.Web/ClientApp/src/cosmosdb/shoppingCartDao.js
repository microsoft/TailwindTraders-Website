class ShoppingCartDao {
    constructor(cosmosClient, databaseId, containerId) {
        this.client = cosmosClient;
        this.databaseId = databaseId;
        this.collectionId = containerId;

        this.database = null;
        this.container = null;
    }

    async init() {
        const dbResponse = await this.client.databases.createIfNotExists({
            id: this.databaseId
        });
        this.database = dbResponse.database;
        const coResponse = await this.database.containers.createIfNotExists({
            id: this.collectionId
        });
        this.container = coResponse.container;
    }

    async find(email) {
        const querySpec = {
            query: "SELECT * FROM root.detailProduct r WHERE r.email=@email",
            parameters: [
              {
                name: "@email",
                value: email,
              }
            ]
          };

        if (!this.container) {
            throw new Error("Collection is not initialized.");
        }
        const { result: results } = await this.container.items
            .query(querySpec)
            .toArray();
        return results;
    }

    async addItem(item) {
        const { body: doc } = await this.container.items.create(item);
        return doc;
    }
}

export default ShoppingCartDao;