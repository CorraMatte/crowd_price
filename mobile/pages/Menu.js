import React from "react";
import AppHeader from "../utils/AppHeader";
import {Text, View} from "react-native";
import {MENU_MESSAGE_STR, SEARCH_BUTTON, UPLOAD_BUTTON} from "../utils/strings";
import {Button} from "react-native-elements";
import {menu_style} from "../utils/styles";


export class Menu extends React.Component {
    render () {
        return (
            <View style={menu_style.container}>
                <AppHeader title={"Menu"} navigation={this.props.navigation}/>
                <View style={menu_style.menu_message_view}>
                   <Text
                        style={menu_style.menu_message_str}
                    >{MENU_MESSAGE_STR}</Text>
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