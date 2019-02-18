import React from "react";

import { withNamespaces } from "react-i18next";

import { Card } from "../../../../shared";

const Popular = ({ t, popularProductsData, relatedDetailProducts }) => {
    popularProductsData = popularProductsData || [];
    relatedDetailProducts = relatedDetailProducts || [];
    return (
        <section className="featured">
            {popularProductsData.length ? <h2 className="featured__title">{t("home.popular.products")}</h2> 
            : <h2 className="featured__title">{t("home.recommended.products")}</h2>}
            <div className="cards">
                {popularProductsData.map((popularProductsInfo, index) => {
                    return <Card {...popularProductsInfo} key={index} />;
                })}
                {relatedDetailProducts.map((popularProductsInfo, index) => {
                    return <Card {...popularProductsInfo} key={index} />;
                })}
            </div>
        </section>
    );
};

export default withNamespaces()(Popular);

