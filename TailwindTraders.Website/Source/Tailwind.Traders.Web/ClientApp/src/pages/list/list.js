import React from "react";

import { Banner, ListGrid, ListAside } from "./components";

const List = ({ typesList, brandsList, onFilterChecked, productsList, loggedIn }) => {
    return (
        <div className="list">
            <Banner loggedIn={loggedIn} />
            <div className="list__content">
                <ListAside
                    onFilterChecked={onFilterChecked}
                    typesList={typesList}
                    brandsList={brandsList}
                />
                <ListGrid productsList={productsList} />
            </div>
        </div>
    );
};

export default List;
