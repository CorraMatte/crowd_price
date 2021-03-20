import React from "react";
import axios from "react-native-axios";
import {Alert, Text, TextInput, View} from "react-native";
import {SEARCH_BUTTON, SEARCH_MESSAGE_STR} from "../utils/strings";
import {Button} from "react-native-elements";
import {MAX_DISTANCE, MAX_PRICE, MIN_PRICE, setPntState} from "../utils/utils";
import {REPORTS_SEARCH_API, SEARCH_SORT_OPTIONS_API} from "../urls/endpoints";
import {getAuthHeader, getToken} from "../utils/auth";
import AppHeader from "../utils/AppHeader";
import {Picker} from "@react-native-picker/picker";
import RangeSlider, {Slider} from 'react-native-range-slider-expo';
import {search_style} from "../utils/styles";


export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            price_min: MIN_PRICE,
            price_max: MAX_PRICE,
            product_query: '',
            distance: MAX_DISTANCE,
            ordering_by_index: 0,
            ordering_by_value: '',
            pnt: 'POINT(0 0)',

            sorting_options: []
        }
    }

    // https://github.com/Agontuk/react-native-geolocation-service
    componentDidMount() {
        axios.get(SEARCH_SORT_OPTIONS_API).then(res => {
            this.setState({
                sorting_options: res.data.results
            });
        });

        setPntState(this);
    }


    send_search = (e) => {
        e.preventDefault();

        const req = {
            price_min: this.state.price_min,
            price_max: this.state.price_max,
            product_query: this.state.product_query,
            distance: this.state.distance,
            ordering_by: this.state.sorting_options[this.state.ordering_by_index][0],
            pnt: this.state.pnt
        }

        getToken().then(
            token => {
                axios.post(REPORTS_SEARCH_API, req, getAuthHeader(token)).then(
                    res => {
                        console.log(res.data)
                        this.props.navigation.navigate("SearchResults", {results: res.data.results});
                    }).catch(
                    err => {
                        let errors = []
                        for (const [field, error_message] of Object.entries(err.response.data)) {
                            errors.push(`Error in field "${field}": ${error_message}`)
                        }

                        Alert.alert(errors);
                    })
            }
        )
    }

    render() {
        return (
            <View style={search_style.container}>
                <AppHeader title={"Search"} navigation={this.props.navigation} leftOption={"Menu"}/>
                <View style={{flex: 1}}>
                    <View style={search_style.search_message_view}>
                        <Text style={search_style.search_message}>{SEARCH_MESSAGE_STR}</Text>
                    </View>

                    <View style={search_style.search_input_view}>
                        <TextInput
                            value={this.state.product_query}
                            onChangeText={(text => {
                                this.setState({product_query: text})
                            })}
                            style={search_style.text_input}
                            label="product_query"
                            placeholder="Product name"
                        />
                    </View>

                    <View style={search_style.search_input_view}>
                        <Text style={search_style.distance_txt}>Maximum distance {this.state.distance}km</Text>
                        <Slider
                            min={0}
                            max={MAX_DISTANCE}
                            step={10}
                            initialValue={100}
                            valueOnChange={(value => {
                                this.setState({distance: value})
                            })}
                        />

                    </View>

                    <View style={search_style.search_input_view}>
                        <Text style={search_style.distance_txt}>
                            Price from {this.state.price_min} to {this.state.price_max}
                        </Text>
                        <RangeSlider
                            min={MIN_PRICE}
                            max={MAX_PRICE}
                            fromValueOnChange={value => this.setState({price_min: value})}
                            toValueOnChange={value => this.setState({price_max: value})}
                            initialFromValue={MIN_PRICE}
                            step={10}
                        />
                    </View>

                    <View style={search_style.picker_view}>
                        <Picker
                            style={search_style.picker}
                            selectedValue={this.state.ordering_by_value}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({
                                    ordering_by_index: itemIndex,
                                    ordering_by_value: itemValue
                                })
                            }
                        >
                            {this.state.sorting_options.map((opt) => <Picker.Item label={opt[1]} value={opt[0]}
                                                                                  key={opt[0]}/>)}
                        </Picker>
                    </View>

                    <View style={search_style.search_button_view}>
                        <Button
                            title={SEARCH_BUTTON}
                            onPress={this.send_search}
                        />
                    </View>

                </View>
            </View>
        )
    }
}

export default Search