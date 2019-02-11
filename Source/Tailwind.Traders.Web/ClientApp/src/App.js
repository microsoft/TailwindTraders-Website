import React, { Component, Fragment } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { Header, Footer } from "./shared";
import { Home, List, MyCoupons, Detail, SuggestedProductsList, Profile, ShoppingCart } from "./pages";
import APIClient from "./ApiClient";
import "./i18n";
import "./main.scss";
require("dotenv").config();

class App extends Component {
    constructor() {
        super();
        this.state = {
            shoppingCart: [],
            quantity: null,
        }
    }

    async componentDidMount() {
        const profile = await APIClient.getProfileData();
        const { profile: { email } } = profile;
        // const shoppingCart = await APIClient.getShoppingCart(email);
        // this.setState({ shoppingCart });
        const quantity = this.state.shoppingCart.reduce((oldQty, { qty }) => oldQty + qty, 0);
        this.setState({ quantity })
    }

    ShoppingCart = (quantity) => {
        this.setState({ quantity });
    }

    sumProductInState = () => {
        this.setState(prevState => {
            return { quantity: prevState.quantity + 1 }
        })
    }

    render() {
        const { quantity } = this.state;
        return (
            <div className="App">
                <Router>
                    <Fragment>
                        <Header quantity={quantity} />
                        <Route exact path="/" component={Home} />
                        <Route path="/coupons" component={MyCoupons} />
                        <Route exact path="/list" component={List} />
                        <Route exact path="/list/:code" component={List} />
                        <Route path="/suggested-products-list" component={SuggestedProductsList} />
                        <Route path="/product/detail/:productId" render={(props) => <Detail sumProductInState={this.sumProductInState} {...props}/>} />
                        <Route path="/profile" component={Profile} />
                        <Route path="/shopping-cart" render={() => <ShoppingCart ShoppingCart={this.ShoppingCart} quantity={this.state.quantity} />} />
                        <Footer />
                    </Fragment>
                </Router>
            </div>
        );
    }
}

export default App;
