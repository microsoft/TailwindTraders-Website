import React from "react";

import { withNamespaces } from "react-i18next";

const LoginForm = ({ t, handleSubmit, keepInputEmail, keepInputPassword, text }) => (
    <form onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
    }}>
        <label className="modal__label" htmlFor="email">{t('shared.header.email')}</label>
        <input
            onChange={keepInputEmail}
            value={text}
            className="modal__input"
            id="email"
            type="email"
            placeholder={t('shared.header.emailPlaceholder')}
        />
        <label className="modal__label" htmlFor="password">{t('shared.header.password')}</label>
        <input
            onChange={keepInputPassword}
            value={text}
            className="modal__input"
            id="password"
            type="password"
            placeholder={t('shared.header.passwordPlaceholder')}
        />
        <div className="modal__btns">
            <button type="submit" value="Submit" className="btn btn--primary">{t('shared.header.login')}</button>
        </div>
    </form>
);

export default withNamespaces()(LoginForm);