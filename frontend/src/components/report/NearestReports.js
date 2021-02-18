import React from "react";
import axios from "axios";
import {REPORTS_NEAREST_API} from "../../urls/endpoints";
import {getAuthHeader} from "../../auth";
import {DetailGroupReport} from "./DetailGroupReport";

class NearestReports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: []
        }
    }

    componentDidMount() {
        axios.get(REPORTS_NEAREST_API, getAuthHeader()).then(res => {
            this.setState({
                reports: res.data.results.features,
            })
        });
    }

    render () {
        console.log(this.state.reports)
        return (
            <div>
                <h1>Near reports to you</h1>
                <DetailGroupReport reports={this.state.reports} />
            </div>
        )
    }
}

export default NearestReports;
