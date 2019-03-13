import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';

import Home from "./home";
import { ProductService } from "../../services";

import Powertools from "../../assets/images/home_powertools.jpg";
import Plumbing from "../../assets/images/home_plumbing.jpg";
import Garden from "../../assets/images/home_gardencenter.jpg";
import Electrical from "../../assets/images/home_electrical.jpg";

class HomeContainer extends Component {
    constructor() {
        super();
        this.state = {
            recommendedProducts: [
                {
                    title: "Power Tools",
                    imageUrl: Powertools,
                    cssClass: "grid__item-a",
                    url: "/list/diytools"
                },
                {
                    title: "Plumbing",
                    imageUrl: Plumbing,
                    cssClass: "grid__item-b",
                    url: "/list/kitchen"
                },
                {
                    title: "Electrical",
                    imageUrl: Electrical,
                    cssClass: "grid__item-c",
                    url: "/list/home"
                },
                {
                    title: "Garden Center",
                    imageUrl: Garden,
                    cssClass: "grid__item-d",
                    url: "/list/gardening"
                },
            ],
            popularProducts: [],
            loading: true,
        };
    }

    async componentDidMount() {
        if (this.props.userInfo.loggedIn) {
            await this.renderPopularProducts()
        }
    }

    async shouldComponentUpdate(nextProps) {
        if ((this.props.userInfo.loggedIn !== nextProps.userInfo.loggedIn) && nextProps.userInfo.loggedIn) {
            await this.renderPopularProducts(nextProps.userInfo.token)
        }
    }

    async renderPopularProducts(token) {
        token = token || this.props.userInfo.token;

        let popularProducts = await ProductService.getHomePageData(token);

        if (popularProducts && popularProducts.data.popularProducts) {
            popularProducts = popularProducts.data.popularProducts.slice(0, 3);
            this.setState({ popularProducts, loading: false });
        }
    }

    render() {
        const { recommendedProducts, popularProducts } = this.state;
        const { loggedIn } = this.props.userInfo
        return (
            <Fragment>
                <Home
                    recommendedProducts={recommendedProducts}
                    popularProducts={popularProducts}
                    loggedIn={loggedIn}
                />
            </Fragment>
        );
    }
}

const mapStateToProps = state => state.login;

export default connect(mapStateToProps)(HomeContainer);
