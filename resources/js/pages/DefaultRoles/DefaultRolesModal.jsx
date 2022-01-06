import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Formik, Form, FieldArray } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
    handleShow,
    handleSubmit,
    handleUpdate,
    handleSetCheck,
} from "@/store/actions/DefaultRolesAction";

function DefaultRolesModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.DefaultRoles);

    const { modal, data, menus, id, isShow } = props.show;

    const initialValues =
        modal == "edit_default_role"
            ? { roles: menus.map((item) => item.menu_id), id: id }
            : modal == "delete"
            ? { id: id }
            : { roles: [], id: id };

    const handleCheck = (e) => {
        dispatchs(handleSetCheck(e.target.checked));
    };

    if (modal == "edit_default_role" || modal == "add_default_role") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Danh sách chức năng</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    onSubmit={
                        modal == "add_default_role"
                            ? (value, e) => {
                                  dispatchs(handleSubmit(value, e));
                              }
                            : (value, e) => {
                                  dispatchs(handleUpdate(value, e));
                              }
                    }
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
                                                        checked={
                                                            JSON.stringify(
                                                                data.map(({ id }) => id)
                                                            ) ==
                                                            JSON.stringify(
                                                                menus.map(({ menu_id }) => menu_id)
                                                            )
                                                        }
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
                                        {modal == "add_default_role" ? "Thêm mới" : "Cập nhật"}
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

DefaultRolesModal.propTypes = {
    modal: PropTypes.bool,
};

DefaultRolesModal.defaultProps = {
    modal: false,
};

export default DefaultRolesModal;
