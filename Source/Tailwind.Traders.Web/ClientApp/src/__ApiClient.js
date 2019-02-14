import axios from "axios";
import ShoppingCartDaoFactory from "./cosmosdb/shoppingCartDaoFactory";

const qs = require('qs');
const settingsUrl = "/api/settings";

const APIUrl = process.env.REACT_APP_DEV_API_URL;
const APIUrlShoppingCart = process.env.REACT_APP_API_URL_SHOPPINGCART;
const auth = process.env.REACT_APP_DEV_AUTH;
const byPassShoppingCartApi = !!process.env.REACT_APP_BYPASS_SHOPPINGCART_API || false;


const instance = (token) => axios.create({
    baseURL: token,
    timeout: 1000,
    headers: { 'Authorization': 'Bearer ' + token }
});





const headersConfig = pauth => ({
    headers: { Authorization: `Email ${pauth}` },
});

const headersMultipartConfig = pauth => ({
    headers: {
        'Authorization': `Email ${pauth}`,
        'Content-Type': 'multipart/form-data'
    },
});

const APIClient = {
    _needLoadSettings: !APIUrl || !auth || !APIUrlShoppingCart,
    _apiUrl: APIUrl,
    _auth: auth,
    _apiUrlShoppingCart: APIUrlShoppingCart,
    _byPassShoppingCartApi: byPassShoppingCartApi,
    _shoppingCartDao: null,

    async loadSettings() {
        if (this._needLoadSettings) {
            const settingsResponse = await axios.get(settingsUrl);
            this._needLoadSettings = false;
            this._apiUrl = settingsResponse.data.apiUrl;
            this._auth = settingsResponse.data.auth;
            this._apiUrlShoppingCart = settingsResponse.data.apiUrlShoppingCart;
            this._byPassShoppingCartApi = !!settingsResponse.data.byPassShoppingCartApi;
            if (this._byPassShoppingCartApi && !this._shoppingCartDao) {
                this._shoppingCartDao = await ShoppingCartDaoFactory(settingsResponse.data.cart);
            }
        }
    },
    
    async getHomePageData() {
        await this.loadSettings();
        try {
            const response = await axios.get(`${this._apiUrl}/products/landing`);
            return response.data;
        }
        catch {
            const statusError = {
                errorMsj: "An error has occurred in Home's Page!",
            };
            return statusError;
        }
    },
    async getCouponsPageData() {
        await this.loadSettings();
        const response = await axios.get(`${this._apiUrl}/coupons`, headersConfig(this._auth));
        return response.data;
    },
    async getFilteredProducts(type = {}) {
        await this.loadSettings();
        const response = await axios.get(`${this._apiUrl}/products/?`, {
            'params': type, 'paramsSerializer': function (params) {
                return qs.stringify(params, { arrayFormat: 'repeat' })
            }
        });
        return response.data;
    },
    async getDetailProductData(productId) {
        await this.loadSettings();
        const response = await axios.get(`${this._apiUrl}/products/${productId}`);
        return response.data;
    },

    async getRelatedProducts(formData) {
        await this.loadSettings();
        try {
            const response = await axios.post(`${this._apiUrl}/products/imageclassifier`, formData);
            return response.data;
        }
        catch {
            throw new Error("KO");
        }
    },
    async getUserInfoData() {
        await this.loadSettings();

        const response = await axios.get(`${this._apiUrl}/profiles/me`, headersConfig(this._auth));
        return response.data;
    },
    async getShoppingCart(email) {
        await this.loadSettings();
        if (this._byPassShoppingCartApi) {
            const items = await this._shoppingCartDao.find(email);
            return items;
        }
        else {
            const response = await axios.get(`${this._apiUrlShoppingCart}/shoppingcart`, {
                params: {
                    email: email
                }
            });
            return response.data;
        }
    },
    async getRelatedDetailProducts(email, typeid) {
        await this.loadSettings();
        const response = await axios.get(`${this._apiUrlShoppingCart}/shoppingcart/relatedproducts`, {
            params: {
                email: email,
                typeid: typeid
            }
        }, headersConfig(this._auth));
        return response.data[0];
    },


};

export default APIClient;
