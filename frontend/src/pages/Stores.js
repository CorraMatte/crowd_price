import React from "react";
import axios from "axios";
import {DetailGroupReport} from "../components/report/DetailGroupReport"
import {STORES_API, REPORTS_STORE_API} from "../urls/endpoints";
import {STORE_URL} from "../urls/navigation";


class DetailStoreItem extends React.Component {
    render() {
        const store = this.props.store;
        const props = store.properties;
        let reports;

        if (store.reports) {
            reports = <DetailGroupReport reports={store.reports}/>
        } else {
            reports = <div>No reports</div>
        }

        return (
            <div>
                <img src={props.picture} alt="immagine" />
                {reports}
                <a href={`${STORE_URL}/${store.id}`}>{props.name}</a>
            </div>
        )
    }
}


class Stores extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            stores: []
        }
    }

    componentDidMount() {
        axios.get(STORES_API).then(
            res => {
                let stores = res.data.results.features;

                stores.forEach(
                    store => {
                        axios.get(`${REPORTS_STORE_API}/${store.id}`).then(
                            res => {
                                // MAYBE CAN BE IMPROVE, SILLY UPDATE STATE IN A LOOP
                                store.reports = res.data.results.features.slice(0, 4);
                                this.setState({
                                    stores: stores,
                                })
                            }
                        )
                    }
                )
            });
    }

    render () {
        const stores = this.state.stores;
        if (stores.length === 0) {
            return (<div></div>)
        }

        return (
            <div>
                There are: {stores.length} items
                {stores.map((store) => <DetailStoreItem store={store} key={store.id}/>)}
            </div>
        )
    }
}

export {Stores, DetailStoreItem};