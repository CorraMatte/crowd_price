import React from "react";
import axios from "axios";
import {MOST_REPORTED_PRODUCTS_API} from "../endpoints";

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
        return <div></div>
    }
}

export default MostReportedProducts;