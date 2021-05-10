import ShoppingCartDao from "./shoppingCartDao";
import { CosmosClient } from "@azure/cosmos";

const ShoppingCartDaoFactory = async (settings) => {
    const cosmosClient = new CosmosClient({
        endpoint: settings.host,
        auth: {
            masterKey: settings.authKey
        }
    });
    const shoppingCartDao = new ShoppingCartDao(cosmosClient, settings.databaseId, settings.containerId);
    await shoppingCartDao.init();
    return shoppingCartDao;
}

export default ShoppingCartDaoFactory;
