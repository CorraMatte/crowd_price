import React from "react";
import {Redirect} from "react-router-dom";
import {doLogin, isLoggedIn} from "../auth";
import {Alert, Button, Card, Col, Form} from "react-bootstrap";
import axios from "axios";
import {CONSUMER_SIGNUP_API} from "../urls/endpoints";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";
import {getCoordinatesByIP, getIP} from "../components/utils/utils";


class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password1: '',
            password2: '',
            longitude: '',
            latitude: '',
            errors: []
        }
    }

    fieldChangeHandler = (e) => {
        const target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({[name]: value});
    }

    componentDidMount() {
        getIP().then(
            res => {
                getCoordinatesByIP(res.data.ip).then(
                    res => {
                        this.setState({
                            longitude: res.data.longitude,
                            latitude: res.data.latitude,
                        })
                    }
                )
            }
        )
    }

    signup = (e) => {
        e.preventDefault();

        const req = {
            email: this.state.email,
            password1: this.state.password1,
            password2: this.state.password2
        }

        axios.post(CONSUMER_SIGNUP_API, req).then(
            res => {
                if (res.status === 201) {
                    doLogin(this.state.email, this.state.password1).then(
                        res => {
                            this.setState({
                                errors: []
                            })
                        }
                    )
                } else {
                    this.setState({
                        errors: res.data
                    })
                }
            }
        ).catch(
            err => {
                this.setState({
                    errors: err.response.data.detail
                })
            }
        )

    }

    render() {
        if (isLoggedIn()) {
            return <Redirect to="/"/>
        }

        let error_box;
        if (this.state.errors.length > 0) {
            error_box = (
                <Card.Body>
                    {this.state.errors.map((error) => <Alert variant={"danger"} key={error}>{error}</Alert>)}
                </Card.Body>
            )
        }

        return (
            <div>
                <HeaderUnLogged/>

                <Card bg={"dark"} className={"col-md-4 mx-auto mt-3"}>
                    <Card.Header className={"text-light"}>Welcome on Crowd Price!</Card.Header>
                    <Card.Body className={"text-light"}>
                        <Form onSubmit={this.signup}>
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
                                    name="password1"
                                    id="password1"
                                    value={this.state.password1}
                                    required={true}
                                    onChange={this.fieldChangeHandler}
                                />
                            </Col>
                            <Col className={"mt-3"}>
                                Repeat Password
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password2"
                                    id="password2"
                                    value={this.state.password2}
                                    required={true}
                                    onChange={this.fieldChangeHandler}
                                />
                            </Col>
                            <Col className={"mt-3"}>
                                <Button type="submit" className={"btn-block btn-primary"}>Sign in!</Button>
                            </Col>
                        </Form>

                    </Card.Body>
                    {error_box}
                    <Card.Body>
                        <Card.Link href="/login/" className={"text-light"}>Already an account? Login!</Card.Link>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default Signup;