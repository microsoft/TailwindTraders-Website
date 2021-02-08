import React from "react";

import { withTranslation } from "react-i18next";

import { Card } from "../../../../shared";

const recommendedProducts = ({ t, recommendedProducts }) => {
    return (
        <section className="featured">
            <h2 className="featured__title">{t("mycoupons.RecentSearchedProducts.title")}</h2>
            <div className="cards">
                {recommendedProducts.map((recentSearchedProductsInfo, index) => {
                    return <Card {...recentSearchedProductsInfo} key={index} />;
                })}
            </div>
        </section>
    );
};

export default withTranslation()(recommendedProducts);
