import React from "react";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from "./components/Home";
import Stores from "./components/Stores";
import Profile from "./components/Profile";
import Login from './components/Login';
import {isLoggedIn, logOut} from "./auth";
import LoginRequiredRoute from './custom_routes/LoginRequiredRoute'
import {Button} from "react-bootstrap";


/* Import pages */
//
//
// import Overview from './pages/Overview';
// import AddBarrel from './pages/AddBarrel';
// import EditBarrel from './pages/EditBarrel';
// import Operations from './pages/Operations';
// import AddUser from './pages/AddUser';
/* end pages */


export class BaseRouter extends React.Component {

    render() {
        // Page router dispatcher
        return (
            <Router>
                <Route path="/home/" component={Home} />
                <Route path="/stores/" component={Stores} />
                {/*<LoginRequiredRoute path='/upload/' component={Upload}/>*/}
                <LoginRequiredRoute path='/profile/' component={Profile}/>


                {/*
                <Route path="/login/" component={Login} />

            <PrivateRoute exact path="/" component={Overview} />
            <PrivateRoute path="/add_barrel/" component={AddBarrel} />
            <PrivateRoute path="/add_user/" component={AddUser} />
            <PrivateRoute path="/barrel/" component={EditBarrel} />
            <PrivateRoute path="/operations/" component={Operations} />*/}
            </Router>
        );
    }
}