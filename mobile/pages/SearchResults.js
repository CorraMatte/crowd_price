import React from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import AppHeader from "../utils/AppHeader";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "#E5EAF5"
    },
})

class Item extends React.Component {
    render () {
        const data = this.props.data;
        return (
            <View style={styles.container}>
                <Text>{data.product}</Text>
                <Text>{data.store}</Text>
                <Text>{data.price}</Text>
            </View>
        )
    }
}

// https://reactnative.dev/docs/textinput
export class SearchResults extends React.Component {

    render() {
        let new_data = [];
        this.props.route.params.results.forEach(
            (value) => new_data.push({
                id: '' + value.id,
                price: value.properties.price,
                product: value.properties.product.name,
                store: value.properties.store.name,
                profile: value.properties.consumer.profile.user.email,
                created_time: value.properties.created_time,
                picture: value.properties.picture,
            })
        )

        return (
            <View>
                <AppHeader />
                <FlatList
                    data={new_data}
                    renderItem={({item}) => (
                        <Item data={item} />
                    )}
                />
            </View>
        )
    }
}

export default SearchResults;