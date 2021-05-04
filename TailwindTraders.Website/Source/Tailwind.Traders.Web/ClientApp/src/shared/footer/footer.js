import React from "react";
import { Link } from "react-router-dom";

import { withNamespaces } from "react-i18next";

import { ReactComponent as Logo } from "../../assets/images/logo-horizontal.svg";

const Footer = ({ t }) => {
    return (
        <footer className="foo">
            <div className="foo__content">
                <Link className="foo__link" to="/">
                    <Logo />
                </Link>
                <div className="foo__disclaimer">
                    <p className="foo-text">{t("shared.footer.disclaimer")}</p>
                </div>
            </div>
        </footer>
    );
};

export default withNamespaces()(Footer);
