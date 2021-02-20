import React from "react";

// https://visgl.github.io/react-map-gl/docs/get-started/get-started
// https://visgl.github.io/react-map-gl/docs/api-reference/popup
import {Popup, StaticMap as ReactStaticMapGL} from 'react-map-gl';
import {ACCESS_TOKEN, MAP_STYLE, MAP_ZOOM} from "../utils/const"


export class StaticMap extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        let props;
        if (this.props) {
            // City from lon lat https://docs.mapbox.com/api/search/geocoding/
            props = {
                latitude: this.props.latitude,
                longitude: this.props.longitude,
                label: `${this.props.label} lon:${this.props.longitude} lat: ${this.props.latitude}`
            }
        } else {
            return (<div></div>)
        }

        return (
            <ReactStaticMapGL
                width="50vw"
                height="50vh"
                latitude={props.latitude}
                longitude={props.longitude}
                zoom={MAP_ZOOM}
                mapStyle={MAP_STYLE}
                mapboxApiAccessToken={ACCESS_TOKEN}
            >
                <Popup
                    latitude={props.latitude}
                    longitude={props.longitude}
                    closeButton={false}
                    closeOnClick={false}
                    anchor="top" >
                    <div>{props.label}</div>
                </Popup>
            </ReactStaticMapGL>
        )
    }
}

export default StaticMap;