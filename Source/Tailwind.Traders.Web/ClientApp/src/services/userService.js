import axios from "axios";
import { HeadersConfig, ConfigService } from "./configService"
require('../helpers/errorsHandler');


const UserService = { 

    async postLoginForm(formData) {
        await ConfigService.loadSettings();
        const response = await axios.post(`${ConfigService._apiUrl}/login`, formData, { errorHandle: false });
        return response;
    },

    async getUserInfoData(token) {
        await ConfigService.loadSettings();
        const response = await axios.get(`${ConfigService._apiUrl}/profiles/me`, HeadersConfig(token), { errorHandle: false });
        return response.data;
    },

    async getProfileData(token) {
        await ConfigService.loadSettings();
        const response = await axios.get(`${ConfigService._apiUrl}/profiles/navbar/me`, HeadersConfig(token), { errorHandle: false });
        return response.data;
    }
}


export default UserService;