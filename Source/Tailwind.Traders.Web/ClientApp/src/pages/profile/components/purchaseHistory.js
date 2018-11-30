import React from "react";

const PurchaseHistory = ({ name, image, price }) => {
    return (
        <div className="history__item">
            <div className="history__data">
                <img className="history__image" src={`${image}`} alt={`${name}_image`} />
                <div className="history__info">
                    <p className="history__info-name">{`${name}`}</p>
                    <p className="history__info-price">{`${price}`}</p>
                </div>
            </div>
        </div>
    )
};

export default PurchaseHistory;
