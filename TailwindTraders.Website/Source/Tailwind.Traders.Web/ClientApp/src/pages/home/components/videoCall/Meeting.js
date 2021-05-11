import React from "react";
import { CallClient, LocalVideoStream } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { CommunicationIdentityClient } from "@azure/communication-administration";
import { PrimaryButton, TextField } from "office-ui-fabric-react";
import CallCard from "./CallCard";
import { createClientLogger, setLogLevel } from "@azure/logger";
import queryString from "query-string";
import { Dropdown } from "@fluentui/react";
import { ConfigService } from "./../../../../services"

export default class Meeting extends React.Component {
  constructor(props) {
    super(props);
    this.communicationIdentityClient = new CommunicationIdentityClient(
      ConfigService._acsConnectionString
    );
    this.callClient = null;
    this.callAgent = null;
    this.deviceManager = null;
    this.destinationUserIds = null;
    this.destinationPhoneIds = null;
    this.destinationGroup = null;
    this.meetingLink = null;
    this.threadId = null;
    this.messageId = null;
    this.organizerId = null;
    this.tenantId = null;
    this.isVideoCall = null;
    this.callError = null;

    this.state = {
      id: undefined,
      loggedIn: false,
      selectedCameraDeviceId: null,
      selectedSpeakerDeviceId: null,
      selectedMicrophoneDeviceId: null,
      showCameraNotFoundWarning: false,
      showSpeakerNotFoundWarning: false,
      showMicrophoneNotFoundWarning: false,
      callError: null,
      userDetails: null,
      userName: null,
      cameraDeviceOptions: [],
      speakerDeviceOptions: [],
      microphoneDeviceOptions: [],
      userNameEntered: false,
    };
  }

  // Get device list
  getDevicesList = async () => {
    const cameraDevices = await this.deviceManager?.getCameras();
    const speakerDevices = await this.deviceManager?.getSpeakers();
    const microphoneDevices = await this.deviceManager?.getMicrophones();
    console.log(cameraDevices[0]);
    this.setState({
      selectedCameraDeviceId: cameraDevices[0]?.id,
      selectedMicrophoneDeviceId: microphoneDevices[0]?.id,
      selectedSpeakerDeviceId: speakerDevices[0]?.id,
    });

    cameraDevices.map((cameraDevice) => {
      return this.state.cameraDeviceOptions.push({
        key: cameraDevice.id,
        text: cameraDevice.name,
      });
    });
    speakerDevices.map((speakerDevice) => {
      return this.state.speakerDeviceOptions.push({
        key: speakerDevice.id,
        text: speakerDevice.name,
      });
    });
    microphoneDevices.map((microphoneDevice) => {
      return this.state.microphoneDeviceOptions.push({
        key: microphoneDevice.id,
        text: microphoneDevice.name,
      });
    });
  };

  async componentDidMount() {
    await this.provisionNewuser();
    let queries = queryString.parse(
      decodeURIComponent(this.props.location.search)
    );
    this.isVideoCall = queries?.isVideoCall;
  }

  handleUsernameChange = (e) => {
    this.setState({ userName: e.target.value });
  };

  handleJoinCall = async () => {
    await this.joinTeamsMeeting();
  };

  // Provisioning new ACS user
  provisionNewuser = async () => {
    try {
      const communicationUserId = await this.communicationIdentityClient.createUser();
      const tokenResponse = await this.communicationIdentityClient.issueToken(
        communicationUserId,
        ["voip", "chat"]
      );
      this.setState({ userDetails: tokenResponse });
    } catch (error) {
      alert(error);
    }
  };

  // Initializing callClient and callAgent
  handleLogIn = async (userDetails, userName) => {
    if (this.callAgent !== null) {
      this.callAgent.dispose();
    }
    if (userDetails) {
      try {
        const tokenCredential = new AzureCommunicationTokenCredential(
          userDetails.token
        );
        const logger = createClientLogger("ACS");
        setLogLevel("warning");
        logger.verbose.log = (...args) => {
          console.log(...args);
        };
        logger.info.log = (...args) => {
          console.info(...args);
        };
        logger.warning.log = (...args) => {
          console.warn(...args);
        };
        logger.error.log = (...args) => {
          console.error(...args);
        };
        const options = { logger: logger };
        this.callClient = new CallClient(options);
        this.callAgent = await this.callClient.createCallAgent(
          tokenCredential,
          { displayName: userName }
        );
        window.callAgent = this.callAgent;
        this.deviceManager = await this.callClient.getDeviceManager();
        await this.deviceManager.askDevicePermission(true, true);
        this.callAgent.on("callsUpdated", (e) => {
          console.log(`callsUpdated, added=${e.added}, removed=${e.removed}`);

          e.added.forEach((call) => {
            if (this.state.call && call.isIncoming) {
              call.reject();
              return;
            }
            this.setState({ call: call, callEndReason: undefined });
          });

          e.removed.forEach((call) => {
            if (this.state.call && this.state.call === call) {
              if (this.state.call.callEndReason.code !== 0) {
                this.setState({
                  callError: `Call end reason: code: ${this.state.call.callEndReason.code}, subcode: ${this.state.call.callEndReason.subcode}`,
                });
              }

              this.setState({
                call: null,
                callEndReason: this.state.call.callEndReason,
              });
            }
          });
        });
        this.setState({ loggedIn: true });
      } catch (e) {
        console.error(e);
      }
    }
  };


  // Join teams meeting
  joinTeamsMeeting = async () => {
    try {
      let queries = queryString.parse(
        decodeURIComponent(this.props.location.search)
      );
      console.log(queries);
      this.threadId = queries?.threadId;
      this.messageId = "0";
      let contextData = JSON.parse(queries?.context);
      this.organizerId = contextData?.Oid;
      this.tenantId = contextData?.Tid;
      this.isVideoCall = queries?.isVideoCall;
      if (this.meetingLink) {
        this.callAgent.join(
          {
            meetingLink: this.meetingLink,
          },
          await this.getCallOptions()
        );
      } else if (
        !this.meetingLink &&
        this.messageId &&
        this.threadId &&
        this.tenantId &&
        this.organizerId
      ) {
        console.log("Joining using params");
        this.callAgent.join(
          {
            messageId: this.messageId,
            threadId: this.threadId,
            tenantId: this.tenantId,
            organizerId: this.organizerId,
          },
          await this.getCallOptions()
        );
      } else {
        throw new Error(
          "Please enter Teams meeting link or Teams meeting coordinate"
        );
      }
    } catch (e) {
      console.error("Failed to join teams meeting:", e);
      this.setState({ callError: "Failed to join teams meeting: " + e });
    }
  };

  getCallOptions = async () => {
    let queries = queryString.parse(
      decodeURIComponent(this.props.location.search)
    );
    let callOptions = {
      videoOptions: {
        localVideoStreams: undefined,
      },
      audioOptions: {
        muted: (queries?.isVideoCall === "true") ? false : true,
      },
    };

    const cameraDevice = await this.deviceManager.getCameras()[0];
    if (!cameraDevice || cameraDevice.id === "camera:") {
      this.setState({ showCameraNotFoundWarning: true });
    } else if (cameraDevice) {
      //   this.setState({ selectedCameraDeviceId: cameraDevice.id });
      const localVideoStream = new LocalVideoStream(cameraDevice);
      callOptions.videoOptions = { localVideoStreams: [localVideoStream] };
    }

    const speakerDevice = await this.deviceManager.getSpeakers()[0];
    if (!speakerDevice || speakerDevice.id === "speaker:") {
      this.setState({ showSpeakerNotFoundWarning: true });
    } else if (speakerDevice) {
      //   this.setState({ selectedSpeakerDeviceId: speakerDevice.id });
      this.deviceManager.setSpeaker(speakerDevice);
    }

    const microphoneDevice = await this.deviceManager.getMicrophones()[0];
    if (!microphoneDevice || microphoneDevice.id === "microphone:") {
      this.setState({ showMicrophoneNotFoundWarning: true });
    } else {
      //   this.setState({ selectedMicrophoneDeviceId: microphoneDevice.id });
      this.deviceManager.setMicrophone(microphoneDevice);
    }

    return callOptions;
  }

  cameraDeviceSelectionChanged = async (event, item) => {
    const cameraDeviceInfo = await this.deviceManager
      .getCameras()
      .find((cameraDeviceInfo) => {
        return cameraDeviceInfo.id === item.key;
      });
    // const localVideoStream = this.call.localVideoStreams[0];
    // localVideoStream.switchSource(cameraDeviceInfo);
    this.setState({ selectedCameraDeviceId: cameraDeviceInfo.id });
  };

  speakerDeviceSelectionChanged = async (event, item) => {
    const speakerDeviceInfo = await this.deviceManager
      .getSpeakers()
      .find((speakerDeviceInfo) => {
        return speakerDeviceInfo.id === item.key;
      });
    this.deviceManager.setSpeaker(speakerDeviceInfo);
    this.setState({ selectedSpeakerDeviceId: speakerDeviceInfo.id });
  };

  microphoneDeviceSelectionChanged = async (event, item) => {
    const microphoneDeviceInfo = await this.deviceManager
      .getMicrophones()
      .find((microphoneDeviceInfo) => {
        return microphoneDeviceInfo.id === item.key;
      });
    this.deviceManager.setMicrophone(microphoneDeviceInfo);
    this.setState({ selectedMicrophoneDeviceId: microphoneDeviceInfo.id });
  };

  render() {
    return (
      <div className="text-center pb-3">
        {!this.state.call ? (
          <div className="text-center w-50 mx-auto my-5 py-5">
            <div className="persona mt-4">
              {this.state.userName ? this.state.userName : "Enter you name"}
            </div>
            <TextField
              className="mb-3 mx-4 my-4 w-50 mx-auto"
              placeholder="Enter your name"
              onChange={this.handleUsernameChange}
            />
            <button
              className="btn btn-small btn-success mb-4 mx-auto w-50"
              onClick={async () => {
                await this.handleLogIn(
                  this.state.userDetails,
                  this.state.userName
                )
                
                setTimeout(async () => {
                    await this.getDevicesList();
                    this.setState({ userNameEntered: true });
                  }, 2000);
              }}
            >
              Done
            </button>
            <br />

            {this.state.userNameEntered && this.isVideoCall === "true" ? (
              <div className="mx-4 mb-4">
                <Dropdown
                  selectedKey={this.state.selectedCameraDeviceId}
                  onChange={ async () => await this.cameraDeviceSelectionChanged}
                  label={"Camera"}
                  options={this.state.cameraDeviceOptions}
                  disabled={async ()=> await this.deviceManager?.getCameras().length === 0}
                  placeHolder={ async ()=> await 
                    this.deviceManager?.getCameras().length === 0
                      ? "No camera devices found"
                      : this.state.selectedCameraDeviceId
                      ? ""
                      : "Select camera"
                  }
                />
                <Dropdown
                  selectedKey={this.state.selectedMicrophoneDeviceId}
                  onChange={ async () => await this.microphoneDeviceSelectionChanged}
                  options={this.state.microphoneDeviceOptions}
                  label={"Microphone"}
                  disabled={async () => 
                    await this.deviceManager?.getMicrophones().length === 0
                  }
                  placeHolder={async () =>
                    await this.deviceManager?.getMicrophones().length === 0
                      ? "No microphone devices found"
                      : this.state.selectedMicrophoneDeviceId
                      ? ""
                      : "Select microphone"
                  }
                />
                <Dropdown
                  selectedKey={this.state.selectedSpeakerDeviceId}
                  onChange={this.speakerDeviceSelectionChanged}
                  options={this.state.speakerDeviceOptions}
                  label={"Speaker"}
                  disabled={ async ()=> await this.deviceManager?.getSpeakers().length === 0}
                  placeHolder={async ()=> await 
                    this.deviceManager?.getSpeakers().length === 0
                      ? "No speaker devices found"
                      : this.state.selectedSpeakerDeviceId
                      ? ""
                      : "Select speaker"
                  }
                />
              </div>
            ) : (
              <></>
            )}
            <PrimaryButton
              className="primary-button"
              disabled={!this.state.userNameEntered}
              iconProps={{
                iconName: "Group",
                style: { verticalAlign: "middle", fontSize: "large" },
              }}
              text={this.isVideoCall === "true" ? "Join meeting" : "Chat"}
              onClick={async () => await this.joinTeamsMeeting() }
            ></PrimaryButton>
          </div>
        ) : (
          <CallCard
            userDetails={this.state.userDetails}
            threadId={this.threadId}
            isVideoCall={this.isVideoCall}
            userName={this.state.userName}
            call={this.state.call}
            deviceManager={this.deviceManager}
            selectedCameraDeviceId={this.state.selectedCameraDeviceId}
            selectedSpeakerDeviceId={this.state.selectedSpeakerDeviceId}
            selectedMicrophoneDeviceId={this.state.selectedMicrophoneDeviceId}
            onShowCameraNotFoundWarning={(show) => {
              this.setState({ showCameraNotFoundWarning: show });
            }}
            onShowSpeakerNotFoundWarning={(show) => {
              this.setState({ showSpeakerNotFoundWarning: show });
            }}
            onShowMicrophoneNotFoundWarning={(show) => {
              this.setState({ showMicrophoneNotFoundWarning: show });
            }}
          />
        )}
      </div>
    );
  }
}
