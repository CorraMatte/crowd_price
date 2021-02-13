import React from "react";
import {PRODUCT_URL} from "../../urls/navigation";


class DetailProductItem extends React.Component {
    render() {
        const props = this.props.product;

        return (
            <div>
                <img src={props.picture} alt="immagine"/>
                prod: <a href={`${PRODUCT_URL}/${props.id}`}>{props.name}</a>
                <br/>
                Has {props.count} review
                <br/>
            </div>
        )
    }
}

class DetailGroupProduct extends React.Component {
    render() {
        const res = this.props.products;
        if (res) {
            return (
                <div>
                    There are: {res.length} items
                    {res.map((product) => <DetailProductItem product={product} key={product.id}/>)}
                </div>
            )
        } else {
            return (<div></div>)
        }
    }
}
export {DetailProductItem, DetailGroupProduct};
