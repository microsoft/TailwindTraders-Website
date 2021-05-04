import React from "react";
import { Link } from "react-router-dom";

import { withNamespaces } from "react-i18next";

const Card = ({ id, imageUrl, name, price, t }) => (
    <article className="card__item">
        <Link style={{ textDecoration: 'none' }} to={`/product/detail/${id}`}>
            <img className="card__photo" src={imageUrl} alt={`${name} photography`} />
            <h3 className="card__heading">${price}</h3>
            <p className="card__description">{name}</p>
            <button className="btn  btn--primary">{t("shared.addToList")}</button>
        </Link>
    </article>
);

export default withNamespaces()(Card);
