import React, { Component, Fragment } from "react";

import APIClient from "../../ApiClient";
import Home from "./home";

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
                },
                {
                    title: "Plumbing",
                    imageUrl: Plumbing,
                    cssClass: "grid__item-b",
                },
                {
                    title: "Electrical",
                    imageUrl: Electrical,
                    cssClass: "grid__item-c",
                },
                {
                    title: "Garden Center",
                    imageUrl: Garden,
                    cssClass: "grid__item-d",
                },
            ],
            popularProducts: [],
            loading: true,
        };
    }

    async componentDidMount() {
        let popularProducts = await APIClient.getHomePageData();

        if (popularProducts.errorMsj) {
            console.error(popularProducts.errorMsj);
        } else {
            if (popularProducts) {
                popularProducts = popularProducts.popularProducts.slice(0, 3);
            }
            this.setState({ popularProducts, loading: false });
        }
    }

    render() {
        const { recommendedProducts, popularProducts } = this.state;
        return (
            <Fragment>
                <Home recommendedProducts={recommendedProducts} popularProducts={popularProducts} />
            </Fragment>
        );
    }
}

export default HomeContainer;
