import React from "react";
import {Button, Image, Linking, Text, View} from "react-native";
import AppHeader from "../utils/AppHeader";


export class Report extends React.Component {
    openMap = () => {
        const data = this.props.route.params.data;
        console.log(data)
        return
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${data.latitude},${data.longitude}`;
        const label = 'maps';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url).then(r => console.log(r));
    }

    // https://stackoverflow.com/questions/43214062/open-maps-google-maps-in-react-native
    render() {
        const data = this.props.route.params.data;
        console.log(data)
        const date = new Date(data.created_time);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };

        return (
            <View>
                <AppHeader title={"Report"} />
                <Text>{data.product}</Text>
                <Text>{data.price}</Text>
                <Text>{data.store}</Text>
                <Text>{data.profile}</Text>
                <Text>{date.toLocaleString(options)}</Text>
                <Image
                    source={{
                        uri: data.picture,
                    }}
                />
                <Button title={"open in Maps"} onPress={this.openMap} />
            </View>
        )
    }
}

export default Report;