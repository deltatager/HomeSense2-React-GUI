import React, {ChangeEvent} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './index.css';
import * as serviceWorker from './serviceWorker';

const JAVA_BACKEND_IP = "pi1.deltanet.int";
//const JAVA_BACKEND_IP = window.location.hostname;

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

class DeviceCard extends React.Component<IDeviceProps, any> {
    constructor(props: IDeviceProps) {
        super(props);
        this.state = props.initialState;

        this.updateRemoteState = this.updateRemoteState.bind(this);
    }

    updateRemoteState(): void {
        let self = this;
        $.ajax({
            url: "http://" + JAVA_BACKEND_IP + ":8080/hs2/" + this.state.instanceOf + "s/" + this.state.id,
            type: 'PUT',
            contentType: "application/json",
            data: JSON.stringify(this.state)
        }).done(function (data) {
            data = JSON.parse(data);
            self.setState(data);
        });
    }

    render = () =>
        <div className="col-6 col-lg-4 col-xl-3 my-3">
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
        <div className="col-6 col-lg-4 col-xl-3 my-3">
            <div className="card">
                <div className="card-body">
                    <p>Name: {this.state.name} (#{this.state.id})</p>
                    <p>Address: {this.state.address}</p>
                </div>
                <div className="card-footer" style={{backgroundColor: this.state.mode === "ON" ? "#eee" : "#000"}}>
                    <button onClick={this.toggleMode} className="d-block mx-auto btn btn-primary"
                            style={{width: "100%"}}><i className="fas fa-power-off"></i> Toggle light
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
        <div className="col-6 col-lg-4 col-xl-3 my-3">
            <div className="card">
                <div className="card-body">
                    <p>Name: {this.state.name} (#{this.state.id})</p>
                    <p>Address: {this.state.address}</p>
                </div>
                <div className="card-footer"
                     style={{backgroundColor: this.state.mode === "ON" ? this.getHexBrightness() : "#000"}}>
                    <input className="mr-3" style={{width: "50%"}} onChange={this.changeBrightness} type="range" name="brightness" min="0" max="255" step="5"
                           value={this.state.brightness}/>
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
        <div className="col-6 col-lg-4 col-xl-3 my-3">
            <div className="card">
                <div className="card-body">
                    <p>Name: {this.state.name} (#{this.state.id})</p>
                    <p>Address: {this.state.address}</p>
                </div>
                <div className="card-footer"
                     style={{backgroundColor: this.state.mode === "ON" ? this.getHexColor() : "#000000"}}>
                    <div className="d-block mx-auto" style={{width: "200px"}}>
                        <input className="mr-3" onChange={this.changeColor} type="color"
                               value={this.getHexColor()} style={{width: "30%"}} />
                        <button onClick={this.toggleMode} className="btn btn-primary">
                            <i className="fas fa-power-off"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
}

class DeviceCardGroup extends React.Component {
    state: IGroupState;

    constructor({props}: { props: any }) {
        super(props);
        this.state = {devices: []};
    }

    componentDidMount(): void {
        let self = this;
        $.getJSON("http://" + JAVA_BACKEND_IP + ":8080/hs2/devices")
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

class Navbar extends React.Component<any, any> {

    constructor({props}: { props: any }) {
        super(props);
    }

    render = () =>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#/">HomeSense 2</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <a className="nav-link" href="#/">Devices</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#/" onClick={this.props.modalToggler}>Add a device</a>
                    </li>
                </ul>
            </div>
        </nav>
}

class NewDeviceModal extends React.Component<any, any> {

    constructor({props}: { props: any }) {
        super(props);

        this.state = {devicesTypes: undefined, type: undefined, name: undefined, address: undefined};

        let self = this;
        $.getJSON("http://" + JAVA_BACKEND_IP + ":8080/hs2/devices/supported")
            .done(function (data) {
                self.setState({deviceTypes: data})
            });

        this.sendPostRequest = this.sendPostRequest.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    sendPostRequest(): void {
        let self = this;
        $.ajax({
            url: "http://" + JAVA_BACKEND_IP + ":8080/hs2/devices",
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(this.state)
        }).done(function (data) {
            data = JSON.parse(data);
            self.setState(data);
        });
    }

    onChangeHandler(): void {
        console.log(this)
    }

    render() {
        if (!this.props.show) {
            return null;
        }

        const backdropStyle = {
            position: 'fixed' as 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: 50
        };

        const modalStyle = {
            backgroundColor: '#fff',
            borderRadius: 5,
            maxWidth: 500,
            minHeight: 300,
            margin: '0 auto',
            padding: 30
        };

        return (
            <div className="backdrop2" style={backdropStyle}>
                <div className="modal2" style={modalStyle}>
                    <h2>Add a new device</h2>
                    Type: <input onChange={this.onChangeHandler} list="types" id="type"/>
                    Name: <input onChange={this.onChangeHandler} type="text" id="name"/>
                    Address: <input onChange={this.onChangeHandler} type="number" id="address"/>
                    <button> Create device </button>

                    <datalist id="types">
                        {this.state.deviceTypes.map((item: any) =>
                            <option value={item}/>
                        )
                        }
                    </datalist>
                    <div className="footer2">
                        <button onClick={this.props.onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

class App extends React.Component<any, any> {

    constructor({props}: { props: any }) {
        super(props);

        this.state = {modalOpen: false};
    }

    toggleModal = () => {
        this.setState({modalOpen: !this.state.modalOpen});
    }

    render = () =>
        <div>
            <Navbar modalToggler={this.toggleModal}/>
            <DeviceCardGroup/>
            <div className="App">
                <NewDeviceModal show={this.state.modalOpen} onClose={this.toggleModal}/>
            </div>
        </div>
}

ReactDOM.render(
    <App/>,
    $("#container-fluid")[0]
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
