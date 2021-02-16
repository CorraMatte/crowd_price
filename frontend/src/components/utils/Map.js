import React from "react";

// eslint-disable-next-line
/*global google*/

import {GoogleMap, Circle, Marker} from "react-google-maps";
const {
    withGoogleMap,
} = require("react-google-maps");

const options = {
    strokeColor: "#f00f",
    fillColor: "#f008"
};

const Map = withGoogleMap((props) => {
    let radius = props.radius;

    return (
        <GoogleMap
            zoom={props.zoom}
            center={props.center}
        >
            {props.places.map((place, index) => {
                return (
                    <span key={index}>
                  {props.special &&
                  <Marker
                      position={{lat: place.lat, lng: place.lng}}
                      label={(index+1).toString()}
                  />
                  }
                        {!props.special &&
                        <Circle
                            key={index}
                            options={options}
                            center={place}
                            radius={radius}
                        />
                        }
              </span>
                );
            })}
        </GoogleMap>
    );
});

export default Map;