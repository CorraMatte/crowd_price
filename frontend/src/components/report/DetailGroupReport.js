import React from "react";
import {PRODUCT_URL, REPORT_URL} from "../../urls/navigation";


class DetailReportItem extends React.Component {
    render() {
        const props = this.props.report.properties;
        const product = props.product;
        const consumer = props.consumer;
        let store = props.store ? "store" : "" ;


        return (
            <div>
                <img src={product.picture} alt="immagine"/>
                <br/>
                prod: <a href={`${PRODUCT_URL}/${product.id}`}>{product.name}</a>
                <br/>
                price: {props.price} €
                <br/>
                reported by: {consumer.profile.user.email} with exp {consumer.experience ? consumer.experience : 0}
                <br/>
                {store}
                <a href={`${REPORT_URL}/${this.props.report.id}`}>vai al dettaglio</a>
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
export {DetailGroupReport};
