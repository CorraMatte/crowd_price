import React from "react";
import {Navbar, Nav} from 'react-bootstrap';
import {getUserType} from "../../auth";
import {ANALYST_LABEL} from "./const";
import Logo from "../../img/logo.png"


export class HeaderLogged extends React.Component {
    render() {
        let feature;
        const user_type = getUserType();
        if (user_type === ANALYST_LABEL) {
            feature = <Nav.Link href="/graphs/">Graphs</Nav.Link>
        }

        return (
            <div>
                <Navbar className="fixed-top" bg="dark" variant="dark">
                    <Navbar.Brand>
                        <img src={Logo} alt="" width="40" height="40" className="d-inline-block align-top" />
                    </Navbar.Brand>
                    <Navbar.Brand href="/">Home</Navbar.Brand>
                    <Nav className="mr-auto">
                        {feature}
                        <Nav.Link href="/search/">Search</Nav.Link>
                        <Nav.Link href="/stores/">Stores</Nav.Link>
                        <Nav.Link href="/profile/">Profile</Nav.Link>
                    </Nav>
                    <Nav className="ml-auto">
                        <Nav.Link href="/logout/">Logout</Nav.Link>
                    </Nav>
                </Navbar>
                <br /><br /><br />
            </div>
        )
    };
}

export default HeaderLogged;