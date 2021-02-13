import React from "react";
import {PRODUCT_URL, REPORT_URL} from "../../urls/navigation";
import {DetailProductItem} from "../product/DetailGroupProduct";


class DetailReportItem extends React.Component {
    render() {
        const props = this.props.report.properties;
        const product = props.product;
        const consumer = props.consumer;
        const store = props.store ? "store" : "" ;


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
            </div>
        )
    }
}

class DetailGroupReport extends React.Component {
    render() {
        const res = this.props.reports;
        if (res) {
            return (
                <div>
                    There are: {res.length} items
                    {res.map((report) => <DetailReportItem report={report} key={report.id}/>)}
                </div>
            )
        } else {
            return (<div></div>)
        }
    }
}
export {DetailGroupReport, DetailReportItem};
