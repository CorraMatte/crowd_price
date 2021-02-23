import AsyncStorage from '@react-native-async-storage/async-storage';


export const setToken = (token) => {
    AsyncStorage.setItem("token", token).then(() => {});
}

export const getToken = () => {
    return AsyncStorage.getItem('token');
}

// Delete the token from the sessionStorage
export const logOut = () => {
    AsyncStorage.removeItem("token").then(() => {});
}

// Create header for request
export const getAuthHeader = () => {
    return { headers: { Authorization: "Token " + getToken() }};
}
