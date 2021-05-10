import { getItemValue, setItemValue } from "./localStorage";

export const getRefreshToken = () => getItemValue('refreshToken');
export const getAccessToken = () => getItemValue('token');

export const setRefreshToken = (newRefreshToken) => setItemValue('refreshToken', newRefreshToken);
export const setAccessToken = (newAccessToken) => setItemValue('token', newAccessToken);
