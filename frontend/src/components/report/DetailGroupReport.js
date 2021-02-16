import React from "react";
import {REPORT_URL} from "../../urls/navigation";
import {DetailProductItem} from "../product/DetailGroupProduct";


class DetailReportItem extends React.Component {
    render() {
        if (!this.props.report)  {
            return (<div></div>);
        }

        const props = this.props.report.properties;
        const product = props.product;
        const consumer = props.consumer;
        const geo = this.props.report.geometry;
        const store = props.store ? "store" : "" ;
        let lon = null; let lat = null;

        if (geo) {
            lon = geo.coordinates[0];
            lat = geo.coordinates[1];
        }

        return (
            <div>
                <DetailProductItem product={product} key={product.id}/>
                price: {props.price} €
                <br/>
                reported by: {consumer.profile.user.email} with exp {consumer.experience ? consumer.experience : 0}
                <br/>
                {store}
                <a href={`${REPORT_URL}/${this.props.report.id}`}>vai al dettaglio</a>
                <br />
                <br />
                <br />
                <span>MAP WITH THE COORDINATES {lon} {lat}</span>
            </div>
        )
    }
}

class DetailGroupReport extends React.Component {
    render() {
        const res = this.props.reports;
        return (
            <div>
                There are: {res.length} items
                {res.map((report) => <DetailReportItem report={report} key={report.id}/>)}
            </div>
        )
    }
}
export {DetailGroupReport, DetailReportItem};
