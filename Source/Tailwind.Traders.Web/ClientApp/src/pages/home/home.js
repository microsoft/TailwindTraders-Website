import React from "react";

import { Hero, Recommended, Getapp, Popular } from "./components";

const Home = ({ recommendedProducts, popularProducts, loggedIn }) => {
    return (
        <div className="home">
            <Hero />
            <Recommended recommendedProductsData={recommendedProducts} loggedIn={loggedIn} />
            <Getapp />
            {loggedIn && <Popular popularProductsData={popularProducts} />}
        </div>
    );
};

export default Home;