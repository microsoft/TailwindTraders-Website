import React from "react";

import { withNamespaces } from "react-i18next";

import SmallCouponItem from "./components/smallCouponItem";

const SmallCoupons = ({ smallCoupons }) => {
    return (
        <div className="mycoupons__grid">
            {smallCoupons.map((smallCouponsInfo, index) => (
                <SmallCouponItem {...smallCouponsInfo} key={index} />
            ))}
        </div>
    );
};

export default withNamespaces()(SmallCoupons);
