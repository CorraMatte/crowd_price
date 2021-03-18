import React from "react";
import axios from "axios";
import {
    ANALYST_API,
    CONSUMER_API,
    REPORTS_USER_API,
    SEARCH_FAVORITE_ALL_API,
    SEARCH_FAVORITE_REMOVE_API
} from "../urls/endpoints";
import {AnalystDetail, ConsumerDetail} from "../components/profile/RolesDetail";
import {DetailGroupReport} from "../components/report/DetailGroupReport";
import {getUserType, getAuthHeader} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import StaticMap from "../components/map/StaticMap";
import {ANALYST_LABEL, CONSUMER_LABEL} from "../components/utils/const";
import {_update_reports, getCoordinatesByIP, getIP} from "../components/utils/utils";
import {Button, Card, Col, Container, ListGroup, Row} from "react-bootstrap";


class MainProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_profile: null,
            user_type: getUserType(),
            reports: [],
            next_reports_url: '',
            prev_reports_url: '',
            coords: [0, 0],
            starred_searches: [],
            errors: ''
        }
    }

    update_reports = (e) => {
        e.preventDefault();
        _update_reports(this, e, getAuthHeader());
    }

    update_starred_search = () => {
        axios.get(SEARCH_FAVORITE_ALL_API, getAuthHeader()).then(
            res => {
                this.setState({
                    starred_searches: res.data.results
                })
            }
        );
    }

    componentDidMount() {
        if (this.state.user_type === CONSUMER_LABEL) {
            axios.get(CONSUMER_API, getAuthHeader()).then(
                res => {
                    this.setState({
                        user_profile: res.data
                    })
                });

            this.update_starred_search();

        } else if (this.state.user_type === ANALYST_LABEL) {
            axios.get(ANALYST_API, getAuthHeader()).then(
                res => {
                    this.setState({
                        user_profile: res.data
                    })
                });
        }

        axios.get(`${REPORTS_USER_API}`, getAuthHeader()).then(
            res => {
                this.setState({
                    reports: res.data,
                    next_reports_url: res.data.next,
                    prev_reports_url: res.data.previous,
                })
            });

        navigator.geolocation.getCurrentPosition(
            position => {
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

    remove_starred_search = (e) => {
        e.preventDefault();
        const req = {
            id: e.target.id
        };
        console.log(req);


        axios.post(SEARCH_FAVORITE_REMOVE_API, req, getAuthHeader()).then(
            res => {
                this.update_starred_search();
            }
        )
    }

    render() {
        let profile_type;
        if (this.state.user_type === CONSUMER_LABEL) {
            profile_type = <ConsumerDetail consumer={this.state.user_profile} total_reports={this.state.reports.count}/>
        } else if (this.state.user_type) {
            profile_type = <AnalystDetail analyst={this.state.user_profile}/>
        }

        return (
            <div>
                <HeaderLogged/>
                <Container className={"my-md-5"} fluid>
                    <Row>
                        <Col className={"col-md-4 ml-md-1"}>
                            {profile_type}
                        </Col>
                        <Col className={"col-md-1"}></Col>
                        <Col className={"col-md-6"}>
                            <h3>Location of the store on the map</h3>
                            <StaticMap latitude={this.state.coords[1]} longitude={this.state.coords[0]}
                                       label={"Your current location"}/>
                        </Col>
                    </Row>
                </Container>
                {
                    this.state.user_type === CONSUMER_LABEL ?
                        <Container className={"col-md-12 my-5"} fluid>
                            <Card bg={"light"} className={"my-md-3"}>
                                <Card.Header>
                                    Your saved search
                                </Card.Header>
                                <Card.Body>
                                    {
                                        this.state.starred_searches.length > 0 ?
                                            <ListGroup>
                                                {
                                                    this.state.starred_searches.map((search) => (
                                                        <ListGroup.Item>
                                                            <div className={'d-inline float-left'}>
                                                                Your saved research for <b>{search.product}</b> has {search.total_results}. <br />
                                                                <a href={""}>Click here to open in the search tab</a>
                                                            </div>
                                                            <Button
                                                                className={'d-inline float-right'}
                                                                variant={'danger'}
                                                                id={search.id}
                                                                name={'delete'+search.id}
                                                                onClick={this.remove_starred_search}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </ListGroup.Item>
                                                    ))
                                                }
                                            </ListGroup>
                                            : <p>{"You didn't save any search you've done"}</p>
                                    }
                                </Card.Body>
                            </Card>


                            <Card bg={"light"} className={"my-md-3"}>
                                <Card.Header>
                                    <h3>Reports created</h3>
                                </Card.Header>
                                <Card.Body>
                                    <Button id={"previous"} onClick={this.update_reports} className={"float-left"}
                                            disabled={!this.state.prev_reports_url}>previous</Button>
                                    <Button id={"next"} onClick={this.update_reports} className={"float-right"}
                                            disabled={!this.state.next_reports_url}>next</Button>
                                </Card.Body>
                                <Card.Body>
                                    <DetailGroupReport reports={this.state.reports}/>
                                </Card.Body>
                            </Card>
                        </Container>
                        : <div></div>
                }
            </div>
        )
    }
}

export default MainProfile;