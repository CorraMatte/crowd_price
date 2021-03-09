import React, {Component} from "react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import moment from 'moment'



export class LineChartItem extends Component {


    render () {
        let prices = [];
        this.props.prices.forEach((rep) => {
            prices.push({date: new Date(moment(rep.date, "hh:mm:ss DD/MM/YYYY")).getTime(), price: rep.price})
        })

        console.log(this.props.prices)

        return (
            <ResponsiveContainer width={"100%"} height={500}>
                <LineChart data={prices}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey={'date'}
                        type="number"
                        domain = {['auto', 'auto']}
                        tickFormatter = {(unixTime) => moment(unixTime).format('DD/MM/YYYY')}
                    />
                    <YAxis />
                    <Tooltip
                        labelFormatter={(label) => (moment(label).format('DD/MM/YYYY hh:mm:ss'))}
                        formatter={(value, name, props) => ( [value + "€", name, ] )}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        )
    }
}
