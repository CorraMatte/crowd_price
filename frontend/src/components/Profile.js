import React from "react";
import axios from "axios";
import {CONSUMER_API} from "../urls/endpoints";

class Product extends React.Component {
    constructor(props) {
        super(props);
        const pk = props.pk;
        axios.get(`${CONSUMER_API}/${pk}`).then(
            res => { this.setState({
                consumer: res.data.results
            })
        });
    }

    render () {
        return <div></div>
    }
}

export default Product;