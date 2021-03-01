import React from "react";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";


export class BarChartItem extends React.Component {

    render() {
        return (
            <ResponsiveContainer width={"60%"} height={500}>
                <BarChart data={this.props.data} >
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis />
                    <XAxis dataKey="name">
                    </XAxis>
                    <Tooltip />
                    <Legend />
                    <Bar name={"reports"} dataKey="value" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        )
    }
}

export default BarChartItem