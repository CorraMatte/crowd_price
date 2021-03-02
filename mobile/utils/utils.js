import axios from "react-native-axios";
import * as Location from "expo-location";
import {Accuracy} from "expo-location";
import {Alert} from "react-native";



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


// 1 Million as maximum price
export const MAX_PRICE = 10000;

// 1 cent as minimum price
export const MIN_PRICE = 0;

// Max distance in KM
export const MAX_DISTANCE = 100;