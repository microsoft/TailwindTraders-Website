import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';

import { animateScroll as scroll } from "react-scroll";
import { LoadingSpinner } from "../../shared";
import Alert from "react-s-alert";

import APIClient from "../../ApiClient";
import Detail from "./detail";
import { CommonServices } from '../../services';

class DetailContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popularProducts: [],
            detailProduct: {},
            loading: true,
            loadingRelated: null,
            relatedDetailProducts: [],
        };
        this.addProductToCart = this.addProductToCart.bind(this);
    }

    async componentDidMount() {
        scroll.scrollToTop();
        await this.getDetailPageData(this.props.match.params.productId);
    }

    async componentDidUpdate(prevProps) {
        const oldProductId = prevProps.match.params.productId;
        const newProductId = this.props.match.params.productId;
        if (newProductId !== oldProductId) {
            await this.getDetailPageData(newProductId);
            scroll.scrollToTop();
        }
    }

    async getDetailPageData(productId) {
        const detailProduct = await CommonServices.getDetailProductData(productId);

        // let popularProducts = await APIClient.getHomePageData();
        // if (popularProducts) {
        //     popularProducts = popularProducts.popularProducts.slice(0, 3);
        // }

        // this.setState({ popularProducts, detailProduct, loading: false });
        this.setState({ detailProduct, loading: false });
    }

    async addProductToCart() {

        const profile = await CommonServices.getProfileData(this.props.userInfo.token);
        const { profile: { email } } = profile;
        this.state.detailProduct.email = email

        await CommonServices.postProductToCart(this.props.userInfo.token, this.state.detailProduct)
            .then((data) => { this.showSuccesMessage(data) })
            .catch((data) => { this.showErrorMessage(data) });


        this.setState({ loadingRelated: true });

        setTimeout(async () => {
            console.log(this.props)
            let relatedDetailProducts = await CommonServices
                .getRelatedDetailProducts(this.props.userInfo.token, this.state.detailProduct.type.id);

            if (relatedDetailProducts) {
                relatedDetailProducts = relatedDetailProducts.recommendations.slice(0, 3);
            }

            this.setState({ relatedDetailProducts, loadingRelated: false });
        }, 2000);



        this.props.sumProductInState();
    }

    showSuccesMessage(data) {
        Alert.success(data.message, {
            position: "top",
            effect: "scale",
            beep: true,
            timeout: 1500,
        });
    }

    showErrorMessage(data) {
        Alert.error(data.message, {
            position: "top",
            effect: "scale",
            beep: true,
            timeout: 5000,
        });
    }

    render() {
        const { loading, detailProduct, loadingRelated } = this.state;
        const { loggedIn } = this.props.userInfo
        return (
            <Fragment>
                <Alert stack={{ limit: 1 }} />
                {loading ? <LoadingSpinner /> :
                    <Detail
                        loggedIn={loggedIn}
                        detailProductData={detailProduct}
                        addProductToCart={this.addProductToCart}
                        loadingRelated={loadingRelated}
                    />
                }
            </Fragment>
        );
    }
}

const mapStateToProps = state => state.login;

export default connect(mapStateToProps)(DetailContainer);