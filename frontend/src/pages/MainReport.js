import React from "react";
import axios from "axios";
import {REPORT_API} from "../urls/endpoints";
import {isLoggedIn} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";
import {StaticMap} from "../components/map/StaticMap";
import {Card, Col, Container, Row} from "react-bootstrap";
import {PRODUCT_URL, STORE_URL} from "../urls/navigation";
import {get_day_month_year_from_date} from "../components/utils/utils";


class MainReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: null
        }
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get(`${REPORT_API}/${id}`).then(
            res => {
                this.setState({
                    report: res.data
                })
            });
    }

    render() {
        if (!this.state.report) {
            return (<Container></Container>)
        }

        const coords = this.state.report.geometry.coordinates.slice();
        const props = this.state.report.properties;
        const product = props.product;
        const consumer = props.consumer;
        const store = !props.store ? "Not located in a store" :
            <a href={`${STORE_URL}/${props.store.id}`} className={"text-light"}>Located in: {props.store.name}</a>

        return (
            <div>
                {isLoggedIn() ? <HeaderLogged/> : <HeaderUnLogged/>}
                <Container className={"float-left my-md-3"} fluid>
                    <Row>
                        <Col className={"col-md-4 ml-md-1"}>
                            <Card bg={"dark"} className={"text-light ml-md-1"}>
                                <Card.Img variant={"top"} src={props.picture}/>
                                <Card.Header><h4><a className={"text-light"}
                                                href={`${PRODUCT_URL}/${product.id}`}>{product.name}</a></h4></Card.Header>
                                <Card.Body>
                                    price: {props.price}€ <br/>
                                    by {consumer.profile.user.email} <br/>
                                </Card.Body>
                                <Card.Body>
                                    {store}
                                </Card.Body>
                                <Card.Footer>
                                    <small>Reported on the {get_day_month_year_from_date(props.created_time)}</small>
                                </Card.Footer>
                            </Card>
                        </Col>
                        <Col className={"col-md-1"}></Col>
                        <Col className={"col-md-6"}>
                            <h3>Location of the report on the map</h3>
                            <StaticMap latitude={coords[1]} longitude={coords[0]} label={"Was reported here"}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default MainReport;