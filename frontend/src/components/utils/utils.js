import axios from "axios";
import {
    GRAPH_REPORT_CATEGORY_TOP_API,
    GRAPH_REPORT_PRODUCT_TOP_API,
    GRAPH_REPORT_PRODUCT_TOP_PRICE_AVG_API,
    GRAPH_REPORT_PRODUCT_TOP_PRICE_TREND_API,
    GRAPH_REPORT_STORE_TOP_API,
    GRAPH_REPORT_USER_MOST_ACTIVE_API,
    GRAPH_SEARCH_CATEGORY_TOP_API,
    GRAPH_SEARCH_PRODUCT_TOP_API
} from "../../urls/endpoints";
import {getAuthHeader} from "../../auth";


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

export const populateGraphDataset = (obj) => {
    axios.get(GRAPH_REPORT_USER_MOST_ACTIVE_API, getAuthHeader()).then(
        res => {
            obj.setState({
                'most_active_user': res.data.results
            })
        }
    );
    axios.get(GRAPH_REPORT_PRODUCT_TOP_API, getAuthHeader()).then(
        res => {
            obj.setState({
                'most_rated_products': res.data.results
            })
        }
    );
    axios.get(GRAPH_REPORT_STORE_TOP_API, getAuthHeader()).then(
        res => {
            obj.setState({
                'most_rated_stores': res.data.results
            })
        }
    );
    axios.get(GRAPH_REPORT_CATEGORY_TOP_API, getAuthHeader()).then(
        res => {
            obj.setState({
                'most_rated_categories': res.data.results
            })
        }
    );
    axios.get(GRAPH_SEARCH_CATEGORY_TOP_API, getAuthHeader()).then(
        res => {
            obj.setState({
                'most_searched_categories': res.data.results
            })
        }
    );
    axios.get(GRAPH_SEARCH_PRODUCT_TOP_API, getAuthHeader()).then(
        res => {
            obj.setState({
                'most_searched_products': res.data.results
            })
        }
    );
    axios.get(GRAPH_REPORT_PRODUCT_TOP_PRICE_AVG_API, getAuthHeader()).then(
        res => {
            obj.setState({
                'most_report_products_avg_price': res.data.results
            })
        }
    );
    axios.get(GRAPH_REPORT_PRODUCT_TOP_PRICE_TREND_API, getAuthHeader()).then(
        res => {
            obj.setState({
                'most_report_products_price_trend': res.data.results
            })
        }
    );
}