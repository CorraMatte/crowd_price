import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import {BaseRouter} from "./routes"


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