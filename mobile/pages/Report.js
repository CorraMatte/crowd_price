import React from "react";
import {Button, Image, Linking, Text, View} from "react-native";
import AppHeader from "../utils/AppHeader";
import {REPORT_OPEN_IN_MAP_BUTTON, REPORT_TITLE_STR} from "../utils/strings";


export class Report extends React.Component {
    openMap = () => {
        const data = this.props.route.params.data;
        console.log(this.props.route.params.data)
        console.log(data)

        let url;
        try {
            const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
            const latLng = `${data.latitude},${data.longitude}`;
            const label = 'maps';
            url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`
            });
        } catch (ReferenceError) {
            url = `https://www.google.com/maps/@${data.latitude},${data.longitude}`
        }

        Linking.openURL(url).then(r => console.log(r));
    }

    // https://stackoverflow.com/questions/43214062/open-maps-google-maps-in-react-native
    render() {
        const data = this.props.route.params.data;
        const date = new Date(data.created_time);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };

        return (
            <View>
                <AppHeader title={REPORT_TITLE_STR} />
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
                <Button title={REPORT_OPEN_IN_MAP_BUTTON} onPress={this.openMap} />
            </View>
        )
    }
}

export default Report;