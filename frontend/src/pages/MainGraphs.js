import React from "react";
import HeaderLogged from "../components/utils/HeaderLogged";
import {populateGraphDataset} from "../components/utils/utils";


export class MainGraphs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'most_active_user': [],
            'most_rated_products': [],
            'most_rated_categories': [],
            'most_rated_stores': [],
            'most_searched_categories': [],
            'most_searched_products': [],
            'most_report_products_avg_price': [],
            'most_report_products_price_trend': []
        }
    }

    componentDidMount() {
        populateGraphDataset(this);
    }

    render() {
        console.log(this.state)
        return (
            <HeaderLogged />
        )
    }
}

export default MainGraphs;