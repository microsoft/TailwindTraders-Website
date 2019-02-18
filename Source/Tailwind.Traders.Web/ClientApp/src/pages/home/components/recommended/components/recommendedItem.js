import React from "react";
import { Link } from "react-router-dom";

const generateStyle = imageUrl => {
    return {
        backgroundImage: `url(${imageUrl})`,
    };
};

const RecommendedItem = ({ title, imageUrl, cssClass }) => (
    <div className={`grid__item ${cssClass}`} style={generateStyle(imageUrl)}>
        <Link className="btn  btn--secondary" to="/">
            {title}
        </Link>
    </div>
);

export default RecommendedItem;
