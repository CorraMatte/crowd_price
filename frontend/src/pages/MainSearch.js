import React from "react";
import axios from "axios";
import {
    CATEGORIES_API,
    DUMP_FORMAT_OPTIONS_API, REPORTS_DUMP_API,
    REPORTS_SEARCH_API,
    SEARCH_ADD_FAVORITE_API,
    SEARCH_SORT_OPTIONS_API
} from "../urls/endpoints";
import {Alert, Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import {ACCESS_TOKEN, ANALYST_LABEL, MAX_DISTANCE, MAX_PRICE, MIN_PRICE} from "../components/utils/const"
import {DetailReportItem} from "../components/report/DetailGroupReport";
import {getAuthHeader, getUserType, isLoggedIn} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";
import DynMap from "../components/map/DynMap";
import {saveAs} from 'file-saver'
import {getCoordinatesByIP, getIP} from "../components/utils/utils";
import {RangeSlider, Slider} from 'reactrangeslider';
import "react-datepicker/dist/react-datepicker.css";
import ReactMapGL, {Marker} from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import {FaSearchLocation} from 'react-icons/fa';
import {LineChartItem} from "../components/graph/LineChartItem";


class MainSearch extends React.Component {
    constructor(props) {
        super(props);
        let past_date = new Date()
        past_date.setDate(past_date.getDate() - 30)

        this.state = {
            price_min: MIN_PRICE,
            price_max: MAX_PRICE,
            product_query: '',
            categories: [],
            distance: 100,
            after_date: past_date,
            ordering_by: '-created_time',
            reports: [],
            pnt: 'POINT(0 0)',

            export_format: 'csv',
            prices: [],

            all_categories: [],
            sorting_options: [],
            dump_format_options: [],
            has_results: false,
            errors: '',

            is_valid_search: false,
            saved_search_result: '',

            latitude: 0,
            longitude: 0,
            zoom: 15
        }
    }

    MapChange = (e) => {
        this.setState({
            latitude: e.latitude,
            longitude: e.longitude,
            zoom: e.zoom
        })
    }

    componentDidMount() {
        axios.get(CATEGORIES_API).then(res => {
            this.setState({
                all_categories: res.data.results
            })
        });
        axios.get(SEARCH_SORT_OPTIONS_API).then(res => {
            this.setState({
                sorting_options: res.data.results
            });
        });
        if (getUserType() === ANALYST_LABEL) {
            axios.get(DUMP_FORMAT_OPTIONS_API, getAuthHeader()).then(res => {
                this.setState({
                    dump_format_options: res.data.results
                });
            });
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    pnt: `POINT(${position.coords.longitude} ${position.coords.latitude})`
                });
            },
            err => {
                getIP().then(
                    res => {
                        getCoordinatesByIP(res.data.ip).then(
                            res_coords => {
                                this.setState({
                                    latitude: res_coords.data.latitude,
                                    longitude: res_coords.data.longitude,
                                    pnt: `POINT(${res_coords.data.longitude} ${res_coords.data.latitude})`
                                })
                            }
                        )
                    }
                )
            }
        );
    }

    send_search = (e) => {
        e.preventDefault();
        const req = {
            price_min: this.state.price_min,
            price_max: this.state.price_max,
            categories: this.state.categories,
            product_query: this.state.product_query,
            distance: this.state.distance,
            after_date: this.state.after_date,
            ordering_by: this.state.ordering_by,
            pnt: this.state.pnt
        }

        const opt = isLoggedIn() ? getAuthHeader() : {};
        axios.post(REPORTS_SEARCH_API, req, opt).then(
            res => {
                let prices = []
                res.data.features.forEach((rep) => {
                    prices.push({date: rep.properties.created_time, price: rep.properties.price});
                });

                this.setState({
                    reports: res.data.features,
                    has_search: true,
                    errors: '',
                    is_valid_search: true,
                    prices: prices
                });

            }).catch(
            err => {
                this.setState({
                    errors: 'You have to insert at least the product name',
                    is_valid_search: false
                })
            }
        )
    }

    downloadDump = (e) => {
        e.preventDefault();
        const req = {"export_format": this.state.export_format}
        axios.post(REPORTS_DUMP_API, req, {
            headers: {Authorization: `Token ${isLoggedIn()}`},
            responseType: 'blob'
        }).then(response => {
            let [, filename] = response.headers['content-disposition'].split('filename=');
            filename = filename.replaceAll('"', '');
            saveAs(response.data, filename);
        })
    }

    addToFavorite = () => {
        axios.post(SEARCH_ADD_FAVORITE_API, {}, getAuthHeader()).then(
            res => {
                this.setState({
                    errors: '',
                    saved_search_result: 'Search has been saved',
                    is_valid_search: false
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
            after_date: date
        })
    }

    priceChangeHandler = (prices) => {
        this.setState({
            price_min: prices.start,
            price_max: prices.end
        })
    }

    distanceChangeHandler = (distance) => {
        this.setState({
            distance: distance
        })
    }

    onMarkerDragEnd = (event) => {
        this.setState({
            longitude: event.lngLat[0],
            latitude: event.lngLat[1],
            pnt: `POINT(${event.lngLat[0]} ${event.lngLat[1]})`
        });
    }

    render() {
        let result_header;
        let dump_menu = "";
        let graph_result_for_analyst = "";

        if (getUserType() === ANALYST_LABEL) {
            dump_menu = (
                <Form onSubmit={this.downloadDump}>
                    <Card.Body>
                        Select the format download
                        <Form.Control as="select" name="export_format" onChange={this.fieldChangeHandler}>
                            {this.state.dump_format_options.map((opt) => <option value={opt[0]}
                                                                                 key={opt[0]}>{opt[1]}</option>)}
                        </Form.Control>
                    </Card.Body>
                    <Card.Body>
                        <Button id={"submitDump"} color={"primary"} className={'btn-block'}
                                type="submit">Download</Button>
                    </Card.Body>
                </Form>
            )

            if (this.state.prices) {
                graph_result_for_analyst = (
                    <Container className={"float-left my-md-3"} fluid>
                        <Card bg={"light"} className={"my-md-3"}>
                            <Card.Header>
                                <h3>Prices based on report</h3>
                            </Card.Header>
                            <Card.Body>
                                <LineChartItem prices={this.state.prices}/>
                            </Card.Body>
                        </Card>
                    </Container>
                )
            }
        }

        if (!this.state.errors) {
            if (!this.state.has_search) {
                result_header = <span>press "search" to do a query</span>
            } else {
                result_header = <span>There are {this.state.reports.length} reports for that product</span>
            }
        } else {
            result_header = <Alert variant={"danger"}>{this.state.errors}</Alert>
        }

        const you_are_here_popup = {
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            label: "Your current location"
        }

        return (
            <div>
                {isLoggedIn() ? <HeaderLogged/> : <HeaderUnLogged/>}
                <Container className={"float-left my-md-3"} fluid>
                    <Row>
                        <Col className={"col-md-4 ml-md-1"}>
                            <Card bg={"dark"} className={'text-light'}>
                                <Card.Header>Search reports for the product</Card.Header>
                                <Form onSubmit={this.send_search}>
                                    <Card.Body>
                                        <Form.Control
                                            type="text"
                                            name="product_query"
                                            placeholder={"Type the product name"}
                                            id={"product_query"}
                                            defaultValue={this.state.product_query}
                                            onChange={this.fieldChangeHandler}
                                        />
                                    </Card.Body>

                                    <Card.Body>
                                        Price from {this.state.price_min}€ to {this.state.price_max}€
                                        <RangeSlider
                                            value={{start: this.state.price_min, end: this.state.price_max}}
                                            onChange={this.priceChangeHandler}
                                            min={MIN_PRICE}
                                            max={MAX_PRICE}
                                            step={100}
                                        />
                                    </Card.Body>

                                    <Card.Body>
                                        Distance up to {this.state.distance} km
                                        <Slider
                                            min={10}
                                            max={MAX_DISTANCE}
                                            step={10}
                                            value={this.state.distance}
                                            onChange={this.distanceChangeHandler}
                                        />
                                    </Card.Body>

                                    <Card.Body>
                                        Categories <br/>
                                        {this.state.all_categories.map(
                                            (cat) =>
                                                    <Form.Check
                                                        type='checkbox'
                                                        id={cat.id}
                                                        name={cat.name}
                                                        label={cat.name}
                                                        key={cat.id}
                                                        onChange={this.fieldChangeHandler}
                                                        className={'mx-md-2'}
                                                    />
                                        )}
                                    </Card.Body>

                                    <Card.Body>
                                        Published after <br/>
                                        <DatePicker selected={this.state.after_date} onChange={this.dateChangeHandler}/>
                                    </Card.Body>

                                    <Card.Body>
                                        Sort by
                                        <Form.Control as="select" onChange={this.fieldChangeHandler}
                                                      name={'ordering_by'}>
                                            {this.state.sorting_options.map((opt) =>
                                                <option value={opt[0]} key={opt[0]}>{opt[1]}</option>)
                                            }
                                        </Form.Control>
                                    </Card.Body>

                                    <Card.Footer>
                                        <Button id={"submit"} className={"btn-block btn-primary"}
                                                type="submit">Search</Button>
                                    </Card.Footer>

                                    <Card.Body>
                                        Edit your current location
                                        <ReactMapGL
                                            width="100%"
                                            height="50vh"
                                            zoom={this.state.zoom}
                                            latitude={this.state.latitude}
                                            longitude={this.state.longitude}
                                            mapStyle="mapbox://styles/mapbox/streets-v11"
                                            onViewportChange={this.MapChange}
                                            mapboxApiAccessToken={ACCESS_TOKEN}
                                        >
                                            <Marker
                                                longitude={this.state.longitude}
                                                latitude={this.state.latitude}
                                                draggable
                                                onDragEnd={this.onMarkerDragEnd}
                                            >
                                                <FaSearchLocation color={'#343a40'} size={30}/>
                                            </Marker>
                                        </ReactMapGL>
                                    </Card.Body>

                                    {isLoggedIn() ?
                                        <Card.Body>
                                            <br/>
                                            <br/>
                                            <Button
                                                className={'btn-block'}
                                                onClick={this.addToFavorite}
                                                disabled={!this.state.is_valid_search}
                                            >
                                                Add last search to favorite searches
                                            </Button>
                                        </Card.Body> :
                                        <div></div>
                                    }

                                    {
                                        this.state.saved_search_result ?
                                            <Card.Body>
                                                <Alert variant={"success"}>{this.state.saved_search_result}</Alert>
                                            </Card.Body> :
                                            <div></div>
                                    }

                                </Form>
                                {dump_menu}
                            </Card>

                        </Col>
                        <Col className={"col-md-7"}>
                            <h3>{result_header}</h3>
                            {this.state.reports.map((report) => (
                                <DetailReportItem report={report} col_size={"col-md-11"}/>
                            ))}
                        </Col>
                    </Row>
                </Container>

                {graph_result_for_analyst}

                {this.state.reports.length > 0 ?
                    <Container className={"float-left my-md-3"} fluid>
                        <Card>
                            <Card.Header>
                                <h3>{this.state.reports.length ? "Results in the map" : ""}</h3>
                            </Card.Header>
                            <Card.Body>
                                <DynMap reports={this.state.reports} popup={you_are_here_popup}/>
                            </Card.Body>
                        </Card>
                    </Container> :
                    <Container></Container>
                }

            </div>
        )
    }
}

export default MainSearch;