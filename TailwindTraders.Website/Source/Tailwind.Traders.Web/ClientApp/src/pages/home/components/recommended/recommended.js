import React from "react";
import { Link } from "react-router-dom";

import { withNamespaces } from "react-i18next";

import RecommendedItem from "./components/recommendedItem";
import { UploadFile } from "../../../../shared/index";

import { ReactComponent as CouponsImg } from "../../../../assets/images/icon-coupons.svg";

const Recommended = ({ t, recommendedProductsData, loggedIn }) => {
    return (
        <section className="recommended">
            <UploadFile
                title={t("home.recommended.uploadPhotoTitle")}
                subtitle={t("home.recommended.uploadPhotoSubtitle")}
            />
            {loggedIn && <Link className="btn  btn--secondary" to="/coupons">
                <CouponsImg />
                <span>{t("shared.seeMyCoupons")}</span>
            </Link>}

            <div className="grid__wrapper">
                <h2 className="grid__heading">{t("home.recommended.recommended")}</h2>
                <div className="grid">
                    {recommendedProductsData &&
                        recommendedProductsData.map((recommendedProductsInfo, index) => {
                            return <RecommendedItem {...recommendedProductsInfo} key={index} />;
                        })}
                </div>
            </div>
        </section>
    );
};

export default withNamespaces()(Recommended);
