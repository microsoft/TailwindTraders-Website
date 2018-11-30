import React from "react";
import { Link } from "react-router-dom";

import { withNamespaces } from "react-i18next";

import BadgeApple from "../../../../assets/images/badge-apple.svg";
import BadgeGoogle from "../../../../assets/images/badge-google.svg";
import MockupSmall from "../../../../assets/images/Mockup_Small.png";
import MockupSmall2 from "../../../../assets/images/Mockup_Small@2x.png";
import MockupBig from "../../../../assets/images/Mockup_Big.png";
import MockupBig2 from "../../../../assets/images/Mockup_Big@2x.png";

const Getapp = ({ t }) => {
    return (
        <section className="getapp">
            <header className="getapp__header">
                <h1 className="getapp-title">{t("home.getapp.title")}</h1>
                <p className="getapp-text">{t("home.getapp.subtitle")}</p>
                <div className="getapp__stores-wrapper">
                    <Link className="getapp__btn" to="/">
                        <img
                            className="getapp__badge"
                            src={BadgeApple}
                            alt={t("home.getapp.appStoreImg")}
                        />
                    </Link>
                    <Link className="getapp__btn" to="/">
                        <img
                            className="getapp__badge"
                            src={BadgeGoogle}
                            alt={t("home.getapp.googlePlayImg")}
                        />
                    </Link>
                </div>
            </header>
            <picture className="getapp__body">
                <source
                    srcSet={`${MockupSmall} 1x, ${MockupSmall2} 2x`}
                    media="(min-width: 20em)"
                />
                <source
                    srcSet={`${MockupBig} 1x, ${MockupBig2} 2x`}
                    media="(min-width: 85.375em)"
                />
                <img
                    srcSet={`${MockupSmall} 1x, ${MockupSmall2} 2x`}
                    alt="Black iPhone displaying Tailwind Traders' home screen"
                />
            </picture>
        </section>
    );
};

export default withNamespaces()(Getapp);
