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

const menu_user_message_view = {
    flex: 0.5,
    justifyContent: 'center'
}

const menu_buttons_view_group = {
    flex: 2,
    justifyContent: "center",
    alignContent: "center"
}

const title_message_str = {
    textAlign: "center",
    fontSize: 34
}

const title_message_user_str = {
    fontSize: 16,
    textAlign: 'center'
}

const menu_button_view = {
    width: "90%",
    alignSelf: "center",
    marginBottom: 30
}

const text_input = {
    borderWidth: 2,
    borderRadius: 10,
    padding: 10
}

const menu_exp_view = {
    flex: 2,
    justifyContent: "center",
    alignContent: "center"
}

export const menu_style = StyleSheet.create({
    container: container,
    menu_message_view: menu_message_view,
    menu_button_view: menu_button_view,
    menu_buttons_view_group: menu_buttons_view_group,
    menu_message_str: title_message_str,
    menu_exp_view: menu_exp_view,
    menu_user_message_view: menu_user_message_view,
    title_message_user_str: title_message_user_str
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
    justifyContent: "space-around",
    width: "70%",
    alignSelf: "center"
}

const distance_txt = {
    textAlign: "left",
    fontSize: 16
}

const search_button_view = {
    width: "70%",
    alignSelf: "center",
    marginBottom: 30
}

const picker_view = {
    flex: 0.5,
    justifyContent: "space-around",
    width: "70%",
    alignSelf: "center"
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

const title_style = {
    fontSize: 28,
    alignSelf: 'center',
    flex: 0.1
}

export const search_result_style = StyleSheet.create({
    item_view: item_view,
    item_date_str: item_date_str,
    item_title_str: item_title_str,
    title_style: title_style
});


const report_container = {
    flex: 1,
    backgroundColor: "#E5EAF5"
}

const report_text_view = {
    flex: 1,
    justifyContent: "center",
    width: "80%",
    alignSelf: "center"
}

const report_detail_str = {
    fontSize: 18,
    marginBottom: 2
}

const report_price_str = {
    fontSize: 22,
    marginBottom: 2
}


export const report_style = StyleSheet.create({
    report_container: report_container,
    report_text_view: report_text_view,
    report_button_view: menu_button_view,
    report_message_str: title_message_str,
    item_date_str: report_detail_str,
    report_detail_str: report_detail_str,
    report_price_str: report_price_str
});


const txt_view_group = {
    flex: 1,
    alignSelf: "center",
    width: "90%",
    justifyContent: "space-around"
}

const advice_str = {
    fontWeight: "bold",
    color: "#50A5D0",
}

const login_button_view = {
    flex: 1,
    width: "70%",
    alignSelf: "center",
    justifyContent: "space-around",
}

const login_message_view = {
    flex: 1,
    justifyContent: "space-around"
}

export const login_style = StyleSheet.create({
    container: report_container,
    login_message_str: title_message_str,
    login_button_view: login_button_view,
    text_input: text_input,
    txt_view_group: txt_view_group,
    advice_str: advice_str,
    login_message_view: login_message_view
});

export const signup_style = login_style;

const upload_button_view = {
    flex: 2,
    width: "90%",
    alignSelf: "center",
    justifyContent: "space-around",
    marginTop: 30
}

export const upload_style = StyleSheet.create({
    container: report_container,
    text_input: text_input,
    upload_text_input: search_input_view,
    upload_message_str: title_message_str,
    upload_message_view: menu_message_view,
    picker: picker,
    picker_view: picker_view,
    upload_button_view: upload_button_view
})