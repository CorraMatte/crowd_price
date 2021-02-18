import React from "react";
import {Redirect} from "react-router-dom";
import {isLoggedIn, setToken} from "../auth";
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import {CONSUMER_SIGNUP} from "../urls/endpoints";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";


class Login extends React.Component {
    constructor(props) {
        super(props);
        let past_date = new Date()
        past_date.setDate(past_date.getDate() - 30)

        this.state = {
            'email': '',
            'password1': '',
            'password2': '',
            'errors': ''
        }
    }

    fieldChangeHandler = (e) => {
        const target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({[name]: value});
    }

    getCoordinatesByIP() {
        axios.get('https://api.ipify.org?format=json').then(
            res => {
                const ip = res.data.ip;
                console.log(ip);
                axios.get('https://www.iplocate.io/api/lookup/' + ip).then(
                    res => {
                        console.log(res.data.longitude)
                        console.log(res.data.latitude)
                    }
                )
            })
    }

    login = (e) => {
        e.preventDefault();

        const req = {
            'email': this.state.email,
            'password1': this.state.password1,
            'password2': this.state.password2,
        }

        axios.post(CONSUMER_SIGNUP, req).then(
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
                let errors = 'Errors: '
                console.log(err.response.data)
                err.response.data.detail.map((msg_error) => errors += msg_error);

                this.setState({
                    'errors': errors
                })
            }
        )

    }

    render() {

        this.getCoordinatesByIP();

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
                        name="password1"
                        id="password1"
                        value={this.state.password1}
                        required={true}
                        onChange={this.fieldChangeHandler}
                    />

                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password2"
                        id="password2"
                        value={this.state.password2}
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