import React from "react";
import axios from "react-native-axios";
import {getToken, setToken} from "../utils/auth";
import {Text, TextInput, Alert, View, StyleSheet} from "react-native";
import {Button} from "react-native-elements";
import {USER_LOGIN_API} from "../urls/endpoints";
import {LOGIN_BUTTON, SIGNUP_WELCOME_MESSAGE_STR, WELCOME_MESSAGE_STR} from "../utils/strings";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E5EAF5"
    },
    input: {
        width: 200,
        height: 35,
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
        marginBottom: 100,
    }
});

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
        this.props.navigation.navigate("Search");

        getToken().then(
            res => {
                if (res !== null) {
                    // Has to be Menu
                    // this.props.navigation.navigate("Menu");
                    // this.props.navigation.navigate("Search");
                    this.props.navigation.navigate("Search");
                }
            }
        )

        return (
            <View style={styles.container}>
                <Text style={styles.inputext}>{WELCOME_MESSAGE_STR}</Text>
                <TextInput
                    value={this.state.email}
                    onChangeText={(text) => {this.setState({'email': text})}}
                    keyboardType="email-address"
                    autoCompleteType="email"
                    label="Email"
                    placeholder="Email"
                    style={styles.input}
                />
                <TextInput
                    value={this.state.password}
                    onChangeText={(text) => {this.setState({'password': text})}}
                    label="Password"
                    placeholder="Password"
                    secureTextEntry={true}
                    style={styles.input}
                />
                <Text
                    onPress={() => this.props.navigation.navigate("Signup")}
                    style={{fontWeight: "bold", color: "#50A5D0", margin: 10}}
                >{SIGNUP_WELCOME_MESSAGE_STR}</Text>
                <Button
                    title={LOGIN_BUTTON}
                    style={styles.input}
                    onPress={this.onLogin}
                />
            </View>
        );
    }
}

export default Login;