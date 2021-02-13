import React from "react";
import axios from "axios";
import {MOST_REPORTED_PRODUCTS_API} from "../../urls/endpoints";
import {DetailGroupProduct} from "../product/DetailGroupReport";

class MostReportedProducts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        }
    }

    componentDidMount() {
        axios.get(MOST_REPORTED_PRODUCTS_API).then(res => {
            this.setState({
                products: res.data,
            });
        });
    }

    render () {
        return (
            <div>
                <h1>The most rated products</h1>
                <DetailGroupProduct products={this.state.products} />
            </div>
        )
    }
}

export default MostReportedProducts;