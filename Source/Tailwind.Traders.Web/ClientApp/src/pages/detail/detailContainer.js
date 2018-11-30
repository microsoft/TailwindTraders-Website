import React, { Component, Fragment } from "react";

import { animateScroll as scroll } from "react-scroll";
import { LoadingSpinner } from "../../shared";
import Alert from "react-s-alert";

import APIClient from "../../ApiClient";
import Detail from "./detail";

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
        const detailProduct = await APIClient.getDetailProductData(productId);

        let popularProducts = await APIClient.getHomePageData();
        if (popularProducts) {
            popularProducts = popularProducts.popularProducts.slice(0, 3);
        }

        this.setState({ popularProducts, detailProduct, loading: false });
    }

    async addProductToCart() {
        const profile = await APIClient.getProfileData();
        const { profile: { email } } = profile;
        this.state.detailProduct.email = email

        await APIClient.postProductToCart(this.state.detailProduct)
            .then((data) => { this.showSuccesMessage(data) })
            .catch((data) => { this.showErrorMessage(data) });


        this.setState({ loadingRelated: true });

        setTimeout(async () => {
            let relatedDetailProducts = await APIClient.getRelatedDetailProducts(email, this.state.detailProduct.type.id);
            relatedDetailProducts = relatedDetailProducts.recommendations.slice(0, 3);

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
        const { loading, detailProduct, relatedDetailProducts, loadingRelated } = this.state;

        return (
            <Fragment>
                <Alert stack={{ limit: 1 }} />
                {loading ? <LoadingSpinner /> :
                    <Detail
                        relatedDetailProducts={relatedDetailProducts}
                        detailProductData={detailProduct}
                        addProductToCart={this.addProductToCart}
                        loadingRelated={loadingRelated}
                    />
                }
            </Fragment>
        );
    }
}

export default DetailContainer;
