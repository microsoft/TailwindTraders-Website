import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

import { NamespacesConsumer } from "react-i18next";

import Profile from "./components/profile"
import SmallCoupons from "../mycoupons/components/smallcoupons/smallCoupons";
import PurchaseHistory from "./components/purchaseHistory"
import FavoriteCategories from "./components/favoriteCategories"
import { Card } from "../../shared/"

import PlantImg from "../../assets/images/profile-plant.jpg";
import ExteriorImg from "../../assets/images/profile-sink.jpg";
import KitchenImg from "../../assets/images/profile-kitchen.jpg";
import Plumbing from "../../assets/images/home_plumbing.jpg";
import Garden from "../../assets/images/home_gardencenter.jpg";
import Electrical from "../../assets/images/home_electrical.jpg";
import { UserService } from '../../services';

class ProfileContainer extends Component {
    constructor() {
        super();
        this.state = {
            profile: {},
            coupons: {
                smallCoupons: [],
            },
            recommendedProducts: [],
            purchaseHistory: [
                {
                    name: "Plant wooden pot",
                    price: "$22.99",
                    image: PlantImg,
                },
                {
                    name: "Exterior sink",
                    price: "$54.99",
                    image: ExteriorImg,
                },
                {
                    name: "White kitchen island",
                    price: "$150.99",
                    image: KitchenImg,
                },
            ],
            favoriteCatregories: [
                {
                    title: 'Plumbing',
                    image: Plumbing,
                },
                {
                    title: 'Garden',
                    image: Garden,
                },
                {
                    title: 'Kitchen',
                    image: Electrical,
                },
            ]
        };
    }

    async componentDidMount() {
        const userInformation = await UserService.getUserInfoData(this.props.userInfo.token);
        this.setState({ ...userInformation });
    }

    render() {
        const { coupons } = this.state
        const { purchaseHistory, recommendedProducts, favoriteCatregories, profile } = this.state
        const isSmallCouponsAvailable = coupons && coupons.smallCoupons.length;
        return (
            <NamespacesConsumer>
                {t => (
                    <div className="profile">
                        <div className="grid-container">
                            <Profile {...profile} />
                            <aside className="aside">
                                <div className="profile__heading">
                                    <h2 className="profile__heading-title">{t("profile.cupons.title")}</h2>
                                    {isSmallCouponsAvailable ?
                                        <Link className="btn  btn--secondary" to="/coupons">
                                            <span>{t("profile.cupons.seeAll")}</span>
                                        </Link> : null}
                                </div>
                                {isSmallCouponsAvailable ? <SmallCoupons smallCoupons={coupons.smallCoupons} /> :
                                    <div className="profile__data--empty">
                                        <span className="profile__title profile__info">{t("profile.cupons.noCupons")}</span>
                                    </div>}
                            </aside>

                            <div className="history">
                                <h2 className="profile__heading-title profile__heading-history">{t("profile.history.title")}</h2>
                                {purchaseHistory && purchaseHistory.map((purchaseHistoryItem, index) => (
                                    <PurchaseHistory {...purchaseHistoryItem} key={index} />
                                ))}
                            </div>
                        </div>
                        <h2 className="profile__heading-title profile__heading-recommended">{t("profile.recommended.title")}</h2>
                        <div className="cards">
                            {recommendedProducts && recommendedProducts.map((recommendedProducts, index) => (
                                <Card {...recommendedProducts} key={index} />
                            ))}
                        </div>
                        <h2 className="profile__heading-title">{t("profile.favorite.title")}</h2>
                        <div className="favorite">
                            {favoriteCatregories && favoriteCatregories.map((favoriteCatregory, index) => (
                                <FavoriteCategories {...favoriteCatregory} key={index} />
                            ))}
                        </div>
                    </div>
                )}
            </NamespacesConsumer>
        );
    }
}

const mapStateToProps = state => state.login;

export default connect(mapStateToProps)(ProfileContainer);
