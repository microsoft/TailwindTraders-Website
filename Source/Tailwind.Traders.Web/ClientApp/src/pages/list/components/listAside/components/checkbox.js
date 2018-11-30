import React from "react";

import PropTypes from "prop-types";

const Checkbox = ({ type = "checkbox", name, checked = false, onChange, code }) => (
    <input type={type} name={name} checked={checked} onChange={onChange} id={code} />
);

Checkbox.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    id: PropTypes.string,
};

export default Checkbox;
