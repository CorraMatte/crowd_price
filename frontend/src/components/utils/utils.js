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

export const aggregate_report_by_coords = (reports) => {
    let aggr_reports = {};
    reports.forEach((report) => {
        if (!aggr_reports[report.geometry.coordinates]) {
            aggr_reports[report.geometry.coordinates] = [];
        }
        aggr_reports[report.geometry.coordinates].push(report);
    })

    return aggr_reports;
}

export const get_day_month_year_from_date = (date) => {
    const new_date = new Date(date);
    return `${new_date.getDay()}/${new_date.getMonth()}/${new_date.getFullYear()}`
}