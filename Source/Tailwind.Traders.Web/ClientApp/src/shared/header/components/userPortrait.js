import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

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
        const { imageUrlMedium } = this.props;
        return (
            <Fragment>
                {isUserPortrait && imageUrlMedium ? (
                    <Link to="/profile">
                        <img className="portrait" src={imageUrlMedium} alt="Scott Hanselman's Portrait" onError={this.onError} />
                    </Link>
                ) : (
                        <User />
                    )}
            </Fragment>
        );
    }
}

export default UserPortrait;
