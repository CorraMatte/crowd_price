import React from "react";
import axios from "axios";
import {REPORTS_NEAREST_API} from "../../urls/endpoints";
import {getAuthHeader} from "../../auth";
import {DetailGroupReport} from "./DetailGroupReport";
import {Card, Container} from "react-bootstrap";
import {getCoordinatesByIP, getIP} from "../utils/utils";

class NearestReports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: []
        }
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            position =>  {
                const req = {pnt: `POINT(${position.coords.longitude} ${position.coords.latitude})`}
                axios.post(REPORTS_NEAREST_API, req, getAuthHeader()).then(
                    res => {
                        this.setState({
                            reports: res.data
                        })
                    });
            },
            err => {
                getIP().then(
                    res => {
                        getCoordinatesByIP(res.data.ip).then(
                            res_coords => {
                                const req = {pnt: `POINT(${res_coords.data.longitude} ${res_coords.data.latitude})`}
                                axios.post(REPORTS_NEAREST_API, req, getAuthHeader()).then(
                                    res => {
                                    this.setState({
                                        reports: res.data
                                    })
                                });
                            }
                        )
                    }
                )
            }
        );

    }

    render() {
        return (
            <div>
                {
                    this.state.reports ?
                        <Container className={"my-5"} fluid>
                            <Card bg={"light"}>
                                <Card.Header>
                                    <h3>Reports near to you</h3>
                                </Card.Header>
                                <Card.Body>
                                    <DetailGroupReport reports={this.state.reports}/>
                                </Card.Body>
                            </Card>
                        </Container>
                        :
                        <Card bg={"light"}>
                            <Card.Header>
                                <h3>No reports near to your location</h3>
                            </Card.Header>
                        </Card>
                }
            </div>
        )
    }
}

export default NearestReports;
