import { ErrorMessage } from "formik";
import PropTypes from "prop-types";
import React from "react";
import { FormFeedback, Input } from "reactstrap";

InputGroups.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    require: PropTypes.bool,
    styles: PropTypes.object,
};

InputGroups.defaultProps = {
    type: "text",
    label: "",
    placeholder: "",
    disabled: false,
    require: false,
    readonly: false,
    styles: {},
};

function InputGroups(props) {
    const { field, form, type, placeholder, disabled, readonly, require } = props;
    const { name, value } = field;
    const { errors, touched } = form;
    const showError = errors[name] && touched[name];

    return (
        <>
            <Input
                id={name}
                {...field}
                value={value || ""}
                type={type}
                disabled={disabled}
                placeholder={placeholder}
                readOnly={readonly}
                required={require}
                invalid={showError}
                // style={styles}
            />
            <ErrorMessage name={name} component={FormFeedback} />
        </>
    );
}

export default InputGroups;
