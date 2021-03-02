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
                <View style={menu_style.body}>
                    <Text
                        style={menu_style.menu_message}
                    >{MENU_MESSAGE_STR}</Text>
                    <Button
                        title={SEARCH_BUTTON}
                        style={menu_style.menu_button}
                        onPress={() => {
                            this.props.navigation.navigate("Search")
                        }}
                    />
                    <Button
                        title={UPLOAD_BUTTON}
                        style={menu_style.menu_button}
                        onPress={() => {
                            this.props.navigation.navigate("Upload")
                        }}
                    />
                </View>
            </View>
        )
    }
}


export default Menu;