import React, { Component } from "react";
import { Link } from "react-router-dom";

import { NamespacesConsumer } from "react-i18next";
import { LoadingSpinner } from "../../shared";

import { Popular } from "../home/components";

class Detail extends Component {

    addToCart = () => {
        this.props.addProductToCart();
    }


    render() {
        const { name, price, imageUrl, stockUnits } = this.props.detailProductData;
        const type = Object.assign({}, this.props.detailProductData.type);
        const { features } = this.props.detailProductData;

        const relatedDetailProducts = this.props.relatedDetailProducts;
        const hasRelatedDetailProducts = relatedDetailProducts && relatedDetailProducts.length;

        const bgImage = {
            backgroundImage: `url(${imageUrl})`,
        };

        const { loadingRelated, loggedIn } = this.props;


        return (
            <NamespacesConsumer>
                {t => (
                    <div className="detail">
                        <div className="detail__wrapper">
                            <div className="detail__image" style={bgImage} />
                            <div className="detail__info">
                                <p className="detail__label">{type.name}</p>
                                <div className="detail__data">
                                    <span className="detail__title">{name} (${price})</span>
                                    {stockUnits > 0 ? 
                                        <span className="detail__tag">{t("detail.inStock")}</span> :
                                        <span className="detail__tag nostock">{t("detail.outStock")}</span>
                                    }
                                    <span className="detail__tag">{t("detail.tagName1")}</span>
                                    <span className="detail__tag">{t("detail.tagName2")}</span>
                                </div>
                                {stockUnits > 0 && loggedIn && <div className="detail__buttons">
                                    <button className={`btn btn--primary btn--cart`} onClick={this.addToCart}>{t("detail.addToCart")}</button>
                                    <Link className="btn btn--secondary" to="/shopping-cart">{t("detail.shoppingCart")}</Link>
                                </div> }
                                <div className="detail__description">
                                    <ul>
                                        {features &&
                                            features.map((feature, index) => (
                                                <li className="detail__feature" key={index}>
                                                    <span className="detail__feature-title">{`${feature.title}:`}</span>
                                                    <span className="detail__feature-description">{feature.description}</span>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {loadingRelated ? <LoadingSpinner /> : null}
                        {hasRelatedDetailProducts ? <Popular relatedDetailProducts={relatedDetailProducts} /> : null}
                    </div>
                )}
            </NamespacesConsumer>
        );
    }
}

export default Detail;
