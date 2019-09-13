import axios from "axios";

require('dotenv').config()
const settingsUrl = "/api/settings";

const APIUrl = process.env.REACT_APP_DEV_API_URL;
const APIUrlShoppingCart = process.env.REACT_APP_API_URL_SHOPPINGCART;
const UseB2C = process.env.REACT_APP_USEB2C;
const B2cAuthority = process.env.REACT_APP_B2CAUTHORITY;
const B2cClientId = process.env.REACT_APP_B2CCLIENTID;
const B2cScopes = process.env.REACT_APP_B2CSCOPES;

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
    _B2cAuthority: B2cAuthority,
    _B2cClientId: B2cClientId,
    _B2cScopes: B2cScopes,
    _applicationInsightsIntrumentationKey: '',
    _debugInformation: {},

    async loadSettings() {
        if (this._needLoadSettings) {
            const settingsResponse = await axios.get(settingsUrl);
            this._needLoadSettings = false;
            this._apiUrl = settingsResponse.data.apiUrl;
            this._apiUrlShoppingCart = settingsResponse.data.apiUrlShoppingCart;
            this._UseB2C = settingsResponse.data.useB2C;
            this._B2cAuthority = settingsResponse.data.b2CAuth.authority;
            this._B2cClientId = settingsResponse.data.b2CAuth.clientId;
            this._B2cScopes = settingsResponse.data.b2CAuth.scopes;
            this._devspacesName = settingsResponse.data.devspacesName;
            this._applicationInsightsIntrumentationKey = settingsResponse.data.applicationInsights.instrumentationKey;
            this._debugInformation = settingsResponse.data.debugInformation;
        }
    },

    HeadersConfig(token = undefined) {
        return _HeadersConfig(token, this._devspacesName);
    }
}

export default ConfigService;