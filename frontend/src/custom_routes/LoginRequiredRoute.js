import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLoggedIn } from "../auth";


// PrivateRoute is used for page where authentication is required (redirect to login page)
// Otherwise you can use Route
const LoginRequiredRoute = ({component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render={props =>
                isLoggedIn() ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
                )
            }
        />
    );
}

export default LoginRequiredRoute;