import React from "react";
import {Redirect} from "react-router-dom";
import {isLoggedIn, setToken} from "../auth";
import {Alert, Button, Card, Col, Form} from "react-bootstrap";
import axios from "axios";
import {USER_LOGIN_API} from "../urls/endpoints";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errors: ''
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
            email: this.state.email,
            password: this.state.password,
        }

        axios.post(USER_LOGIN_API, req).then(
            res => {
                if (res.status === 200) {
                    setToken(res.data.key, res.data.type);
                    this.setState({
                        errors: ''
                    })
                } else {
                    this.setState({
                        errors: res.data
                    })
                }
            }
        ).catch(
            err => {
                this.setState({
                    errors: 'invalid email/password'
                })
            }
        )

    }

    render() {
        if (isLoggedIn()) {
            return <Redirect to="/"/>
        }

        let error_box;
        if (this.state.errors) {
            error_box = (
                <Card.Body>
                    <Alert variant={"danger"}>{this.state.errors}</Alert>
                </Card.Body>
            )
        }

        return (
            <div>
                <HeaderUnLogged/>
                <Card bg={"dark"} className={"col-md-4 mx-auto mt-3"}>
                    <Card.Header className={"text-light"}><h4>Welcome on Crowd Price!</h4></Card.Header>
                    <Card.Body className={"text-light"}>
                        <Form onSubmit={this.login}>
                            <Col className={"mt-3"}>
                                Email address
                                <Form.Control
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Enter email"
                                    value={this.state.email}
                                    required={true}
                                    onChange={this.fieldChangeHandler}
                                />
                            </Col>
                            <Col className={"mt-3"}>
                                Password
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    id="password"
                                    value={this.state.password}
                                    required={true}
                                    onChange={this.fieldChangeHandler}
                                />
                            </Col>
                            <Col className={"mt-3"}>
                                <Button type="submit" className={"btn-block btn-primary"}>Login</Button>
                            </Col>
                        </Form>
                    </Card.Body>
                    {error_box}
                    <Card.Body>
                        <Card.Link href="/signup/" className={"text-light"}>Don't have an account? Signup!</Card.Link>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default Login;