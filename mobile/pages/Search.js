import React from "react";
import {StyleSheet, Text, TextInput, View} from "react-native";
import {SEARCH_BUTTON, SEARCH_MESSAGE_STR, SIGNUP_BUTTON, SIGNUP_MESSAGE_STR} from "../utils/strings";
import {Button} from "react-native-elements";
import {MAX_PRICE, MIN_PRICE} from "../utils/utils";
import {REPORTS_SEARCH_API} from "../urls/endpoints";
import {getAuthHeader} from "../utils/auth";
import AppHeader from "../utils/AppHeader";
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
            reports: [],

            all_categories: [],
            sorting_options: [],
            has_search: false,
            errors: ''
        }
    }

    send_search = (e) => {
        e.preventDefault();
        const req = {
            price_min: this.state.price_min,
            price_max: this.state.price_max,
            categories: this.state.categories,
            product_query: this.state.product_query,
            distance: this.state.distance,
            ordering_by: this.state.ordering_by
        }

        axios.post(REPORTS_SEARCH_API, req, getAuthHeader()).then(
            res => {
                this.setState({
                    reports: res.data.features,
                    has_search: true,
                    errors: ''
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

    render() {
        const results = "";

        return (
            <View style={styles.container}>
                <AppHeader title={"Search"} navigation={this.props.navigation} leftOption={"Menu"}/>
                <Text style={styles.inputext}>{SEARCH_MESSAGE_STR}</Text>
                <TextInput
                    value={this.state.product_query}
                    onChangeText={(text => {this.setState({product_query: text})})}
                    keyboardType="email-address"
                    autoCompleteType="email"
                    label="Email"
                    placeholder="Email"
                    style={styles.input}
                />

                <TextInput
                    value={this.state.price_min}
                    onChangeText={(text => {this.setState({price_min: text})})}
                    keyboardType="number-pad"
                    label="minimum price"
                    placeholder="0"
                    style={styles.input}
                />

                <TextInput
                    value={this.state.price_max}
                    onChangeText={(text => {this.setState({price_max: text})})}
                    keyboardType="number-pad"
                    label="maximum price"
                    placeholder="0"
                    style={styles.input}
                />

                <TextInput
                    value={this.state.distance}
                    onChangeText={(text => {this.setState({distance: text})})}
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
                    onPress={this.search}
                />

            </View>
        )
    }
}

export default Search