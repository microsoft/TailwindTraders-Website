import React, { Component } from 'react';

import { NamespacesConsumer } from 'react-i18next';

import { ReactComponent as Logo } from '../../../assets/images/logo-horizontal.svg';
import { ReactComponent as Close } from '../../../assets/images/icon-close.svg';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            isomodalpened: false,
        };
    }

    toggleModalClass = () => {
        this.setState(prevState => ({
            isomodalpened: !prevState.isomodalpened,
        }));

        this.toggleBodyScroll();
    };

    toggleBodyScroll() {
      if(!document.body.classList.contains("is-blocked")){
          document.body.classList.add("is-blocked");
          document.getElementById("email").focus();
      } else {
        document.body.classList.remove("is-blocked");
      }
    }

    render() {
        return (
            <NamespacesConsumer>
                {t => (
                    <div className={this.state.isomodalpened ? 'modal-overlay is-opened' : 'modal-overlay'}>
                        <div className="modal">
                            <Close onClick={this.toggleModalClass} />
                            <Logo />
                            <form className="modal__form" action="post">
                                <label className="modal__label" htmlFor="email">{t('shared.header.email')}</label>
                                <input
                                    className="modal__input"
                                    id="email"
                                    type="email"
                                    placeholder={t('shared.header.emailPlaceholder')}
                                />
                                <label className="modal__label" htmlFor="password">{t('shared.header.password')}</label>
                                <input
                                    className="modal__input"
                                    id="password"
                                    type="password"
                                    placeholder={t('shared.header.passwordPlaceholder')}
                                />
                            </form>
                            <div className="modal__btns">
                                <button className="btn btn--primary">{t('shared.header.login')}</button>
                                <span>{t('shared.header.or')}</span>
                                <button className="btn btn--microsoft">{t('shared.header.loginMicrosoft')}</button>
                            </div>
                        </div>
                    </div>
                )}
            </NamespacesConsumer>
        );
    }
}

export default Login;
