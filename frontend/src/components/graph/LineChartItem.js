import React, {Component} from "react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";


export class LineChartItem extends Component {
    render () {
        return (
            <ResponsiveContainer width={"100%"} height={500}>
                <LineChart data={this.props.prices}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis hide={true} dataKey={'date'}/>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        )
    }
}

export default LineChartItem