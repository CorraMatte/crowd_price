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
                    <Tooltip dataKey={'product'} />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        )
    }
}

export class MultiLineChartItem extends Component {
    render () {
        let lines = [];
        let prods = new Set();
        this.props.prices.forEach((report) => {
            prods.add(Object.keys(report)[1])
        })

        prods.forEach((prod) =>
            lines.push(<Line type="monotone" dataKey={prod} stroke="#82ca9d" key={prod} />)
        )

        return (
            <ResponsiveContainer width={"100%"} height={500}>
                <LineChart data={this.props.prices}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis hide={true} dataKey={'date'}/>
                    <YAxis />
                    <Tooltip dataKey={'product'} />
                    <Legend />
                    {lines}
                    {/*<Line type="monotone" dataKey={"prod1"} stroke="#82ca9d" key={"prod1"} />
                    <Line type="monotone" dataKey={"prod"} stroke="#8884d8" key={"prod"} />*/}
                </LineChart>
            </ResponsiveContainer>
        )
    }
}
