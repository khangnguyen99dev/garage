import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { FormGroup, Input, Label } from "reactstrap";
import { handleImageChange } from "@/store/actions";

FileField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    multiple: PropTypes.bool,
};

FileField.defaultProps = {
    type: "text",
    label: "",
    placeholder: "",
    disabled: false,
    require: false,
    readonly: false,
    multiple: false,
};

function FileField(props) {
    const dispatchs = useDispatch();
    const { field, form, type, label, placeholder, disabled, readonly, action, multiple, data } =
        props;

    const { name, value } = field;

    const { setFieldValue } = form;

    const FileChange = (e) => {
        const files = e.target.files;
        if (files) {
            const filesArray = Array.from(files).map((file) => URL.createObjectURL(file));
            if (multiple) {
                dispatchs(handleImageChange(data.concat(filesArray), action));
            } else {
                dispatchs(handleImageChange(filesArray, action));
                setFieldValue(name, files[0]);
            }
            Array.from(files).map((file) => URL.revokeObjectURL(file));
        }
    };

    return (
        <FormGroup>
            {label && <Label for={name}>{label}</Label>}

            <Input
                id={name}
                {...field}
                onChange={FileChange}
                value={undefined}
                type={type}
                disabled={disabled}
                placeholder={placeholder}
                readOnly={readonly}
                multiple={multiple}
            />
        </FormGroup>
    );
}

export default FileField;
