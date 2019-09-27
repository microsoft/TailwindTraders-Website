import axios from 'axios'
import toast from './toast'
import { handleUnathenticatedRequest } from './refreshJWTHelper'


function errorResponseHandler(error) {
    // if it's token expired error, solve it silently
    if (isTokenExpiredError(error)) {
        return handleUnathenticatedRequest(error);
    }

    // otherwise, if has response show the error
    if (error.response) {
        toast.error(error.response.data || error.response.statusText);
    }

    // check for errorHandle config
    if (error.config.hasOwnProperty('errorHandle') && error.config.errorHandle === false) {
        return Promise.reject(error);
    }
}

function isTokenExpiredError(error) {    
    if (error.response && error.response.status === 401) {
        return true;
    }

    if (error.response && error.response.data) {

        const errorResponseData = error.response.data;

        if (typeof errorResponseData === 'string') {
            return !!errorResponseData.match(/401|[Uu]nauthorized/);
        }
    }

    return false;
}

// apply interceptor on response
axios.interceptors.response.use(
    response => response,
    errorResponseHandler   
);

export default errorResponseHandler;