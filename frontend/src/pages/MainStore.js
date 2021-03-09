import React from "react";
import axios from "axios";
import {STORE_API, REPORTS_STORE_API, GRAPH_STORE_PRICE_TREND_API} from "../urls/endpoints";
import {DetailGroupReport} from "../components/report/DetailGroupReport"
import {isLoggedIn} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";
import {Card, Col, Container, Row} from "react-bootstrap";
import DynMap from "../components/map/DynMap";


class MainStore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: null,
            reports: [],
            prices: []
        };
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
            res => { this.setState({
                reports: res.data.results.features
            })
        });

        axios.get(`${GRAPH_STORE_PRICE_TREND_API}/${id}`).then(
            res => {
                this.setState({
                    prices: res.data.results
                })
            }
        );
    }

    render () {
        if (!this.state.store || !this.state.reports) {
            return (<Container></Container>)
        }

        const coords = this.state.store.geometry.coordinates.slice();
        const store = this.state.store.properties;
        const reports = this.state.reports;

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
                                    There are {reports.length} reports in this store
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
                            <DetailGroupReport reports={reports} />
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        )

    }
}

export default MainStore;