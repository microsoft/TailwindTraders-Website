import React from "react";

import { withNamespaces } from "react-i18next";

const generateStyle = image => {
    return {
        backgroundImage: `url(${image})`,
    };
};

const SmallCouponItem = ({ t, image, discount, title, until, description }) => {
    return (
        <article className="coupon">
            <div className="coupon__img-wrapper">
                <div className="coupon__img" style={generateStyle(image)} />
            </div>
            <div className="coupon__content">
                <h2 className="coupon__price">{discount}</h2>
                <p className="coupon__title">{title}</p>
                <p className="coupon__description">{description}</p>
                <p className="coupon__until">
                    {t("mycoupons.smallcoupons.until")} {until}
                </p>
            </div>
        </article>
    );
};

export default withNamespaces()(SmallCouponItem);
