import React from "react";
import axios from "axios";
import {DetailProductItem} from "../components/product/DetailGroupProduct"
import {DetailReportItem} from "../components/report/DetailGroupReport";
import {PRODUCT_API, REPORTS_PRODUCT_API} from "../urls/endpoints";
import {isLoggedIn} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";
import DynMap from "../components/Map/DynMap";

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
                    product: res.data,
                    reports: this.state.reports
                })
            });

        axios.get(`${REPORTS_PRODUCT_API}/${id}`).then(
            res => {
                this.setState({
                    product: this.state.product,
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
                {isLoggedIn() ? <HeaderLogged /> : <HeaderUnLogged />}
                <DetailProductItem product={prod} key={prod.id}/>
                {reports.map((report) => <DetailReportItem report={report} key={report.id}/>)}
                <DynMap reports={reports} />
            </div>
        )

    }
}

export default MainProduct;