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
        if (this.props.label === 'price' && this.props.data) {
            this.props.data.forEach((data) => {
                    data.value = parseFloat(data.value).toFixed(2);
                }
            )
        }

        return (
            <ResponsiveContainer width={"100%"} height={500}>
                <BarChart data={this.props.data} >
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis
                        tickFormatter={this.formatYAxisForPrice}
                    />
                    <XAxis dataKey="name">
                    </XAxis>
                    <Tooltip
                        formatter={this.getFormatterForPrice}
                    />
                    <Legend />
                    <Bar name={this.props.label} dataKey="value" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        )
    }
}

export default BarChartItem