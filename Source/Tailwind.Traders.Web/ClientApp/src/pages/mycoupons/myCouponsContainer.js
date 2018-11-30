import React, { Component, Fragment } from "react";

import APIClient from "../../ApiClient";
import { LoadingSpinner } from "../../shared"

import MyCoupons from "./myCoupons";

class MyCouponsContainer extends Component {
    constructor() {
        super();
        this.state = {
            smallCoupons: [],
            bigCoupon: {},
            recommendedProducts: [],
            loading: true,
        };
    }

    async componentDidMount() {
        const couponsPageData = await APIClient.getCouponsPageData();
        const recommendedProducts = couponsPageData.recommendedProducts;
        const { smallCoupons, bigCoupon } = couponsPageData.coupons;

        this.setState({ smallCoupons, bigCoupon, recommendedProducts, loading: false });
    }

    render() {
        const { loading, smallCoupons, bigCoupon, recommendedProducts } = this.state
        return (
            <Fragment>
                {loading ? <LoadingSpinner /> : <MyCoupons
                    bigCoupon={bigCoupon}
                    smallCoupons={smallCoupons}
                    recommendedProducts={recommendedProducts} />
                }

            </Fragment>
        );
    }
}

export default MyCouponsContainer;
