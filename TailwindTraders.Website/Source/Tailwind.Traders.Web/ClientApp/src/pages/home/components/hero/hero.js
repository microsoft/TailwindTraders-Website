import React, { Component } from "react";

import { NamespacesConsumer } from "react-i18next";

import { ReactComponent as Freeshipping } from "../../../../assets/images/icon-freeshipping.svg";
import Herobg from "../../../../assets/images/herobg.jpg";

class Hero extends Component {
    constructor(props) {
        super(props);
        this.bgImg = React.createRef();
    }

    componentDidMount() {
        const img = new Image();
        img.src = Herobg;
        img.onload = () => {
            const imgContainer = this.bgImg.current;
            imgContainer.style.backgroundImage = `url('${img.src}')`;
            imgContainer.classList.add("u-fade-in");
        };
    }

    render() {
        return (
            <NamespacesConsumer>
                {t => (
                    <div className="hero">
                        <div className="hero__banner">
                            <div className="hero__inner">
                                <Freeshipping />
                                <span className="hero__text  hero__text--strong">
                                    {t("home.hero.shiping")}
                                </span>
                                <span className="hero__text">&#8226;</span>
                                <span className="hero__text hero__text--light">
                                    {t("home.hero.orders")}
                                </span>
                            </div>
                        </div>
                        <div className="hero__image-wrapper">
                            <div className="hero__image" ref={this.bgImg} />
                        </div>
                    </div>
                )}
            </NamespacesConsumer>
        );
    }
}

export default Hero;
