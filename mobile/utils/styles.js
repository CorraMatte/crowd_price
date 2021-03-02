import {StyleSheet} from "react-native";

const container = {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#E5EAF5"
}

const body = {
    flex: 1,
    justifyContent: "center",
}

const menu_message = {
    padding: 30,
    fontSize: 28
}

const menu_button = {
    height: 30,
    padding: 30,
    borderRadius: 20,
}

const picker = {
    width: 200,
    borderColor: 'black',
    borderWidth: 1,
}

export const menu_style = StyleSheet.create({
    container: container,
    body: body,
    menu_message: menu_message,
    menu_button: menu_button
});

export const search_style = StyleSheet.create({
    container: container,
    body: body,
    menu_message: menu_message,
    menu_button: menu_button
});
