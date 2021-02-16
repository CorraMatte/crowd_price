import React from "react";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from "./components/Home";
import {Stores} from "./components/store/Stores";
import Profile from "./components/Profile";
import MainProduct from "./components/product/MainProduct";
import MainCategory from "./components/product/MainCategory";
import Login from './components/Login';
import MainReport from './components/report/MainReport';
import MainStore from './components/store/MainStore';
import MainSearch from "./components/search/MainSearch";
import LoginRequiredRoute from './custom_routes/LoginRequiredRoute'



export class BaseRouter extends React.Component {

    render() {
        // Page router dispatcher
        return (
            <Router>

                <Route exact path="/" component={Home} />
                <Route path="/stores/" component={Stores} />
                <Route path="/login/" component={Login} />
                <Route path="/search/" component={MainSearch} />
                <Route path="/product/:id" component={MainProduct} />
                <Route path="/report/:id" component={MainReport} />
                <Route path="/store/:id" component={MainStore} />
                <Route path="/category/:id" component={MainCategory} />
                <LoginRequiredRoute path='/profile/' component={Profile}/>

                {/*<LoginRequiredRoute path='/upload/' component={Upload}/>*/}
                {/*<LoginRequiredRoute path='/graph/' component={Profile}/>*/}
            </Router>
        );
    }
}