import React from "react";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from "./components/Home";
import LoginRequiredRoute from './custom_routes/LoginRequiredRoute'


/* Import pages */
// import Login from './pages/Login';
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