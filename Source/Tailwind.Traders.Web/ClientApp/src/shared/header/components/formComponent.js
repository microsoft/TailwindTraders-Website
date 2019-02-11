import React, { Component } from 'react';

import { NamespacesConsumer } from 'react-i18next';
import APIClient from "../../../ApiClient";
import Alert from "react-s-alert";

import { ReactComponent as Logo } from '../../../assets/images/logo-horizontal.svg';
import { ReactComponent as Close } from '../../../assets/images/icon-close.svg';


class FormComponent extends Component {
    constructor() {
        super();
        this.state = {
            isomodalpened: false,
            email: "",
            password: "",
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


    handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            username: this.state.email,
            password: this.state.password,
            grant_type: this.state.grant_type
        }

        if (!this.state.email || !this.state.password) {
            this.handleFormErrors();
            return;
        }

        const loginFormData = await APIClient.postLoginForm(formData)
        const LocalStorageInformation = this.generateLocalStorageInformation(loginFormData);
        this.saveDataToLocalStorage(LocalStorageInformation);
        this.toggleModalClass();
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
                        <div className="modal">
                            <Close onClick={this.toggleModalClass} />
                            <Logo />
                            <form onSubmit={(event) => {
                                event.preventDefault();
                                this.props.submitAction();
                                alert(this.props.text);
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
                                    <span>{t('shared.header.or')}</span>
                                    <button className="btn btn--microsoft">{t('shared.header.loginMicrosoft')}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </NamespacesConsumer>
        );
    }
}

export default FormComponent;


// const FormComponent = props => (
//     <form onSubmit={(event) => {
//         event.preventDefault();
//         props.submitAction();
//         alert(props.text);
//     }}>
//         <h1>Our form example</h1>
//         <div>
//             <textarea
//                 onChange={event => props.textAction(event.target.value)}
//                 value={props.text}
//             />
//         </div>
//         <div>
//             <input type="submit" value="Submit" />
//         </div>
//     </form>
// );

// export default FormComponent;