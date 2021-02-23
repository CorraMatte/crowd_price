import React from "react";

import { logOut } from "./auth";
import { Header } from "react-native-elements";
import { Icon } from "react-native-elements";


export class AppHeader extends React.Component {
    render () {
        return (
            <Header
                leftComponent={ this.props.leftOption ?
                    <Icon
                        name="home"
                        color='#FFF'
                        onPress={() => {
                            this.props.navigation.navigate(this.props.leftOption)
                        }}
                        underlayColor={ "#64B5F6" }
                    /> :
                    <div></div>
                }
                centerComponent={{ text: this.props.title, style: { color: "#FFF", fontSize: 20 } }}
                rightComponent={
                    <Icon
                        name="exit-to-app"
                        color="#FFF"
                        onPress={ () => { logOut(); this.props.navigation.navigate("Login") } }
                        underlayColor={ "#64B5F6" }
                    />
                }
            />
        );
    }
}

export default AppHeader;