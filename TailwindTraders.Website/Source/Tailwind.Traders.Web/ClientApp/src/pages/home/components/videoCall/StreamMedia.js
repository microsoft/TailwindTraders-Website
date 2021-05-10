import React from "react";
import { Renderer } from "@azure/communication-calling";
export default class StreamMedia extends React.Component {
    constructor(props) {
        super(props);
        this.stream = props.stream;
        this.remoteParticipant = props.remoteParticipant;
        // this.id = utils.getIdentifierText(this.remoteParticipant.identifier);

        this.state = {
            isAvailable: props.stream.isAvailable,
            isSpeaking: false
        };
    }

    /**
     * Start stream after DOM has rendered
     */
    async componentDidMount() {
        this.remoteParticipant.on('isSpeakingChanged', () => {
            this.setState({ isSpeaking: this.remoteParticipant.isSpeaking });
        });

        console.log('StreamMedia', this.stream, this.id);
        let renderer = new Renderer(this.stream);
        let view;
        let videoContainer;

        const renderStream = async () => {
            if(!view) {
                view = await renderer.createView();
            }
            videoContainer = document.getElementById(`${this.id}-${this.stream.type}-${this.stream.id}`);
            videoContainer.hidden = false;
            if(!videoContainer.hasChildNodes()) { videoContainer.appendChild(view.target); }
            videoContainer.children[0].children[0].style.objectFit = "cover";
        }

        this.stream.on('availabilityChanged', async () => {
            console.log(`stream=${this.stream.type}, availabilityChanged=${this.stream.isAvailable}`);
            if (this.stream.isAvailable) {
                this.setState({ isAvailable: true });
                await renderStream();
            } else {
                if(videoContainer) { videoContainer.hidden = true; }
                this.setState({ isAvailable: false });
            }
        });

        if (this.stream.isAvailable) {
            this.setState({ isAvailable: true });
            await renderStream();
        }
    }

    render() {
        if(this.state.isAvailable) {
            return (
                    <div className={`participant-stream-renderer ${this.state.isSpeaking ? `speaking` : `not-speaking`}`} id={`${this.id}-${this.stream.type}-${this.stream.id}`}></div>
            );
        } else {
            return null;
        }
    }
}



