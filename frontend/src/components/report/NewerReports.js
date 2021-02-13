import React from "react";
import axios from "axios";
import {DetailGroupReport} from "./DetailGroupReport";
import {REPORTS_NEWER_API} from "../../endpoints";

class NewerReports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: []
        }
    }

    componentDidMount() {
        axios.get(REPORTS_NEWER_API).then(res => {
            this.setState({
                reports: res.data.results.features,
            });
        });
    }

    render () {
        return (
            <div>
                <h1>New reports in the Crowd Price</h1>
                <DetailGroupReport reports={this.state.reports} />
            </div>
        )
    }
}

export default NewerReports;