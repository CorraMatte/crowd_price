import React from "react";
import axios from "react-native-axios";
import {Text, TextInput, Alert, View, StyleSheet} from "react-native";
import {Button} from "react-native-elements";
import {CONSUMER_SIGNUP_API} from "../urls/endpoints";
import {SIGNUP_BUTTON, SIGNUP_MESSAGE_STR, SIGNUP_TO_LOGIN_STR} from "../utils/strings";
import {signup_style} from "../utils/styles";


export class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'email': '',
            'password1': '',
            'password2': '',
            'longitude': '',
            'latitude': ''
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
        const req = {
            'email': this.state.email,
            'password1': this.state.password1,
            'password2': this.state.password2
        }

        axios.post(CONSUMER_SIGNUP_API, req).then(
            res => {
                if (res.status === 201) {
                    Alert.alert("Account created!", "Now you can log in...");
                    this.props.navigation.navigate("Login");
                } else {
                    Alert.alert("Error during the signup", res.data);
                    this.setState({
                        'errors': res.data
                    })
                }
            }
        ).catch(
            err => {
                let errors = 'Errors: '
                err.response.data.detail.map((msg_error) => errors += msg_error);
                Alert.alert(errors);
            }
        )
    }

    render() {
        return (
            <View style={signup_style.container}>
                <View style={signup_style.login_message_view}>
                    <Text style={signup_style.login_message_str}>{SIGNUP_MESSAGE_STR}</Text>
                </View>

                <View style={signup_style.txt_view_group}>
                    <TextInput
                        value={this.state.email}
                        onChangeText={(text) => {
                            this.setState({email: text})
                        }}
                        keyboardType="email-address"
                        autoCompleteType="email"
                        label="Email"
                        placeholder="Email"
                        style={signup_style.text_input}
                    />
                    <TextInput
                        value={this.state.password1}
                        onChangeText={(text) => {
                            this.setState({password1: text})
                        }}
                        label="Password"
                        placeholder="Password"
                        secureTextEntry={true}
                        style={signup_style.text_input}
                    />
                    <TextInput
                        value={this.state.password2}
                        onChangeText={(text) => {
                            this.setState({password2: text})
                        }}
                        label="ConfirmPassword"
                        placeholder="Confirm password"
                        secureTextEntry={true}
                        style={signup_style.text_input}
                    />
                    <Text
                        onPress={() => this.props.navigation.navigate("Login")}
                        style={signup_style.advice_str}
                    >{SIGNUP_TO_LOGIN_STR}</Text>
                </View>

                <View style={signup_style.login_button_view}>
                    <Button
                        title={SIGNUP_BUTTON}
                        onPress={this.signup}
                    />
                </View>

            </View>
        );
    }
}

export default Signup;