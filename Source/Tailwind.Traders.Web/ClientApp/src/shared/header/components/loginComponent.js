import React, { Component } from 'react';

import { NamespacesConsumer } from 'react-i18next';
import Alert from "react-s-alert";

import { UserService } from "../../../services";
import { saveState } from "../../../helpers/localStorage";

import { ReactComponent as Logo } from '../../../assets/images/logo-horizontal.svg';
import { ReactComponent as Close } from '../../../assets/images/icon-close.svg';

class LoginComponent extends Component {
    constructor() {
        super();
        this.state = {
            isomodalpened: false,
            email: "",
            password: "",
            grant_type: "password"
        };
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

    render() {
        return (
            <NamespacesConsumer>
                {t => (
                    <div className={this.state.isomodalpened ? 'modal-overlay is-opened' : 'modal-overlay'}>
                        <Alert stack={{ limit: 1 }} />
                        <div className="modal">
                            <Close onClick={this.toggleModalClass} />
                            <Logo />
                            <form onSubmit={(event) => {
                                event.preventDefault();
                                this.handleSubmit();
                            }}>
                                <label className="modal__label" htmlFor="email">{t('shared.header.email')}</label>
                                <input
                                    onChange={this.keepInputEmail}
                                    value={this.props.text}
                                    className="modal__input"
                                    id="email"
                                    type="email"
                                    placeholder={t('shared.header.emailPlaceholder')}
                                />
                                <label className="modal__label" htmlFor="password">{t('shared.header.password')}</label>
                                <input
                                    onChange={this.keepInputPassword}
                                    value={this.props.text}
                                    className="modal__input"
                                    id="password"
                                    type="password"
                                    placeholder={t('shared.header.passwordPlaceholder')}
                                />
                                <div className="modal__btns">
                                    <button type="submit" value="Submit" className="btn btn--primary">{t('shared.header.login')}</button>

                                    <span style={{ display: 'none' }}>{t('shared.header.or')}</span>
                                    <button style={{ display: 'none' }} className="btn btn--microsoft">{t('shared.header.loginMicrosoft')}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </NamespacesConsumer>
        );
    }
}

export default LoginComponent;
