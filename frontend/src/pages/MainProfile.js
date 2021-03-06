import React from "react";
import axios from "axios";
import {
    ANALYST_API,
    CONSUMER_API, DUMP_LAST_API,
    REPORTS_USER_API,
    SEARCH_FAVORITE_ALL_API,
    SEARCH_FAVORITE_REMOVE_API
} from "../urls/endpoints";
import {AnalystDetail, ConsumerDetail} from "../components/profile/RolesDetail";
import {DetailGroupReport} from "../components/report/DetailGroupReport";
import {getUserType, getAuthHeader} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import {ANALYST_LABEL, CONSUMER_LABEL} from "../components/utils/const";
import {_update_reports, get_full_date, getCoordinatesByIP, getIP} from "../components/utils/utils";
import {Button, Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import {SEARCH_URL} from "../urls/navigation";
import DynMap from "../components/map/DynMap";


class MainProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_profile: null,
            user_type: getUserType(),
            reports: [],
            dumps: [],
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

        } else if (this.state.user_type === ANALYST_LABEL) {
            axios.get(ANALYST_API, getAuthHeader()).then(
                res => {
                    this.setState({
                        user_profile: res.data
                    })
                });

            axios.get(DUMP_LAST_API, getAuthHeader()).then(
                res => {
                    this.setState({
                        dumps: res.data
                    })
                });
        }

        this.update_starred_search();

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

        let reports;
        if (this.state.reports.results) {
            reports = this.state.reports.results.features;
        } else {
            reports = []
        }

        const you_are_here_popup = {
            latitude: this.state.coords[1],
            longitude: this.state.coords[0],
            label: "Your current location"
        }

        return (
            <div>
                <HeaderLogged/>
                <Container className={"my-md-5"} fluid>
                    <Row>
                        <Col className={"col-md-4"}>
                            {profile_type}
                        </Col>
                        <Col className={"col-md-8"}>
                            <h3>Your location on the map</h3>
                            <DynMap popup={you_are_here_popup} reports={reports}/>
                        </Col>
                    </Row>
                </Container>


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
                                                <ListGroup.Item key={search.id}>
                                                    <div className={'d-inline float-left'}>
                                                        Your saved research
                                                        for <b>{search.product}</b> has {search.total_results} results. <br/>
                                                        <a href={`${SEARCH_URL}/${search.id}`}>
                                                            Click here to open in the search tab
                                                        </a>
                                                    </div>
                                                    <Button
                                                        className={'d-inline float-right'}
                                                        variant={'danger'}
                                                        id={search.id}
                                                        name={'delete' + search.id}
                                                        onClick={this.remove_starred_search}
                                                    >
                                                        Remove
                                                    </Button>
                                                </ListGroup.Item>
                                            ))
                                        }
                                    </ListGroup>
                                    : <div>{"You didn't save any search you've done"}</div>
                            }
                        </Card.Body>
                    </Card>
                </Container>

                {
                    this.state.user_type === CONSUMER_LABEL &&
                        <Container className={"col-md-12 my-5"} fluid>
                            <Card bg={"light"} className={"my-md-3"}>
                                <Card.Header>
                                    <h3>Reports created</h3>
                                </Card.Header>
                                {
                                    this.state.reports.count > 0 ?
                                        <div>
                                            <Card.Body>
                                                <Button id={"previous"} onClick={this.update_reports}
                                                        className={"float-left"}
                                                        disabled={!this.state.prev_reports_url}>previous</Button>
                                                <Button id={"next"} onClick={this.update_reports}
                                                        className={"float-right"}
                                                        disabled={!this.state.next_reports_url}>next</Button>
                                            </Card.Body>
                                            <Card.Body>
                                                <DetailGroupReport reports={this.state.reports}/>
                                            </Card.Body>
                                        </div>
                                        : <Card.Body>You didn't create any reports</Card.Body>
                                }
                            </Card>
                        </Container>
                }
                {
                    this.state.user_type === ANALYST_LABEL &&
                        <Container className={"col-md-12 my-5"} fluid>
                            {this.state.dumps.length > 0 ?
                                <Card bg={"light"} className={"my-md-3"}>
                                    <Card.Header>
                                        Your latest download
                                    </Card.Header>
                                    <Card.Body>
                                        <ListGroup>
                                            {
                                                this.state.dumps.map((dump) => (
                                                    <ListGroup.Item key={dump.id}>
                                                        <div className={'d-inline float-left'}>
                                                            {get_full_date(dump.download_timestamp)} - {dump.export_format}
                                                        </div>
                                                        <Button href={`${SEARCH_URL}/${dump.search}`}
                                                                className={'float-right'}>
                                                            Go to Search
                                                        </Button>
                                                    </ListGroup.Item>
                                                ))
                                            }
                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                                : <p>{"You didn't downlaod any search"}</p>
                            }
                        </Container>
                }
            </div>
        )
    }

}


export default MainProfile;