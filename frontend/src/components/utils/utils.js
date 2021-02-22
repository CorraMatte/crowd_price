import axios from "axios";

export const getCoordinatesByIP = (ip) => {
    return axios.get('https://www.iplocate.io/api/lookup/' + ip);
}

export const getIP = () => {
    return axios.get('https://api.ipify.org?format=json');
}

export const getLatFromReport = (report) => {
    return report.geometry.coordinates ?
        report.geometry.coordinates[1] :
        report.properties.store.geometry.coordinates[1]
}

export const getLongFromReport = (report) => {
    return report.geometry.coordinates ?
        report.geometry.coordinates[0] :
        report.properties.store.geometry.coordinates[0]
}
