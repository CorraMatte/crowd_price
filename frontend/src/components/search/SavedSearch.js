import React from "react";
import axios from "axios";
import {SEARCH_LATEST_API} from "../../urls/endpoints";
import {getAuthHeader} from "../../auth";

class SavedSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searches: []
        }
    }

    componentDidMount() {
        axios.get(SEARCH_LATEST_API, getAuthHeader()).then(
            res => { this.setState({
                searches: res.data.results,
            })
        });
    }

    render () {
        return (
            <h1>Your saved search results</h1>
        )
    }
}

export default SavedSearch;