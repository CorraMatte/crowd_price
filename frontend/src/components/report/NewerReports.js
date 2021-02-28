import React from "react";
import axios from "axios";
import {DetailGroupReport} from "./DetailGroupReport";
import {REPORTS_NEWER_API} from "../../urls/endpoints";
import {Container} from "react-bootstrap";

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
            <Container className={"col-md-12 my-5"} fluid>
                <h3>New reports in the Crowd Price</h3>
                <DetailGroupReport reports={this.state.reports} />
            </Container>
        )
    }
}

export default NewerReports;