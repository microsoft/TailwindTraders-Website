import React, { Component } from "react";
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import Alert from "react-s-alert";
import { ProductService } from '../../services';

import { ReactComponent as PhotoImg } from "../../assets/images/icon-photo.svg";

class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.uploadFile = this.uploadFile.bind(this);
    }

    uploadFile(e) {

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        
        ProductService.getRelatedProducts(formData, this.props.userInfo.token)
            .then((relatedProducts) => {
                if (relatedProducts.length > 1) {
                    this.props.history.push({
                        pathname: "/suggested-products-list",
                        state: { relatedProducts },
                    });
                }else {
                    this.props.history.push({
                        pathname: `/product/detail/${relatedProducts[0].id}`,
                    });
                }
            })
            .catch(() => {
                Alert.error("There was an error uploading the image, please try again", {
                    position: "top",
                    effect: "scale",
                    beep: true,
                    timeout: 6000,
                });
            });
    }

    resetFileValue(e) {
        e.target.value = null;
    }

    render() {
        const { title, subtitle } = this.props;
        return (
            <form className="upload">
                <Alert stack={{ limit: 1 }} />
                <input
                    className="upload__input"
                    id="upload_image"
                    name="upload_image"
                    accept="image/png, image/jpeg"
                    type="file"
                    onChange={this.uploadFile}
                    onClick={this.resetFileValue}
                />
                <label className="upload__label" htmlFor="upload_image">
                    <PhotoImg className="upload__img" />
                    <span className="upload__info">
                        {subtitle ? <span className="upload__subtitle">{subtitle}</span> : null}
                        <span className="upload__title">{title}</span>
                    </span>
                </label>
            </form>
        );
    }
}

const mapStateToProps = state => state.login;

export default connect(mapStateToProps)(withRouter(UploadFile));