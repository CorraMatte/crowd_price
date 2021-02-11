import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import {Header} from "./components/Header"
import {BaseRouter} from "./routes"


// Dispatch to each page
class App extends React.Component {

    render() {
        return (
            <Router>
                <Header {...this.props}/>
                <BaseRouter {...this.props}/>
            </Router>
        );
    }
}

export default App;