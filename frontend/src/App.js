import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import {HeaderUnLogged} from "./components/utils/HeaderUnLogged"
import {BaseRouter} from "./routes"
import {isLoggedIn} from "./auth";
import HeaderLogged from "./components/utils/HeaderLogged";


// Dispatch to each page
class App extends React.Component {

    render() {
        return (
            <Router>

                <BaseRouter {...this.props}/>
            </Router>
        );
    }
}

export default App;