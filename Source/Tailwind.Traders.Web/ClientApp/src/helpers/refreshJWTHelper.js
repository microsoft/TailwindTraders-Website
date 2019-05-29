import axios from 'axios';
import {
    getRefreshToken,
    setAccessToken,
    setRefreshToken
} from './tokensHelper';
import { ConfigService } from '../services'

let failedRequestToRetry = [];
let isAlreadyFetchingAccessToken = false;

const addSubscriber = (callback) => failedRequestToRetry.push(callback);

const fetchNewJWTokens = async (refreshToken) => {
    const dataToken = {
        token: refreshToken
    }
    const response = await axios.put(`${ConfigService._apiUrl}/auth/refresh`, dataToken);

    if (!response.data) {
        return null;
    }

    return {
        newAccessToken: response.data.access_token.token,
        newRefreshToken: response.data.refresh_token
    };
}

const onAccessTokenFetched = (accessToken) => {
    failedRequestToRetry.forEach(callback => callback(accessToken));
    failedRequestToRetry = [];
}


export const handleUnathenticatedRequest = async (authenticationError) => {
    try {

        const { response: errorResponse } = authenticationError;
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            // We can't refresh, throw the error
            return Promise.reject(authenticationError);
        }
        const retryOriginalRequest = new Promise(resolve => {
            addSubscriber(accessToken => {
                errorResponse.config.headers.Authorization = `Bearer ${accessToken}`;
                resolve(axios(errorResponse.config));
            });
        });

        if (!isAlreadyFetchingAccessToken) {
            isAlreadyFetchingAccessToken = true;
            
            const newJWTokens = await fetchNewJWTokens(refreshToken);

            if (!newJWTokens) {
                return Promise.reject(authenticationError);
            }

            setAccessToken(newJWTokens.newAccessToken);

            setRefreshToken(newJWTokens.newRefreshToken);

            isAlreadyFetchingAccessToken = false;
            onAccessTokenFetched(newJWTokens.newAccessToken);
        }

        return retryOriginalRequest;

    } catch (err) {
        return Promise.reject(err);
    }
}


