import React from "react";
import axios from "axios";
import {PRODUCTS_CATEGORY_API} from "../urls/endpoints";
import {DetailProductItem} from "../components/product/DetailGroupProduct";


class MainCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get(`${PRODUCTS_CATEGORY_API}/${id}`).then(
            res => { this.setState({
                products: res.data.results
            })
        });
    }

    render () {
        const products = this.state.products;
        if (products.length === 0) {
            return (<div></div>)
        }

        return (
            <div>
                <h1>There are {products.length} reports</h1>
                {products.map((product) => <DetailProductItem product={product} key={product.id}/>)}
            </div>
        )
    }
}


export default MainCategory;