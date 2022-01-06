import { ErrorMessage } from "formik";
import PropTypes from "prop-types";
import React from "react";
import NumberFormat from "react-number-format";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";
import _isObject from "lodash/isObject";

NumberFormatInput.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    label: PropTypes.string,
    readonly: PropTypes.bool,
};

NumberFormatInput.defaultProps = {
    label: "",
    readonly: false,
};

function NumberFormatInput(props) {
    const { field, form, label, placeholder, readonly } = props;
    const { name, value } = field;
    const { errors, touched, setFieldValue } = form;
    const showError = errors[name] && touched[name];

    return (
        <FormGroup>
            {label && <Label for={name}>{label}</Label>}

            <NumberFormat
                name={name}
                thousandSeparator={true}
                suffix={" vnđ"}
                value={value}
                onValueChange={(val) => setFieldValue(name, val.floatValue)}
                placeholder={placeholder}
                className={showError ? "is-invalid form-control" : "form-control"}
                onBlur={(e) => field.onBlur(e)}
                readOnly={readonly}
            />
            <ErrorMessage name={name} component={FormFeedback} />
        </FormGroup>
    );
}

export default NumberFormatInput;
