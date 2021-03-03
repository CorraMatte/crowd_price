import {StyleSheet} from "react-native";

const container = {
    flex: 1,
    alignSelf: "center",
    backgroundColor: "#E5EAF5"
}

const menu_message_view = {
    flex: 2,
    justifyContent: "center"
}

const menu_buttons_view_group = {
    flex: 2,
    justifyContent: "center",
    alignContent: "center"
}

const menu_message_str = {
    textAlign: "center",
    fontSize: 34
}

const menu_button_view = {
    width: "90%",
    alignSelf:"center",
    marginBottom: 30
}

const text_input = {
    borderWidth: 2,
    borderRadius: 10,
    padding: 10
}

export const menu_style = StyleSheet.create({
    container: container,
    menu_message_view: menu_message_view,
    menu_button_view: menu_button_view,
    menu_buttons_view_group: menu_buttons_view_group,
    menu_message_str: menu_message_str,
});

const search_message = {
    textAlign: "center",
    fontSize: 22
}

const search_message_view = {
    flex: 0.5,
    justifyContent: "center"
}

const search_input_view = {
    flex: 1,
    justifyContent:"space-around",
    width: "70%",
    alignSelf:"center"
}

const distance_txt = {
    textAlign: "left",
    fontSize: 16
}

const search_button_view = {
    width: "70%",
    alignSelf:"center",
    marginBottom: 30
}

const picker_view = {
    flex: 0.5,
    justifyContent:"space-around",
    width: "70%",
    alignSelf:"center"
}

const picker = {
    borderColor: 'black',
    borderWidth: 1,
}

export const search_style = StyleSheet.create({
    container: container,
    search_message_view: search_message_view,
    search_message: search_message,
    search_input_view: search_input_view,
    distance_txt: distance_txt,
    picker: picker,
    picker_view: picker_view,
    search_button_view: search_button_view,
    text_input: text_input
});


const item_view = {
    justifyContent: "center",
    width: "90%",
    alignSelf: "center",
    marginTop: 20
}

const item_title_str = {
    fontSize: 16
}

const item_date_str = {
    fontSize: 12,
    marginBottom: 5
}

export const search_result_style = StyleSheet.create({
    item_view: item_view,
    item_date_str: item_date_str,
    item_title_str: item_title_str

});