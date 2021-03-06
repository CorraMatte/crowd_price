import React from "react";
import {get_badge_from_experience, get_day_month_year_from_date} from "../utils/utils";
import {Alert, Button, Card, Form} from "react-bootstrap";
import bsCustomFileInput from 'bs-custom-file-input';
import axios from "axios";
import {getAuthHeader, isLoggedIn} from "../../auth";
import {file_url, PROFILE_IMG_API, PROFILE_UPDATE_IMG_API, USER_UPDATE_PASSWORD_API} from "../../urls/endpoints";


class ProfileDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            picture: this.props.profile.picture,
            picture_error: '',

            old_password: '',
            new_password1: '',
            new_password2: '',
            password_errors: [],
            password_updated: ''
        }
    }

    componentDidMount() {
        bsCustomFileInput.init();
    }

    updateProfilePic = (e) => {
        e.preventDefault();
        const img = e.target[0].files[0];

        if (!img) {
            this.setState({
                picture_error: 'Select an image'
            });
            return;
        }

        let form_data = new FormData();
        form_data.append('image', img, img.name);

        axios.put(PROFILE_UPDATE_IMG_API, form_data, {
            headers: {
                Authorization: `Token ${isLoggedIn()}`,
                'content-type': 'multipart/form-data'
            },
        }).then(
            res => {
                axios.get(PROFILE_IMG_API, getAuthHeader()).then(
                    res_pic => {
                        this.setState({
                            picture: file_url(res_pic.data.results),
                            picture_error: ''
                        });
                    }
                )
            },
            err => {
                this.setState({
                    picture_error: err.response.data.detail
                });
            }
        )
    }

    changeUserPassword = (e) => {
        e.preventDefault();
        const req = {
            old_password: this.state.old_password,
            new_password1: this.state.new_password1,
            new_password2: this.state.new_password2,
        }
        axios.put(USER_UPDATE_PASSWORD_API, req, getAuthHeader()).then(
            res => {
                this.setState({
                    password_updated: res.data.detail,
                    password_errors: []
                });
            },
            err => {
                this.setState({
                    password_updated: '',
                    password_errors: err.response.data.detail
                });
            }
        )
        console.log(req);
    }

    fieldChangeHandler = (e) => {
        const target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({[name]: value});
    }

    render() {
        if (!this.props.profile) {
            return (<div></div>);
        }

        const profile = this.props.profile;
        let password_response_box;

        if (this.state.password_errors.length > 0) {
            password_response_box = (
                this.state.password_errors.map((error) => <Alert variant={"danger"} key={error} className={'d-block'}>{error}</Alert>)
            )
        } else if (this.state.password_updated) {
            password_response_box = (
                <Card.Body>
                    <Alert variant={'success'} className={'d-block'}>{this.state.password_updated}</Alert>
                </Card.Body>
            )
        }

        return (
            <div>
                <Card.Img alt={'profile image'} src={this.state.picture} variant={"top"}/>

                <Card.Body className={'text-center'}>
                    <h4>Hello <b>{profile.user.email}</b></h4> <br/>
                </Card.Body>

                <Card.Body>
                    <Form onSubmit={this.updateProfilePic}>
                        <div className="custom-file">
                            <input id="profilePicture" type="file" className="custom-file-input"/>
                            <label className="custom-file-label" htmlFor="profilePicture">{'Choose file'}</label>
                        </div>
                        <Button type="submit" className={"btn-block btn-primary my-md-2"}>
                            {'Change profile picture'}
                        </Button>
                    </Form>
                    {
                        this.state.picture_error ?
                        <Alert variant={"danger"} className={'d-block'}>{this.state.picture_error}</Alert> :
                        <div></div>
                    }
                </Card.Body>

                <Card.Body>
                    <Form onSubmit={this.changeUserPassword}>

                        <Form.Control
                            type="password"
                            placeholder="Old password"
                            name="old_password"
                            id="old_password"
                            className={'my-md-1'}
                            value={this.state.old_password}
                            required={true}
                            onChange={this.fieldChangeHandler}
                        />

                        <Form.Control
                            type="password"
                            placeholder="New password"
                            name="new_password1"
                            id="new_password1"
                            className={'my-md-1'}
                            value={this.state.new_password1}
                            required={true}
                            onChange={this.fieldChangeHandler}
                        />

                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            name="new_password2"
                            id="new_password2"
                            className={'my-md-1'}
                            value={this.state.new_password2}
                            required={true}
                            onChange={this.fieldChangeHandler}
                        />

                        <Button type="submit" className={"btn-block btn-primary my-md-2"}>
                            {'Change password'}
                        </Button>

                        {password_response_box}

                    </Form>
                </Card.Body>
            </div>
        )
    }
}

class ConsumerDetail extends React.Component {
    render() {
        if (!this.props.consumer) {
            return (<div></div>);
        }

        const consumer = this.props.consumer;

        return (
            <Card bg={"dark"} className={"text-light"}>
                <ProfileDetail profile={consumer.profile}/>
                <Card.Body>
                    Your current level is <br/>
                    <h2>{get_badge_from_experience(consumer.experience)}</h2>
                </Card.Body>
                <Card.Body>
                    You created {consumer.experience} reports
                </Card.Body>
                <Card.Footer>
                    <small>subscribe from {get_day_month_year_from_date(consumer.profile.subscribe_date)}</small>
                </Card.Footer>
            </Card>
        )
    }
}

class AnalystDetail extends React.Component {
    render() {
        if (!this.props.analyst) {
            return (<div></div>);
        }

        const analyst = this.props.analyst;
        return (
            <Card bg={"dark"} className={"text-light col-md-3"}>
                <ProfileDetail profile={analyst.profile}/>
                <Card.Footer>
                    <small>Your organization is <b>{analyst.organization}</b></small>
                </Card.Footer>
            </Card>
        )
    }
}

export {ProfileDetail, ConsumerDetail, AnalystDetail};