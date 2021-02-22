import React from "react";
import axios from "axios";
import {
    CATEGORIES_API,
    DUMP_FORMAT_OPTIONS_API, REPORTS_DUMP_API,
    REPORTS_SEARCH_API,
    SEARCH_ADD_FAVORITE_API,
    SEARCH_SORT_OPTIONS_API
} from "../urls/endpoints";
import {Button, Form} from "react-bootstrap";
import DatePicker from "react-datepicker";
import {ANALYST_LABEL, MAX_DISTANCE, MAX_PRICE, MIN_PRICE} from "../components/utils/const"
import {DetailGroupReport} from "../components/report/DetailGroupReport";
import {getAuthHeader, getUserType, isLoggedIn} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";
import DynMap from "../components/map/DynMap";
import { saveAs } from 'file-saver'


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
            'distance': 100,
            'after_date': past_date,
            'ordering_by': '-created_time',
            'reports': [],

            'export_format': 'csv',

            'all_categories': [],
            'sorting_options': [],
            'dump_format_options': [],
            'has_search': false,
            'errors': ''
        }
    }

    componentDidMount() {
        axios.get(CATEGORIES_API).then(res => {
            this.setState({
                'all_categories': res.data.results
            })
        });
        axios.get(SEARCH_SORT_OPTIONS_API).then(res => {
            this.setState({
                'sorting_options': res.data.results
            });
        });
        if (getUserType() === ANALYST_LABEL) {
            axios.get(DUMP_FORMAT_OPTIONS_API, getAuthHeader()).then(res => {
                this.setState({
                    'dump_format_options': res.data.results
                });
            });
        }
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
            'ordering_by': this.state.ordering_by
        }

        axios.post(REPORTS_SEARCH_API, req, getAuthHeader()).then(
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

    downloadDump = (e) => {
        console.log(this.state);
        e.preventDefault();
        const req = {"export_format": this.state.export_format}
        axios.post(REPORTS_DUMP_API, req, {
            headers: { Authorization: `Token ${isLoggedIn()}` },
            responseType: 'blob'
        }).then(response => {
            let [ , filename] = response.headers['content-disposition'].split('filename=');
            filename = filename.replaceAll('"', '');
            saveAs(response.data, filename);
        })
    }

    addToFavorite = () => {
        axios.post(SEARCH_ADD_FAVORITE_API, getAuthHeader()).then(
            res => {
                this.setState({
                    'errors': ''
                })
            }
        )
    }

    fieldChangeHandler = (e) => {
        const target = e.target;
        let name = target.name;
        let value = target.value;

        if (target.type === 'checkbox') {
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

        this.setState({[name]: value});
    }

    dateChangeHandler = (date) => {
        this.setState({
            'after_date': date
        })
    }

    render() {
        let result_header;
        let dump_menu = "";
        if (getUserType() === ANALYST_LABEL) {
            dump_menu = (
                <Form onSubmit={this.downloadDump}>
                    <Form.Control as="select" name="export_format" onChange={this.fieldChangeHandler}>
                        {this.state.dump_format_options.map((opt) => <option value={opt[0]}
                                                                             key={opt[0]}>{opt[1]}</option>)}
                    </Form.Control>
                    <Button id={"submitDump"} color={"primary"} type="submit">download</Button>
                </Form>

            )
        }

        if (!this.state.errors) {
            if (!this.state.has_search) {
                result_header = <span>press "search" to do a query</span>
            } else {
                result_header = <span>There are {this.state.reports.length} reports for that product</span>
            }
        } else {
            result_header = this.state.errors.map((err) => [<span>{err}</span>, <br/>])
        }

        return (
            <div>
                {isLoggedIn() ? <HeaderLogged/> : <HeaderUnLogged/>}
                <Form onSubmit={this.send_search}>
                    <Form.Control
                        type="text"
                        name="product_query"
                        id={"product_query"}
                        defaultValue={this.state.product_query}
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

                    {this.state.all_categories.map(
                        (cat) => <Form.Check type='checkbox' id={cat.id} name={cat.name} label={cat.name} key={cat.id}
                                             onChange={this.fieldChangeHandler}/>
                    )}

                    <DatePicker selected={this.state.after_date} onChange={this.dateChangeHandler}/>

                    <Form.Control as="select" onChange={this.fieldChangeHandler} name={'ordering_by'}>
                        {this.state.sorting_options.map((opt) => <option value={opt[0]} key={opt[0]}>{opt[1]}</option>)}
                    </Form.Control>

                    <Button id={"submit"} color={"primary"} type="submit">search</Button>

                </Form>
                <h1>{result_header}</h1>
                {isLoggedIn() ? <Button onClick={this.addToFavorite}>Add to favorite search</Button> : <div></div>}

                {dump_menu}

                <DetailGroupReport reports={this.state.reports}/>
                <DynMap reports={this.state.reports}/>

            </div>
        )

    }
}

export default MainSearch;