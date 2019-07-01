import React, { Component } from 'react';

import { NamespacesConsumer } from 'react-i18next';

import Alert from 'react-s-alert';

import { UserService } from '../../../services';
import AuthB2CService from '../../../services/authB2CService';
import { saveState } from '../../../helpers/localStorage';

import LoginB2c from './loginB2c';
import LoginForm from './loginForm';

import { ReactComponent as Logo } from '../../../assets/images/logo-horizontal.svg';
import { ReactComponent as Close } from '../../../assets/images/icon-close.svg';

class LoginComponent extends Component {
    constructor() {
        super();
        this.authService = new AuthB2CService();
        this.state = {
            isModalOpened: false,
            email: "",
            password: "",
            grant_type: "password",
            useB2c: null,
        };
    }

    componentDidMount() {
        this.setUseB2c();
    }

    toggleModalClass = () => {
        this.props.onClickClose();
    }

    keepInputEmail = (e) => {
        const email = this.props.textAction(e.target.value);
        this.setState({ email })
    }

    keepInputPassword = (e) => {
        this.setState({ password: e.target.value })
    }

    handleSubmit = async () => {
        const formData = {
            username: this.state.email.email,
            password: this.state.password,
            grant_type: this.state.grant_type
        }

        if (!this.state.email || !this.state.password) {
            this.handleFormErrors();
            return;
        }

        const loginFormData = await UserService.postLoginForm(formData);

        const LocalStorageInformation = this.generateLocalStorageInformation(loginFormData);

        this.saveDataToLocalStorage(LocalStorageInformation);
        this.props.submitAction(LocalStorageInformation);

        this.toggleModalClass();
    }

    generateLocalStorageInformation(loginFormData) {
        return {
            user: this.state.email,
            token: loginFormData.data.access_token.token,
            refreshToken: loginFormData.data.refresh_token,
            loggedIn: true
        }
    }

    saveDataToLocalStorage(LocalStorageInformation) {
        saveState(LocalStorageInformation);
    }

    handleFormErrors() {
        Alert.error("Username or Password can not be empty", {
            position: "top",
            effect: "scale",
            beep: true,
            timeout: 6000,
        });
    }

    setUseB2c = () => {
        const useB2cFromEnv = process.env.REACT_APP_USE_B2C ? JSON.parse(process.env.REACT_APP_USE_B2C.toLowerCase()) : false;
        if (this.props.UseB2C !== null) {
            return this.setState({ useB2c: this.props.UseB2C })
        }
        return this.setState({ useB2c: useB2cFromEnv })
    }

    handleLoginB2CClick = async (e) => {
        e.preventDefault();
        let user;
        let token;
        try {
            user = await this.authService.login();
            token = await this.authService.getToken();
        }
        catch (e) {
            Alert.error("Cannot not be logged", {
                position: "top",
                effect: "scale",
                beep: true,
                timeout: 6000,
            });
            return;
        }
        
        const LocalStorageInformation = {
            user: user.name,
            token: token,
            refreshToken: null,
            loggedIn: true
        }

        this.saveDataToLocalStorage(LocalStorageInformation);
        this.props.submitAction(LocalStorageInformation);

        this.toggleModalClass();
    }

    render() {
        return (
            <NamespacesConsumer>
                {t => (
                    <div className={this.state.isModalOpened ? 'modal-overlay is-opened' : 'modal-overlay'}>
                        <Alert stack={{ limit: 1 }} />
                        <div className="modal">
                            <Close onClick={this.toggleModalClass} />
                            <Logo />
                            {this.state.useB2c
                                ? <LoginB2c onLoginClick={this.handleLoginB2CClick} />
                                : <LoginForm
                                    handleSubmit={this.handleSubmit}
                                    keepInputEmail={this.keepInputEmail}
                                    keepInputPassword={this.keepInputPassword}
                                />
                            }
                        </div>
                    </div>
                )}
            </NamespacesConsumer>
        );
    }
}

export default LoginComponent;
