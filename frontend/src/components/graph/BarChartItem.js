import React from "react";
import {Bar, Label, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from "recharts";


export class BarChartItem extends React.Component {

    render() {
        return (
            <div>
                <BarChart width={500} height={500} data={this.props.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name">
                        <Label value={this.props.title} position={"bottom"} />
                    </XAxis>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </div>
        )
    }
}

export default BarChartItem