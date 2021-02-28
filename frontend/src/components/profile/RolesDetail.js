import React from "react";
import {get_badge_from_experience, get_day_month_year_from_date} from "../utils/utils";
import {Card} from "react-bootstrap";

class ProfileDetail extends React.Component {
    render () {
        if (!this.props.profile) {
            return (<div></div>);
        }

        const profile = this.props.profile;

        return (
            <div>
                <Card.Img alt={'profile image'} src={profile.picture} variant={"top"} />
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