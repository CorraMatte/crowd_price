import React from "react";
import axios from "axios";
import {PRODUCTS_CATEGORY_API, REPORTS_PRODUCT_API} from "../urls/endpoints";
import {DetailGroupProduct} from "../components/product/DetailGroupProduct";
import {isLoggedIn} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";
import {Container} from "react-bootstrap";
import {DetailGroupReport} from "../components/report/DetailGroupReport";


class MainCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            products_reports: {}
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get(`${PRODUCTS_CATEGORY_API}/${id}`).then(
            res => {
                res.data.results.forEach((prod) => {
                    axios.get(`${REPORTS_PRODUCT_API}/${prod.id}`).then(
                        report_res => {
                            let prods_dict = this.state.products_reports;
                            let prods = this.state.products;
                            prods_dict[prod.name] = report_res.data.results.features;
                            prod.count = report_res.data.results.features.length;
                            prods.push(prod);
                            this.setState({
                                products: prods,
                                products_reports: prods_dict
                            })
                        }
                    )
                })
            });
    }

    render() {
        const products_dict = this.state.products_reports;
        const products = this.state.products;
        if (!products_dict) {
            return (<div></div>)
        }

        let prods_views = []
        for (const [prod_name, reports] of Object.entries(products_dict)) {
            if (reports.length > 0) {
                prods_views.push(
                    <Container fluid>
                        <h3>Reports for {prod_name}</h3>
                        <DetailGroupReport reports={reports}/>
                    </Container>
                )
            }
        }

        return (
            <div>
                {isLoggedIn() ? <HeaderLogged/> : <HeaderUnLogged/>}
                <Container className={"my-md-3"} fluid>
                    <h3>Products in this category</h3>
                    <DetailGroupProduct products={products}/>
                </Container>
                {prods_views}
            </div>
        )
    }
}


export default MainCategory;