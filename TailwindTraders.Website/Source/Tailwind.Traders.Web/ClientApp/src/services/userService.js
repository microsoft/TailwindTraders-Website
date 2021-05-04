import axios from "axios";
import { ConfigService } from "./"
require('../helpers/errorsHandler');


const UserService = { 

    async postLoginForm(formData) {
        await ConfigService.loadSettings();
        const response = await axios.post(`${ConfigService._apiUrl}/login`, formData, ConfigService.HeadersConfig(), { errorHandle: false });
        return response;
    },

    async getUserInfoData(token) {
        await ConfigService.loadSettings();
        const response = await axios.get(`${ConfigService._apiUrl}/profiles/me`, ConfigService.HeadersConfig(token), { errorHandle: false });
        return response.data;
    },

    async getProfileData(token) {
        await ConfigService.loadSettings();
        const response = await axios.get(`${ConfigService._apiUrl}/profiles/navbar/me`, ConfigService.HeadersConfig(token), { errorHandle: false });
        return response.data;
    }
}


export default UserService;