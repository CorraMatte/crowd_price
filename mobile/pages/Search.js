import React from "react";
import axios from "react-native-axios";
import {Alert, StyleSheet, Text, TextInput, View} from "react-native";
import {SEARCH_BUTTON, SEARCH_MESSAGE_STR} from "../utils/strings";
import {Button} from "react-native-elements";
import {getCoordinatesByIP, getIP, MAX_PRICE, MIN_PRICE} from "../utils/utils";
import {REPORTS_SEARCH_API} from "../urls/endpoints";
import {getAuthHeader, getToken} from "../utils/auth";
import AppHeader from "../utils/AppHeader";
import Geolocation from 'react-native-geolocation-service';


const styles = StyleSheet.create({
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
            categories: [],
            distance: 100,
            ordering_by: '-created_time',
            pnt: 'POINT(0 0)',

            all_categories: [],
            sorting_options: []
        }
    }

    componentDidMount() {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log(`POINT(${position.coords.longitude} ${position.coords.latitude})`);
                this.setState({
                    'pnt': `POINT(${position.coords.longitude} ${position.coords.latitude})`
                })
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
                Alert.alert("Activate geo localization for a better service");
                getIP().then(
                    res => {
                        getCoordinatesByIP(res.data.ip).then(
                            res => {
                                this.setState({
                                    longitude: res.data.longitude,
                                    latitude: res.data.latitude,
                                })
                            }
                        )
                    }
                )
            },
            { enableHighAccuracy: true, timeout: 5000 }
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
            ordering_by: this.state.ordering_by,
            pnt: this.state.pnt
        }

        getToken().then(
            token => {
                axios.post(REPORTS_SEARCH_API, req, getAuthHeader(token)).then(
                    res => {
                        console.log(res.data.features)
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
                    keyboardType="email-address"
                    autoCompleteType="email"
                    label="Email"
                    placeholder="Email"
                    style={styles.input}
                />

                <TextInput
                    value={this.state.price_min}
                    onChangeText={(text => {
                        this.setState({price_min: text})
                    })}
                    keyboardType="number-pad"
                    label="minimum price"
                    placeholder="0"
                    style={styles.input}
                />

                <TextInput
                    value={this.state.price_max}
                    onChangeText={(text => {
                        this.setState({price_max: text})
                    })}
                    keyboardType="number-pad"
                    label="maximum price"
                    placeholder="0"
                    style={styles.input}
                />

                <TextInput
                    value={this.state.distance}
                    onChangeText={(text => {
                        this.setState({distance: text})
                    })}
                    keyboardType="number-pad"
                    label="distance"
                    placeholder="100"
                    style={styles.input}
                />

                {this.state.all_categories.map(
                    (cat) => <Form.Check type='checkbox' id={cat.id} name={cat.name} label={cat.name} key={cat.id}
                                         onChange={this.fieldChangeHandler}/>
                )}

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