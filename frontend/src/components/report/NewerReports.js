import React from "react";
import axios from "axios";
import {REPORTS_NEWER_API} from "../../endpoints";

class NewerReports extends React.Component {
    constructor(props) {
        super(props);
        axios.get(REPORTS_NEWER_API).then(res => {
            this.setState({
                reports: res.data.results,
            })
        });
    }

    render () {
        return <div></div>
    }
}

export default NewerReports;