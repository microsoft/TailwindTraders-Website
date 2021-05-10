import React from "react";

import { Card } from "../../../../shared";

const ListGrid = ({ productsList }) => {
    return (
        <div className="list-grid">
            {productsList && productsList.map((productsListInfo, index) => {
                return <Card {...productsListInfo} key={index} />;
            })}
        </div>
    );
};

export default ListGrid;
