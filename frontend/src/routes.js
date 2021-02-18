import React from "react";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from "./pages/Home";
import {Stores} from "./pages/Stores";
import MainProfile from "./pages/MainProfile";
import MainProduct from "./pages/MainProduct";
import MainCategory from "./pages/MainCategory";
import Login from './pages/Login';
import MainReport from './pages/MainReport';
import MainStore from './pages/MainStore';
import MainSearch from "./pages/MainSearch";
import LoginRequiredRoute from './custom_routes/LoginRequiredRoute'
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";



export class BaseRouter extends React.Component {

    render() {
        // Page router dispatcher
        return (
            <Router>
                <Route exact path="/" component={Home} />
                <Route path="/stores/" component={Stores} />
                <Route path="/login/" component={Login} />
                <Route path="/signup/" component={Signup} />
                <Route path="/logout/" component={Logout} />
                <Route path="/search/" component={MainSearch} />
                <Route path="/product/:id" component={MainProduct} />
                <Route path="/report/:id" component={MainReport} />
                <Route path="/store/:id" component={MainStore} />
                <Route path="/category/:id" component={MainCategory} />
                <LoginRequiredRoute path='/profile/' component={MainProfile}/>

                {/*<LoginRequiredRoute path='/upload/' component={Upload}/>}
                {/*<LoginRequiredRoute path='/graph/' component={Profile}/>*/}
            </Router>
        );
    }
}