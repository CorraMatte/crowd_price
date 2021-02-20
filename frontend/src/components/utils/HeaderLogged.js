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
    faSignOutAlt,
    faHome
} from "@fortawesome/free-solid-svg-icons";
import {getUserType} from "../../auth";
import {ANALYST_LABEL, CONSUMER_LABEL} from "./const";


export class HeaderLogged extends React.Component {
    render() {
        let feature;
        const user_type = getUserType();
        if (user_type === ANALYST_LABEL) {
            feature = (<NavItem>
                        <NavLink href="/graph/" style={{color: "#fffa"}}><FontAwesomeIcon icon={faArrowCircleUp} className={"small"}/>Graph</NavLink>
                      </NavItem>)
        } else if (user_type === CONSUMER_LABEL) {
            feature = (<NavItem>
                        <NavLink href="/add_product/" style={{color: "#fffa"}}><FontAwesomeIcon icon={faArrowCircleUp} className={"small"}/>Add product</NavLink>
                      </NavItem>)
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
                            <NavItem>
                                <NavLink href="/profile/" ><FontAwesomeIcon icon={faUser}/>Profile</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/logout/" ><FontAwesomeIcon icon={faSignOutAlt}/>Logout</NavLink>
                            </NavItem>
                        </Nav>
                </Container>
            </Navbar>
        )
    };
}

export default HeaderLogged;