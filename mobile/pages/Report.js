import React from "react";
import {Button, Image, Linking, Text, View} from "react-native";
import AppHeader from "../utils/AppHeader";
import {REPORT_OPEN_IN_MAP_BUTTON, REPORT_TITLE_STR} from "../utils/strings";
import {report_style} from "../utils/styles";
import {get_str_date} from "../utils/utils";


export class Report extends React.Component {
    openMap = () => {
        const data = this.props.route.params.data;
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



        return (
            <View style={report_style.report_container}>
                <AppHeader title={REPORT_TITLE_STR} />
                <View style={report_style.report_text_view}>
                    <Text style={report_style.report_message_str}>Report Detail</Text>
                </View>
                <View style={report_style.report_text_view}>
                    <Text style={report_style.report_detail_str}>{data.product + " " + data.price + "€"}</Text>
                    <Text style={report_style.report_detail_str}>{"Created in store: " + data.store}</Text>
                    <Text style={report_style.report_detail_str}>{"by: " + data.profile}</Text>
                    <Text></Text>
                    <Text style={report_style.item_date_str}>{"on " + get_str_date(data.created_time)}</Text>
                </View>

                <View style={{flex: 2}}>
                    <Image
                        source={{
                            uri: data.picture,
                        }}
                    />
                </View>
                <View style={report_style.report_button_view}>
                    <Button title={REPORT_OPEN_IN_MAP_BUTTON} onPress={this.openMap} />
                </View>
            </View>
        )
    }
}

export default Report;