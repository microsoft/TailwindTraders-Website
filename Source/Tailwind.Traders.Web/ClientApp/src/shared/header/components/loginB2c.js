import React from "react";

import { withTranslation } from "react-i18next";

const LoginB2c = ({ t, onLoginClick }) => (
    <div className="modal-b2c">
        <p>{t('shared.login.claim')}</p>
        <button className="btn btn--secondary b2c-button"
            onClick={onLoginClick}
        >{t('shared.login.B2CButton')}</button>
    </div>
);

export default withTranslation()(LoginB2c);