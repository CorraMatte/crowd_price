import React from "react";
import {PRODUCT_URL} from "../../urls/navigation";
import CategoryItem from "./CategoryItem";


class DetailProductItem extends React.Component {
    render() {
        const props = this.props.product;
        return (
            <div>
                <img src={props.picture} alt="immagine"/>
                prod: <a href={`${PRODUCT_URL}/${props.id}`}>{props.name}</a>
                <br/>
                {props.count ? `Has ${props.count} review` : ""}
                {props.categories.map((cat) => <CategoryItem name={cat.name} key={cat.id} id={cat.id}/>)}
                <br/>
            </div>
        )
    }
}

class DetailGroupProduct extends React.Component {
    render() {
        const res = this.props.products;
        return (
            <div>
                There are: {res.length} items
                {res.map((product) => <DetailProductItem product={product} key={product.id}/>)}
            </div>
        )
    }
}
export {DetailProductItem, DetailGroupProduct};
