import React from "react";
import axios from "axios";
import {REPORT_URL} from "../../urls/navigation";


class DetailReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            report: []
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        axios.get(`${REPORT_URL}/${id}`).then(
            res => { this.setState({
                report: res.data.results
            })
        });
    }

    render () {
        return (
            <div>
            </div>
        )
    }
}

export default DetailReport