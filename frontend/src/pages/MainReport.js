import React from "react";
import axios from "axios";
import {REPORT_API} from "../urls/endpoints";
import {DetailReportItem} from "../components/report/DetailGroupReport";
import {isLoggedIn} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";
import {StaticMap} from "../components/Map/StaticMap";


class MainReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: null
        }
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get(`${REPORT_API}/${id}`).then(
            res => { this.setState({
                report: res.data
            })
        });
    }

    render () {
        const report = this.state.report;
        let coords = [0, 0];

        if (this.state.report) {
            coords = this.state.report.geometry.coordinates.slice();
        }
        
        return (
            <div>
            {isLoggedIn() ? <HeaderLogged /> : <HeaderUnLogged />}
            <DetailReportItem report={report} />
            <StaticMap latitude={coords[1]} longitude={coords[0]} label={"Location :"} />
            </div>
        )
    }
}

export default MainReport;