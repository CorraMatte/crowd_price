import React from "react";
import {get_day_month_year_from_date} from "../utils/utils";

class ProfileDetail extends React.Component {
    render () {
        if (!this.props.profile) {
            return (<div></div>);
        }

        const profile = this.props.profile;

        return (
            <div>
                <img alt={'profile image'} src={profile.picture} />
                email: {profile.user.email}
                subcribe from: {get_day_month_year_from_date(profile.subscribe_date)}
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
            <div>
                <ProfileDetail profile={consumer.profile} />
                experience: {consumer.experience}
            </div>
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
            <div>
                <ProfileDetail profile={analyst.profile} />
                experience: {analyst.organization}
            </div>
        )
    }
}

export {ProfileDetail, ConsumerDetail, AnalystDetail};