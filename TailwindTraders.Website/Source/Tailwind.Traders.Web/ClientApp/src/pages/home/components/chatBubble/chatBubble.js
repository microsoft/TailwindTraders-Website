import React, { Component } from "react";
import chatIcon from "../../../../assets/images/chat-bubble-icon.svg";
import { withRouter } from "react-router-dom";
import axios from "axios";
import callIcon from "../../../../assets/images/icon-call.svg";
import "./chatBubble.css";
import { ConfigService } from "./../../../../services"

class ChatBubble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bubbleExpanded: false,
      loadingMeeting: false,
      loadingChat: false,
    };
  }

  // Calling the Logic app to create a teams meeting
  getMeetingDetails = async (isVideo) => {
    if (isVideo) {
      this.setState({ loadingMeeting: true });
    } else {
      this.setState({ loadingChat: true });
    }

    axios
      .post(
        ConfigService._logicAppUrl,
        {
          email: ConfigService._email,
          headline: "Tailwind Traders Customer Support",
          summary: "Customer support",
          text: "Customer support",
          userPhone: "",
          webAppMeetingDomain: new URL(window.location.href).host,
          isVideoCall: isVideo.toString(),
        }
      )
      .then((response) => {
        if (isVideo) {
          this.setState({ loadingMeeting: false });
          this.naviagateTo("/meeting" + response.data.joinUrl);
        } else {
          this.setState({ loadingChat: false });
          this.naviagateTo("/meeting" + response.data.joinUrl);
        }
      });
  };

  naviagateTo = (location) => {
    this.props.history.push(location);
  };

  render() {
    return (
      <>
        <div
          className="chat-bubble"
          style={{
            width: 80,
            height: 80,
            backgroundColor: "#2F4B66",
            position: "fixed",
            right: 100,
            bottom: 60,
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={() =>
            this.setState({
              bubbleExpanded: !this.state.bubbleExpanded,
            })
          }
        >
          <img
            src={chatIcon}
            alt="chat-bubble"
            style={{ marginTop: 24, marginLeft: 24 }}
          />
        </div>
        {this.state.bubbleExpanded && (
          <div
            className="bubble-options"
            style={{
              height: 400,
              width: 400,
              borderRadius: 14,
              position: "fixed",
              right: 150,
              bottom: 120,
              backgroundColor: "#E5E5E5",
              borderBottomRightRadius: 0,
            }}
          >
            <div
              className="bubble-title"
              style={{
                backgroundColor: "#2F4B66",
                borderTopLeftRadius: 14,
                borderTopRightRadius: 14,
                padding: 14,
                color: "#ffffff",
              }}
            >
              Customer Care
            </div>
            <div className="bubble-body">
              <div
                className="bubble-row"
                style={{
                  position: "absolute",
                  left: 24,
                  bottom: 100,
                }}
              >
                <div
                  className="mini-persona"
                  style={{
                    height: 28,
                    width: 28,
                    backgroundColor: "#2F4B66",
                    borderRadius: "50%",
                    color: "#ffffff",
                    display: "inline-block",
                    verticalAlign: "bottom",
                  }}
                >
                  <div style={{ marginLeft: 10.5, marginTop: 3 }}>T</div>
                </div>

                <div
                  className="bubble-prompt"
                  style={{
                    display: "inline-block",
                    maxWidth: "80%",
                    padding: 14,
                    backgroundColor: "#333333",
                    color: "#ffffff",
                    borderRadius: 14,
                    borderBottomLeftRadius: 0,
                    marginLeft: 12,
                    marginBottom: 12,
                  }}
                >
                  <p className="bubble-text">
                    Hi! You can start a phone call, video call, or chat session
                    to connect with a Tailwind Traders associate. Which would
                    you prefer?
                  </p>
                  <div className="bubble-options-row">
                    <button
                      style={{
                        width: "48%",
                        height: 28,
                        marginRight: 14,
                        backgroundColor: "#359CFF",
                        border: "none",
                        color: "#ffffff",
                        cursor: "pointer",
                        padding: 4,
                        paddingLeft: 12,
                        paddingRight: 12,
                        borderRadius: 4,
                        textDecoration: "none",
                      }}
                      onClick={() => {
                        this.getMeetingDetails(true);
                      }}
                      disabled={this.state.loadingMeeting}
                    >
                      {this.state.loadingMeeting
                        ? "Please wait..."
                        : "VIDEO CALL"}
                    </button>
                    <button
                      style={{
                        width: "40%",
                        height: 28,
                        marginRight: 18,
                        backgroundColor: "#359CFF",
                        border: "none",
                        color: "#ffffff",
                        cursor: "pointer",
                        padding: 4,
                        paddingLeft: 12,
                        paddingRight: 12,
                        borderRadius: 4,
                        textDecoration: "none",
                      }}
                      onClick={() => {
                        this.getMeetingDetails(false);
                      }}
                      disabled={this.state.loadingChat}
                    >
                      {this.state.loadingChat ? "Please wait..." : "CHAT"}
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="d-block"
                style={{ position: "absolute", bottom: 24, right: 36 }}
              >
                <div className="support-contact text-right align-bottom d-inline-block">
                  <div className="text-black">Call to connect with us:</div>
                  <div className="text-primary">
                    <a href="tel:+18332270697">+18332270697</a>
                  </div>
                </div>
                <div className="call-icon rounded-circle d-inline-block">
                  <img src={callIcon} alt="icon-call" />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default withRouter(ChatBubble);
