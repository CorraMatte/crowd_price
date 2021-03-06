import React from "react";
import axios from "axios";
import {STORES_API, REPORTS_STORE_API} from "../urls/endpoints";
import {STORE_URL} from "../urls/navigation";
import {isLoggedIn} from "../auth";
import HeaderLogged from "../components/utils/HeaderLogged";
import {HeaderUnLogged} from "../components/utils/HeaderUnLogged";
import {Card, Container, Row} from "react-bootstrap";


class DetailStoreItem extends React.Component {
    render() {
        const store = this.props.store;
        if (!store) {
            return (<div></div>)
        }

        const props = store.properties;

        return (
            <Card bg={"dark"} className={"text-light col-md-3 ml-md-2 my-md-1"}>
                <Card.Header>
                    <img src={props.picture} alt="immagine" />
                </Card.Header>
                <Card.Body>
                    {props.name}
                </Card.Body>
                <Card.Footer>
                    <a className={"text-light"} href={`${STORE_URL}/${store.id}`}>more details..</a>
                </Card.Footer>
            </Card>
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
                {isLoggedIn() ? <HeaderLogged /> : <HeaderUnLogged />}
                <Container className={"ml-md-2 my-md-3"} fluid>
                    <Card bg={"light"} className={"my-md-3"}>
                        <Card.Header>
                            <h3>There are {stores.length} stores</h3>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                {stores.map((store) => <DetailStoreItem store={store} key={store.id}/>)}
                            </Row>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        )
    }
}

export {Stores, DetailStoreItem};