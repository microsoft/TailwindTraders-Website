import React from "react";
import { ChatClient } from "@azure/communication-chat";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import videoIcon from "../../../../assets/images/icon-video-on.svg";
import sendIcon from "../../../../assets/images/icon-send.svg";
import "./chat.css";
import { ConfigService } from "./../../../../services"

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatClient: null,
      chatThreadClient: null,
      currentMessage: "",
      messageList: [],
      userDetails: props.userDetails,
    };
  }

  // Chat message polling
  getChatMessages = async () => {
    setInterval(async () => {
      let pagedAsyncIterableIterator = await this.state.chatThreadClient.listMessages();
      let nextMessage = await pagedAsyncIterableIterator.next();

      this.setState({ messageList: [] });
      while (!nextMessage.done) {
        let chatMessage = nextMessage.value;
        console.log(chatMessage);
        if (chatMessage.type !== "participantAdded") {
          this.setState({
            messageList: [
              ...this.state.messageList,
              {
                sender:
                  chatMessage.senderDisplayName === this.props.userName
                    ? "me"
                    : "them",
                content: chatMessage.content.message,
                sequenceId: parseInt(chatMessage.sequenceId),
              },
            ],
          });
        }
        nextMessage = await pagedAsyncIterableIterator.next();
      }
    }, 2000);
  };

  componentWillMount() {
    this.setState(
      {
        chatClient: new ChatClient(
          ConfigService._acsResource,
          new AzureCommunicationTokenCredential(this.state.userDetails.token)
        ),
      },
      () => {
        this.getChatThreadClient().then(() => {
          this.getChatMessages();
        });
      }
    );
  }

  // Initialize threadClient
  getChatThreadClient = async () => {
    try {
      let chatThreadClient = await this.state.chatClient.getChatThreadClient(
        this.props.threadId
      );
      this.setState({ chatThreadClient: chatThreadClient });
    } catch (error) {
      alert(error);
    }
  };

  handleMessageChange = (evt) => {
    this.setState({ currentMessage: evt.target.value });
  };

  // Send chat message
  sendMessage = async () => {
    let sendMessageRequest = {
      content: this.state.currentMessage,
    };
    let sendMessageOptions = {
      priority: "Normal",
      senderDisplayName: this.props.userName,
    };
    let sendChatMessageResult = await this.state.chatThreadClient.sendMessage(
      sendMessageRequest,
      sendMessageOptions
    );
    console.log(sendChatMessageResult);
    this.setState({ currentMessage: "" });
  };

  render() {
    return (
      <div className="chat-window card w-50 mx-auto mb-4">
        <div className="chat-header card-header text-left">
          Experts
          <button
            className="btn-small btn-success border-0 rounded-lg float-right"
            onClick={this.props.switchToCallView}
          >
            <img src={videoIcon} alt="videoIcon" />
          </button>
        </div>
        <div
          className="chat-window-body card-body"
          style={{ height: 380, overflow: "auto" }}
        >
          {this.state.messageList
            .sort((a, b) => a.sequenceId - b.sequenceId)
            .map((message) =>
              message.sender === "them" ? (
                <div className="left-message text-left mb-2">
                  <div
                    className="d-inline-block px-3 py-2 bg-light"
                    style={{ maxWidth: 250 }}
                  >
                    {message.content}
                  </div>
                </div>
              ) : (
                <div className="right-message text-right mb-2">
                  <div
                    className="d-inline-block px-3 py-2 bg-dark text-white"
                    style={{ maxWidth: 250 }}
                  >
                    {message.content}
                  </div>
                </div>
              )
            )}
        </div>
        <div className="chat-footer card-footer">
          <input
            type="text"
            placeholder="Type message"
            style={{ width: "90%" }}
            onChange={this.handleMessageChange}
            value={this.state.currentMessage}
            onKeyPress={(evt) => {
              if (evt.key === "Enter") {
                this.sendMessage();
              }
            }}
          />
          <button className="send-message-btn" onClick={this.sendMessage}>
            <img src={sendIcon} alt="sendIcon" className="send-message-icon" />
          </button>
        </div>
      </div>
    );
  }
}
