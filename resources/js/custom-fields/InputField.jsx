import { ErrorMessage } from "formik";
import PropTypes from "prop-types";
import React from "react";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";

InputField.propTypes = {
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

InputField.defaultProps = {
    type: "text",
    label: "",
    placeholder: "",
    disabled: false,
    require: false,
    readonly: false,
    styles: {},
};

function InputField(props) {
    const { field, form, type, label, placeholder, disabled, readonly, require, styles } = props;
    const { name, value } = field;
    const { errors, touched } = form;
    const showError = errors[name] && touched[name];

    return (
        <FormGroup>
            {label && <Label for={name}>{label}</Label>}

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
                style={styles}
            />
            <ErrorMessage name={name} component={FormFeedback} />
        </FormGroup>
    );
}

export default InputField;
