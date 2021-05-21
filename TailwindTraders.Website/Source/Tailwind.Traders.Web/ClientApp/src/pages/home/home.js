import React, { useEffect, useState } from "react";

import { Hero, Recommended, Getapp, Popular } from "./components";
import ChatBubble from './components/chatBubble/chatBubble';
import { ConfigService } from './../../services'

const Home = ({ recommendedProducts, popularProducts, loggedIn }) => {
    const [customerSupportEnabled, setCustomerSupportEnabled] = useState(false);
    useEffect(() => {
        async function loadSettings() {
            await ConfigService.loadSettings();
            setCustomerSupportEnabled(ConfigService._customerSupportEnabled);
        }
        loadSettings();
    },[])
    return (
        <div className="home">
            <Hero />
            <Recommended recommendedProductsData={recommendedProducts} loggedIn={loggedIn} />
            <Getapp />
            {loggedIn && <Popular popularProductsData={popularProducts} />} 
            { customerSupportEnabled && <ChatBubble />}
        </div>
    );
};

export default Home;