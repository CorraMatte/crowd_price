import React from "react";
import axios from "axios";
import {STORES_API, REPORTS_STORE_API} from "../endpoints";

class Stores extends React.Component{
    constructor(props) {
        super(props);
        axios.get(STORES_API).then(
            res => {
                let stores = res.data.result;
                stores['results']['features'].forEach(
                    store => {
                        axios.get(`${REPORTS_STORE_API}/${store['pk']}`).then(
                            res => {
                                let reports = res.data.result;
                                store['reports'] = reports['results']['features'];
                            }
                        )
                    }
                )
                this.setState({
                    stores: stores,
                })
            });
    }

    render () {
        return <div></div>
    }
}

export default Stores;