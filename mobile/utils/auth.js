import AsyncStorage from '@react-native-async-storage/async-storage';


// https://www.javatpoint.com/react-native-asyncstorage
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
export const getAuthHeader = (token) => {
    return { headers: { Authorization: "Token " + token }};
}
