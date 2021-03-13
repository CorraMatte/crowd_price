/*
    Django API endpoints
*/

const backend_url = 'http://127.0.0.1:8000';

export const REPORTS_NEWER_API = `${backend_url}/reports/newer`;
export const REPORTS_NEAREST_API = `${backend_url}/reports/nearest`;
export const REPORTS_STORE_API = `${backend_url}/reports/store`;
export const REPORTS_PRODUCT_API = `${backend_url}/reports/product`;
export const REPORTS_SEARCH_API = `${backend_url}/reports/search`;
export const REPORTS_USER_API = `${backend_url}/reports/user`;
export const REPORT_API = `${backend_url}/report`;

export const PRODUCTS_MOST_REPORTED_API = `${backend_url}/products/most_reported`;
export const PRODUCTS_CATEGORY_API = `${backend_url}/products/category`;
export const PRODUCT_PRICE_AVG_API = `${backend_url}/products/price/avg`;
export const CATEGORIES_API = `${backend_url}/categories`;

export const SEARCH_LATEST_API = `${backend_url}/search/latest`;
export const SEARCH_STARRED_API = `${backend_url}/search/starred`;
export const SEARCH_ADD_FAVORITE_API = `${backend_url}/search/favorite/add`;
export const SEARCH_SORT_OPTIONS_API = `${backend_url}/search/sort/options`;

export const REPORTS_DUMP_API = `${backend_url}/reports/dump`;
export const DUMP_FORMAT_OPTIONS_API = `${backend_url}/dump/format/options`;

export const STORES_API = `${backend_url}/stores`;
export const STORE_API = `${backend_url}/store`;

export const PRODUCT_API = `${backend_url}/product`;
export const PRODUCTS_API = `${backend_url}/products`;

export const CONSUMER_API = `${backend_url}/consumer/detail`;
export const ANALYST_API = `${backend_url}/analyst/detail`;
export const CONSUMER_SIGNUP_API = `${backend_url}/consumer/signup`;
export const USER_LOGIN_API = `${backend_url}/user/login`;
export const USER_UPDATE_PASSWORD_API = `${backend_url}/user/update/password`;
export const PROFILE_UPDATE_IMG_API = `${backend_url}/profile/update/img`;
export const PROFILE_IMG_API = `${backend_url}/profile/img`;

export const GRAPH_REPORT_USER_MOST_ACTIVE_API = `${backend_url}/graph/report/user/most_active`;
export const GRAPH_REPORT_PRODUCT_TOP_API = `${backend_url}/graph/report/product/top`;
export const GRAPH_REPORT_CATEGORY_TOP_API = `${backend_url}/graph/report/category/top`;
export const GRAPH_REPORT_STORE_TOP_API = `${backend_url}/graph/report/store/top`;
export const GRAPH_SEARCH_PRODUCT_TOP_API = `${backend_url}/graph/search/product/top`;
export const GRAPH_SEARCH_CATEGORY_TOP_API = `${backend_url}/graph/search/category/top`;
export const GRAPH_PRODUCT_PRICE_LAST_REPORT_API = `${backend_url}/graph/product/price/last_report`;
export const GRAPH_REPORT_PRODUCT_TOP_PRICE_AVG_API = `${backend_url}/graph/report/product/top/price/avg`;
export const GRAPH_PRODUCT_PRICE_TREND_API = `${backend_url}/graph/product/price/trend`
export const GRAPH_CATEGORY_PRICE_TREND_API = `${backend_url}/graph/category/price/trend`

// API NOT USED
export const GRAPH_STORE_PRICE_TREND_API = `${backend_url}/graph/store/price/trend`


export const file_url = (url) => {
    return `${backend_url}${url}`;
}
