import ServiceCrud from "@/services/ServiceCrud";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
// import AsyncSelect from 'react-select/async';
import Select from "react-select";
import { FormFeedback, FormGroup, Label } from "reactstrap";
// import queryString from 'query-string';
import { hanldeBidding } from "@/store/actions";
import { handleInputChange } from "@/store/actions";
import { ErrorMessage } from "formik";

SelectField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    action: PropTypes.string,
    require: PropTypes.bool,
};

SelectField.defaultProps = {
    label: "",
    placeholder: "",
    disabled: false,
    action: "",
    require: false,
};

function SelectField(props) {
    const dispatchs = useDispatch();

    const {
        field,
        form,
        label,
        placeholder,
        disabled,
        id,
        data,
        action,
        bidding,
        require,
        isMulti,
    } = props;

    const { name, value } = field;
    // const timeOutRef = useRef(null);
    const [api, setApi] = useStateCallback("");

    const { errors, touched } = form;
    const showError = errors[name] && touched[name];

    const [fields, setFields] = useState([]);

    const [options, setOptions] = useState([]);

    const selectedOption = options.find((option) => option.value === value);

    // const [search, setSearch] = useStateCallback({
    //     params: {
    //         search: '',
    //         fieldsearch: '',
    //     }
    // });

    const handleSelectedOptionChange = (selectedOption) => {
        const selectedValue = selectedOption ? selectedOption.value : selectedOption;

        const changeEvent = {
            target: {
                name: name,
                value: selectedValue,
            },
        };
        field.onChange(changeEvent);

        if (bidding) {
            dispatchs(hanldeBidding(api, selectedValue, bidding));
        }

        if (action) {
            dispatchs(handleInputChange(name, selectedValue, action));
        }
    };

    // const loadOptions = (value, callback) => {
    //     if (timeOutRef.current) {
    //         clearTimeout(timeOutRef.current);
    //     }

    //     timeOutRef.current = setTimeout(() => {
    //         setSearch(preState => ({
    //             ...preState,
    //             params: { ...preState.params, search: value },
    //         }), search => {
    //             ServiceCrud.instance.getAll(api, queryString.stringify(search.params),)
    //                 .then(response => {
    //                     const { data } = response.data;
    //                     let arr = [];
    //                     data.map((value) => {
    //                         arr.push({
    //                             value: value.id,
    //                             label: value.name
    //                         })
    //                     })
    //                     callback(arr)
    //                 })
    //                 .catch((error) => {
    //                     console.log('Error: ' + error);
    //                 });
    //         });
    //     }, 800);
    // }

    function useStateCallback(initialState) {
        const [state, setState] = useState(initialState);
        const cbRef = useRef(null);

        const setStateCallback = useCallback((state, cb) => {
            cbRef.current = cb;
            setState(state);
        }, []);

        useEffect(() => {
            if (cbRef.current) {
                cbRef.current(state);
                cbRef.current = null;
            }
        }, [state]);

        return [state, setStateCallback];
    }

    const dataOptions = (api) => {
        ServiceCrud.instance
            .getAll(api)
            .then((response) => {
                const { data } = response;
                return data;
            })
            .then((data) => {
                let arr = [];
                data.map((value) => {
                    arr.push({
                        value: value[fields[0]],
                        label: value[fields[1]],
                    });
                });
                setOptions(arr);
            })
            .catch((error) => {
                console.log("Error: " + error);
            });
    };

    const onFocus = (e) => {
        let str = e.target.id.split(":");

        const model = str[0];

        const fields = str[1].split(",");

        setFields(fields);

        if (api) {
            dataOptions(api);
        } else {
            setApi(model, (api) => {
                ServiceCrud.instance
                    .getAll(api)
                    .then((response) => {
                        const { data } = response;
                        return data;
                    })
                    .then((data) => {
                        let arr = [];
                        data.map((value) => {
                            arr.push({
                                value: value[fields[0]],
                                label: value[fields[1]],
                            });
                        });
                        setOptions(arr);
                    })
                    .catch((error) => {
                        console.log("Error: " + error);
                    });
            });
        }
    };

    let str = "";
    if (id) {
        str = id.split(":")[1].split(",");
    }

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
                value={
                    selectedOption
                        ? selectedOption
                        : data &&
                          typeof data !== "undefined" &&
                          Object.keys(data).length > 0 &&
                          data[str[0]]
                        ? { value: data[str[0]], label: data[str[1]] }
                        : ""
                }
                onChange={handleSelectedOptionChange}
                onFocus={onFocus}
                placeholder={placeholder}
                options={options}
                isDisabled={disabled}
                inputId={id}
                required={require}
                isMulti={isMulti}
                className={showError ? "is-invalid" : ""}
                styles={showError ? customStyles : ""}
                // loadOptions={loadOptions}
            />

            <ErrorMessage name={name} component={FormFeedback} />
        </FormGroup>
    );
}

export default SelectField;
