
// Set the authentication token
export const setToken = (token, type) => {
    sessionStorage.setItem("token", token);
    localStorage.setItem("type", type);
    return JSON.parse(sessionStorage.getItem("token")) !== null
}

// Check if user is logged in and return the token if exists
export const isLoggedIn = () => {
    return sessionStorage.getItem("token");
    return true;
}

//
export const getUserType = () => {
    return localStorage.getItem("type");
}

// Delete the token from the sessionStorage
export const logOut = () => {
    // sessionStorage.removeItem("token");
}

// Create header for request
export const requestConfig = () => {
    return { headers: { Authorization: `Token ${isLoggedIn()}` }};
}

// Build backend path
export const backendPath = (path="/") => {
    let proto = "http";
    let address = "127.0.0.1";
    let port = "8000";

    return proto + "://" + address + ":" + port + path;
}

