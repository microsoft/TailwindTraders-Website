import React from "react";

import { Hero, Recommended, Getapp, Popular } from "./components";

const Home = ({ recommendedProducts, popularProducts }) => {
    return (
        <div className="home">
            <Hero />
            <Recommended recommendedProductsData={recommendedProducts} />
            <Getapp />
            <Popular popularProductsData={popularProducts} />
        </div>
    );
};

export default Home;
