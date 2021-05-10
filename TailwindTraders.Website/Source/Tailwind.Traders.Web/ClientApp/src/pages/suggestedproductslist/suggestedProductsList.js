import React, { Component, Fragment } from "react";

import { NamespacesConsumer } from "react-i18next";

import { Card, UploadFile } from "../../shared";

class SuggestedProductsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestedProductsList: null,
        }
    }

    async componentDidMount() {
        const suggestedProductsList = this.props.location.state;
        this.setState({ suggestedProductsList: suggestedProductsList.relatedProducts });
    }

    render() {
        const productsReceived = this.state.suggestedProductsList;
        return (
            <NamespacesConsumer>
                {t => (
                    <Fragment>
                        <div className="banner">
                            <span className="banner__item">{t("shared.banner.disclaimer")}</span>
                            <div className="banner__item">
                                <span>{t("shared.banner.info")}</span>
                            </div>
                            <UploadFile title={t("shared.banner.uploadPhotoTitle")} />
                        </div>
                        <div className="suggestedproductslist">
                            {productsReceived && productsReceived.map((suggestedProductsListInfo, index) => (
                                <Card {...suggestedProductsListInfo} key={index} />
                            ))}
                        </div>
                    </Fragment>
                )}
            </NamespacesConsumer>
        );
    }
}

export default SuggestedProductsList;
