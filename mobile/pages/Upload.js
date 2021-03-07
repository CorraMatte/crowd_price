import React from "react";
import axios from "react-native-axios";
import {Alert, Text, TextInput, View} from "react-native";
import {UPLOAD_BUTTON, UPLOAD_MESSAGE_STR} from "../utils/strings";
import {Button} from "react-native-elements";
import AppHeader from "../utils/AppHeader";
import {Picker} from '@react-native-picker/picker';
import {PRODUCTS_API, REPORT_ADD_API, STORES_API} from "../urls/endpoints";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import {setPntState} from "../utils/utils";
import {upload_style} from "../utils/styles";
import {getToken} from "../utils/auth";

export class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product_id: 0,
            store_id: 0,
            price: 10,
            pnt: 'POINT(0 0)',
            uri: '',

            products: [],
            stores: [],
            store_selected: 0,
            product_selected: 0
        }
    }

    // https://docs.expo.io/versions/latest/sdk/imagepicker/#imagepickerlaunchimagelibraryasyncoptions
    _takePhoto = async () => {
        const {
            status: cameraPerm
        } = await Permissions.askAsync(Permissions.CAMERA);

        if (cameraPerm === 'granted') {
            let pickerResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
            });

            await this._handleImagePicked(pickerResult);
        }
    };

    _pickImage = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
        });

        await this._handleImagePicked(pickerResult);
    };

    _handleImagePicked = async pickerResult => {
        if (!pickerResult.cancelled) {
            this.setState({
                uri: pickerResult.uri
            });
        }
    };

    // https://github.com/Agontuk/react-native-geolocation-service
    componentDidMount() {
        axios.get(STORES_API).then(res => {
            this.setState({
                stores: res.data.results.features
            })
        })

        axios.get(PRODUCTS_API).then(res => {
            this.setState({
                products: res.data.results
            })
        })

        setPntState(this);
    }

    add_report = () => {
        let req = {};

        if (this.state.uri) {
            const uri = this.state.uri;
            const filename = this.state.uri.replace(/^.*[\\\/]/, '');

            req.photo= {
                uri,
                name: filename,
            };
        }

        if (this.state.store_id !== 0) {
            req.store = this.state.store_id
        }

        if (this.state.product_id === 0 || this.state.price === 0) {
            Alert.alert("Select at least a product and a price");
            return;
        }

        req.price = this.state.price;
        req.product = this.state.product_id;
        req.pnt = this.state.pnt;

        getToken().then(
            token => {
                console.log(req)
                axios.post(REPORT_ADD_API, req, {
                    headers: {
                        Authorization: "Token " + token
                    }}).then(
                    res => {
                        Alert.alert('Report has been upload sucessfully');
                        this.props.navigation.navigate("Menu");
                    }
                ).catch(err => {
                    console.log(err)
                })
            }
        ).catch(err => {
            console.log(err)
        })

    }


    render() {
        return (
            <View style={upload_style.container}>
                <AppHeader title={"Upload"} navigation={this.props.navigation} leftOption={"Menu"}/>
                <View style={upload_style.upload_message_view}>
                    <Text style={upload_style.upload_message_str}>{UPLOAD_MESSAGE_STR}</Text>
                </View>

                <View style={upload_style.picker_view}>
                    <Picker
                        style={upload_style.picker}
                        selectedValue={this.state.product_selected}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({
                                product_id: itemIndex,
                                product_selected: itemValue
                            })}
                    >
                        <Picker.Item label={"Select an item"} value={0} key={0}/>
                        {this.state.products.map((prod) => <Picker.Item label={prod.name} value={prod.id}
                                                                        key={prod.id}/>)}
                    </Picker>
                </View>

                <View style={upload_style.picker_view}>
                    <Picker
                        style={upload_style.picker}
                        selectedValue={this.state.store_selected}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({
                                store_id: itemIndex,
                                store_selected: itemValue
                            })
                        }
                    >
                        <Picker.Item label={"Store not present"} value={0} key={0}/>
                        {this.state.stores.map((store) =>
                            <Picker.Item
                                label={store.properties.name}
                                value={store.id}
                                key={store.id}
                            />)}
                    </Picker>
                </View>

                <View style={upload_style.upload_text_input}>
                    <Text>Insert the price (€)</Text>
                    <TextInput
                        value={"" + this.state.price}
                        onChangeText={(text => {
                            this.setState({price: text})
                        })}
                        keyboardType="number-pad"
                        label="minimum price"
                        placeholder="0"
                        style={upload_style.text_input}
                    />
                </View>

                <View style={upload_style.upload_button_view}>
                    {
                        this.state.uri ?
                            <Text>An image is selected for upload!</Text>
                            :
                            <Text>No image is selected</Text>
                    }

                    <Button
                        title="Take image"
                        onPress={this._takePhoto}
                    />

                    <Button
                        title="Select image"
                        onPress={this._pickImage}
                    />

                    <Button
                        title={UPLOAD_BUTTON}
                        onPress={this.add_report}
                    />

                </View>

            </View>
        )
    }
}

export default Upload