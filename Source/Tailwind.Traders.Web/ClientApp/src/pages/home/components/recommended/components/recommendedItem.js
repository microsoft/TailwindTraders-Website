import React from "react";
import { Link } from "react-router-dom";

const generateStyle = imageUrl => {
    return {
        backgroundImage: `url(${imageUrl})`,
    };
};

const RecommendedItem = ({ title, imageUrl, cssClass, url }) => (
    <div className={`grid__item ${cssClass}`} style={generateStyle(imageUrl)}>
    <Link className="btn  btn--secondary" to={url}>
            {title}
        </Link>
    </div>
);

export default RecommendedItem;
