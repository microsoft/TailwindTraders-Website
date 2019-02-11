import { FORM_EMAIL } from './types';

const defaultState = {
    email: '',
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case FORM_EMAIL:
            return { ...state, ...action };
        default:
            return state;
    }
};