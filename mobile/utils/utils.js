import axios from "react-native-axios";

export const getCoordinatesByIP = (ip) => {
    return axios.get('https://www.iplocate.io/api/lookup/' + ip);
}

export const getIP = () => {
    return axios.get('https://api.ipify.org?format=json');
}


// 1 Million as maximum price
export const MAX_PRICE = 1000000.00;

// 1 cent as minimum price
export const MIN_PRICE = 0.00;
