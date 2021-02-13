/*
    Django API endpoints
*/

let backend_url = 'http://127.0.0.1:8000';

export const REPORTS_NEWER_API = `${backend_url}/reports/newer`
export const REPORTS_NEAREST_API = `${backend_url}/reports/nearest`
export const MOST_REPORTED_PRODUCTS_API = `${backend_url}/products/most_reported`
export const SEARCH_LATEST_API = `${backend_url}/search/latest`
export const SEARCH_STARRED_API = `${backend_url}/search/starred`
export const STORES_API = `${backend_url}/stores`
export const REPORTS_STORE_API = `${backend_url}/reports/store/`
export const PRODUCT_API = `${backend_url}/product`
export const CONSUMER_API = `${backend_url}/consumer`

// NAVIGATION
let frontend_url = 'http://127.0.0.1:3000';
export const REPORT_URL = `${frontend_url}/report`
export const PRODUCT_URL = `${frontend_url}/product`

// export const STORES_API = `${backend_url}/stores`
