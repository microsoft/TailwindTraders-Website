import axios from "axios";

const settingsUrl = "/api/settings";
const qs = require('qs');

const APIUrl = process.env.REACT_APP_DEV_API_URL;
const APIUrlShoppingCart = process.env.REACT_APP_API_URL_SHOPPINGCART;

const APIClient = { 
    _needLoadSettings: !APIUrl || !APIUrlShoppingCart,
    _apiUrl: APIUrl,

    async loadSettings() {
        if (this._needLoadSettings) {
            const settingsResponse = await axios.get(settingsUrl);
            this._needLoadSettings = false;
            this._apiUrl = settingsResponse.data.apiUrl;
        }
    },

    // async postLoginForm(formData) {
    //     await this.loadSettings();
    //     try {
    //         const response = await axios.post(`${this._apiUrl}/login`, formData);
    //         return response;
    //     }
    //     catch (error) {
    //         const statusError = {
    //             errorMsj: "An error retrieving login data",
    //         };
    //         return statusError;
    //     }
    // },


}

export default APIClient;