import React from "react";
import {Redirect} from "react-router-dom";
import {isLoggedIn, setToken} from "../auth";
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import {USER_LOGIN_API} from "../urls/endpoints";
import HeaderLogged from "../components/utils/HeaderLogged";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";


class Login extends React.Component {
    constructor(props) {
        super(props);
        let past_date = new Date()
        past_date.setDate(past_date.getDate() - 30)

        this.state = {
            'email': '',
            'password': '',
            'errors': ''
        }
    }

    fieldChangeHandler = (e) => {
        const target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({[name]: value});
    }

    login = (e) => {
        e.preventDefault();
        const req = {
            'email': this.state.email,
            'password': this.state.password,
        }

        axios.post(USER_LOGIN_API, req).then(
            res => {
                if (res.status === 200) {
                    setToken(res.data.key, res.data.type);
                } else {
                    this.setState({
                        'errors': res.data
                    })
                }
            }
        ).catch(
            err => {
                this.setState({
                    'errors': 'invalid email/password'
                })
            }
        )

    }

    render() {
        if (isLoggedIn()) {
            return <Redirect to="/" />
        }

        return (
            <div>
                <HeaderUnLogged />
                {this.state.errors}
                <Form onSubmit={this.login}>

                    <Form.Control
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter email"
                        value={this.state.email}
                        required={true}
                        onChange={this.fieldChangeHandler}
                    />

                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        id="password"
                        value={this.state.password}
                        required={true}
                        onChange={this.fieldChangeHandler}
                    />

                    <Button type="submit">Sign in!</Button>
                </Form>
            </div>
        )
    }
}

export default Login;