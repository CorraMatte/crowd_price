import React from "react";
import axios from "react-native-axios";
import {getToken, setToken} from "../utils/auth";
import {Text, TextInput, Alert, View, StyleSheet} from "react-native";
import {Button} from "react-native-elements";
import {USER_LOGIN_API} from "../urls/endpoints";
import {LOGIN_BUTTON, SIGNUP_WELCOME_MESSAGE_STR, WELCOME_MESSAGE_STR} from "../utils/strings";
import {login_style} from "../utils/styles";


// https://reactnative.dev/docs/textinput
export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'email': '',
            'password': ''
        }
    }

    onLogin = () => {
        // Send login request in order to retrieve user token
        axios.post(USER_LOGIN_API, {email: this.state.email, password: this.state.password}).then((res) => {
            if (res.status === 200) {
                this.setState({
                    email: '',
                    password: ''
                })
                setToken(res.data.key);
                this.props.navigation.navigate("Menu");
            } else {
                Alert.alert("Invalid credentials");
            }
        }).catch(e => {
            Alert.alert("Invalid credentials");
        });
    }

    render() {
        getToken().then(
            res => {
                if (res !== null) {
                    this.props.navigation.navigate("Menu");
                }
            }
        )

        return (
            <View style={login_style.container}>
                <View style={login_style.login_message_view}>
                    <Text style={login_style.login_message_str}>{WELCOME_MESSAGE_STR}</Text>
                </View>

                <View style={login_style.txt_view_group}>
                    <TextInput
                        value={this.state.email}
                        onChangeText={(text) => {
                            this.setState({'email': text})
                        }}
                        style={login_style.text_input}
                        keyboardType="email-address"
                        autoCompleteType="email"
                        label="Email"
                        placeholder="Email"
                    />
                    <TextInput
                        value={this.state.password}
                        onChangeText={(text) => {
                            this.setState({'password': text})
                        }}
                        style={login_style.text_input}
                        label="Password"
                        placeholder="Password"
                        secureTextEntry={true}
                    />
                    <Text
                        onPress={() => this.props.navigation.navigate("Signup")}
                        style={login_style.advice_str}
                    >{SIGNUP_WELCOME_MESSAGE_STR}</Text>
                </View>

                <View style={login_style.login_button_view}>
                    <Button
                        title={LOGIN_BUTTON}
                        onPress={this.onLogin}
                    />
                </View>

            </View>
        );
    }
}

export default Login;