import React from "react";
import axios from "axios";
import {ANALYST_API, CONSUMER_API, REPORTS_USER_API} from "../urls/endpoints";
import {AnalystDetail, ConsumerDetail} from "../components/profile/RolesDetail";
import {DetailGroupReport} from "../components/report/DetailGroupReport";
import {getUserType, getAuthHeader} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import StaticMap from "../components/map/StaticMap";
import {ANALYST_LABEL, CONSUMER_LABEL} from "../components/utils/const";
import {getCoordinatesByIP, getIP} from "../components/utils/utils";


class MainProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_profile: null,
            user_type: getUserType(),
            reports: [],
            coords: [0, 0],
            errors: ''
        }
    }

    componentDidMount() {
        // const id = this.props.match.params.id;
        if (this.state.user_type === CONSUMER_LABEL) {
            axios.get(`${CONSUMER_API}`, getAuthHeader()).then(
                res => {this.setState({
                    user_profile: res.data
                })
            });
        } else if (this.state.user_type === ANALYST_LABEL) {
            axios.get(`${ANALYST_API}`, getAuthHeader()).then(
                res => {
                    this.setState({
                        user_profile: res.data
                    })
            });
        }

        axios.get(`${REPORTS_USER_API}`, getAuthHeader()).then(
            res => {
                this.setState({
                    reports: res.data.results.features
                })
        });

        navigator.geolocation.getCurrentPosition(
            position =>  {
                this.setState({
                    coords: [position.coords.longitude, position.coords.latitude]
                });
            },
            err => {
                getIP().then(
                    res => {
                        getCoordinatesByIP(res.data.ip).then(
                            res_coords => {
                                this.setState({
                                    errors: err.message,
                                    coords: [res_coords.data.longitude, res_coords.data.latitude]
                                })
                            }
                        )
                    }
                )
            }
        );
    }

    render () {
        let profile_type;
        if (this.state.user_type === CONSUMER_LABEL) {
            profile_type = <ConsumerDetail consumer={this.state.user_profile} />
        } else if (this.state.user_type) {
            profile_type = <AnalystDetail analyst={this.state.user_profile} />
        }

        return (
            <div>
                <HeaderLogged />
                {profile_type}
                <StaticMap latitude={this.state.coords[1]} longitude={this.state.coords[0]} label={"Your location"} />
                <h5>{this.state.errors}</h5>
                <DetailGroupReport reports={this.state.reports} />
            </div>
        )
    }
}

export default MainProfile;