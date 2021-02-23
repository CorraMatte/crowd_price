import React from "react";

import axios from "react-native-axios";
import {Text, TextInput, Alert, View, StyleSheet} from "react-native";
import {Button} from "react-native-elements";
import {CONSUMER_SIGNUP_API} from "../urls/endpoints";
import {getCoordinatesByIP, getIP} from "../utils/utils";
import {SIGNUP_BUTTON, SIGNUP_MESSAGE_STR} from "../utils/strings";
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

export class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'email': '',
            'password1': '',
            'password2': '',
            'longitude': '',
            'latitude': '',
            'errors': ''
        }
    }

    fieldChangeHandler = (e) => {
        const target = e.target;
        let name = target.name;
        let value = target.value;
        this.setState({[name]: value});
    }


    signup = (e) => {
        e.preventDefault();
        // Read longitude and latitude from GEO


        const req = {
            'email': this.state.email,
            'password1': this.state.password1,
            'password2': this.state.password2,
            'pnt': `POINT(${this.state.longitude} ${this.state.latitude})`
        }

        axios.post(CONSUMER_SIGNUP_API, req).then(
            res => {
                if (res.status === 201) {
                    Alert.alert("Account created!\n\nNow you can log in...");
                    this.props.navigation.navigate("Login");
                } else {
                    this.setState({
                        'errors': res.data
                    })
                }
            }
        ).catch(
            err => {
                let errors = 'Errors: '
                err.response.data.detail.map((msg_error) => errors += msg_error);
                this.setState({
                    'errors': errors
                })
            }
        )

    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.inputext}>{SIGNUP_MESSAGE_STR}</Text>
                <TextInput
                    value={this.state.email}
                    onChangeText={this.fieldChangeHandler}
                    keyboardType="email-address"
                    autoCompleteType="email"
                    label="Email"
                    placeholder="Email"
                    style={styles.input}
                />
                <TextInput
                    value={this.state.password1}
                    onChangeText={this.fieldChangeHandler}
                    label="Password"
                    placeholder="Password"
                    secureTextEntry={true}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.password2}
                    onChangeText={this.fieldChangeHandler}
                    label="ConfirmPassword"
                    placeholder="Confirm password"
                    secureTextEntry={true}
                    style={styles.input}
                />
                <Text
                    onPress={() => this.props.navigation.navigate("Login")}
                    style={{fontWeight: "bold", color: "#50A5D0", margin: 10}}
                >Already have an account? Log in! </Text>
                <Button
                    title={SIGNUP_BUTTON}
                    style={styles.input}
                    onPress={this.signup}
                />
            </View>
        );
    }
}

export default Signup;