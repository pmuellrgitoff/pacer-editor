import React, {Component} from 'react';
import {isSysexData} from "../utils/sysex";
import MidiPorts from "./MidiPorts";
import {requestPreset, requestPresetObj, SYSEX_SIGNATURE} from "../pacer";
import {outputFromId} from "../utils/ports";
import {hs} from "../utils/hexstring";
import "./TestSender.css";

class TestSender extends Component {

    state = {
        output: null,           // MIDI output port enabled
        data: null,
        messages: [
            requestPreset(5),
            requestPresetObj(5, 0x0D)
        ]
    };

    handleMidiInputEvent = (event) => {
        console.log("Dumper.handleMidiInputEvent", event, event.data);
        // if (event instanceof MIDIMessageEvent) {
        if (isSysexData(event.data)) {
            this.setState({data: event.data});
        } else {
            console.log("MIDI message is not a sysex message")
        }
        // }
    };

    enablePort = (port_id) => {
        console.warn(`SendTester.componentDidMount.enablePort ${port_id}`);
        this.setState({output: port_id});
    };

    sendSysex(msg) {
        console.log("sendSysex", msg);
        if (this.state.output) {
            outputFromId(this.state.output).sendSysex(SYSEX_SIGNATURE, msg);
        }
    }

    sendMessage = (msg) => {
        this.sendSysex(msg);
    };

/*
    componentDidMount() {
        console.warn("SendTester.componentDidMount");
    }

    componentWillUnmount() {
        console.warn("SendTester.componentWillUnmount");
    }
*/

    /**
     * @returns {*}
     */
    render() {

        console.log("SendTester.render", this.props);

        const { data, messages } = this.state;

        return (
            <div>

                <div className="sub-header">
                    {/*<h2>test<br />sender</h2>*/}
                    {this.props.inputPorts && <MidiPorts ports={this.props.inputPorts} type="input" onMidiEvent={this.handleMidiInputEvent} />}
                    {this.props.outputPorts && <MidiPorts ports={this.props.outputPorts} type="output" onPortSelection={this.enablePort} />}
                </div>

                <div className="main">

                    <h4>message:</h4>
                    {/*<div className="message">*/}
                        {/*{hs(message)}*/}
                    {/*</div>*/}

                    <div>
                        {messages.map((msg, i) =>
                            <div key={i}>
                                <div className="message">
                                    <button onClick={() => this.sendMessage(msg)}>send</button> {hs(msg)}
                                </div>
                            </div>
                        )}
                    </div>

                    <h4>response:</h4>
                    <div className="message">
                        {hs(data)}
                    </div>

                </div>

            </div>

        );
    }
}

export default TestSender;
