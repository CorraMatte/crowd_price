import React from "react";
import {StyleSheet, Text, TextInput, View} from "react-native";
import {UPLOAD_BUTTON, UPLOAD_MESSAGE_STR} from "../utils/strings";
import {Button} from "react-native-elements";
import AppHeader from "../utils/AppHeader";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "#E5EAF5"
    },
    input: {
        height: 35,
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
        marginBottom: 10,
    },
    inputext: {
        height: 50,
        padding: 10,
        textAlign: "center",
        fontSize: 24,
        marginBottom: 20,
    }
});

export class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            price: 0,
            product_name: '',
            categories: [],
            all_categories: [],
            errors: ''
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <AppHeader title={"Upload"} navigation={this.props.navigation} leftOption={"Menu"}/>
                <Text style={styles.inputext}>{UPLOAD_MESSAGE_STR}</Text>
                <TextInput
                    value={this.state.product_name}
                    onChangeText={(text => {this.setState({product_name: text})})}
                    keyboardType="email-address"
                    autoCompleteType="email"
                    label="Email"
                    placeholder="Email"
                    style={styles.input}
                />

                <TextInput
                    value={this.state.price}
                    onChangeText={(text => {this.setState({price: text})})}
                    keyboardType="number-pad"
                    label="minimum price"
                    placeholder="0"
                    style={styles.input}
                />

                {this.state.all_categories.map(
                    (cat) => <Form.Check type='checkbox' id={cat.id} name={cat.name} label={cat.name} key={cat.id}
                                         onChange={this.fieldChangeHandler}/>
                )}

                <Button
                    title={UPLOAD_BUTTON}
                    style={styles.input}
                    onPress={this.search}
                />

            </View>
        )
    }
}

export default Upload