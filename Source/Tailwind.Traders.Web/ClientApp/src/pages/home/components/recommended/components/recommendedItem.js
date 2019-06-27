import React from "react";
import { Link } from "react-router-dom";

const RecommendedItem = ({ title, imageUrl, cssClass, url }) => {
    return (
        <div className={`grid__item ${cssClass}`} style={{backgroundImage: `url(${imageUrl})`}}>
            <Link className="btn  btn--secondary" to={url}>
                {title}
            </Link>
        </div>
    )
};


export default RecommendedItem;
