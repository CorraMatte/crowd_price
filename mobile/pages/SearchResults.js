import React from "react";
import {FlatList, Text, View} from "react-native";


class Item extends React.Component {
    render () {
        console.log(this.props.data)
        return (
            <View>
                <Text>{this.props.product}</Text>
                <Text>{this.props.store}</Text>
                <Text>{this.props.price}</Text>
            </View>
        )
    }
}


export class SearchResults extends React.Component {
    renderItem = (item) => (
        <Item data={item.item} />
    );

    render() {
        console.log(this.props.route.params.results);
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
                <FlatList
                    data={new_data}
                    renderItem={this.renderItem}
                />
            </View>
        )
    }
}

export default SearchResults;