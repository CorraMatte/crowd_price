import React from "react";
import axios from "axios";
import {ANALYST_API, CONSUMER_API, REPORTS_USER_API} from "../urls/endpoints";
import {AnalystDetail, ConsumerDetail} from "../components/profile/RolesDetail";
import {DetailGroupReport} from "../components/report/DetailGroupReport";
import {getUserType, getAuthHeader} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import StaticMap from "../components/Map/StaticMap";
import {Button} from "react-bootstrap";
import {getCoordinatesByIP, getIP} from "../components/utils/utils";


class MainProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'user_profile': null,
            'user_type': getUserType(),
            'reports': []
        }
    }

    updateProfileLocation () {
        getIP().then(
            res => {
                getCoordinatesByIP(res.data.ip).then(
                    res => {
                        console.log('update location profile')
                        // console.log(res)
                    }
                )
            }
        )
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
    }

    render () {
        let profile_type;
        let coords = [0, 0];

        if (this.state.user_profile) {
            coords = this.state.user_profile.profile.pnt.coordinates.slice();
        }

        if (this.state.user_type === 'consumer') {
            profile_type = <ConsumerDetail consumer={this.state.user_profile} />
        } else if (this.state.user_type) {
            profile_type = <AnalystDetail analyst={this.state.user_profile} />
        }

        return (
            <div>
                <HeaderLogged />
                {profile_type}
                <StaticMap latitude={coords[1]} longitude={coords[0]} label={"Your location"} />
                <DetailGroupReport reports={this.state.reports} />
                <Button id={"submit"} color={"primary"} onClick={this.updateProfileLocation}>update my location</Button>
            </div>
        )
    }
}

export default MainProfile;