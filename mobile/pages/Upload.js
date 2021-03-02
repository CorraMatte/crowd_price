import React from "react";
import axios from "react-native-axios";
import {Alert, StyleSheet, Text, TextInput, View} from "react-native";
import {UPLOAD_BUTTON, UPLOAD_MESSAGE_STR} from "../utils/strings";
import {Button} from "react-native-elements";
import AppHeader from "../utils/AppHeader";
import {setPntState} from "../utils/utils";
import {Picker} from '@react-native-picker/picker';
import {PRODUCTS_API, STORES_API} from "../urls/endpoints";
import * as ImagePicker from "react-native-image-picker";


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
            product_id: 0,
            store_id: 0,
            price: 0.01,
            pnt: 'POINT(0 0)',

            products: [],
            stores: [],
            store_selected: 0,
            product_selected: 0
        }
    }

    // https://github.com/Agontuk/react-native-geolocation-service
    componentDidMount() {
        axios.get(STORES_API).then( res => {
            this.setState({
                stores: res.data.results.features
            })
        })

        axios.get(PRODUCTS_API).then( res => {
            this.setState({
                products: res.data.results
            })
        })

        setPntState(this);
    }

    add_report = () => {
        let req = {
            price: this.state.price,
            product: this.state.product_id,
            pnt: this.state.pnt
        }

        if (this.state.store_id !== 0) {
            req.store = this.state.store_id
        }

        if (req.product === 0) {
            Alert.alert("Select at least a product");
            return
        }

        console.log(req);
    }

    render() {
        return (
            <View style={styles.container}>
                <AppHeader title={"Upload"} navigation={this.props.navigation} leftOption={"Menu"}/>
                <Text style={styles.inputext}>{UPLOAD_MESSAGE_STR}</Text>

                // https://github.com/react-native-picker/picker
                <Picker
                    selectedValue={this.state.product_selected}
                    onValueChange={(itemValue, itemIndex) =>
                    this.setState({
                        product_id: itemIndex,
                        product_selected: itemValue
                    })}
                >
                    <Picker.Item label={"Select an item"} value={0} key={0} />
                    {this.state.products.map((prod) =>  <Picker.Item label={prod.name} value={prod.id} key={prod.id}/>)}
                </Picker>

                <Picker
                    selectedValue={this.state.store_selected}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({
                            store_id: itemIndex,
                            store_selected: itemValue
                        })
                    }
                >
                    <Picker.Item label={"Store not present"} value={0} key={0} />
                    {this.state.stores.map((store) =>  <Picker.Item label={store.properties.name} value={store.id} key={store.id}/>)}
                </Picker>

                <TextInput
                    value={this.state.price}
                    onChangeText={(text => {this.setState({price: text})})}
                    keyboardType="number-pad"
                    label="minimum price"
                    placeholder="0"
                    style={styles.input}
                />

                <Button
                    title="Take image"
                    onPress={() =>
                        ImagePicker.launchCamera(
                            {
                                mediaType: 'photo',
                                includeBase64: false,
                                maxHeight: 200,
                                maxWidth: 200,
                            },
                            (response) => {
                                setResponse(response);
                            },
                        )
                    }
                />

                <Button
                    title="Select image"
                    onPress={() =>
                        ImagePicker.launchImageLibrary(
                            {
                                mediaType: 'photo',
                                includeBase64: false,
                                maxHeight: 200,
                                maxWidth: 200,
                            },
                            (response) => {
                                setResponse(response);
                            },
                        )
                    }
                />

                <Button
                    title={UPLOAD_BUTTON}
                    style={styles.input}
                    onPress={this.add_report}
                />

            </View>
        )
    }
}

export default Upload