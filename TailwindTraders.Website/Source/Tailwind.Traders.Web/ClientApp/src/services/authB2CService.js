import * as Msal from 'msal';
import { ConfigService } from './'

export default class AuthB2CService {
    constructor() {
        this.applicationConfig = {
            auth: {
                clientId: ConfigService._B2cClientId,
                authority: ConfigService._B2cAuthority,
                validateAuthority: false,
                redirectUri: `${window.location.origin}`
            }
        }

        this.msalAgent = new Msal.UserAgentApplication(this.applicationConfig);

        this.msalAgent.handleRedirectCallback(async (error, response) => {
            if(!response.accessToken) {
                await this.login();
            }
        });
    }

    login = async () => {
        await this.msalAgent.loginPopup();
        const user = this.msalAgent.getAccount();
        return (user) ? user : null;
    }

    logout = () => this.msalAgent.logout();

    getToken = async () => {
        return await this.msalAgent.acquireTokenSilent({ scopes: [ConfigService._B2cScopes], authority: ConfigService._B2cAuthority })
            .then(accessToken => accessToken.accessToken);
    };
}