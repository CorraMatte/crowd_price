import React from "react";
import axios from "axios";
import {SEARCH_STARRED_API} from "../../urls/endpoints";
import {getAuthHeader} from "../../auth";

class RecentSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searches: []
        }
    }

    componentDidMount() {
        axios.get(SEARCH_STARRED_API, getAuthHeader()).then(
            res => { this.setState({
                searches: res.data.results,
            })
        });
    }

    render () {
        return (
            <h1>Your recent search results</h1>
        )
    }
}

export default RecentSearch;