import axios from "react-native-axios";

export const getCoordinatesByIP = (ip) => {
    return axios.get('https://www.iplocate.io/api/lookup/' + ip);
}

export const getIP = () => {
    return axios.get('https://api.ipify.org?format=json');
}
