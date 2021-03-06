import React from "react";
import axios from "axios";
import {PRODUCTS_MOST_REPORTED_API} from "../../urls/endpoints";
import {DetailGroupProduct} from "./DetailGroupProduct";
import {Card, Container} from "react-bootstrap";

class MostReportedProducts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        }
    }

    componentDidMount() {
        axios.get(PRODUCTS_MOST_REPORTED_API).then(res => {
            this.setState({
                products: res.data,
            });
        });
    }

    render () {
        return (
            <Container className={"my-5"} fluid>
                <Card>
                    <Card.Header>
                        <h3>The most rated products</h3>
                    </Card.Header>
                    <Card.Body>
                        <DetailGroupProduct products={this.state.products} />
                    </Card.Body>
                </Card>
            </Container>
        )
    }
}

export default MostReportedProducts;