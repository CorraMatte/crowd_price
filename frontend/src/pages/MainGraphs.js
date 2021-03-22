import React from "react";
import HeaderLogged from "../components/utils/HeaderLogged";
import {
    ANALYST_API,
    GRAPH_REPORT_CATEGORY_TOP_API,
    GRAPH_REPORT_PRODUCT_TOP_API,
    GRAPH_REPORT_PRODUCT_TOP_PRICE_AVG_API,
    GRAPH_REPORT_STORE_TOP_API,
    GRAPH_REPORT_USER_MOST_ACTIVE_API,
    GRAPH_SEARCH_CATEGORY_TOP_API,
    GRAPH_SEARCH_PRODUCT_TOP_API
} from "../urls/endpoints";
import axios from "axios";
import {getAuthHeader} from "../auth";
import BarChartItem from "../components/graph/BarChartItem";
import {
    GRAPH_REPORT_CATEGORY_TOP_TITLE,
    GRAPH_REPORT_PRODUCT_TOP_PRICE_AVG_TITLE,
    GRAPH_REPORT_PRODUCT_TOP_TITLE,
    GRAPH_REPORT_STORE_TOP_TITLE,
    GRAPH_REPORT_USER_MOST_ACTIVE_TITLE,
    GRAPH_SEARCH_CATEGORY_TOP_TITLE,
    GRAPH_SEARCH_PRODUCT_TOP_TITLE
} from "../components/utils/const";
import {Card, Container} from "react-bootstrap";
import {Redirect} from "react-router-dom";


export class MainGraphs extends React.Component {
    constructor(props) {
        super(props);
        let graphs = {
            graphs: {
                most_active_user: {
                    url: GRAPH_REPORT_USER_MOST_ACTIVE_API,
                    title: GRAPH_REPORT_USER_MOST_ACTIVE_TITLE,
                    label: 'reports',
                    type: 'barchart'
                },
                most_rated_products: {
                    url: GRAPH_REPORT_PRODUCT_TOP_API,
                    title: GRAPH_REPORT_PRODUCT_TOP_TITLE,
                    label: 'reports',
                    type: 'barchart'
                },
                most_rated_categories: {
                    url: GRAPH_REPORT_CATEGORY_TOP_API,
                    title: GRAPH_REPORT_CATEGORY_TOP_TITLE,
                    label: 'reports',
                    type: 'barchart'
                },
                most_rated_stores: {
                    url: GRAPH_REPORT_STORE_TOP_API,
                    title: GRAPH_REPORT_STORE_TOP_TITLE,
                    label: 'reports',
                    type: 'barchart'
                },
                most_searched_categories: {
                    url: GRAPH_SEARCH_CATEGORY_TOP_API,
                    title: GRAPH_SEARCH_CATEGORY_TOP_TITLE,
                    label: 'searches',
                    type: 'barchart'
                },
                most_searched_products: {
                    url: GRAPH_SEARCH_PRODUCT_TOP_API,
                    title: GRAPH_SEARCH_PRODUCT_TOP_TITLE,
                    label: 'searches',
                    type: 'barchart'
                },
                most_report_products_avg_price: {
                    url: GRAPH_REPORT_PRODUCT_TOP_PRICE_AVG_API,
                    title: GRAPH_REPORT_PRODUCT_TOP_PRICE_AVG_TITLE,
                    label: 'price',
                    type: 'barchart'
                }
            }
        }

        for (const value of Object.values(graphs.graphs)) {
            value.height = 750;
        }

        this.state = {...graphs, ...{isAnalyst: true}};
    }

    componentDidMount() {
        axios.get(ANALYST_API, getAuthHeader()).then(
            res => {
                const isAnalyst = !(Object.keys(res.data).length === 0 && res.data.constructor === Object)

                this.setState({
                    isAnalyst: isAnalyst
                });

                if (isAnalyst) {
                    for (const [field, value] of Object.entries(this.state.graphs)) {
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
            }
        );
    }

    render() {
        let graphs = [];

        if (!this.state.isAnalyst) {
            return <Redirect to="/"/>
        }

        for (const [field, value] of Object.entries(this.state.graphs)) {
            let graph;
            if (value.type === 'barchart') {
                graph = <BarChartItem key={field} data={value.data} label={value.label}/>
            }

            graphs.push(
                <Card bg={"light"} className={"my-md-3"} key={field}>
                    <Card.Header>{value.title}</Card.Header>
                    {graph}
                </Card>
            )
        }

        return (
            <Container fluid>
                <HeaderLogged/>
                {graphs}
            </Container>
        )
    }
}

export default MainGraphs;