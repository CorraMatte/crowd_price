import React from "react";
import axios from "axios";
import {REPORT_API} from "../../urls/endpoints";
import {DetailReportItem} from "./DetailGroupReport";


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
            res => { this.setState({
                report: res.data
            })
        });
    }

    render () {
        const report = this.state.report;
        return (
            <DetailReportItem report={report} />
        )
    }
}

export default MainReport;