import React from "react";
import axios from "axios";
import {REPORTS_NEAREST_API} from "../../endpoints";
import MostReportedProducts from "../MostReportedProducts";

class NearestReports extends React.Component {
    constructor(props) {
        super(props);
        axios.get(REPORTS_NEAREST_API).then(res => {
            this.setState({
                reports: res.data.results,
            })
        });
    }

    render () {
        return <div></div>
    }
}

export default NearestReports;
