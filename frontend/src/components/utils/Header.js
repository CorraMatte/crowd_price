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
    faUser,
    faSearch,
    faStore,
    faArrowCircleUp,
    faSignInAlt,
    faSignOutAlt,
    faHome
} from "@fortawesome/free-solid-svg-icons";
import {getUserType, isLoggedIn, logOut} from "../../auth";


export class Header extends React.Component {
    render() {
        const user_type = getUserType();
        let action;
        if (isLoggedIn()) {
            action = (
                [<NavItem>
                    <NavLink href="/" style={{color: "#fffa", backgroundColor: "#64c4ed", border: "0"}}
                         onClick={logOut()}><FontAwesomeIcon icon={faSignOutAlt}/>Logout</NavLink>
                </NavItem>,
                <NavItem>
                    <NavLink href="/profile/" style={{color: "#fffa"}}><FontAwesomeIcon
                        icon={faUser}/>Profile</NavLink>
                </NavItem>]
            )
        } else {
            action = (
                <NavItem>
                    <NavLink href="/login/" style={{color: "#fffa"}}><FontAwesomeIcon
                        icon={faSignInAlt}/>Login</NavLink>
                </NavItem>
            )
        }

        let feature;
        if (user_type) {
            feature = <NavItem>
                        <NavLink href="/upload/" style={{color: "#fffa"}}><FontAwesomeIcon icon={faArrowCircleUp} className={"small"}/>Upload reports</NavLink>
                      </NavItem>
        } else if (user_type) {
            feature = <NavItem>
                        <NavLink href="/graph/" style={{color: "#fffa"}}><FontAwesomeIcon icon={faArrowCircleUp} className={"small"}/>Graph</NavLink>
                      </NavItem>
        }

        return (
            <Navbar style={{backgroundColor: "#64c4ed"}} light expand="md">
                <Container>
                    <NavbarBrand href="/" style={{color: "#fff"}}>Home</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                        <Nav navbar className="mr-auto">
                            <NavItem>
                                <NavLink href="/" style={{color: "#fffa"}}><FontAwesomeIcon icon={faHome} className={"small"}/>Home</NavLink>
                            </NavItem>
                            {feature}
                            <NavItem>
                                <NavLink href="/search/" style={{color: "#fffa"}}><FontAwesomeIcon icon={faSearch} className={"small"}/>Search</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/stores/" style={{color: "#fffa"}}><FontAwesomeIcon icon={faStore} className={"small"}/>Stores</NavLink>
                            </NavItem>
                            {action}
                        </Nav>
                </Container>
            </Navbar>
        )
    };
}

export default Header;