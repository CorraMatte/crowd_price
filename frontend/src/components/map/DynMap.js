import React from "react";
import ReactMapGL, {Popup} from 'react-map-gl';
import {ACCESS_TOKEN, MAP_DYN_ZOOM, MAP_STATIC_ZOOM, MAX_RESULTS_IN_LABEL} from "../utils/const"
import {
    aggregate_report_by_coords,
    get_day_month_year_from_date,
    getLatFromReport,
    getLongFromReport
} from "../utils/utils";
import 'mapbox-gl/dist/mapbox-gl.css';


export class DynMap extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.reports.length === 0) {
            this.state = {
                latitude: this.props.popup.latitude,
                longitude: this.props.popup.longitude,
                zoom: MAP_STATIC_ZOOM
            };
        } else {
            this.state = {
                latitude: 0,
                longitude: 0,
                zoom: MAP_DYN_ZOOM
            }
        }
    }

    MapChange = (e) => {
        this.setState({
            latitude: e.latitude,
            longitude: e.longitude,
            zoom: e.zoom
        })
    }

    render() {
        let popups = [];

        if (this.props.reports) {
            const aggr_reports = aggregate_report_by_coords(this.props.reports);
            for (const [key, reports] of Object.entries(aggr_reports)) {
                const labels = [];
                reports.slice(0, MAX_RESULTS_IN_LABEL).forEach((report) => {
                    const props = report.properties
                    labels.push(
                        `${props.product.name}: ${props.price}€ on ${get_day_month_year_from_date(props.created_time)}
                        `);
                })

                if (reports.length > MAX_RESULTS_IN_LABEL) {
                    labels.push('..and more');
                }

                popups.push({
                    latitude: getLatFromReport(reports[0]),
                    longitude: getLongFromReport(reports[0]),
                    labels: labels,
                    key: key
                });
            }
        } else {
            return (<div></div>)
        }

        let latitude, longitude;
        if (this.state.latitude === 0) {
            if (popups.length === 0) {
                latitude = this.props.popup.latitude;
                longitude = this.props.popup.longitude;
            } else {
                latitude = popups[0].latitude;
                longitude = popups[0].longitude;
            }
        } else {
            latitude = this.state.latitude;
            longitude = this.state.longitude;
        }

        return (
            <ReactMapGL
                width="100%"
                height="50vh"
                zoom={this.state.zoom}
                latitude={latitude}
                longitude={longitude}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                onViewportChange={this.MapChange}
                mapboxApiAccessToken={ACCESS_TOKEN}
            >
                {
                    popups.map(
                        (popup) =>
                            <Popup
                                latitude={popup.latitude}
                                longitude={popup.longitude}
                                closeButton={true}
                                key={popup.key}
                            >
                                {
                                    popup.labels.map((label) =>
                                        <div key={label}>{label}</div>
                                    )
                                }
                            </Popup>
                    )
                }
                <Popup longitude={this.props.popup.longitude} latitude={this.props.popup.latitude} key={this.props.popup.label}>
                    {this.props.popup.label}
                </Popup>
            </ReactMapGL>
        )
    }
}

export default DynMap;