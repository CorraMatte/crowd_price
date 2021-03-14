import React from "react";
import axios from "axios";
import {REPORTS_SEARCH_API, SEARCH_STARRED_API} from "../../urls/endpoints";
import {getAuthHeader} from "../../auth";
import {Card, Container} from "react-bootstrap";
import {DetailGroupReport} from "../report/DetailGroupReport";

class SavedSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saved_searcher_results: {}
        }
    }

    componentDidMount() {
        axios.get(SEARCH_STARRED_API, getAuthHeader()).then(
            res => {
                res.data.results.features.forEach((search) => {
                    axios.get(`${REPORTS_SEARCH_API}/${search.id}`).then(
                        reports => {
                            let saved_searches = this.state.saved_searcher_results;
                            saved_searches[search.id] = reports.data;
                            this.setState({
                                saved_searcher_results: saved_searches
                            })
                        }
                    )
                });
            });
    }

    render() {
        let results = [];
        for (const [key, value] of Object.entries(this.state.saved_searcher_results)) {
            results.push(
                <DetailGroupReport reports={value} key={key}/>
            )
        }

        return (
            <div>
                {
                    this.state.saved_searcher_results ?
                        <Container className={"my-5"} fluid>
                            <Card>
                                <Card.Header>
                                    <h3>Reports in your saved searches</h3>
                                </Card.Header>
                                <Card.Body>
                                    {results}
                                </Card.Body>
                            </Card>
                        </Container>
                        :
                        <Card>
                            <Card.Header>
                                <h3 className={'container-fluid'}>No saved search for this user</h3>
                            </Card.Header>
                        </Card>
                }
            </div>
        )
    }
}

export default SavedSearch;