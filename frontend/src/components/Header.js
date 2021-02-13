import React from "react";
import {
    Collapse,
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


export class Header extends React.Component {

    state = {
        isOpen: false,
    };

    toggle = () => this.setIsOpen(!this.state.isOpen);

    setIsOpen = (value) => {
        this.setState({
            isOpen: value
        })
    };

    logout = () => {
        // this.props.onAuth();
    };

    render() {
        let username = localStorage.getItem('user');
        let action; let profile;
        if (this.props.isAuthenticated) {
            action = (
                <NavItem>
                    <NavLink href="/" style={{color: "#fffa", backgroundColor: "#64c4ed", border: "0"}}
                         onClick={this.logout}><FontAwesomeIcon icon={faSignOutAlt}/> Logout</NavLink>
                </NavItem>
            )
            profile =(
                <NavItem>
                    <NavLink href="/profile/" style={{color: "#fffa"}}><FontAwesomeIcon
                        icon={faUser}/> {username}</NavLink>
                </NavItem>
            )
        } else {
            action = (
                <NavItem>
                    <NavLink href="/login/" style={{color: "#fffa"}}><FontAwesomeIcon
                        icon={faSignInAlt}/> Login</NavLink>
                </NavItem>
            )
        }

        return (
            <Navbar style={{backgroundColor: "#64c4ed"}} light expand="md">
                <Container>
                    <NavbarBrand href="/home" style={{color: "#fff"}}>Home</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav navbar className="mr-auto">
                                <NavItem>
                                    <NavLink href="/home/" style={{color: "#fffa"}}><FontAwesomeIcon icon={faHome} className={"small"}/>Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="/upload/" style={{color: "#fffa"}}><FontAwesomeIcon icon={faArrowCircleUp} className={"small"}/>Upload reports</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="/search/" style={{color: "#fffa"}}><FontAwesomeIcon icon={faSearch} className={"small"}/>Search</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="/stores/" style={{color: "#fffa"}}><FontAwesomeIcon icon={faStore} className={"small"}/>Stores</NavLink>
                                </NavItem>
                                {profile}
                                {action}
                            </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        )
    };
}


const mapStateToProps = state => {
    return {
        isAuthenticated: state.token !== null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        // onAuth: () => dispatch(actions.authLogout())
    }
};

export default Header;