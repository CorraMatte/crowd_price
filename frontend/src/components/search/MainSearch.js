import React from "react";
import axios from "axios";
import {CATEGORIES_API, REPORTS_SEARCH_API} from "../../urls/endpoints";
import {Button, Form} from "react-bootstrap";
import DatePicker from "react-datepicker";
import {MAX_DISTANCE, MAX_PRICE, MIN_PRICE} from "../utils/const"
import {DetailGroupReport} from "../report/DetailGroupReport";


class MainSearch extends React.Component {
    constructor(props) {
        super(props);
        let past_date = new Date()
        past_date.setDate(past_date.getDate() - 30)

        this.state = {
            'price_min': 0.01,
            'price_max': 999999.99,
            'product_query': '',
            'categories': [],
            'is_starred': false,
            'distance': 100,
            'all_categories': [],
            'after_date': past_date,
            'profile': 1, // to change with current session
            'reports': [],

            'has_search': false,
            'errors': ''
        }
    }

    componentDidMount() {
        axios.get(CATEGORIES_API).then(res => {
            this.setState({
                'all_categories': res.data.results
            })
        })
    }

    send_search = (e) => {
        e.preventDefault();
        const req = {
            "price_min": this.state.price_min,
            "price_max": this.state.price_max,
            "categories": this.state.categories,
            "product_query": this.state.product_query,
            "distance": this.state.distance,
            "after_date": this.state.after_date,
            "is_starred": this.state.is_starred,

            "profile": this.state.profile
        }

        axios.post(REPORTS_SEARCH_API, req).then(
            res => {
                this.setState({
                    'reports': res.data.features,
                    'has_search': true,
                    'errors': ''
                })
            }).catch(
                err => {
                    let errors = []
                    for (const [field, error_message] of Object.entries(err.response.data)) {
                        errors.push(`Error in field "${field}": ${error_message}`)
                    }

                    this.setState({
                        'errors': errors
                    })
                }
        )
    }

    fieldChangeHandler = (e) => {
        const target = e.target;
        let name = target.name;
        let value = target.value;

        if (target.type === 'checkbox') {
            if (target.name !== 'is_starred') {
                let categories_checked = this.state.categories.slice();

                if (target.checked) {
                    categories_checked.push(target.id);
                } else {
                    const index = categories_checked.indexOf(target.id);
                    categories_checked.splice(index, 1);
                }

                value = categories_checked;
                name = 'categories';
            }
            else {
                value = target.checked;
            }
        }

        this.setState({[name]: value});
    }

    dateChangeHandler = (date) => {
        this.setState({
            'after_date': date
        })
    }

    render() {
        let result_header;

        if (!this.state.errors) {
            if (!this.state.has_search) {
                result_header = <span>press "search" to do a query</span>
            } else {
                result_header = <span>There are {this.state.reports.length} reports for that product</span>
            }
        } else {
            result_header = this.state.errors.map((err) => [<span>{err}</span>, <br />])
        }

        return (
            <div>
                <Form onSubmit={(event) => this.send_search(event)}>
                    <Form.Control
                        type="text"
                        name="product_query"
                        id={"product_query"}
                        defaultValue={"this.state.price_min"}
                        onChange={this.fieldChangeHandler}
                    />
                    <Form.Control
                        type="number"
                        name="price_min"
                        id="price_min"
                        min={this.state.price_min}
                        defaultValue={MIN_PRICE}
                        onChange={this.fieldChangeHandler}
                    />
                    <Form.Control
                        type="number"
                        name="price_max"
                        id={"price_max"}
                        defaultValue={this.state.price_max}
                        max={MAX_PRICE}
                        onChange={this.fieldChangeHandler}
                    />
                    <Form.Control
                        type="number"
                        name="distance"
                        id={"distance"}
                        max={this.state.distance}
                        defaultValue={MAX_DISTANCE}
                        onChange={this.fieldChangeHandler}
                    />
                    <Form.Control
                        type='checkbox'
                        id="is_starred"
                        label="is_starred"
                        onChange={this.fieldChangeHandler}
                    />
                    {this.state.all_categories.map(
                        (cat) => <Form.Check type='checkbox' id={cat.id} name={cat.name} label={cat.name} onChange={this.fieldChangeHandler}/>
                        )}
                    <DatePicker selected={this.state.after_date} onChange={this.dateChangeHandler} />
                    <Button id={"submit"} color={"primary"} type="submit">search</Button>
                </Form>

                <h1>{result_header}</h1>
                <DetailGroupReport reports={this.state.reports} />
            </div>
        )

    }
}

export default MainSearch;