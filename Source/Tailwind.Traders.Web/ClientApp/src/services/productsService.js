import axios from "axios";
import { ConfigService } from "./"
const qs = require('qs');
require('../helpers/errorsHandler');


const ProductService = { 

    async getHomePageData() {
        await ConfigService.loadSettings();
        const response = await axios.get(`${ConfigService._apiUrl}/products/landing`, ConfigService.HeadersConfig(), { errorHandle: false })
        return response;
    },

    async getCouponsPageData(token) {
        await ConfigService.loadSettings();
        const response = await axios.get(`${ConfigService._apiUrl}/coupons`, ConfigService.HeadersConfig(token), { errorHandle: false });
        return response;
    },

    async getFilteredProducts(type = {}) {
        await ConfigService.loadSettings();

        const params = {
            'params': type,
            'paramsSerializer': function (params) {
                return qs.stringify(params, { arrayFormat: 'repeat' })
            }
        }

        const response = await axios.get(`${ConfigService._apiUrl}/products/?`, params, ConfigService.HeadersConfig(), { errorHandle: false });
        return response;
    },

    async getDetailProductData(productId) {
        await ConfigService.loadSettings();
        const response = await axios.get(`${ConfigService._apiUrl}/products/${productId}`, ConfigService.HeadersConfig(), { errorHandle: false });
        return response.data;
    },

    async getRelatedProducts(formData, token) {
        await ConfigService.loadSettings();
        const response = await axios.post(`${ConfigService._apiUrl}/products/imageclassifier`, formData, ConfigService.HeadersConfig(token));
        return response.data;
    }
}

export default ProductService;