import React from "react";
import axios from "axios";
import {SEARCH_STARRED_API} from "../../endpoints";

class RecentSearch extends React.Component {
    constructor(props) {
        super(props);
        axios.get(SEARCH_STARRED_API).then(
            res => { this.setState({
                searches: res.data.results,
            })
        });
    }

    render () {
        return <div></div>
    }
}

export default RecentSearch;