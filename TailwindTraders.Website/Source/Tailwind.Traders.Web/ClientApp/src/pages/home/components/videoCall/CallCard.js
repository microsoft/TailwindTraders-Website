import React from "react";
import StreamMedia from "./StreamMedia";
import LocalVideoPreviewCard from "./LocalVideoPreviewCard";
import { LocalVideoStream } from "@azure/communication-calling";
import chatIcon from "../../../../assets/images/icon-chat.svg";
import hangupIcon from "../../../../assets/images/icon-hangup.svg";
import videoOnIcon from "../../../../assets/images/icon-video-on.svg";
import videoOffIcon from "../../../../assets/images/icon-video-off.svg";
import micIcon from "../../../../assets/images/icon-mic.svg";
import micOffIcon from "../../../../assets/images/icon-micOff.svg";

import Chat from "../chat/chat";
import './CallCard.css';

export default class CallCard extends React.Component {
  constructor(props) {
    super(props);
    this.callFinishConnectingResolve = undefined;
    this.call = props.call;
    this.deviceManager = props.deviceManager;
    this.state = {
      callState: this.call.state,
      callId: this.call.id,
      remoteParticipants: this.call.remoteParticipants,
      streams: [],
      videoOn: true,
      micMuted: false,
      onHold: this.call.state === "Hold",
      screenShareOn: this.call.isScreenShareOn,
      cameraDeviceOptions: [],
      speakerDeviceOptions: [],
      microphoneDeviceOptions: [],
      selectedCameraDeviceId: props.selectedCameraDeviceId,
      selectedSpeakerDeviceId: props.selectedSpeakerDeviceId,
      selectedMicrophoneDeviceId: props.selectedMicrophoneDeviceId,
      showSettings: false,
      showLocalVideo: false,
      chatView: false,
    };
  }

  // Get Devices list
  async componentWillMount() {
    if (this.props.isVideoCall !== "true") {
      this.setState({ chatView: true });
      await this.handleMicOnOff();
      await this.handleVideoOnOff();
    }
    if (this.call) {
      const cameraDevices = await this.deviceManager.getCameras();
      const speakerDevices = await this.deviceManager.getSpeakers();
      const microphoneDevices = await this.deviceManager.getMicrophones();

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

      this.deviceManager.on("videoDevicesUpdated", (e) => {
        e.added.forEach((cameraDevice) => {
          this.state.cameraDeviceOptions.push({
            key: cameraDevice.id,
            text: cameraDevice.name,
          });
        });

        e.removed.forEach((removedCameraDevice) => {
          this.state.cameraDeviceOptions.forEach(async (value, index) => {
            if (value.key === removedCameraDevice.id) {
              this.state.cameraDeviceOptions.splice(index, 1);
              if (removedCameraDevice.id === this.state.selectedCameraDeviceId) {
                const cameraDevice = await this.deviceManager.getCameras()[0];
                this.setState({ selectedCameraDeviceId: cameraDevice.id });
              }
            }
          });
        });
      });

      this.deviceManager.on("audioDevicesUpdated", (e) => {
        e.added.forEach((audioDevice) => {
          if (audioDevice.deviceType === "Speaker") {
            this.state.speakerDeviceOptions.push({
              key: audioDevice.id,
              text: audioDevice.name,
            });
          } else if (audioDevice.deviceType === "Microphone") {
            this.state.microphoneDeviceOptions.push({
              key: audioDevice.id,
              text: audioDevice.name,
            });
          }
        });

        e.removed.forEach((removedAudioDevice) => {
          if (removedAudioDevice.deviceType === "Speaker") {
            this.state.speakerDeviceOptions.forEach(async (value, index) => {
              if (value.key === removedAudioDevice.id) {
                this.state.speakerDeviceOptions.splice(index, 1);
                if (
                  removedAudioDevice.id === this.state.selectedSpeakerDeviceId
                ) {
                  const speakerDevice = await this.deviceManager.getSpeakers()[0];
                  this.deviceManager.setSpeaker(speakerDevice);
                  this.setState({ selectedSpeakerDeviceId: speakerDevice.id });
                }
              }
            });
          } else if (removedAudioDevice.deviceType === "Microphone") {
            this.state.microphoneDeviceOptions.forEach(async (value, index) => {
              if (value.key === removedAudioDevice.id) {
                this.state.microphoneDeviceOptions.splice(index, 1);
                if (
                  removedAudioDevice.id ===
                  this.state.selectedMicrophoneDeviceId
                ) {
                  const microphoneDevice = await this.deviceManager.getMicrophones()[0];
                  this.deviceManager.setMicrophone(microphoneDevice);
                  this.setState({
                    selectedMicrophoneDeviceId: microphoneDevice.id,
                  });
                }
              }
            });
          }
        });
      });

      const onCallStateChanged = () => {
        console.log("stateChanged ", this.state.callState);
        this.setState({ callState: this.call.state });

        if (
          this.state.callState !== "None" &&
          this.state.callState !== "Connecting" &&
          this.state.callState !== "Incoming"
        ) {
          if (this.callFinishConnectingResolve) {
            this.callFinishConnectingResolve();
          }
        }
        if (this.state.callState === "Incoming") {
          this.selectedCameraDeviceId = cameraDevices[0]?.id;
          this.selectedSpeakerDeviceId = speakerDevices[0]?.id;
          this.selectedMicrophoneDeviceId = microphoneDevices[0]?.id;
        }
      };
      onCallStateChanged();
      this.call.on("stateChanged", onCallStateChanged);

      this.call.on("idChanged", () => {
        console.log("idChanged ", this.call.id);
        this.setState({ callId: this.call.id });
      });

      // this.call.on("isRecordingActiveChanged", () => {
      //   console.log("isRecordingActiveChanged ", this.call.isRecordingActive);
      // });

      this.call.on("isMutedChanged", () => {
        this.setState({ micMuted: this.call.isMicrophoneMuted });
      });

      this.call.on("isScreenSharingOnChanged", () => {
        this.setState({ screenShareOn: this.call.isScreenShareOn });
      });

      this.call.remoteParticipants.forEach((rp) =>
        this.subscribeToRemoteParticipant(rp)
      );
      this.call.on("remoteParticipantsUpdated", (e) => {
        console.log(
          `Call=${this.call.callId}, remoteParticipantsUpdated, added=${e.added}, removed=${e.removed}`
        );
        e.added.forEach((p) => {
          console.log("participantAdded", p);
          this.subscribeToRemoteParticipant(p);
          this.setState({ remoteParticipants: this.call.remoteParticipants });
        });
        e.removed.forEach((p) => {
          console.log("participantRemoved", p);
          this.setState({ remoteParticipants: this.call.remoteParticipants });
        });
      });
    }
  }

  subscribeToRemoteParticipant(participant) {
    participant.on("displayNameChanged", () => {
      console.log("displayNameChanged ", participant.displayName);
    });

    participant.on("participantStateChanged", () => {
      console.log(
        "participantStateChanged",
        participant.identifier.communicationUserId,
        participant.state
      );
      this.setState({ remoteParticipants: this.call.remoteParticipants });
    });

    const addToListOfAllParticipantStreams = (participantStreams) => {
      if (participantStreams) {
        let participantStreamTuples = participantStreams.map((stream) => {
          return { stream, participant };
        });
        const tuplesToAdd = [];
        participantStreamTuples.forEach((participantStreamTuple) => {
          if (
            !this.state.streams.find((v) => {
              return v === participantStreamTuple;
            })
          ) {
            tuplesToAdd.push(participantStreamTuple);
          }
        });
        this.setState({ streams: this.state.streams.concat(tuplesToAdd) });
      }
    };

    const removeFromListOfAllParticipantStreams = (participantStreams) => {
      if (participantStreams) {
        let participantStreamTuples = participantStreams.map((stream) => {
          return { stream, participant };
        });
        let arr = this.state.streams;
        arr.forEach((tuple, i) => {
          if (
            participantStreamTuples.find((v) => {
              return v === tuple;
            })
          ) {
            this.state.streams.splice(i);
          }
        });
        this.setState({ streams: arr });
      }
    };

    const handleVideoStreamsUpdated = (e) => {
      addToListOfAllParticipantStreams(e.added);
      removeFromListOfAllParticipantStreams(e.removed);
    };

    addToListOfAllParticipantStreams(participant.videoStreams);
    participant.on("videoStreamsUpdated", handleVideoStreamsUpdated);
  }

  handleVideoOnOff = async () => {
    try {
      if (
        this.call.state === "None" ||
        this.call.state === "Connecting" ||
        this.call.state === "Incoming"
      ) {
        if (this.state.videoOn) {
          this.setState({ videoOn: false });
        } else {
          this.setState({ videoOn: true });
        }
        await this.watchForCallFinishConnecting();
        if (this.state.videoOn) {
          const cameraDeviceInfo = await this.deviceManager
            .getCameras()
            .find((cameraDeviceInfo) => {
              return cameraDeviceInfo.id === this.state.selectedCameraDeviceId;
            });
          this.call
            .startVideo(new LocalVideoStream(cameraDeviceInfo))
            .catch((error) => {});
        } else {
          this.call
            .stopVideo(this.call.localVideoStreams[0])
            .catch((error) => {});
        }
      } else {
        if (this.call.localVideoStreams[0]) {
          await this.call.stopVideo(this.call.localVideoStreams[0]);
        } else {
          const cameraDeviceInfo = await this.deviceManager
            .getCameras()
            .find((cameraDeviceInfo) => {
              return cameraDeviceInfo.id === this.state.selectedCameraDeviceId;
            });
          await this.call.startVideo(new LocalVideoStream(cameraDeviceInfo));
        }
      }

      this.setState({ videoOn: this.call.localVideoStreams[0] ? true : false });
    } catch (e) {
      console.error(e);
    }
  };

  async watchForCallFinishConnecting() {
    return new Promise((resolve) => {
      if (
        this.state.callState !== "None" &&
        this.state.callState !== "Connecting" &&
        this.state.callState !== "Incoming"
      ) {
        resolve();
      } else {
        this.callFinishConnectingResolve = resolve;
      }
    }).then(() => {
      this.callFinishConnectingResolve = undefined;
    });
  }

  handleMicOnOff = async () => {
    try {
      if (!this.call.isMicrophoneMuted) {
        await this.call.mute();
      } else {
        await this.call.unmute();
      }
      this.setState({ micMuted: this.call.isMicrophoneMuted });
    } catch (e) {
      console.error(e);
    }
  };

  cameraDeviceSelectionChanged = async (event, item) => {
    const cameraDeviceInfo = await this.deviceManager
      .getCameras()
      .find((cameraDeviceInfo) => {
        return cameraDeviceInfo.id === item.key;
      });
    const localVideoStream = this.call.localVideoStreams[0];
    localVideoStream.switchSource(cameraDeviceInfo);
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

  switchToCallView = () => {
    this.setState({ chatView: false });
  };

  render() {
    return (
      <>
        {!this.state.chatView ? (
          <div className="call-screen text-center mt-3">
            {this.state.callState !== "Connected" && (
              <div>Tailwind Traders</div>
            )}
            {this.state.callState === "Connecting" && (
              <div
                className="lobby card p-5 text-center w-50 mx-auto"
              >
                <div className="pt-5 t-call-info">
                  Checking for available representatives
                </div>
              </div>
            )}
            {this.state.callState === "InLobby" && (
              <div
                className="lobby card p-5 text-center w-50 mx-auto"
              >
                <div className="pt-5 t-call-info">
                  Waiting for representative to connect
                </div>
              </div>
            )}
            {this.state.callState === "Connected" && (
              <div className="incall-section">
                <div className="remote-participant w-50 mx-auto">
                  <div className="remote-video-stream">
                    {this.state.callState === "Connected" &&
                      this.state.streams.map((v, index) => (
                        <div>
                          {index === 0 && (
                            <div className="d-inline-block mx-auto remote-participant-name px-2 py-1 bg-dark text-white rounded-lg">
                              Connected with:{" "}
                              <div className="d-inline-block font-weight-light">
                                {v.participant.displayName}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    <div className="call-vid-grid">
                      {this.state.callState === "Connected" &&
                        this.state.streams.map((v, index) => (
                            <StreamMedia
                              key={index}
                              stream={v.stream}
                              remoteParticipant={v.participant}
                            />
                        ))}
                        {
                          this.state.videoOn ? 
                          <LocalVideoPreviewCard
                            selectedCameraDeviceId={
                              this.state.selectedCameraDeviceId
                            }
                            deviceManager={this.deviceManager}
                          /> : <></>
                        }
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div
              className="call-options"
            >
              <button
                className="call-option-btn d-block mb-3 p-3 bg-dark border-0 rounded-circle"
                onClick={() => {
                  this.setState({ chatView: !this.state.chatView });
                }}
              >
                <img src={chatIcon} alt="chat" />
              </button>
              <button
                className="call-option-btn d-block mb-3 p-3 bg-dark border-0 rounded-circle"
                onClick={async () => await this.handleVideoOnOff}
              >
                <img
                  src={this.state.videoOn ? videoOnIcon : videoOffIcon}
                  alt="videoOn/Off"
                />
              </button>
              <button
                className="call-option-btn call-option-btn-ex d-block mb-3 py-3 bg-dark border-0 rounded-circle"
                onClick={async () => await this.handleMicOnOff}
              >
                <img
                  src={this.state.micMuted ? micOffIcon : micIcon}
                  alt="micOn/Off"
                />
              </button>
            </div>
            <div
              className="call-footer w-100 d-block mt-5 pt-3 pb-5 text-center"
            >
              <button
                className="btn btn-danger call-end-btn rounded-circle py-4 mt-3 mx-auto"
                onClick={() => {
                  this.call
                    .hangUp({ forEveryone: false })
                    .catch((e) => console.error(e));
                  window.location.reload();
                }}
              >
                <img src={hangupIcon} alt="hangup" />
              </button>
            </div>
          </div>
        ) : this.state.callState === "Connected" ? (
          <Chat
            userDetails={this.props.userDetails}
            threadId={this.props.threadId}
            userName={this.props.userName}
            callState={this.state.callState}
            switchToCallView={this.switchToCallView}
          />
        ) : (
          <div className="text-center mh-info-text">
            <div className="mt-5">Please wait...</div>
          </div>
        )}
      </>
    );
  }
}
