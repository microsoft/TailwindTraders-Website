import React from "react";
import { Link } from "react-router-dom";

function handleClickReward(cssClass, eventId) {
    if (cssClass === "grid__item-a") {
        fetch('/api/Personalizer/reward');
            //.then()
            //.catch(console.error("Failed to send reward"));
    }
}

const RecommendedItem = ({ title, imageUrl, cssClass, url, eventId }) => {
    return (
        <div className={`grid__item ${cssClass}`} style={{ backgroundImage: `url(${imageUrl})` }}>
            <Link className="btn  btn--secondary" to={url}
                onClick={() => { handleClickReward(cssClass, eventId) }}>
                {title}
            </Link>
        </div>
    )
};


export default RecommendedItem;
