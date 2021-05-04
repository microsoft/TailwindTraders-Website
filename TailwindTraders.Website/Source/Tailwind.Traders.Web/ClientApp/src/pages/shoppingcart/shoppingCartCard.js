import React, { Component } from "react";
import { Link } from "react-router-dom";

class ShoppingCartCard extends Component {
    incrementQty = () => {
        const productQuantity = this.props.qty + 1
        this.props.updateQty(this.props._cdbid, productQuantity);
    }

    decrementQty = () => {
        const productQuantity = this.props.qty - 1
        this.props.updateQty(this.props._cdbid, productQuantity);
    }

    render() {
        return (
            <article className="shopping-card__item">
                <Link style={{ textDecoration: 'none' }} to={`/product/detail/${this.props.id}`}>
                    <img className="shopping-card__photo" src={this.props.imageUrl} alt={`${this.props.name} photography`} />
                    <h3 className="shopping-card__heading">${this.props.price}</h3>
                    <p className="shopping-card__description">{this.props.name}</p>
                </Link>
                <div className="manager">
                    <button className="manager__btn" onClick={this.decrementQty}>-</button>
                    <p className="manager__number" >{this.props.qty}</p>
                    <button className="manager__btn" onClick={this.incrementQty}>+</button>
                </div>
            </article>
        );
    }
}

export default ShoppingCartCard;

