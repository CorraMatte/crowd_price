import React from "react";
import {PRODUCT_URL, REPORT_URL, STORE_URL} from "../../urls/navigation";
import {Card, Row} from "react-bootstrap";
import {get_day_month_year_from_date} from "../utils/utils";
import {file_url} from "../../urls/endpoints";


class DetailReportItem extends React.Component {
    render() {
        if (!this.props.report)  {
            return (<Card></Card>);
        }

        const props = this.props.report.properties;
        const product = props.product;
        const consumer = props.consumer;
        const store = !props.store ? "Not located in a store" :
            <a href={`${STORE_URL}/${props.store.id}`} className={"text-light"}>Reported in the store <b>"{props.store.name}"</b></a>
        const url_picture = props.picture.slice(0, 7) === 'http://' ? props.picture : file_url(props.picture);

        return (
            <Card bg={"dark"} className={"text-light ml-md-2 mb-md-2 " + this.props.col_size}>
                <Card.Img variant={"top"} src={url_picture} />
                <Card.Header><h4><a className={"text-light"} href={`${PRODUCT_URL}/${product.id}`}>{product.name}</a></h4></Card.Header>
                <Card.Body>
                    price: {props.price}€ <br />
                    by {consumer.profile.user.email} <br />
                    on the {get_day_month_year_from_date(props.created_time)}
                </Card.Body>
                {
                    props.distance ?
                        <Card.Body>
                            {`The report is located at ${props.distance}km from your location`}
                        </Card.Body>
                         : <div></div>
                }
                <Card.Body>
                    {store}
                </Card.Body>
                <Card.Footer>
                    <a href={`${REPORT_URL}/${this.props.report.id}`} className={"text-light"}>more details..</a>
                </Card.Footer>
            </Card>
        )
    }
}

class DetailGroupReport extends React.Component {
    render() {

        if (!this.props.reports.results) {
            return (<div></div>);
        }

        const res = this.props.reports.results.features;

        return (
            <div>
                <Row className={"ml-md-2"}>
                    {res.map((report) => (<DetailReportItem report={report} key={report.id} col_size={"col-md-3"}/>))}
                </Row>
            </div>
        )
    }
}

export {DetailGroupReport, DetailReportItem};
