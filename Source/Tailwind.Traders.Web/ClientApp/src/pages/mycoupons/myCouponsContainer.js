import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';

import { LoadingSpinner } from "../../shared"

import MyCoupons from "./myCoupons";
import { ProductService } from '../../services';

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
        const token = this.props.userInfo.token;
        const couponsPageData = await ProductService.getCouponsPageData(token);
        
        const recommendedProducts = couponsPageData.data.recommendedProducts;
        const { smallCoupons = [], bigCoupon = [] } = couponsPageData.data.coupons || {};

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

const mapStateToProps = state => state.login;

export default connect(mapStateToProps)(MyCouponsContainer);