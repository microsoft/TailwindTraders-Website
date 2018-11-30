import React from "react";

import { withNamespaces } from "react-i18next";

const BigCoupon = ({ bigCoupon }) => {
    const sectionStyle = bigCoupon => {
        return {
            backgroundImage: `url(${bigCoupon.image})`,
        };
    };

    return (
        <div className="mycoupons__disclaimer" style={sectionStyle(bigCoupon)}>
            <div className="mycoupons__disclaimer-content">
                <h1 className="mycoupons__disclaimer-price">{bigCoupon.discount}</h1>
                <h2 className="mycoupons__disclaimer-description">{bigCoupon.title}</h2>
            </div>
        </div>
    );
};

export default withNamespaces()(BigCoupon);
