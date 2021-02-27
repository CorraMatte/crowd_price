import React from "react";
import axios from "axios";
import {STORE_API, REPORTS_STORE_API} from "../urls/endpoints";
import {DetailReportItem} from "../components/report/DetailGroupReport"
import {DetailStoreItem} from "./Stores";
import {isLoggedIn} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";
import {StaticMap} from "../components/map/StaticMap";


class MainStore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            store: null,
            reports: []
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;

        axios.get(`${STORE_API}/${id}`).then(
            res => {
                this.setState({
                store: res.data
            })
        });

        axios.get(`${REPORTS_STORE_API}/${id}`).then(
            res => { this.setState({
                reports: res.data.results.features
            })
        });
    }

    render () {
        const store = this.state.store;
        const reports = this.state.reports;
        let coords = [0, 0];

        if (this.state.store) {
            coords = this.state.store.geometry.coordinates.slice();
        }

        return (
            <div>
                {isLoggedIn() ? <HeaderLogged /> : <HeaderUnLogged />}
                <DetailStoreItem store={store} />
                <StaticMap latitude={coords[1]} longitude={coords[0]} label={"Location :"} />
                {reports.map((report) => <DetailReportItem report={report} key={report.id}/>)}
            </div>
        )

    }
}

export default MainStore;