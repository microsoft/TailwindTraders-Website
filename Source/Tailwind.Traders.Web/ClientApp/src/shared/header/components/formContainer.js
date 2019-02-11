// import React, { Component } from 'react';

// import { NamespacesConsumer } from 'react-i18next';
// import Alert from "react-s-alert";

// import APIClient from "../../../ApiClient";
// import LoginForm from "./loginForm";
// import store from "../../../utils/store";

// import { textAction, submitAction } from './actions';

// const mapStateToProps = state => state.form;
// const mapDispatchToProps = { textAction, submitAction };

// export default connect(mapStateToProps, mapDispatchToProps);

// import { ReactComponent as Logo } from '../../../assets/images/logo-horizontal.svg';
// import { ReactComponent as Close } from '../../../assets/images/icon-close.svg';

// class Login extends Component {
//     constructor() {
//         super();
//         this.state = {
//             isomodalpened: false,
//             email: "",
//             password: "",
//             grant_type: "password"
//         };
//     }

//     toggleModalClass = () => {
//         this.setState(prevState => ({
//             isomodalpened: !prevState.isomodalpened,
//         }));

//         this.toggleBodyScroll();
//     };

//     toggleBodyScroll() {
//         if (!document.body.classList.contains("is-blocked")) {
//             document.body.classList.add("is-blocked");
//             document.getElementById("email").focus();
//         } else {
//             document.body.classList.remove("is-blocked");
//         }
//     }

//     keepInputEmail = (e) => {
//         const email = e.target.value;
//         this.setState({ email })
//     }

//     keepInputPassword = (e) => {
//         this.setState({ password: e.target.value })
//     }

//     handleSubmit = async (e) => {
//         e.preventDefault();

//         const formData = {
//             username: this.state.email,
//             password: this.state.password,
//             grant_type: this.state.grant_type
//         }

//         if (!this.state.email || !this.state.password) {
//             this.handleFormErrors();
//             return;
//         }


//         const loginFormData = await APIClient.postLoginForm(formData)
//         const LocalStorageInformation = this.generateLocalStorageInformation(loginFormData);
//         this.saveDataToLocalStorage(LocalStorageInformation);
//         this.toggleModalClass();
//     }

//     handleFormErrors() {
//         Alert.error("Username or Password can not be empty", {
//             position: "top",
//             effect: "scale",
//             beep: true,
//             timeout: 6000,
//         });
//     }

//     generateLocalStorageInformation(loginFormData) {
//         return {
//             user: this.state.email,
//             token: loginFormData.data.access_token
//         }
//     }

//     saveDataToLocalStorage(LocalStorageInformation) {
//         store.setDataInformation(LocalStorageInformation);
//     }

//     render() {
//         const { username, password, grant_type } = this.state;
//         return (
//             <NamespacesConsumer>
//                 {t => (
//                     <div className={this.state.isomodalpened ? 'modal-overlay is-opened' : 'modal-overlay'}>
//                         <Alert stack={{ limit: 1 }} />
//                         <div className="modal">
//                             <Close onClick={this.toggleModalClass} />
//                             <Logo />
//                             <LoginForm
//                                 username={username}
//                                 password={password}
//                                 grant_type={grant_type}
//                                 handleSubmit={this.handleSubmit}
//                                 keepInputEmail={this.keepInputEmail}
//                                 keepInputPassword={this.keepInputPassword}
//                             />
//                         </div>
//                     </div>
//                 )}
//             </NamespacesConsumer>
//         );
//     }
// }

// export default Login;


import { connect } from 'react-redux';
import { textAction, submitAction } from './actions';

const mapStateToProps = state => state.form;
const mapDispatchToProps = { textAction, submitAction };

export default connect(mapStateToProps, mapDispatchToProps);