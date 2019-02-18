import axios from "axios";

require('dotenv').config()
const settingsUrl = "/api/settings";

const APIUrl = process.env.REACT_APP_DEV_API_URL;
const APIUrlShoppingCart = process.env.REACT_APP_API_URL_SHOPPINGCART;

export const HeadersConfig = token => ({
    headers: { Authorization: `Bearer ${token}` },
});

export const ConfigService = {
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
    }
}