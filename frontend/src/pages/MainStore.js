import React from "react";
import axios from "axios";
import {STORE_API, REPORTS_STORE_API} from "../urls/endpoints";
import {DetailGroupReport} from "../components/report/DetailGroupReport"
import {isLoggedIn} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import DynMap from "../components/map/DynMap";
import {_update_reports} from "../components/utils/utils";


class MainStore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: null,
            reports: [],
            next_reports_url: '',
            prev_reports_url: '',
        };
    }

    update_reports = (e) => {
        e.preventDefault();
        _update_reports(this, e);
    }

    componentDidMount() {
        const id = this.props.match.params.id;

        axios.get(`${STORE_API}/${id}`).then(
            res => {
                this.setState({
                    store: res.data
            })
        });

        axios.get(`${REPORTS_STORE_API}/${id}`).then(
            res => {
                this.setState({
                    reports: res.data,
                    next_reports_url: res.data.next,
                    prev_reports_url: res.data.previous,
                })
        });
    }

    render () {
        if (!this.state.store) {
            return (<Container></Container>)
        }

        const coords = this.state.store.geometry.coordinates.slice();
        const store = this.state.store.properties;

        const popup = {
            longitude: coords[0],
            latitude: coords[1],
            label: store.name
        }

        return (
            <div>
                {isLoggedIn() ? <HeaderLogged /> : <HeaderUnLogged />}
                <Container className={"float-left my-md-3"} fluid>
                    <Row>
                        <Col className={"col-md-4"}>
                            <Card bg={"dark"} className={"text-light"}>
                                <Card.Img variant={"top"} src={store.picture} className={'mw-100'}/>
                                <Card.Header><h4>{store.name}</h4></Card.Header>
                                <Card.Body>
                                    There are {this.state.reports.count} reports in this store
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className={"col-md-8"}>
                            <h3>Location of the store on the map</h3>
                            <DynMap reports={[]} popup={popup} />
                        </Col>
                    </Row>
                </Container>
                <Container className={"my-md-5"} fluid>
                    <Card bg={"light"} className={"my-md-3"}>
                        <Card.Header>
                            <h3>Reports in this store</h3>
                        </Card.Header>
                        <Card.Body>
                            <Button id={"previous"} onClick={this.update_reports} className={"float-left"}
                                    disabled={!this.state.prev_reports_url}>previous</Button>
                            <Button id={"next"} onClick={this.update_reports} className={"float-right"}
                                    disabled={!this.state.next_reports_url}>next</Button>
                        </Card.Body>
                        <Card.Body>
                            <DetailGroupReport reports={this.state.reports} />
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        )

    }
}

export default MainStore;