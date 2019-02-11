import { FORM_EMAIL, FORM_SUBMIT } from './types';

export const textAction = email => ({
    type: FORM_EMAIL,
    email,
});

export const submitAction = () => ({
    type: FORM_SUBMIT,
});