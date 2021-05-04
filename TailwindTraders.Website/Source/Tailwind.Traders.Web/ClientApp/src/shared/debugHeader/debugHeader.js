import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { ConfigService } from "../../services";
import { withNamespaces } from "react-i18next";

import { ReactComponent as Logo } from "../../assets/images/logo-horizontal.svg";

class DebugHeader extends Component {
    constructor() {
        super();
        this.state = {
            debugInfo: {}
        };
    }

    async componentDidMount() {
        await ConfigService.loadSettings();
        this.setState({ debugInfo: ConfigService._debugInformation });
    }

    render() {
        const debugInfo = this.state.debugInfo;
        const spans = [];

        if (debugInfo.customText) {
            spans.push(<span style={{ "margin": "0px 20px" }}><strong>{debugInfo.customText}</strong></span>)
        }
        
        if (debugInfo.sqlServerName) {
            spans.push(<span style={{ "margin": "0px 20px" }}>SQL Server: <strong>{debugInfo.sqlServerName}</strong></span>)
        }
        if (debugInfo.mongoServerName) {
            spans.push(<span style={{ "margin": "0px 20px" }}>Mongo Server: <strong>{debugInfo.mongoServerName}</strong></span>)
        }

        if (this.state.debugInfo.showDebug) {
            return (
                <debug-header style={{
                    "display": "block", 
                    "padding": "6px 0px", 
                    "text-align": "center",
                    "background-color": "rgb(227, 232, 236)"
                }}>
                    { spans }
                </debug-header>
            );
        } else {
            return <div></div>;
        }
    }

}

export default withNamespaces()(DebugHeader);
