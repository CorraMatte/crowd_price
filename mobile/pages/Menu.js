import React from "react";
import axios from "react-native-axios";
import AppHeader from "../utils/AppHeader";
import {Text, View} from "react-native";
import {MENU_MESSAGE_STR, SEARCH_BUTTON, UPLOAD_BUTTON} from "../utils/strings";
import {Badge, Button} from "react-native-elements";
import {menu_style} from "../utils/styles";
import {getAuthHeader, getToken} from "../utils/auth";
import {CONSUMER_API, CONSUMER_EXPERIENCE_API} from "../urls/endpoints";
import {get_badge_from_experience} from "../utils/utils";


export class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exp: 0,
            user: '',
        }
    }

    componentDidMount() {
        getToken().then(
            token => {
                axios.get(CONSUMER_EXPERIENCE_API, getAuthHeader(token)).then(
                    res => {
                        this.setState({
                            exp: res.data.result
                        });
                    }
                );

                axios.get(CONSUMER_API, getAuthHeader(token)).then(
                    res => {
                        console.log(res.data)
                        this.setState({
                            user: res.data.profile.user.email
                        });
                    }
                );
            }
        )
    }


    render() {
        return (
            <View style={menu_style.container}>
                <AppHeader title={"Menu"} navigation={this.props.navigation}/>
                <View style={menu_style.menu_user_message_view}>
                    <Text
                        style={menu_style.title_message_user_str}
                    >
                        {"You are logged as"} <Text
                        style={{fontWeight: 'bold'}}
                    >{this.state.user}</Text>
                    </Text>
                    <Text style={menu_style.title_message_user_str}>
                        {"You have published "}
                        <Text style={{fontWeight: 'bold'}}>{this.state.exp}</Text>
                        <Text>{" reports"}</Text>
                    </Text>
                </View>
                <View style={menu_style.menu_message_view}>
                    <Text
                        style={menu_style.menu_message_str}
                    >{MENU_MESSAGE_STR}</Text>
                </View>
                <View style={menu_style.menu_exp_view}>
                    {get_badge_from_experience(this.state.exp)}
                </View>
                <View style={menu_style.menu_buttons_view_group}>
                    <View style={menu_style.menu_button_view}>
                        <Button
                            title={SEARCH_BUTTON}
                            onPress={() => {
                                this.props.navigation.navigate("Search")
                            }}
                        />
                    </View>
                    <View style={menu_style.menu_button_view}>
                        <Button
                            title={UPLOAD_BUTTON}
                            onPress={() => {
                                this.props.navigation.navigate("Upload")
                            }}
                        />
                    </View>
                </View>
            </View>
        )
    }
}


export default Menu;