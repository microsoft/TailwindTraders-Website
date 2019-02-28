import axios from "axios";
import { HeadersConfig, ConfigService } from "./configService"
require('../helpers/errorsHandler');

const CartService = {
    async getShoppingCart(token) {
        await ConfigService.loadSettings();
        if (ConfigService._byPassShoppingCartApi) {
            const items = await ConfigService._shoppingCartDao.find(token);
            return items;
        }

        const response = await axios.get(`${ConfigService._apiUrlShoppingCart}/shoppingcart`, HeadersConfig(token));
        return response.data;
    },

    async postProductToCart(token, detailProduct) {
        await ConfigService.loadSettings();

        const productInfo = {
            id: detailProduct.id,
            name: detailProduct.name,
            price: detailProduct.price,
            imageUrl: detailProduct.imageUrl,
            email: detailProduct.email,
            typeid: detailProduct.type.id
        };

        const dataToPost = { detailProduct: productInfo, qty: 1 };

        if (ConfigService._byPassShoppingCartApi) {
            await ConfigService._shoppingCartDao.addItem(dataToPost);
            return { message: "Product added on shopping cart" };
        }

        const addProduct = axios.post(`${ConfigService._apiUrlShoppingCart}/shoppingcart`, dataToPost, HeadersConfig(token))
            .then((response) => {
                return response.data;
            })
            .catch(() => {
                return { errMessage: "The product could not be added to the cart" }
            })

        return addProduct;
    },

    async getRelatedDetailProducts(token, typeid = {}) {
        await ConfigService.loadSettings();
        const response = await axios.get(`${ConfigService._apiUrlShoppingCart}/shoppingcart/relatedproducts/?type=${typeid}`, HeadersConfig(token));
        return response.data[0];
    },

    async updateQuantity(id, qty, token) {
        await ConfigService.loadSettings();

        const product = {
            id: id,
            qty: qty
        }

        const response = await axios.post(`${ConfigService._apiUrlShoppingCart}/shoppingcart/product`, product, HeadersConfig(token));
        return response;
    },

    async deleteProduct(id, token) {
        await ConfigService.loadSettings();

        let config = HeadersConfig(token);
        config.data = {
            id: id,
        }

        const response = await axios.delete(`${ConfigService._apiUrlShoppingCart}/shoppingcart/product`, config);
        return response;
    }
}


export default CartService;