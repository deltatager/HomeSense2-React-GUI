import React, {ChangeEvent} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './index.css';
import * as serviceWorker from './serviceWorker';

class DeviceCard extends React.Component<IDeviceProps, any> {
    constructor(props: IDeviceProps) {
        super(props);
        this.state = props.initialState;

        this.updateRemoteState = this.updateRemoteState.bind(this);
    }

    updateRemoteState(): void {
        let self = this;
        $.ajax({
            url: "http://" + window.location.hostname + ":8080/hs2/" + this.state.instanceOf + "s/" + this.state.id,
            type: 'PUT',
            contentType: "application/json",
            data: JSON.stringify(this.state)
        }).done(function (data) {
            data = JSON.parse(data);
            self.setState(data);
        });
    }

    render = () =>
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 my-3">
            <div className="card">
                <div className="card-body">
                    <p>Name: {this.state.name} (#{this.state.id})</p>
                    <p>Address: {this.state.address}</p>
                </div>
            </div>
        </div>
}

class LightCard extends DeviceCard {
    constructor(props: IDeviceProps) {
        super(props);

        this.toggleMode = this.toggleMode.bind(this);
    }

    toggleMode(): void {
        this.setState({mode: this.state.mode === "ON" ? "OFF" : "ON"},
            () => this.updateRemoteState());
    }

    render = () =>
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 my-3">
            <div className="card">
                <div className="card-body">
                    <p>Name: {this.state.name} (#{this.state.id})</p>
                    <p>Address: {this.state.address}</p>
                </div>
                <div className="card-footer" style={{backgroundColor: this.state.mode === "ON" ? "#eee" : "#000"}}>
                    <button onClick={this.toggleMode} className="d-block mx-auto btn btn-primary"
                            style={{width: "200px"}}><i className="fas fa-power-off"></i> Toggle light
                    </button>
                </div>
            </div>
        </div>

}

class PwmLightCard extends LightCard {
    constructor(props: IDeviceProps) {
        super(props);

        this.changeBrightness = this.changeBrightness.bind(this);
    }
    getHexBrightness() {
        return "#" + this.state.brightness.toString(16) + this.state.brightness.toString(16) + this.state.brightness.toString(16)
    }


    changeBrightness(event: ChangeEvent) {
        if (event.target == null) return;

        this.setState({brightness: parseInt((event.target as any).value)}, () => this.updateRemoteState())
    }

    render = () =>
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 my-3">
            <div className="card">
                <div className="card-body">
                    <p>Name: {this.state.name} (#{this.state.id})</p>
                    <p>Address: {this.state.address}</p>
                </div>
                <div className="card-footer" style={{backgroundColor: this.state.mode === "ON" ? this.getHexBrightness() : "#000"}}>
                    <input onChange={this.changeBrightness} type="range" name="brightness" min="0" max="255" step="10" value={this.state.brightness}/>
                    <button onClick={this.toggleMode} className="btn btn-primary">
                        <i className="fas fa-power-off"></i>
                    </button>
                </div>
            </div>
        </div>

}

class RgbLightCard extends LightCard {
    constructor(props: IDeviceProps) {
        super(props);

        this.changeColor = this.changeColor.bind(this);
    }

    getHexColor() {
        return "#" + this.state.red.toString(16).padStart(2, 0) + this.state.green.toString(16).padStart(2, 0) + this.state.blue.toString(16).padStart(2, 0)
    }

    changeColor(event: ChangeEvent) {
        if (event.target == null) return;

        const red: number = parseInt((event.target as any).value.substring(1, 3), 16);
        const green: number = parseInt((event.target as any).value.substring(3, 5), 16);
        const blue: number = parseInt((event.target as any).value.substring(5, 7), 16);
        this.setState({red: red, green: green, blue: blue}, () => this.updateRemoteState())

    }

    render = () =>
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 my-3">
            <div className="card">
                <div className="card-body">
                    <p>Name: {this.state.name} (#{this.state.id})</p>
                    <p>Address: {this.state.address}</p>
                </div>
                <div className="card-footer"
                     style={{backgroundColor: this.state.mode === "ON" ? this.getHexColor() : "#000000"}}>
                    <div className="d-block mx-auto" style={{width: "200px"}}>
                        <input onChange={this.changeColor} type="color"
                               value={this.getHexColor()}/>
                        <button onClick={this.toggleMode} className="btn btn-primary">
                            <i className="fas fa-power-off"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
}

interface IDeviceState {
    instanceOf: String;
    name: String;
    address: number;
    id: number;
    mode: String;
}

interface IDeviceProps {
    initialState: IDeviceState;
}

interface IGroupState {
    devices: Array<Object>;
}

class DeviceCardGroup extends React.Component {
    state: IGroupState;

    constructor({props}: { props: any }) {
        super(props);
        this.state = {devices: []};
    }

    componentDidMount(): void {
        let self = this;
        $.getJSON("http://" + window.location.hostname + ":8080/hs2/devices")
            .done(function (data) {
                self.setState({devices: data})
            });
    }

    render = () =>
        <div className="row">
            {this.state.devices.map((item: any) => {
                item = JSON.parse(item);
                if (item.instanceOf === "light")
                    return <LightCard key={item.id} initialState={item}/>
                else if (item.instanceOf === "rgblight")
                    return <RgbLightCard key={item.id} initialState={item}/>
                else if (item.instanceOf === "pwmlight")
                    return <PwmLightCard key={item.id} initialState={item}/>
               else
                    return <DeviceCard key={item.id} initialState={item}/>
            })}
        </div>
}

ReactDOM.render(
    <DeviceCardGroup/>,
    $("#reactRoot")[0]
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
