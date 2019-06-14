import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { NamespacesConsumer } from 'react-i18next';

import { UserService, ConfigService } from '../../services';
import AuthB2CService from '../../services/authB2CService';
import { withRouter } from "react-router-dom";

import LoginContainer from './components/loginContainer';
import LoginComponent from './components/loginComponent';
import UserPortrait from './components/userPortrait';

import { ReactComponent as Logo } from '../../assets/images/logo-horizontal.svg';
import { ReactComponent as Close } from '../../assets/images/icon-close.svg';
import { ReactComponent as Hamburger } from '../../assets/images/icon-menu.svg';
import { ReactComponent as Cart } from '../../assets/images/icon-cart.svg';

import { clickAction } from "../../actions/actions";

const Login = LoginContainer(LoginComponent);

class Header extends Component {
    constructor() {
        super();
        this.authService = new AuthB2CService();
        this.state = {
            isopened: false,
            ismodalopened: false,
            profile: {},
            UseB2C: null
        };
        this.loginModalRef = React.createRef();
    }

    async componentDidMount() {
        this.loadSettings();

        if (this.props.userInfo.token) {
            const profileData = await UserService.getProfileData(this.props.userInfo.token);
            this.setState({ ...profileData });
        }

        const setComponentVisibility = this.setComponentVisibility.bind(this);
        setComponentVisibility(document.documentElement.clientWidth);
        window.addEventListener('resize', function () {
            setComponentVisibility(document.documentElement.clientWidth);
        });
    }

    loadSettings = async () => {
        await ConfigService.loadSettings();
        const UseB2C = ConfigService._UseB2C;
        this.setState({ UseB2C })
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

    onClickLogout = () => {
        localStorage.clear();

        if (this.props.userInfo.isB2c) {
            this.authService.logout();
        }

        this.props.clickAction();
        this.props.history.push('/');
    }

    render() {
        const { profile } = this.state;
        const { loggedIn } = this.props.userInfo;
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
                            <button className="u-empty btn-close" onClick={this.toggleClass}>
                                <Close />
                            </button>
                        </nav>
                        <nav className="secondary-nav">
                            {/* <Search /> */}
                            {loggedIn && <Link to="/profile"><UserPortrait {...profile} /></Link>}
                            {loggedIn ? <div className="secondary-nav__login" onClick={this.onClickLogout}>{t('shared.header.logout')}</div>
                                : <div className="secondary-nav__login" onClick={this.toggleModalClass}>{t('shared.header.login')}</div>}
                            {loggedIn && <Link className="secondary-nav__cart" to="/shopping-cart">
                                <Cart />
                                <div className="secondary-nav__cart-number">
                                    {this.props.quantity}
                                </div>
                            </Link>}
                            <button className="u-empty" onClick={this.toggleClass}>
                                <Hamburger />
                            </button>
                        </nav>
                        {this.state.ismodalopened ?
                            <Login UseB2C={this.state.UseB2C} toggleModalClass={this.state.ismodalopened} onClickClose={this.onClickClose} />
                            : null}
                    </header>
                )}
            </NamespacesConsumer>
        );
    }
}

const mapStateToProps = state => state.login;

export default connect(mapStateToProps, { clickAction })(withRouter(Header));
