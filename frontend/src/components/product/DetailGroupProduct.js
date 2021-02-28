import React from "react";
import {PRODUCT_URL} from "../../urls/navigation";
import CategoryItem from "./CategoryItem";
import {Card, Row} from "react-bootstrap";


class DetailProductItem extends React.Component {
    render() {
        const props = this.props.product;
        return (
            <Card bg={"dark"} className={"text-light col-md-3 ml-md-2 my-md-1"}>
                <Card.Header><a className={"text-light"} href={`${PRODUCT_URL}/${props.id}`}>{props.name}</a></Card.Header>
                <Card.Body>
                    {`Has ${props.count ? props.count : '0'} reviews`}
                </Card.Body>
                <Card.Body>
                    {props.categories.length > 0 ? props.categories.map((cat) => (
                        <CategoryItem name={cat.name} key={cat.id} id={cat.id}/>
                        )
                    ): <small>{"No category for this item"}</small>}
                </Card.Body>
                <br/>
            </Card>
        )
    }
}

class DetailGroupProduct extends React.Component {
    render() {
        const res = this.props.products;
        return (
            <div>
                <Row className={"ml-md-2"}>
                    {res.map((product) => <DetailProductItem product={product} key={product.id}/>)}
                </Row>
            </div>
        )
    }
}

export {DetailProductItem, DetailGroupProduct};
