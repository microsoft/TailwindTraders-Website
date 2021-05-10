import React from "react";
import { withNamespaces } from "react-i18next";
import UserPortrait from "../../../shared/header/components/userPortrait";

const Profile = ({ t, name, address, phoneNumber, email, imageUrlMedium }) => {
    return (
        <div className="profile-card">
            <h2 className="profile__heading-title">{t("Customer Information")}</h2>
            <div className="profile-wapper">
                <div className="profile__image">
                    <UserPortrait imageUrlMedium={imageUrlMedium} name={name}/>
                </div>
                <div className="profile__info">
                    <p className="profile__title">{t("profile.name")}</p>
                    <p className="profile__subtitle">{name}</p>
                    <p className="profile__title">{t("profile.address")}</p>
                    <p className="profile__subtitle">{address}</p>
                    <p className="profile__title">{t("profile.phoneNumber")}</p>
                    <p className="profile__subtitle">{phoneNumber}</p>
                    <p className="profile__title">{t("profile.email")}</p>
                    <p className="profile__subtitle">{email}</p>
                </div>
            </div>
        </div>
    );
};

export default withNamespaces()(Profile);
