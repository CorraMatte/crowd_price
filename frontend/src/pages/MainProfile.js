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
import {Col, Container, Row} from "react-bootstrap";


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
                <Container className={"my-md-5"} fluid>
                    <Row>
                        <Col className={"col-md-4 ml-md-1"}>
                            {profile_type}
                        </Col>
                        <Col className={"col-md-1"}></Col>
                        <Col className={"col-md-6"}>
                            <h3>Location of the store on the map</h3>
                            <StaticMap latitude={this.state.coords[1]} longitude={this.state.coords[0]} label={"Your current location"} />
                        </Col>
                    </Row>
                </Container>
                <Container className={"col-md-12 my-5"} fluid>
                    <h3>Reports in this store</h3>
                    <DetailGroupReport reports={this.state.reports} />
                </Container>
            </div>
        )
    }
}

export default MainProfile;