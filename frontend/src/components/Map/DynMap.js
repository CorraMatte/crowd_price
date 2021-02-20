import React from "react";

// https://visgl.github.io/react-map-gl/docs/get-started/get-started
// https://visgl.github.io/react-map-gl/docs/api-reference/popup
import ReactMapGL, {Popup} from 'react-map-gl';
import {ACCESS_TOKEN, MAP_DYN_ZOOM} from "../utils/const"
import {getLatFromReport, getLongFromReport} from "../utils/utils";


export class DynMap extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            latitude: 0,
            longitude: 0,
            zoom: MAP_DYN_ZOOM
        }
    }

    MapChange = (e) => {
        this.setState({
            latitude: e.latitude,
            longitude: e.longitude,
            zoom: e.zoom
        })
    }

    render () {
        let popups = [];

        if (this.props && this.props.reports.length !== 0) {
            // City from lon lat https://docs.mapbox.com/api/search/geocoding/
            // TODO: geocoding: lat, log -> city
            this.props.reports.map((report) => (
                popups.push({
                latitude: getLatFromReport(report),
                longitude: getLongFromReport(report),
                    // TODO: Eventually also the date
                label: `${report.properties.price}€`
            })));
        } else {
            return (<div></div>)
        }

        return (
            <ReactMapGL
                width="100vw"
                height="100vh"
                zoom={this.state.zoom}
                latitude={this.state.latitude || popups.length === 0 ? this.state.latitude : popups[0].latitude}
                longitude={this.state.longitude || popups.length === 0 ? this.state.longitude : popups[0].longitude}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                onViewportChange={this.MapChange}
                mapboxApiAccessToken={ACCESS_TOKEN}
            >
                {
                    popups.map((popup) => <Popup
                        latitude={popup.latitude}
                        longitude={popup.longitude}
                        closeButton={true}
                        >
                        <div>{popup.label}</div>
                    </Popup>
                    )
                }

            </ReactMapGL>
        )
    }
}

export default DynMap;