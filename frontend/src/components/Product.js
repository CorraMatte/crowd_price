import React from "react";
import axios from "axios";
import {PRODUCT_API} from "../endpoints";

class Product extends React.Component {
    constructor(props) {
        super(props);
        let pk = props.pk;
        axios.get(`${PRODUCT_API}/${pk}`).then(
            res => { this.setState({
                product: res.data.results
            })
        });
    }

    render () {
        return <div></div>
    }
}

export default Product;