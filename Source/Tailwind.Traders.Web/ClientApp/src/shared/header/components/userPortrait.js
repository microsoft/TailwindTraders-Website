import React, { Component, Fragment } from "react";

import { ReactComponent as User } from "../../../assets/images/icon-profile.svg";
class UserPortrait extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUserPortrait: true,
        };
    }

    onError = () => {
        this.setState({ isUserPortrait: false });
    };

    render() {
        const { isUserPortrait } = this.state;
        const { imageUrlMedium, name } = this.props;
        return (
            <Fragment>
                {isUserPortrait && imageUrlMedium ? (
                    <img className="portrait" src={imageUrlMedium} alt={`${name}'s portrait`} onError={this.onError} />
                ) : (
                        <User />
                    )}
            </Fragment>
        );
    }
}

export default UserPortrait;
