import React, {Component} from "react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import moment from 'moment'



export class LineChartItem extends Component {


    render () {
        let prices = [];

        this.props.prices.forEach((rep) => {
            let date = new Date(moment(rep.date, "hh:mm:ss DD/MM/YYYY"));

            if (isNaN(date)) {
                date = new Date(rep.date);
            }

            prices.push({date: date.getTime(), price: parseFloat(rep.price)})
        })

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
                    <YAxis
                        type="number" domain={[0, this.props.max ? Math.ceil(this.props.max + (this.props.max * 5 / 100)) : 'auto']}
                    />
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
