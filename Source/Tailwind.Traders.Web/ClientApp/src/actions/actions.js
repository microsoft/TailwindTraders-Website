import { FORM_EMAIL, SAVE_USER, REMOVE_USER } from '../types/types';

export const textAction = email => ({
    type: FORM_EMAIL,
    email,
});

export const submitAction = userInfo => ({
    type: SAVE_USER,
    userInfo
});

export const clickAction = () => ({
    type: REMOVE_USER,
});