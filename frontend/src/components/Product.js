import React from "react";
import axios from "axios";
import {PRODUCT_API} from "../endpoints";

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: []
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        axios.get(`${PRODUCT_API}/${id}`).then(
            res => { this.setState({
                product: res.data.results
            })
        });
    }

    render () {
        return (
            <div>
            </div>
        )
    }
}

export default Product;