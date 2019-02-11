import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { NamespacesConsumer } from 'react-i18next';

import APIClient from '../../ApiClient';


import FormContainer from './components/formContainer';
import FormComponent from './components/formComponent';

// import UserPortrait from './components/userPortrait'; => this will be needed when the user is logged in

import { ReactComponent as Logo } from '../../assets/images/logo-horizontal.svg';
import { ReactComponent as Close } from '../../assets/images/icon-close.svg';
import { ReactComponent as Hamburger } from '../../assets/images/icon-menu.svg';
import { ReactComponent as Cart } from '../../assets/images/icon-cart.svg';
import { ReactComponent as Search } from '../../assets/images/icon-search.svg';

const Form = FormContainer(FormComponent);

class Header extends Component {
    constructor() {
        super();
        this.state = {
            isopened: false,
            ismodalopened: false,
            profile: {},
        };
        this.loginModalRef = React.createRef();
    }

    async componentDidMount() {
        const profileData = await APIClient.getProfileData();
        this.setState({ ...profileData });

        const setComponentVisibility = this.setComponentVisibility.bind(this);
        setComponentVisibility(document.documentElement.clientWidth);
        window.addEventListener('resize', function () {
            setComponentVisibility(document.documentElement.clientWidth);
        });
    }

    setComponentVisibility(width) {
        if (width > 1280) {
            this.setState({ isopened: false });
        }
    }

    toggleClass = () => {
        this.setState(prevState => ({
            isopened: !prevState.isopened,
        }));
    };

    toggleModalClass = () => {

        if (!document.body.classList.contains("is-blocked")) {
            document.body.classList.add("is-blocked");
        } else {
            document.body.classList.remove("is-blocked");
        }

        this.setState(prevState => ({
            ismodalopened: !prevState.ismodalopened
        }));
    };

    onClickClose = () => {
        this.toggleModalClass();
    }

    render() {
        // const { profile } = this.state; =>  this will be needed when the user is logged in
        return (
            <NamespacesConsumer>
                {t => (
                    <header className="header">
                        <Link to="/">
                            <Logo />
                        </Link>
                        <nav className={this.state.isopened ? 'main-nav is-opened' : 'main-nav'}>
                            <Link className="main-nav__item" to="/list/homeappliances">
                                {t('shared.header.homeAppliances')}
                            </Link>
                            <Link className="main-nav__item" to="/list/sink">
                                {t('shared.header.sink')}
                            </Link>
                            <Link className="main-nav__item" to="/list/home">
                                {t('shared.header.home')}
                            </Link>
                            <Link className="main-nav__item" to="/list/gardening">
                                {t('shared.header.gardening')}
                            </Link>
                            <Link className="main-nav__item" to="/list/decor">
                                {t('shared.header.decor')}
                            </Link>
                            <Link className="main-nav__item" to="/list/kitchen">
                                {t('shared.header.kitchen')}
                            </Link>
                            <Link className="main-nav__item" to="/list/diytools">
                                {t('shared.header.diytools')}
                            </Link>
                            <div className="main-nav__actions">
                                <Link className="main-nav__item" to="/profile">
                                    {t('shared.header.profile')}
                                </Link>
                                <button className="u-empty main-nav__item">
                                    {t('shared.header.logout')}
                                </button>
                            </div>
                            <button className="u-empty js-close" onClick={this.toggleClass}>
                                <Close />
                            </button>
                        </nav>
                        <nav className="secondary-nav">
                            <Search />

                            {/* <UserPortrait {...profile} /> this will be needed when the user is logged in */}

                            <div className="secondary-nav__login" onClick={this.toggleModalClass}>Login</div>

                            <Link className="secondary-nav__cart" to="/shopping-cart">
                                <Cart />
                                <div className="secondary-nav__cart-number">
                                    {this.props.quantity}
                                </div>
                            </Link>
                            <button className="u-empty" onClick={this.toggleModClass}>
                                <Hamburger />
                            </button>
                        </nav>

                        {this.state.ismodalopened ? <Form toggleModalClass={this.state.ismodalopened} onClickClose={this.onClickClose} /> : null}

                    </header>
                )}
            </NamespacesConsumer>
        );
    }
}

export default Header;
