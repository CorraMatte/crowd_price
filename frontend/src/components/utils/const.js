// 1 Million as maximum price
export const MAX_PRICE = 5000.00;

// 1 cent as minimum price
export const MIN_PRICE = 0.00;

// Max experience of a user
export const MAX_EXPERIENCE = 100;

// Max distance in KM
export const MAX_DISTANCE = 1000;

// SRID for the project
export const SRID = 4326;

export const MAP_STYLE = "mapbox://styles/mapbox/streets-v11";
export const MAP_STATIC_ZOOM = 12;
export const MAP_DYN_ZOOM = 8;
export const MAX_RESULTS_IN_LABEL = 10;

// Access Token for MAP-GL
export const ACCESS_TOKEN = 'pk.eyJ1IjoiY29ycmFtYXR0ZW8iLCJhIjoiY2tsZGlnbmh1MXMwaDJ4bjBnN3FzYWZjdCJ9.seTk3YxBHFsIoyQq0CZRPw';


// Labels for user types
export const ANALYST_LABEL = 'analyst'
export const CONSUMER_LABEL = 'consumer'


// GRAPH TITLES
export const GRAPH_REPORT_USER_MOST_ACTIVE_TITLE = 'Users with most reports';
export const GRAPH_REPORT_PRODUCT_TOP_TITLE = 'Product with most reports';
export const GRAPH_REPORT_CATEGORY_TOP_TITLE = 'Category with most reports';
export const GRAPH_REPORT_STORE_TOP_TITLE = 'Store with most reports';
export const GRAPH_SEARCH_CATEGORY_TOP_TITLE = 'Category most searched by the user';
export const GRAPH_SEARCH_PRODUCT_TOP_TITLE = 'Product most searched by the user';
export const GRAPH_REPORT_PRODUCT_TOP_PRICE_AVG_TITLE = 'Average price of most reported products';

// Experience thresholds and values
export const NEW_USER_THRESHOLD = 10;
export const NEW_USER_LABEL = 'NEWBIE';

export const INTERMEDIATE_THRESHOLD = 20;
export const INTERMEDIATE_LABEL = 'INTERMEDIATE';

export const EXPERT_THRESHOLD = 50;
export const EXPERT_LABEL = 'EXPERT';

export const VETERAN_THRESHOLD = MAX_EXPERIENCE;
export const VETERAN_LABEL = 'VETERAN';