import React from "react";
import axios from "axios";
import {REPORTS_SEARCH_API, SEARCH_LATEST_API} from "../../urls/endpoints";
import {getAuthHeader} from "../../auth";
import {Card, Container} from "react-bootstrap";
import {DetailGroupReport} from "../report/DetailGroupReport";

class RecentSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searches: []
        }
    }

    componentDidMount() {
        axios.get(SEARCH_LATEST_API, getAuthHeader()).then(
            res => {
                if (res.data.results.features.length === 0) {
                    this.setState({
                        reports: []
                    });
                } else {
                    const search_id = res.data.results.features[0].id;
                    axios.get(`${REPORTS_SEARCH_API}/${search_id}`, getAuthHeader()).then(
                        res => {
                            this.setState({
                                reports: res.data.features
                            });
                        }
                    )

                }
            });
    }

    render() {
        return (
            <div>
                {
                    this.state.reports ?
                        <Container className={"my-5"} fluid>
                            <Card>
                                <Card.Header>
                                    <h3>Reports in the last your search</h3>
                                </Card.Header>
                                <Card.Body>
                                    <DetailGroupReport reports={this.state.reports}/>
                                </Card.Body>
                            </Card>
                        </Container>
                        :
                        <Card>
                            <Card.Header>
                                <h3>No reports in the latest search</h3>
                            </Card.Header>
                        </Card>

                }
            </div>
        )
    }
}

export default RecentSearch;