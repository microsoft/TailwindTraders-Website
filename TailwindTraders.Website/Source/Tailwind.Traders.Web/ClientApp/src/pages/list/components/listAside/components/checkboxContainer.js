import React, { Component } from "react";

import { NamespacesConsumer } from "react-i18next";

import Checkbox from "./checkbox";

class CheckboxContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedItems: new Map(),
        };
    }

    handleChange = (e, dataType) => {
        const item = e.target.name;
        const isChecked = e.target.checked;
        this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
        this.props.onFilterChecked(e, dataType);
    };

    render() {
        const { data, title } = this.props;
        const dataType = this.props.id;

        return (
            <NamespacesConsumer>
                {t => (
                    <div className="filter">
                        <legend className="filter__title">{title}</legend>
                        {data &&
                            data.map((item, key) => (
                                <div className="filter__item" key={key}>
                                    <Checkbox
                                        name={item.name}
                                        checked={this.state.checkedItems.get(item.name)}
                                        onChange={(e)=>{
                                            this.handleChange(e, dataType)
                                        }}
                                        code={`${item.code || item.id}`}
                                    />
                                    <label className="label" htmlFor={`${item.code || item.id}`}>
                                        {item.name}
                                    </label>
                                </div>
                            ))}
                        <div className="filter__more">{t("list.aside.more")}</div>
                    </div>
                )}
            </NamespacesConsumer>
        );
    }
}

export default CheckboxContainer;
