import React from "react";
import HeaderLogged from "../components/utils/HeaderLogged";
import {
    GRAPH_REPORT_CATEGORY_TOP_API,
    GRAPH_REPORT_PRODUCT_TOP_API,
    GRAPH_REPORT_PRODUCT_TOP_PRICE_AVG_API,
    // GRAPH_REPORT_PRODUCT_TOP_PRICE_TREND_API,
    GRAPH_REPORT_STORE_TOP_API,
    GRAPH_REPORT_USER_MOST_ACTIVE_API, GRAPH_SEARCH_CATEGORY_TOP_API, GRAPH_SEARCH_PRODUCT_TOP_API
} from "../urls/endpoints";
import axios from "axios";
import {getAuthHeader} from "../auth";
import BarChartItem from "../components/graph/BarChartItem";
import {
    GRAPH_REPORT_CATEGORY_TOP_TITLE, GRAPH_REPORT_PRODUCT_TOP_PRICE_AVG_TITLE,
    GRAPH_REPORT_PRODUCT_TOP_TITLE, GRAPH_REPORT_STORE_TOP_TITLE,
    GRAPH_REPORT_USER_MOST_ACTIVE_TITLE, GRAPH_SEARCH_CATEGORY_TOP_TITLE, GRAPH_SEARCH_PRODUCT_TOP_TITLE
} from "../components/utils/const";
import {Card, Container} from "react-bootstrap";


export class MainGraphs extends React.Component {
    constructor(props) {
        super(props);
        let graphs = {
            most_active_user: {url: GRAPH_REPORT_USER_MOST_ACTIVE_API, title: GRAPH_REPORT_USER_MOST_ACTIVE_TITLE},
            most_rated_products: {url: GRAPH_REPORT_PRODUCT_TOP_API, title: GRAPH_REPORT_PRODUCT_TOP_TITLE},
            most_rated_categories: {url: GRAPH_REPORT_CATEGORY_TOP_API, title: GRAPH_REPORT_CATEGORY_TOP_TITLE},
            most_rated_stores: {url: GRAPH_REPORT_STORE_TOP_API, title: GRAPH_REPORT_STORE_TOP_TITLE},
            most_searched_categories: {url: GRAPH_SEARCH_CATEGORY_TOP_API, title: GRAPH_SEARCH_CATEGORY_TOP_TITLE},
            most_searched_products: {url: GRAPH_SEARCH_PRODUCT_TOP_API, title: GRAPH_SEARCH_PRODUCT_TOP_TITLE},
            most_report_products_avg_price: {url: GRAPH_REPORT_PRODUCT_TOP_PRICE_AVG_API, title: GRAPH_REPORT_PRODUCT_TOP_PRICE_AVG_TITLE},
            // most_report_products_price_trend: {url: GRAPH_REPORT_PRODUCT_TOP_PRICE_TREND_API, },
        }

        for (const value of Object.values(graphs)) {
            value.width = 500;
            value.width = 750;
        }

        this.state = graphs;
    }

    componentDidMount() {
        for (const [field, value] of Object.entries(this.state)) {
            axios.get(value.url, getAuthHeader()).then(
                res => {
                    value.data = res.data.results;
                    this.setState({
                        [field]: value
                    })
                }
            );
        }
    }

    render() {
        let graphs = [];

        for (const [field, value] of Object.entries(this.state)) {
            graphs.push(
                <Card bg={"light"} className={"my-md-3"}>
                    <Card.Header>{value.title}</Card.Header>
                    <BarChartItem key={field} data={value.data} />
                </Card>
                )
        }

        return (
            <Container fluid>
                <HeaderLogged />
                {graphs}
            </Container>
        )
    }
}

export default MainGraphs;