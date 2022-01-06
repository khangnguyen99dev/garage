import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Formik, Form, FieldArray } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { handleShow, handleSubmit, handleSetCheck } from "@/store/actions/CustomRolesAction";

function CustomRolesModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.CustomRoles);

    const { modal, data, id, isShow, roles } = props.show;

    const initialValues =
        modal == "edit_custom_role"
            ? { roles: roles, id: id }
            : modal == "delete"
            ? { id: id }
            : { roles: roles };

    const handleCheck = (e) => {
        dispatchs(handleSetCheck(e.target.checked));
    };

    if (modal == "edit_custom_role" || modal == "add_custom_role") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Danh sách chức năng</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    onSubmit={(value, e) => {
                        dispatchs(handleSubmit(value, e));
                    }}
                >
                    {(formikProps) => {
                        const { values } = formikProps;
                        return (
                            <Form>
                                <ModalBody>
                                    <FieldArray
                                        name="roles"
                                        render={(formik) => (
                                            <div>
                                                <label>
                                                    <input
                                                        name="roles"
                                                        type="checkbox"
                                                        onChange={(e) => handleCheck(e)}
                                                    />{" "}
                                                    Tất cả
                                                </label>
                                                {data.map((option) => (
                                                    <div key={option.id}>
                                                        <label>
                                                            <input
                                                                name="roles"
                                                                type="checkbox"
                                                                value={option.id}
                                                                checked={values.roles.includes(
                                                                    option.id
                                                                )}
                                                                onChange={(e) => {
                                                                    if (e.target.checked)
                                                                        formik.push(option.id);
                                                                    else {
                                                                        const idx =
                                                                            values.roles.indexOf(
                                                                                option.id
                                                                            );
                                                                        formik.remove(idx);
                                                                    }
                                                                }}
                                                            />{" "}
                                                            {option.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    />
                                </ModalBody>

                                <ModalFooter>
                                    <Button color="success" type="submit" name="id">
                                        Xác nhận
                                    </Button>{" "}
                                    <Button
                                        color="secondary"
                                        type="button"
                                        onClick={(e) => {
                                            dispatchs(handleShow(e));
                                        }}
                                    >
                                        Đóng
                                    </Button>
                                </ModalFooter>
                            </Form>
                        );
                    }}
                </Formik>
            </Modal>
        );
    } else {
        return <div></div>;
    }
}

CustomRolesModal.propTypes = {
    modal: PropTypes.bool,
};

CustomRolesModal.defaultProps = {
    modal: false,
};

export default CustomRolesModal;
