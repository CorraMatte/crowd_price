import React from "react";
import axios from "react-native-axios";
import {Alert, StyleSheet, Text, TextInput, View} from "react-native";
import {SEARCH_BUTTON, SEARCH_MESSAGE_STR} from "../utils/strings";
import {Button} from "react-native-elements";
import {MAX_DISTANCE, MAX_PRICE, MIN_PRICE, setPntState} from "../utils/utils";
import {REPORTS_SEARCH_API, SEARCH_SORT_OPTIONS_API} from "../urls/endpoints";
import {getAuthHeader, getToken} from "../utils/auth";
import AppHeader from "../utils/AppHeader";
import {Picker} from "@react-native-picker/picker";
import RangeSlider from 'react-native-range-slider-expo';


const styles = StyleSheet.create({
    picker: {
        width: 200,
        borderColor: 'black',
        borderWidth: 1,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "#E5EAF5"
    },
    input: {
        width: 200,
        height: 35,
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
        marginBottom: 10,
    },
    inputext: {
        width: 200,
        height: 50,
        padding: 10,
        textAlign: "center",
        fontSize: 24,
        marginBottom: 20,
    }
});

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
                        this.props.navigation.navigate("SearchResults", {results: res.data.features});
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
            <View style={styles.container}>
                <AppHeader title={"Search"} navigation={this.props.navigation} leftOption={"Menu"}/>
                <Text style={styles.inputext}>{SEARCH_MESSAGE_STR}</Text>
                <TextInput
                    value={this.state.product_query}
                    onChangeText={(text => {
                        this.setState({product_query: text})
                    })}
                    label="product_query"
                    placeholder="Search a product"
                    style={styles.input}
                />

                <Text>Maximum distance</Text>
                <TextInput
                    value={"" + this.state.distance}
                    onChangeText={(text => {
                        this.setState({distance: text})
                    })}
                    keyboardType="number-pad"
                    label="distance"
                    placeholder="100"
                    style={styles.input}
                />

                <Text>Price</Text>
                <RangeSlider
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    fromValueOnChange={value => this.setState({price_min: value})}
                    toValueOnChange={value => this.setState({price_max: value})}
                    initialFromValue={MIN_PRICE}
                    step={100}
                />

                <Picker
                    style={styles.picker}
                    selectedValue={this.state.ordering_by_value}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({
                            ordering_by_index: itemIndex,
                            ordering_by_value: itemValue
                        })
                    }
                >
                    {this.state.sorting_options.map((opt) => <Picker.Item label={opt[1]} value={opt[0]} key={opt[0]}/>)}
                </Picker>

                <Button
                    title={SEARCH_BUTTON}
                    style={styles.input}
                    onPress={this.send_search}
                />

            </View>
        )
    }
}

export default Search