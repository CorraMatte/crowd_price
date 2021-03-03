import React from "react";
import {Button, FlatList, StyleSheet, Text, View} from "react-native";
import AppHeader from "../utils/AppHeader";
import {SEARCH_RESULTS_TITLE_STR} from "../utils/strings";
import {get_day_month_year_from_date} from "../utils/utils";
import {search_result_style} from "../utils/styles";

class Item extends React.Component {
    render () {
        const data = this.props.data;
        return (
            <View style={search_result_style.item_view}>
                <Text style={search_result_style.item_title_str}>{data.product + ": " + data.price + "€"}</Text>
                <Text style={search_result_style.item_date_str}>{"created on " + get_day_month_year_from_date(data.created_time)}</Text>
                <Button title={"open"} onPress={() => this.props.navigation.navigate(
                    "Report", {data: data}
                )} />
            </View>
        )
    }
}

// https://reactnative.dev/docs/flatlist
export class SearchResults extends React.Component {
    render() {
        let new_data = [];
        this.props.route.params.results.forEach(
            (value) => new_data.push({
                id: '' + value.id,
                longitude: '' + value.geometry.coordinates[0],
                latitude: '' + value.geometry.coordinates[1],
                price: value.properties.price,
                product: value.properties.product.name,
                store: value.properties.store ? value.properties.store.name : '',
                profile: value.properties.consumer.profile.user.email,
                created_time: value.properties.created_time,
                picture: value.properties.picture,
            })
        )

        return (
            <View>
                <AppHeader title={SEARCH_RESULTS_TITLE_STR} />
                <FlatList
                    data={new_data}
                    renderItem={({item}) => (
                        <Item data={item} navigation={this.props.navigation} />
                    )}
                />
            </View>
        )
    }
}

export default SearchResults;