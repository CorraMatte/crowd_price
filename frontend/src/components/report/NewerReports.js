import React from "react";
import axios from "axios";
import {DetailGroupReport} from "./DetailGroupReport";
import {REPORTS_NEWER_API} from "../../urls/endpoints";
import {Card, Container} from "react-bootstrap";

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
                reports: res.data,
            });
        });
    }

    render () {
        return (
            <Container className={"col-md-12 my-5"} fluid>
                <Card bg={"light"}>
                    <Card.Header>
                        <h3>New reports in the Crowd Price</h3>
                    </Card.Header>
                    <Card.Body>
                        <DetailGroupReport reports={this.state.reports} />
                    </Card.Body>
                </Card>
            </Container>
        )
    }
}

export default NewerReports;