import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { handleInputChange } from "@/store/actions";
import { ErrorMessage } from "formik";

InputFields.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    action: PropTypes.string,
};

InputFields.defaultProps = {
    type: "text",
    label: "",
    placeholder: "",
    disabled: false,
    require: false,
    readonly: false,
    action: "",
};

function InputFields(props) {
    const dispatchs = useDispatch();
    const { field, form, type, label, placeholder, disabled, readonly, action } = props;
    const { name, value } = field;

    const { errors, touched } = form;
    const showError = errors[name] && touched[name];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (action) {
            dispatchs(handleInputChange(name, value, action));
        }
    };

    return (
        <FormGroup>
            {label && <Label for={name}>{label}</Label>}

            <Input
                id={name}
                {...field}
                onChange={handleChange}
                value={value || ""}
                type={type}
                disabled={disabled}
                placeholder={placeholder}
                readOnly={readonly}
                invalid={showError}
            />

            <ErrorMessage name={name} component={FormFeedback} />
        </FormGroup>
    );
}

export default InputFields;
