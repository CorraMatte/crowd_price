// Do login after the signup
import axios from "axios";
import {USER_LOGIN_API} from "./urls/endpoints";


// Set the authentication token
export const setToken = (token, type) => {
    sessionStorage.setItem("token", token);
    localStorage.setItem("type", type);
    console.log(token)
    console.log(type)
    console.log(sessionStorage.getItem("token"));
    return sessionStorage.getItem("token") !== null
}


export const doLogin = (email, password) => {
    const req = {
        'email': email,
        'password': password,
    }

    return axios.post(USER_LOGIN_API, req).then(
        res => {
            setToken(res.data.key, res.data.type);
        }
    )
}


// Check if user is logged in and return the token if exists
export const isLoggedIn = () => {
    return sessionStorage.getItem("token");
}

//
export const getUserType = () => {
    return localStorage.getItem("type");
}

// Delete the token from the sessionStorage
export const logOut = () => {
    console.log("LOGGING OUT!")
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
}

// Create header for request
export const getAuthHeader = () => {
    return { headers: { Authorization: `Token ${isLoggedIn()}` }};
}
