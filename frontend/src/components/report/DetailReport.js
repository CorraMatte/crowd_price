import React from "react";
import axios from "axios";
import {REPORT_URL} from "../../urls/navigation";


class DetailReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: []
        }
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get(`${REPORT_URL}/${id}`).then(
            res => { this.setState({
                reports: res.data.results
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