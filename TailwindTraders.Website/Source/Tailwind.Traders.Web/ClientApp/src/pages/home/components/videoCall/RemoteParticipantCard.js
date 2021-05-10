import { Persona, PersonaSize } from "office-ui-fabric-react";
import { Icon } from "@fluentui/react/lib/Icon";

export default class RemoteParticipantCard extends React.Component {
  constructor(props) {
    super(props);
    this.call = props.call;
    this.remoteParticipant = props.remoteParticipant;
    // this.id = utils.getIdentifierText(this.remoteParticipant.identifier);

    this.state = {
      isSpeaking: this.remoteParticipant.isSpeaking,
      state: this.remoteParticipant.state,
      isMuted: this.remoteParticipant.isMuted,
    };
  }

  async componentWillMount() {
    this.remoteParticipant.on("isMutedChanged", () => {
      this.setState({ isMuted: this.remoteParticipant.isMuted });
    });

    this.remoteParticipant.on("participantStateChanged", () => {
      this.setState({ state: this.remoteParticipant.state });
    });

    this.remoteParticipant.on("isSpeakingChanged", () => {
      this.setState({ isSpeaking: this.remoteParticipant.isSpeaking });
    });
  }

  handleRemoveParticipant(e, identifier) {
    e.preventDefault();
    this.call.removeParticipant(identifier).catch((e) => console.error(e));
  }

  render() {
    return (
      <li
        className={`paticipant-item ${
          this.state.isSpeaking &&
          !this.remoteParticipant.videoStreams.find((stream) => {
            return stream.isAvailable;
          })
            ? `speaking`
            : `not-speaking`
        }`}
        action
      >
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-lg11">
            <Persona
              size={PersonaSize.size40}
              text={this.remoteParticipant.displayName}
              secondaryText={this.state.state}
              styles={{
                primaryText: { color: "#000000" },
                secondaryText: { color: "#666666" },
              }}
            />
          </div>
          <div className="ms-Grid-col ms-lg1">
            {this.state.isMuted && (
              <Icon className="icon-text-large" iconName="MicOff2" />
            )}
            {!this.state.isMuted && (
              <Icon className="icon-text-large" iconName="Microphone" />
            )}
          </div>
        </div>
      </li>
    );
  }
}
