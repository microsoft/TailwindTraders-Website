import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import Electrical from "../../assets/images/home_electrical.jpg";
import Garden from "../../assets/images/home_gardencenter.jpg";
import Plumbing from "../../assets/images/home_plumbing.jpg";
import Powertools from "../../assets/images/home_powertools.jpg";
import { ProductService } from "../../services";
import Home from "./home";



class HomeContainer extends Component {
    constructor() {
        super();
        this.state = {
            recommendedProducts: [
                {
                    title: "Power Tools",
                    imageUrl: Powertools,
                    cssClass: "grid__item-a",
                    url: "/list/kitchen",
                    eventId: ""
                },
                {
                    title: "Electrical",
                    imageUrl: Electrical,
                    cssClass: "grid__item-b",
                    url: "/list/home",
                    eventId: ""
                },
                {
                    title: "Garden Center",
                    imageUrl: Garden,
                    cssClass: "grid__item-c",
                    url: "/list/gardening",
                    eventId: ""
                },
                {
                    title: "Plumbing",
                    imageUrl: Plumbing,
                    cssClass: "grid__item-d",
                    url: "/list/diytools",
                    eventId: ""
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

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    async getRank() {
        const response = await fetch('/api/Personalizer/rank');
        const data = await response.json();
        let newRanking = this.updateProducts(data);
        this.setState({ recommendedProducts: newRanking });

        //const response = await fetch('/api/Personalizer/rank');
        //try {
        //    this.handleErrors(response);
        //    let newRanking = this.updateProducts(response.json());
        //    this.setState({ recommendedProducts: newRanking });
        //} catch{
        //    console.error(response.error);
        //}
        //.then((response) => {
        //    this.handleErrors(response);
        //    let newRanking = this.updateProducts(response.json());
        //    this.setState({ recommendedProducts: newRanking });
        //})
        //.then(console.log("ok"))
        //.catch(error => console.log(error));
    }

    updateProducts(data) {
        var cssEnum = ["grid__item-a", "grid__item-b", "grid__item-c", "grid__item-d"];

        var recommendSource = this.state.recommendedProducts;
        var newHeroIndex = recommendSource.findIndex(obj => obj.title === data.rewardActionId);

        var newRecommend = [];
        var counter;
        for (counter = 0; counter < recommendSource.length; counter++) {
            newRecommend.push(Object.assign({}, recommendSource[newHeroIndex % recommendSource.length]));
            newHeroIndex++;
        }

        newRecommend.map((category, index) => {
            category.cssClass = cssEnum[index];
            category.eventId = data.eventId;
        })

        return newRecommend;
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
