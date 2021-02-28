import React from "react";
import {CATEGORY_URL} from "../../urls/navigation";
import {Button} from "react-bootstrap";


class CategoryItem extends React.Component {
    render() {
        return (
            <Button className={"col-md-8 btn-sm mt-2"} onClick={() => {
                window.location.href = `/${CATEGORY_URL}/${this.props.id}`
            }}>{this.props.name}
            <br/>
            </Button>
        )
    }
}

export default CategoryItem;