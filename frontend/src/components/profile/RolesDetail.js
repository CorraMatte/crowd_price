import React from "react";

class ProfileDetail extends React.Component {
    render () {
        if (!this.props.profile) {
            return (<div></div>);
        }

        const profile = this.props.profile;

        return (
            <div>
                <img src={profile.picture} />
                email: {profile.user.email}
                subcribe from: {profile.subscribe_date}
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