import axios from "axios";
import ShoppingCartDaoFactory from "./cosmosdb/shoppingCartDaoFactory";

const qs = require('qs');
const settingsUrl = "/api/settings";

const APIUrl = process.env.REACT_APP_DEV_API_URL;
const APIUrlShoppingCart = process.env.REACT_APP_API_URL_SHOPPINGCART;
const auth = process.env.REACT_APP_DEV_AUTH;
const userid = process.env.REACT_APP_USERID || 0;
const byPassShoppingCartApi = !!process.env.REACT_APP_BYPASS_SHOPPINGCART_API || false;

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
    _userid: userid,
    _apiUrlShoppingCart: APIUrlShoppingCart,
    _byPassShoppingCartApi: byPassShoppingCartApi,
    _shoppingCartDao: null,

    async loadSettings() {
        if (this._needLoadSettings) {
            const settingsResponse = await axios.get(settingsUrl);
            this._needLoadSettings = false;
            this._apiUrl = settingsResponse.data.apiUrl;
            this._auth = settingsResponse.data.auth;
            this._userid = settingsResponse.data.userId || 0;
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
            const response = await axios.get(`${this._apiUrl}/products/landing`, headersConfig(this._auth));
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
    async getProductsPageData() {
        await this.loadSettings();
        const response = await axios.get(`${this._apiUrl}/products`, headersConfig(this._auth));
        return response.data;
    },
    async getFilteredProducts(type = {}) {
        await this.loadSettings();
        const response = await axios.get(`${this._apiUrl}/products/?`, {
            'params': type, 'paramsSerializer': function (params) {
                return qs.stringify(params, { arrayFormat: 'repeat' })
            }, ...headersConfig(this._auth)
        });
        return response.data;
    },
    async getDetailProductData(productId) {
        await this.loadSettings();
        const response = await axios.get(`${this._apiUrl}/products/${productId}`, headersConfig(this._auth));
        return response.data;
    },
    async getRelatedProducts(formData) {
        await this.loadSettings();
        try {
            const response = await axios.post(`${this._apiUrl}/products/imageclassifier`, formData, headersMultipartConfig(this._auth));
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
    async getProfileData() {
        if (this._userid === 0) {
            return {
                profile: {
                    id: 0,
                    name: "Unknown user",
                    address: "",
                    phoneNumber: "",
                    email: this._auth
                }
            }
        }
        else {
            await this.loadSettings();
            const response = await axios.get(`${this._apiUrl}/profiles/navbar/me`, headersConfig(this._auth));
            return response.data;
        }
    },
    async postProductToCart(detailProduct) {
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
                const response = await axios.post(`${this._apiUrlShoppingCart}/shoppingcart`, dataToPost);
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
    async updateQuantity(id, qty) {
        await this.loadSettings();
        const product = {
            id: id,
            qty: qty
        }
        const response = await axios.post(`${this._apiUrlShoppingCart}/shoppingcart/product`, product);
        return response;
    },
    async deleteProduct(id) {
        await this.loadSettings();
        const product = {
            id: id,
        }
        const response = await axios.delete(`${this._apiUrlShoppingCart}/shoppingcart/product`, { data: product });
        return response;
    },
    async getRelatedDetailProducts(email, typeid) {
        await this.loadSettings();
        const response = await axios.get(`${this._apiUrlShoppingCart}/shoppingcart/relatedproducts`, {
            params: {
                email: email,
                typeid: typeid
            }
        });
        return response.data[0];
    }
};

export default APIClient;
