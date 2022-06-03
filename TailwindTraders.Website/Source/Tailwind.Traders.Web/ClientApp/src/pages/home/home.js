import React from "react";

import { Hero, Recommended, Getapp, Popular } from "./components";
import ChatBubble from './components/chatBubble/chatBubble';

const Home = ({ recommendedProducts, popularProducts, loggedIn }) => {
    return (
        <div className="home">
            <Hero />
            <Recommended recommendedProductsData={recommendedProducts} loggedIn={loggedIn} />
            <Getapp />
            {loggedIn && <Popular popularProductsData={popularProducts} />}
            <ChatBubble />
        </div>
    );
};

export default Home;