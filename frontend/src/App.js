import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import {BaseRouter} from "./routes"
import 'bootstrap/dist/css/bootstrap.min.css';


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