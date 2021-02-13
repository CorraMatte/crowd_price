import React from "react";
import axios from "axios";
import {STORE_API, REPORTS_STORE_API} from "../../urls/endpoints";
import {DetailReportItem} from "../report/DetailGroupReport"
import {DetailStoreItem} from "./Stores";


class DetailStore extends React.Component {
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
            res => { this.setState({
                store: res.data,
                reports: this.state.reports
            })
        });

        axios.get(`${REPORTS_STORE_API}/${id}`).then(
            res => { this.setState({
                store: this.state.store,
                reports: res.data.results.features
            })
        });
    }

    render () {
        const store = this.state.store;
        const reports = this.state.reports;

        if (store) {
            return (
                <div>
                    <h1>There are {this.state.reports.length} reports</h1>
                    {<DetailStoreItem store={store} />}
                    {reports.map((report) => <DetailReportItem report={report} key={report.id}/>)}
                </div>
            )
        } else {
            return (<div></div>)
        }

    }
}

export default DetailStore;