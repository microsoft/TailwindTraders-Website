import React from "react";
import { Link } from "react-router-dom";
import { withNamespaces } from "react-i18next";

import { UploadFile } from "../../../../shared";
import { ReactComponent as CouponsImg } from "../../../../assets/images/icon-coupons.svg";

const Banner = ({ t, loggedIn }) => {
    return (
        <div className="banner">
            <div className="banner__buttons">
                <UploadFile title={t("shared.banner.uploadPhotoTitle")} />
                {loggedIn && <Link className="btn btn--secondary" to="/coupons">
                    <CouponsImg />
                    <span>{t("shared.seeMyCoupons")}</span>
                </Link>}
            </div>
        </div>
    );
};

export default withNamespaces()(Banner);
