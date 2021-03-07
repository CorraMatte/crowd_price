/*
    Django API endpoints
*/

const backend_url = 'http://192.168.1.8:8000';

export const REPORT_ADD_API = `${backend_url}/report/add`;
export const REPORTS_SEARCH_API = `${backend_url}/reports/search`;

export const SEARCH_SORT_OPTIONS_API = `${backend_url}/search/sort/options`;

export const STORES_API = `${backend_url}/stores`;

export const PRODUCTS_API = `${backend_url}/products`;
export const CONSUMER_SIGNUP_API = `${backend_url}/consumer/signup`;
export const USER_LOGIN_API = `${backend_url}/user/login`;
