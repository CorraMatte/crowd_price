import React from "react";
import {Navbar, Nav} from 'react-bootstrap';
import Logo from "../../img/logo.png";


export class HeaderUnLogged extends React.Component {
    render() {
        return (
            <div>
                <Navbar className="fixed-top" bg="dark" variant="dark">
                    <Navbar.Brand href="/">
                        <img src={Logo} alt="" width="35" height="35" className="d-inline-block align-top" />
                    </Navbar.Brand>
                    <Navbar.Brand href="/">Home</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/login/">Login</Nav.Link>
                        <Nav.Link href="/signup/">Signup</Nav.Link>
                        <Nav.Link href="/search/">Search</Nav.Link>
                        <Nav.Link href="/stores/">Stores</Nav.Link>
                    </Nav>
                </Navbar>
                <br /><br /><br />
            </div>
        )
    };
}

export default HeaderUnLogged;