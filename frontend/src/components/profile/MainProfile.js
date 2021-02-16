import React from "react";
import axios from "axios";
import {CONSUMER_API, REPORTS_USER_API} from "../../urls/endpoints";
import {ConsumerDetail} from "./RolesDetail";
import {DetailGroupReport} from "../report/DetailGroupReport";


class MainProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'user_profile': null,
            'reports': []
        }
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get(`${CONSUMER_API}/${id}`).then(
            res => { this.setState({
                user_profile: res.data
            })
        });
        axios.get(`${REPORTS_USER_API}/${id}`).then(
            res => { this.setState({
                reports: res.data.results.features
            })
        });
    }

    render () {
        // Check if the user is an analyst or a consumer
        const profile_type = <ConsumerDetail consumer={this.state.user_profile.consumer} />

        return (
            <div>
                {profile_type}
                <DetailGroupReport reports={this.state.reports} />
            </div>
        )
    }
}

export default MainProfile;