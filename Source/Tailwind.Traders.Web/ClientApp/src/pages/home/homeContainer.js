import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';

import Home from "./home";
import { ProductService } from "../../services";

import Powertools from "../../assets/images/home_powertools.jpg";
import Plumbing from "../../assets/images/home_plumbing.jpg";
import Garden from "../../assets/images/home_gardencenter.jpg";
import Electrical from "../../assets/images/home_electrical.jpg";
import recommended from "./components/recommended/recommended";

class HomeContainer extends Component {
    constructor() {
        super();
        this.state = {
            recommendedProducts: [
                {
                    title: "Power Tools",
                    imageUrl: Powertools,
                    cssClass: "grid__item-a",
                    url: "/list/kitchen"
                },
                {
                    title: "Electrical",
                    imageUrl: Electrical,
                    cssClass: "grid__item-b",
                    url: "/list/home"
                },
                {
                    title: "Garden Center",
                    imageUrl: Garden,
                    cssClass: "grid__item-c",
                    url: "/list/gardening"
                },
                {
                    title: "Plumbing",
                    imageUrl: Plumbing,
                    cssClass: "grid__item-d",
                    url: "/list/diytools"
                }
            ],
            popularProducts: [],
            loading: true,
        };
    }

    async componentDidMount() {

        if (this.props.userInfo.loggedIn) {
            await this.renderPopularProducts()
        }
        this.getRank()
    }

    async shouldComponentUpdate(nextProps) {
        if ((this.props.userInfo.loggedIn !== nextProps.userInfo.loggedIn) && nextProps.userInfo.loggedIn) {
            await this.renderPopularProducts(nextProps.userInfo.token)
        }
    }

    async getRank() {
        // TODO get route dynamically
        const response = await fetch('/api/Personalizer/rank');
        const data = await response.json();
        console.log();
        let newRanking = this.updateProducts(data);
        this.setState({ recommendedProducts: newRanking });
    }

    updateProducts(data) {
        var recommended = this.state.recommendedProducts;//[...this.state.recommendedProducts];
        var tmp = recommended[0];
        var curHeroIndex = recommended.findIndex(obj => obj.title === data.rewardActionId);
        var hero = recommended[curHeroIndex];
        recommended[curHeroIndex].title = tmp.title;
        recommended[curHeroIndex].imageUrl = tmp.imageUrl;
        recommended[curHeroIndex].url = tmp.url;
        recommended[0].title = hero.title;
        recommended[0].imageUrl = hero.imageUrl;
        recommended[0].url = hero.url;

        //var tmp = recommendedProductClone[recommendedProductsClone.findIndex(obj => obj.title === data.rewardActionId)];
        //recommendedProductClone[0] = 
        ////var recommendedProducts = this.state.recommendedProducts;
        //for (i = 0; i < ranking.length; i++) {
        //    var index = recommendedProductsClone.findIndex(obj => obj.title === ranking[i].id);

        //    recommended[i].title = recommendedProductsClone[index].title;
        //    recommended[i].imageUrl = recommendedProductsClone[index].imageUrl;
        //    recommended[i].url = recommendedProductsClone[index].url;
        //}
        return recommended;
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
