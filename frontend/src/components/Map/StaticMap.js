import React from "react";

// https://visgl.github.io/react-map-gl/docs/get-started/get-started
// https://visgl.github.io/react-map-gl/docs/api-reference/popup
import {Popup, StaticMap as ReactStaticMapGL} from 'react-map-gl';
import {ACCESS_TOKEN, MAP_STYLE, MAP_ZOOM} from "../utils/const"


export class StaticMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            latitude: 0,
            longitude: 0,
            label: '',
            zoom: MAP_ZOOM
        }
    }

    componentDidMount() {
        // load correct coordinates and label from props
    }

    render () {
        return (
            <ReactStaticMapGL
                width="100vw"
                height="100vh"
                latitude={this.state.latitude}
                longitude={this.state.latitude}
                zoom={MAP_ZOOM}
                mapStyle={MAP_STYLE}
                mapboxApiAccessToken={ACCESS_TOKEN}
            >
                <Popup
                    latitude={this.state.latitude}
                    longitude={this.state.latitude}
                    closeButton={false}
                    closeOnClick={false}
                    anchor="top" >
                    <div>{this.state.label}</div>
                </Popup>
            </ReactStaticMapGL>
        )
    }
}

export default StaticMap;