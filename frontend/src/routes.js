import React from "react";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from "./components/Home";
import Stores from "./components/Stores";
import Profile from "./components/Profile";
import Product from "./components/product/Product";
import Login from './components/Login';
import DetailReport from './components/report/DetailReport';
import LoginRequiredRoute from './custom_routes/LoginRequiredRoute'


export class BaseRouter extends React.Component {

    render() {
        // Page router dispatcher
        return (
            <Router>
                <Route path="/home/" component={Home} />
                <Route path="/stores/" component={Stores} />
                {/*<LoginRequiredRoute path='/upload/' component={Upload}/>*/}
                <Route path="/login/" component={Login} />
                <Route path="/product/:id" component={Product} />
                <Route path="/report/:id" component={DetailReport} />
                <LoginRequiredRoute path='/profile/' component={Profile}/>

            </Router>
        );
    }
}