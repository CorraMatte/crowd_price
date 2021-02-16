/*
    Django API endpoints
*/

const backend_url = 'http://127.0.0.1:8000';

export const REPORTS_NEWER_API = `${backend_url}/reports/newer`
export const REPORTS_NEAREST_API = `${backend_url}/reports/nearest`
export const REPORTS_STORE_API = `${backend_url}/reports/store`
export const REPORTS_PRODUCT_API = `${backend_url}/reports/product`
export const REPORTS_SEARCH_API = `${backend_url}/reports/search`
export const REPORTS_USER_API = `${backend_url}/reports/user`
export const REPORT_API = `${backend_url}/report`

export const PRODUCTS_MOST_REPORTED_API = `${backend_url}/products/most_reported`
export const PRODUCTS_CATEGORY_API = `${backend_url}/products/category`
export const CATEGORIES_API = `${backend_url}/categories`

export const SEARCH_LATEST_API = `${backend_url}/search/latest`
export const SEARCH_STARRED_API = `${backend_url}/search/starred`

export const STORES_API = `${backend_url}/stores`
export const STORE_API = `${backend_url}/store`

export const PRODUCT_API = `${backend_url}/product`
export const CONSUMER_API = `${backend_url}/consumer`
