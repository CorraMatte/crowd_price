import React from "react";
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from "recharts";


export class GraphItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: ''
        }
    }


    componentDidMount() {
        /*        let data = {...this.props.data};

        if (!data.data) {
            return <div></div>
        }

        data.dataset = [];
        data.data.forEach(
            entry => {
                data.dataset.push({label: entry[0], value: entry[1]});
            }
        )
*/

    }

    render() {
        return (
            <div>
                <BarChart width={500} height={500} data={this.state.data.dataset}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </div>
        )
    }
}

export default GraphItem