import React from "react";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";


export class BarChartItem extends React.Component {
    getFormatterForPrice = (value, name, props) => {
        if (this.props.label === 'price')
            return [value + "€", name, props];
        else
            return [value, name, props];
    }

    formatYAxisForPrice = (tickItem) => {
        if (this.props.label === 'price')
            return tickItem + "€";
        else
            return tickItem;
    }

    render() {
        let graph_data = []

        if (this.props.label === 'price' && this.props.data) {
            this.props.data.forEach((data) => {
                    graph_data.push({
                        value: parseFloat(parseFloat(data.value).toFixed(2)),
                        name: data.name
                    });
                }
            )
        }

        return (
            <ResponsiveContainer width={"100%"} height={500}>
                <BarChart data={graph_data}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <YAxis
                        tickFormatter={this.formatYAxisForPrice}
                        type="number" domain={[0, this.props.max ? Math.ceil(this.props.max + (this.props.max * 5 / 100)) : 'auto']}
                    />
                    <XAxis dataKey="name">
                    </XAxis>
                    <Tooltip
                        formatter={this.getFormatterForPrice}
                    />
                    <Legend/>
                    <Bar name={this.props.label} dataKey="value" fill="#8884d8"/>
                </BarChart>
            </ResponsiveContainer>
        )
    }
}

export default BarChartItem