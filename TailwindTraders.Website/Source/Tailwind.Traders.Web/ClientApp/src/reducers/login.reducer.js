import { FORM_EMAIL, SAVE_USER, REMOVE_USER } from '../types/types';

let userInfo = JSON.parse(localStorage.getItem('state'));

const initialDefaultState = {
    userInfo: {
        loggedIn: false,
        token: '',
        user: {
            email: '',
            type: ''
        }
    }
}

const defaultState = userInfo ? { userInfo } : { ...initialDefaultState };

export default (state = defaultState, action) => {
    switch (action.type) {
        case FORM_EMAIL:
            return { ...state, ...action };
        case SAVE_USER:
            return { userInfo: action.userInfo };
        case REMOVE_USER:
            return { ...initialDefaultState };
        default:
            return defaultState;
    }
};