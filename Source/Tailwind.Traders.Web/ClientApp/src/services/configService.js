import axios from "axios";

require('dotenv').config()
const settingsUrl = "/api/settings";

const APIUrl = process.env.REACT_APP_DEV_API_URL;
const APIUrlShoppingCart = process.env.REACT_APP_API_URL_SHOPPINGCART;
const UseB2C = process.env.REACT_APP_USEB2C;

const _HeadersConfig = (token, devspaces = undefined) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    if (devspaces) {
        headers['azds-route-as'] = devspaces;
    }

    return { headers: headers };
};

const ConfigService = {
    _needLoadSettings: !APIUrl || !APIUrlShoppingCart,
    _apiUrl: APIUrl,
    _apiUrlShoppingCart: APIUrlShoppingCart,
    _UseB2C: UseB2C,


    async loadSettings() {
        if (this._needLoadSettings) {
            const settingsResponse = await axios.get(settingsUrl);
            this._needLoadSettings = false;
            this._apiUrl = settingsResponse.data.apiUrl;
            this._apiUrlShoppingCart = settingsResponse.data.apiUrlShoppingCart;
            this._UseB2C = settingsResponse.data.useB2C;
            this._devspacesName = settingsResponse.data.devspacesName;
        }
    },

    HeadersConfig(token = undefined) {
        return _HeadersConfig(token, this._devspacesName);
    }
}

export default ConfigService;