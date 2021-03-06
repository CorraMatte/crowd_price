import React from "react";
import {get_badge_from_experience, get_day_month_year_from_date} from "../utils/utils";
import {Alert, Button, Card, Form} from "react-bootstrap";
import bsCustomFileInput from 'bs-custom-file-input';
import axios from "axios";
import {getAuthHeader, isLoggedIn} from "../../auth";
import {file_url, PROFILE_IMG_API, PROFILE_UPDATE_IMG_API} from "../../urls/endpoints";


class ProfileDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            picture: this.props.profile.picture,
            errors: ''
        }
    }

    updateProfilePic = (e) => {
        e.preventDefault();
        const img = e.target[0].files[0];

        if (!img) {
            this.setState({
                errors: 'Select an image'
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
                            errors: ''
                        });
                    }
                )
            },
            err => {
                this.setState({
                    errors: err.response.data.detail
                });
            }
        )
    }

    componentDidMount() {
        bsCustomFileInput.init()
    }

    render () {
        if (!this.props.profile) {
            return (<div></div>);
        }

        const profile = this.props.profile;
        return (
            <div>
                <Card.Img alt={'profile image'} src={this.state.picture} variant={"top"} />
                <Card.Body>
                    <Form onSubmit={this.updateProfilePic}>
                        <div className="custom-file">
                            <input id="profilePicture" type="file" className="custom-file-input" />
                            <label className="custom-file-label" htmlFor="profilePicture">{'Choose file'}</label>
                        </div>
                        <Button type="submit" className={"btn-block btn-primary my-md-2"}>{'Change picture'}</Button>
                    </Form>
                    {this.state.errors ? <Alert variant={"danger"}>{this.state.errors}</Alert> : <div></div> }
                </Card.Body>
                <Card.Body>
                    Hello <b>{profile.user.email}</b>  <br />
                </Card.Body>
            </div>
        )
    }
}

class ConsumerDetail extends React.Component {
    render () {
        if (!this.props.consumer) {
            return (<div></div>);
        }

        const consumer = this.props.consumer;

        return (
            <Card bg={"dark"} className={"text-light"}>
                <ProfileDetail profile={consumer.profile} />
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
    render () {
        if (!this.props.analyst) {
            return (<div></div>);
        }

        const analyst = this.props.analyst;
        return (
            <Card bg={"dark"} className={"text-light col-md-3"}>
                <ProfileDetail profile={analyst.profile} />
                <Card.Footer>
                    <small>Your organization is <b>{analyst.organization}</b></small>
                </Card.Footer>
            </Card>
        )
    }
}

export {ProfileDetail, ConsumerDetail, AnalystDetail};