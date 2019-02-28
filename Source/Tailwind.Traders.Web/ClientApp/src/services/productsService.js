import axios from "axios";
import { HeadersConfig, ConfigService } from "./configService"
const qs = require('qs');
require('../helpers/errorsHandler');


const ProductService = { 

    async getHomePageData(token) {
        await ConfigService.loadSettings();
        const response = await axios.get(`${ConfigService._apiUrl}/products/landing`, HeadersConfig(token), { errorHandle: false })
        return response;
    },

    async getCouponsPageData(token) {
        await ConfigService.loadSettings();
        const response = await axios.get(`${ConfigService._apiUrl}/coupons`, HeadersConfig(token), { errorHandle: false });
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

        const response = await axios.get(`${ConfigService._apiUrl}/products/?`, params, { errorHandle: false });
        return response;
    },

    async getDetailProductData(productId) {
        await ConfigService.loadSettings();
        const response = await axios.get(`${ConfigService._apiUrl}/products/${productId}`, { errorHandle: false });
        return response.data;
    },

    async getRelatedProducts(formData, token) {
        await ConfigService.loadSettings();
        const response = await axios.post(`${ConfigService._apiUrl}/products/imageclassifier`, formData, HeadersConfig(token));
        return response.data;
    }
}

export default ProductService;