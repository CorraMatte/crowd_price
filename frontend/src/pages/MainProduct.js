import React from "react";
import axios from "axios";
import {DetailGroupReport} from "../components/report/DetailGroupReport";
import {
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


class MainProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: null,
            reports: [],
            prices: [],
            avg: 0,
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
                    reports: res.data.results.features
                });
            });

        axios.get(`${GRAPH_PRODUCT_PRICE_TREND_API}/${id}`).then(
            res => {
                this.setState({
                    prices: res.data.results
                })
            }
        )

        axios.get(`${PRODUCT_PRICE_AVG_API}/${id}`).then(
            res => {
                this.setState({
                    avg: res.data.result
                })
            }
        )
    }

    render() {
        const prod = this.state.product;
        const reports = this.state.reports;

        if (!prod) {
            return (<div></div>)
        }

        console.log(this.state.prices)


        return (
            <div>
                {isLoggedIn() ? <HeaderLogged/> : <HeaderUnLogged/>}
                <Container className={"float-left my-md-3"} fluid>
                    <Row>
                        <Col className={"col-md-4 ml-md-1"}>
                            <Card bg={"dark"} className={"text-light"}>
                                <Card.Header><h4>{prod.name}</h4></Card.Header>
                                <Card.Body>
                                    Categories <br/>
                                    {prod.categories.length > 0 ? prod.categories.map((cat) => (
                                            <CategoryItem name={cat.name} key={cat.id} id={cat.id}/>
                                        )
                                    ) : <small>{"No category for this item"}</small>}
                                </Card.Body>
                                <Card.Body>
                                    {`Has ${this.state.reports.length ? this.state.reports.length : '0'} reviews`}
                                </Card.Body>
                            </Card>

                            <Card bg={"dark"} className={"text-light my-md-2"}>
                                <Card.Header><h4>{"Average reported price is " + this.state.avg + "€"}</h4></Card.Header>
                            </Card>
                        </Col>
                        <Col className={"col-md-1"}></Col>
                        <Col className={"col-md-6"}>
                            <DynMap reports={reports}/>
                        </Col>
                    </Row>
                </Container>

                {this.state.reports.length > 0 ? (
                    <Container className={"col-md-12 my-5"} fluid>
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