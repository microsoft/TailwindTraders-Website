import axios from "axios";
require('../helpers/errorsHandler');

const qs = require('qs');

require('dotenv').config()
const settingsUrl = "/api/settings";

const APIUrl = process.env.REACT_APP_DEV_API_URL;
const APIUrlShoppingCart = process.env.REACT_APP_API_URL_SHOPPINGCART;

const headersConfig = token => ({
    headers: { Authorization: `Bearer ${token}` },
});

const CommonServices = {
    _needLoadSettings: !APIUrl || !APIUrlShoppingCart,
    _apiUrl: APIUrl,
    _apiUrlShoppingCart: APIUrlShoppingCart,

    async loadSettings() {
        if (this._needLoadSettings) {
            const settingsResponse = await axios.get(settingsUrl);
            this._needLoadSettings = false;
            this._apiUrl = settingsResponse.data.apiUrl;
            this._apiUrlShoppingCart = settingsResponse.data.apiUrlShoppingCart;
        }
    },

    async postLoginForm(formData) {
        await this.loadSettings();
        const response = await axios.post(`${this._apiUrl}/login`, formData, { errorHandle: false });
        return response;
    },

    async getHomePageData(token) {
        await this.loadSettings();
        const response = await axios.get(`${this._apiUrl}/products/landing`, headersConfig(token), { errorHandle: false })
        return response;
    },

    async getCouponsPageData(token) {
        await this.loadSettings();
        const response = await axios.get(`${this._apiUrl}/coupons`, headersConfig(token), { errorHandle: false });
        return response;
    },

    async getFilteredProducts(type = {}) {
        await this.loadSettings();

        const params = {
            'params': type,
            'paramsSerializer': function (params) {
                return qs.stringify(params, { arrayFormat: 'repeat' })
            }
        }

        const response = await axios.get(`${this._apiUrl}/products/?`, params, { errorHandle: false });
        return response;
    },

    async getDetailProductData(productId) {
        await this.loadSettings();
        const response = await axios.get(`${this._apiUrl}/products/${productId}`, { errorHandle: false });
        return response.data;
    },

    async getRelatedProducts(formData, token) {
        await this.loadSettings();
        const response = await axios.post(`${this._apiUrl}/products/imageclassifier`, formData, headersConfig(token));
        return response.data;
    },

    async getUserInfoData(token) {
        await this.loadSettings();
        const response = await axios.get(`${this._apiUrl}/profiles/me`, headersConfig(token), { errorHandle: false });
        return response.data;
    },

    async getProfileData(token) {
        await this.loadSettings();
        const response = await axios.get(`${this._apiUrl}/profiles/navbar/me`, headersConfig(token), { errorHandle: false });
        return response.data;
    },

    /// CART SERVICES ///
    async getShoppingCart(token) {
        await this.loadSettings();
        if (this._byPassShoppingCartApi) {
            const items = await this._shoppingCartDao.find(token);
            return items;
        }

        const response = await axios.get(`${this._apiUrlShoppingCart}/shoppingcart`, headersConfig(token));
        return response.data;
    },

    // TODO REFACTOR
    async postProductToCart(token, detailProduct) {
        await this.loadSettings();
        try {
            const productInfo = {
                id: detailProduct.id,
                name: detailProduct.name,
                price: detailProduct.price,
                imageUrl: detailProduct.imageUrl,
                email: detailProduct.email,
                typeid: detailProduct.type.id
            };

            const dataToPost = { detailProduct: productInfo, qty: 1 };

            if (this._byPassShoppingCartApi) {
                await this._shoppingCartDao.addItem(dataToPost);
                return { message: "Product added on shopping cart" };
            }
            else {
                const response = await axios.post(`${this._apiUrlShoppingCart}/shoppingcart`, dataToPost, headersConfig(token));
                return response.data;
            }
        }
        catch (error) {
            console.error('Error on ApiClient::postProductToCart', error);
            const response = {
                message: "The product could not be added to the cart",
            };
            return response;
        }
    },

    async getRelatedDetailProducts(token, typeid = {}) {
        await this.loadSettings();
        const response = await axios.get(`${this._apiUrlShoppingCart}/shoppingcart/relatedproducts/?type=${typeid}`, headersConfig(token));
        return response.data[0];
    },

    async updateQuantity(id, qty, token) {
        await this.loadSettings();
        const product = {
            id: id,
            qty: qty
        }

        const response = await axios.post(`${this._apiUrlShoppingCart}/shoppingcart/product`, product, headersConfig(token));
        return response;
    },

    async deleteProduct(id, token) {
        await this.loadSettings();
        const product = {
            id: id,
        }
        
        const response = await axios.delete(`${this._apiUrlShoppingCart}/shoppingcart/product`, { data: product }, headersConfig(token));
        return response;
    }
}

export default CommonServices;