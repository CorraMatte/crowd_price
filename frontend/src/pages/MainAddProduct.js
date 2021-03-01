import React from "react";
import axios from "axios";
import {CATEGORIES_API} from "../urls/endpoints";
import {Button, Form} from "react-bootstrap";
import HeaderLogged from "../components/utils/HeaderLogged";


export class MainAddProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'name': '',
            'categories': [],

            'all_categories': [],
        }
    }

    componentDidMount() {
        axios.get(CATEGORIES_API).then(res => {
            this.setState({
                'all_categories': res.data.results
            })
        });
    }

    addProduct() {
        // TODO: MOBILE
    }

    fieldChangeHandler = (e) => {
        const target = e.target;
        let name = target.name;
        let value = target.value;

        if (target.type === 'checkbox') {
            let categories_checked = this.state.categories.slice();

            if (target.checked) {
                categories_checked.push(target.id);
            } else {
                const index = categories_checked.indexOf(target.id);
                categories_checked.splice(index, 1);
            }

            value = categories_checked;
            name = 'categories';
        }

        this.setState({[name]: value});
    }


    render() {
        return (
            <div>
                <HeaderLogged/>
                <Form onSubmit={this.addProduct}>
                    <Form.Control
                        type="text"
                        name="name"
                        id={"name"}
                        defaultValue=""
                        onChange={this.fieldChangeHandler}
                    />

                    {this.state.all_categories.map(
                        (cat) => <Form.Check type='checkbox' id={cat.id} name={cat.name} label={cat.name} key={cat.id}
                                             onChange={this.fieldChangeHandler}/>
                    )}

                    <Button id={"submit"} className={"btn-block btn-primary"} type="submit">search</Button>
                </Form>
            </div>
        )
    }
}

export default MainAddProduct;