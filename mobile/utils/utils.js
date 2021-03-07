import React from "react";
import axios from "react-native-axios";
import * as Location from "expo-location";
import {Accuracy} from "expo-location";
import {Alert} from "react-native";
import {Badge} from "react-native-elements";


export const getCoordinatesByIP = (ip) => {
    return axios.get('https://www.iplocate.io/api/lookup/' + ip);
}

export const getIP = () => {
    return axios.get('https://api.ipify.org?format=json');
}

export const setPntState = (component) => {
    Location.requestPermissionsAsync().then(
        res => {
            console.log(res)
            if (res.status === 'granted') {
                Location.getCurrentPositionAsync({accuracy: Accuracy.Balanced}).then(
                    location => {
                        component.setState({
                            pnt: `POINT(${location.coords.longitude} ${location.coords.latitude})`
                        });
                    }
                )
            } else if (res.status === 'denied') {
                Alert.alert("Activate geo localization for a better service");
                getIP().then(
                    res => {
                        getCoordinatesByIP(res.data.ip).then(
                            res => {
                                component.setState({
                                    pnt: `POINT(${res.data.longitude} ${res.data.latitude})`
                                });
                            }
                        )
                    }
                )
            }
        }
    )
}

export const get_str_date = (date) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const new_date = new Date(date);
    return new_date.toLocaleString(options);
}

// 1 Million as maximum price
export const MAX_PRICE = 5000;

// 1 cent as minimum price
export const MIN_PRICE = 0;

// Max distance in KM
export const MAX_DISTANCE = 100;

// Max Experience
export const MAX_EXPERIENCE = 100;

// Experience thresholds and values
export const NEW_USER_THRESHOLD = 10;
export const NEW_USER_LABEL = 'NEWBIE';
export const INTERMEDIATE_THRESHOLD = 20;
export const INTERMEDIATE_LABEL = 'INTERMEDIATE';
export const EXPERT_THRESHOLD = 50;
export const EXPERT_LABEL = 'EXPERT';
export const VETERAN_THRESHOLD = MAX_EXPERIENCE;
export const VETERAN_LABEL = 'VETERAN';

const badge_text_style = {
    fontSize: 32
}

const badge_style = {
    width: "90%",
    height: 50
}

export const get_badge_from_experience = (exp) => {
    if (exp < NEW_USER_THRESHOLD) {
        return <Badge status={"error"}
                      value={NEW_USER_LABEL}
                      textStyle={badge_text_style}
                      badgeStyle={badge_style}
        />
    } else if (exp < INTERMEDIATE_THRESHOLD) {
        return <Badge status={"warning"}
                      value={INTERMEDIATE_LABEL}
                      textStyle={badge_text_style}
                      badgeStyle={badge_style}
        />
    } else if (exp < EXPERT_THRESHOLD) {
        return <Badge status={"primary"}
                      value={EXPERT_LABEL}
                      textStyle={badge_text_style}
                      badgeStyle={badge_style}
        />
    } else if (exp >= VETERAN_THRESHOLD) {
        return <Badge status={"success"}
                      value={VETERAN_LABEL}
                      textStyle={badge_text_style}
                      badgeStyle={badge_style}
        />
    }
}