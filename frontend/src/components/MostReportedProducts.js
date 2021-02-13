import React from "react";
import axios from "axios";
import {MOST_REPORTED_PRODUCTS_API} from "../urls/endpoints";

class MostReportedProducts extends React.Component {
    constructor(props) {
        super(props);
        axios.get(MOST_REPORTED_PRODUCTS_API).then(
            res => { this.setState({
                products: res.data.results,
            })
        });
    }

    render () {
        return (
            <h1>The most rated products</h1>
        )
    }
}

export default MostReportedProducts;