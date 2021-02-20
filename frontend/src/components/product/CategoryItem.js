import React from "react";
import {CATEGORY_URL} from "../../urls/navigation";


class CategoryItem extends React.Component {
    render () {
        return (
            <div>
                Category: <a href={`${CATEGORY_URL}/${this.props.id}`} >{this.props.name}</a>
            </div>
        )
    }
}

export default CategoryItem;