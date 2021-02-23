import React from "react";
import AppHeader from "../utils/AppHeader";
import {StyleSheet, Text, View} from "react-native";
import {HOME_MESSAGE_STR, SEARCH_BUTTON, UPLOAD_BUTTON} from "../utils/strings";
import {Button} from "react-native-elements";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E5EAF5"
    },
    inputext: {

    }
});

export class Menu extends React.Component {
    render () {
        return (
            <View style={styles.container}>
                <AppHeader title={"Menu"} navigation={this.props.navigation}/>
                <Text style={styles.inputext}>{HOME_MESSAGE_STR}</Text>
                <Button
                    title={SEARCH_BUTTON}
                    style={styles.input}
                    onPress={this.props.navigation.navigate("Search")}
                />
                <Button
                    title={UPLOAD_BUTTON}
                    style={styles.input}
                    onPress={this.props.navigation.navigate("Upload")}
                />
            </View>
        );
    }
}


export default Menu;