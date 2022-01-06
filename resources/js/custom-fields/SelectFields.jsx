import { handleInputChange } from "@/store/actions";
import { ErrorMessage } from "formik";
import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { FormFeedback, FormGroup, Label } from "reactstrap";

SelectFields.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    options: PropTypes.array,
};

SelectFields.defaultProps = {
    label: "",
    placeholder: "",
    disabled: false,
    options: [],
};

function SelectFields(props) {
    const dispatchs = useDispatch();
    const { field, form, options, label, placeholder, disabled, action } = props;
    const { name, value } = field;
    const selectedOption = options.find((option) => option.value === value);

    const { errors, touched } = form;
    const showError = errors[name] && touched[name];

    const handleSelectedOptionChange = (selectedOption) => {
        const selectedValue = selectedOption ? selectedOption.value : selectedOption;

        const changeEvent = {
            target: {
                name: name,
                value: selectedValue,
            },
        };
        field.onChange(changeEvent);
        if (action) {
            dispatchs(handleInputChange(name, selectedValue, action));
        }
    };

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: "#dc3545",
        }),
    };

    return (
        <FormGroup>
            {label && <Label for={name}>{label}</Label>}

            <Select
                id={name}
                {...field}
                value={selectedOption}
                onChange={handleSelectedOptionChange}
                placeholder={placeholder}
                isDisabled={disabled}
                options={options}
                className={showError ? "is-invalid" : ""}
                styles={showError ? customStyles : ""}
            />

            <ErrorMessage name={name} component={FormFeedback} />
        </FormGroup>
    );
}

export default SelectFields;
