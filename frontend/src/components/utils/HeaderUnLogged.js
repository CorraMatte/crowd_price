import React from "react";
import {
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faStore,
    faSignInAlt,
    faHome
} from "@fortawesome/free-solid-svg-icons";


export class HeaderUnLogged extends React.Component {
    render() {
        return (
            <Navbar style={{backgroundColor: "#64c4ed"}} light expand="md">
                <Container>
                    <NavbarBrand href="/" style={{color: "#fff"}}>Home</NavbarBrand>
                    <Nav navbar className="mr-auto">
                        <NavItem>
                            <NavLink href="/" style={{color: "#fffa"}}><FontAwesomeIcon icon={faHome} className={"small"}/>Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/login/" ><FontAwesomeIcon icon={faSignInAlt}/>Login</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/signup/" style={{color: "#fffa"}}><FontAwesomeIcon icon={faSignInAlt}/>Signup</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/search/" style={{color: "#fffa"}}><FontAwesomeIcon icon={faSearch} className={"small"}/>Search</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/stores/" style={{color: "#fffa"}}><FontAwesomeIcon icon={faStore} className={"small"}/>Stores</NavLink>
                        </NavItem>
                    </Nav>
                </Container>
            </Navbar>
        )

    };
}

export default HeaderUnLogged;