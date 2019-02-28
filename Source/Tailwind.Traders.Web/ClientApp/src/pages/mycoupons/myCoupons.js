import React from "react";

import { withNamespaces } from "react-i18next";

import { SmallCoupons, BigCoupon, RecommendedProducts } from "./components";

const MyCoupons = ({ t, bigCoupon, smallCoupons, recommendedProducts }) => {
    return (
        <div className="mycoupons">
            <div className="mycoupons__container">
                {!smallCoupons.length && <p className="mycoupons-empty">{t("mycoupons.small.noCoupons")}</p>}
                {!bigCoupon.length && <p className="mycoupons-empty">{t("mycoupons.big.noCoupons")}</p>}
                
                {smallCoupons.length || bigCoupon.length ? <div>
                    <h1 className="mycoupons__title">{t("mycoupons.title")}</h1>
                    <p className="mycoupons__subtitle">{t("mycoupons.subtitle")}</p>  
                </div>
                : null}

            </div>

            {smallCoupons.length ? <SmallCoupons smallCoupons={smallCoupons} /> : null}
            {bigCoupon.length ? <BigCoupon bigCoupon={bigCoupon} /> : null}

            <RecommendedProducts recommendedProducts={recommendedProducts} />
        </div>
    );
};

export default withNamespaces()(MyCoupons);
