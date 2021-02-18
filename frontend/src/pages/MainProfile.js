import React from "react";
import axios from "axios";
import {ANALYST_API, CONSUMER_API, REPORTS_USER_API} from "../../urls/endpoints";
import {AnalystDetail, ConsumerDetail} from "./RolesDetail";
import {DetailGroupReport} from "../report/DetailGroupReport";
import {getUserType, getAuthHeader} from "../../auth";


class MainProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'user_profile': null,
            'user_type': getUserType(),
            'reports': []
        }
    }

    componentDidMount() {
        // const id = this.props.match.params.id;
        if (this.state.user_type === 'consumer') {
            axios.get(`${CONSUMER_API}`, getAuthHeader()).then(
                res => {this.setState({
                    user_profile: res.data
                })
            });
        } else if (this.state.user_type === 'analyst') {
            axios.get(`${ANALYST_API}`, getAuthHeader()).then(
                res => { this.setState({
                    user_profile: res.data
                })
            });
        }

        axios.get(`${REPORTS_USER_API}`, getAuthHeader()).then(
            res => { this.setState({
                reports: res.data.results.features
            })
        });
    }

    render () {
        let profile_type
        if (this.state.user_type === 'consumer') {
            profile_type = <ConsumerDetail consumer={this.state.user_profile} />
        } else if (this.state.user_type) {
            profile_type = <AnalystDetail analyst={this.state.user_profile} />
        }
        return (
            <div>
                {profile_type}
                <DetailGroupReport reports={this.state.reports} />
            </div>
        )
    }
}

export default MainProfile;