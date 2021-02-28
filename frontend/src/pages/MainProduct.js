import React from "react";
import axios from "axios";
import {DetailGroupReport} from "../components/report/DetailGroupReport";
import {PRODUCT_API, REPORTS_PRODUCT_API} from "../urls/endpoints";
import {isLoggedIn} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";
import DynMap from "../components/map/DynMap";
import {Card, Col, Container, Row} from "react-bootstrap";
import CategoryItem from "../components/product/CategoryItem";

class MainProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: null,
            reports: []
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get(`${PRODUCT_API}/${id}`).then(
            res => {
                this.setState({
                    product: res.data
                })
            });

        axios.get(`${REPORTS_PRODUCT_API}/${id}`).then(
            res => {
                this.setState({
                    reports: res.data.results.features
                })
            });
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
                <Container className={"my-md-3"}>
                    <Row>
                        <Col className={"col-md-3"}>
                            <Card bg={"dark"} className={"text-light"}>
                                <Card.Header><h4>{prod.name}</h4></Card.Header>
                                {/* TODO: Show the last report date for this product (?)*/}
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
                        </Col>
                        <Col className={"col-md-9"}>
                            <DynMap reports={reports}/>
                        </Col>
                    </Row>
                </Container>
                {this.state.reports.length > 0 ? (
                    <Container className={"col-md-12 my-5"} fluid>
                        <h3>Reports for this product</h3>
                        <DetailGroupReport reports={this.state.reports}/>
                    </Container>
                ) : <h3 className={"my-5 mx-5"}>There no reports for this product</h3>}


            </div>
        )

    }
}

export default MainProduct;