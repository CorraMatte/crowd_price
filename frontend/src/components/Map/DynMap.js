import React from "react";

// https://visgl.github.io/react-map-gl/docs/get-started/get-started
// https://visgl.github.io/react-map-gl/docs/api-reference/popup
import ReactMapGL, {Popup} from 'react-map-gl';
import {ACCESS_TOKEN, MAP_ZOOM} from "../utils/const"


export class DynMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            latitude: 0,
            longitude: 0,
            popups: [],
            zoom: MAP_ZOOM
        }
    }

    componentDidMount() {
        // load correct coordinates and popups from props
    }


    MapChange = (e) => {
        this.setState({
            latitude: e.latitude,
            longitude: e.longitude,
            zoom: e.zoom
        })
    }

    render () {
        return (
            <ReactMapGL
                {...this.state}
                width="100vw"
                height="100vh"
                mapStyle="mapbox://styles/mapbox/streets-v11"
                onViewportChange={this.MapChange}
                mapboxApiAccessToken={ACCESS_TOKEN}
            >
                {
                    this.state.popups.map((popup) => <Popup
                        latitude={popup.latitude}
                        longitude={popup.longitude}
                        closeButton={true}
                        anchor="top" >
                        <div>{popup.label}</div>
                    </Popup>
                    )
                }

            </ReactMapGL>
        )
    }
}

export default DynMap;