import React from "react";
import { Link } from "react-router-dom";

const PurchaseHistory = ({ title, image }) => {
    const bgImage = {
        backgroundImage: `url(${image})`,
    }

    return (
        <div className="favorite__item" style={bgImage}>
            <Link to="/" className="btn btn--secondary">
                {title}
            </Link>
        </div>
    )
};

export default PurchaseHistory;
