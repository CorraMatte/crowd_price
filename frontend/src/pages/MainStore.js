import React from "react";
import axios from "axios";
import {STORE_API, REPORTS_STORE_API} from "../urls/endpoints";
import {DetailGroupReport} from "../components/report/DetailGroupReport"
import {isLoggedIn} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";
import {StaticMap} from "../components/map/StaticMap";
import {Card, Col, Container, Row} from "react-bootstrap";


class MainStore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: null,
            reports: []
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;

        axios.get(`${STORE_API}/${id}`).then(
            res => {
                console.log(res)
                this.setState({
                    store: res.data
            })
        });

        axios.get(`${REPORTS_STORE_API}/${id}`).then(
            res => { this.setState({
                reports: res.data.results.features
            })
        });
    }

    render () {
        if (!this.state.store || !this.state.reports) {
            return (<Container></Container>)
        }

        const coords = this.state.store.geometry.coordinates.slice();
        const store = this.state.store.properties;
        const reports = this.state.reports;

        return (
            <div>
                {isLoggedIn() ? <HeaderLogged /> : <HeaderUnLogged />}
                <Container className={"float-left my-md-3"}>
                    <Row>
                        <Col className={"col-md-4 ml-md-1"}>
                            <Card bg={"dark"} className={"text-light"}>
                                <Card.Img variant={"top"} src={store.picture} />
                                <Card.Header>{store.name}</Card.Header>
                                <Card.Body>
                                    There are {reports.length} reports in this store
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className={"col-md-1"}></Col>
                        <Col className={"col-md-6"}>
                            <h3>Location of the store on the map</h3>
                            <StaticMap latitude={coords[1]} longitude={coords[0]} label={store.name} />
                        </Col>
                    </Row>
                </Container>
                <Container className={"container-fluid col-md-12 my-5"}>
                    <h3>Reports in this store</h3>
                    <DetailGroupReport reports={reports} />
                </Container>
            </div>
        )

    }
}

export default MainStore;