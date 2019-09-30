import React from "react";
import { Link } from "react-router-dom";

async function handleClickReward(cssClass, eventId) {
    if (eventId) {
        var rewardValue = (cssClass === "grid__item-a") ? 1 : 0;
        var rsp = await postReward(`/api/Personalizer/reward/${eventId}`, rewardValue);
        if (!rsp.ok) {
            console.error("Failed to send reward: " + rsp.error);
        }
    }
}

async function postReward(url, rewardValue) {
    var reward = { value: rewardValue };
    var rsp = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reward)
    })
    return rsp;
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
