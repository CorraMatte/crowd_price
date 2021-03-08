import axios from "axios";
import {
    EXPERT_LABEL,
    EXPERT_THRESHOLD,
    INTERMEDIATE_LABEL,
    INTERMEDIATE_THRESHOLD,
    NEW_USER_LABEL,
    NEW_USER_THRESHOLD, VETERAN_LABEL,
    VETERAN_THRESHOLD
} from "./const";
import {Badge} from "react-bootstrap";

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
    const month = new_date.getMonth() + 1;
    const day = new_date.getDate();
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${new_date.getFullYear()}`
}

export const get_badge_from_experience = (exp) => {
    if (exp < NEW_USER_THRESHOLD) {
        return <Badge variant={"primary"} pill>{NEW_USER_LABEL}</Badge>
    } else if (exp < INTERMEDIATE_THRESHOLD) {
        return <Badge variant={"light"} pill>{INTERMEDIATE_LABEL}</Badge>
    } else if (exp < EXPERT_THRESHOLD) {
        return <Badge variant={"secondary"} pill>{EXPERT_LABEL}</Badge>
    } else if (exp >= VETERAN_THRESHOLD) {
        return <Badge variant={"success"} pill>{VETERAN_LABEL}</Badge>
    }
}