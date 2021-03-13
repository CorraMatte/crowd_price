import React from "react";
import axios from "axios";
import {DetailGroupReport} from "../components/report/DetailGroupReport";
import {
    GRAPH_PRODUCT_PRICE_LAST_REPORT_API,
    GRAPH_PRODUCT_PRICE_TREND_API,
    PRODUCT_API,
    PRODUCT_PRICE_AVG_API,
    REPORTS_PRODUCT_API
} from "../urls/endpoints";
import {isLoggedIn} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";
import DynMap from "../components/map/DynMap";
import {Card, Col, Container, Row} from "react-bootstrap";
import CategoryItem from "../components/product/CategoryItem";
import {LineChartItem} from "../components/graph/LineChartItem";
import BarChartItem from "../components/graph/BarChartItem";
import {getCoordinatesByIP, getIP} from "../components/utils/utils";
import {PRODUCT_URL} from "../urls/navigation";


class MainProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: null,
            reports: [],
            total_reports: 0,
            prices: [],
            avg: 0,
            last_reports: [],

            popup: {}
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get(`${PRODUCT_API}/${id}`).then(
            res => {
                this.setState({
                    product: res.data
                });
            });

        axios.get(`${REPORTS_PRODUCT_API}/${id}`).then(
            res => {
                this.setState({
                    reports: res.data.results.features,
                    total_reports: res.data.count
                });
            });

        axios.get(`${GRAPH_PRODUCT_PRICE_TREND_API}/${id}`).then(
            res => {
                this.setState({
                    prices: res.data.results
                });
            }
        )

        axios.get(`${PRODUCT_PRICE_AVG_API}/${id}`).then(
            res => {
                this.setState({
                    avg: res.data.result
                });
            }
        )

        axios.get(`${GRAPH_PRODUCT_PRICE_LAST_REPORT_API}/${id}`).then(
            res => {
                this.setState({
                    last_reports: res.data.results
                });
            }
        )

        navigator.geolocation.getCurrentPosition(
            position =>  {
                this.setState({
                    popup: {
                        longitude: position.coords.longitude,
                        latitude: position.coords.latitude,
                        label: "Your current location"
                    }
                });
            },
            err => {
                getIP().then(
                    res => {
                        getCoordinatesByIP(res.data.ip).then(
                            res_coords => {
                                this.setState({
                                    popup: {
                                        longitude: res_coords.data.longitude,
                                        latitude: res_coords.data.latitude,
                                        label: "Your current location"
                                    }
                                });
                            }
                        )
                    }
                )
            }
        );
    }

    render() {
        const prod = this.state.product;
        const reports = this.state.reports;

        if (!prod) {
            return (<div></div>)
        }

        return (
            <div>
                {isLoggedIn() ? <HeaderLogged/> : <HeaderUnLogged/>}
                <Container className={"float-left my-md-3"} fluid>
                    <Row>
                        <Col className={"col-md-4"}>
                            <Card bg={"dark"} className={"text-light"}>
                                <Card.Header><h4><a className={"text-light"} href={`${PRODUCT_URL}/${prod.id}`}>{prod.name}</a></h4></Card.Header>
                                <Card.Body>
                                    Categories <br/>
                                    {prod.categories.length > 0 ? prod.categories.map((cat) => (
                                            <CategoryItem name={cat.name} key={cat.id} id={cat.id}/>
                                        )
                                    ) : <small>{"No category for this item"}</small>}
                                </Card.Body>
                                <Card.Body>
                                    {`Has ${this.state.total_reports} reviews`}
                                </Card.Body>
                            </Card>

                            <Card bg={"dark"} className={"text-light my-md-2"}>
                                <Card.Header>
                                    <h4>{"Average reported price is: "} {this.state.avg ? this.state.avg.toFixed(2) + '€' : 'N/A'}</h4>
                                </Card.Header>
                            </Card>
                        </Col>
                        <Col className={"col-md-8"}>
                            <DynMap reports={reports} popup={this.state.popup}/>
                        </Col>
                    </Row>
                </Container>

                {this.state.reports.length > 0 ? (
                    <Container className={"my-5"} fluid>
                        <Card bg={"light"} className={"my-md-3"}>
                            <Card.Header>
                                <h3>Prices based on report</h3>
                            </Card.Header>
                            <Card.Body>
                                <LineChartItem prices={this.state.prices} />
                            </Card.Body>
                        </Card>

                        <Card bg={"light"} className={"my-md-3"}>
                            <Card.Header>
                                <h3>Prices based on the latest reports</h3>
                            </Card.Header>
                            <Card.Body>
                                <BarChartItem data={this.state.last_reports} label={"price"} />
                            </Card.Body>
                        </Card>

                        <Card bg={"light"} className={"my-md-3"}>
                            <Card.Header>
                                <h3>Reports for this product</h3>
                            </Card.Header>
                            <Card.Body>
                                <DetailGroupReport reports={this.state.reports}/>
                            </Card.Body>
                        </Card>
                    </Container>
                ) : <h3 className={"my-5 mx-5"}>There no reports for this product</h3>}

            </div>
        )

    }
}

export default MainProduct;