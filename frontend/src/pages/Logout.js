import React from "react";
import {logOut} from "../auth";
import {Redirect} from "react-router-dom";


export class Logout extends React.Component {
    render () {
        logOut();

        return (
            <Redirect to="/" />
        )
    }
}

export default Logout;