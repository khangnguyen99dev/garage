import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Formik, Form, FastField } from "formik";
import RolesModel from "./RolesModel";
import InputField from "@/custom-fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import { handleShow, handleSubmit, handleUpdate, handleDelete } from "@/store/actions/RolesAction";
import * as Yup from "yup";

function RolesModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Roles);

    const { modal, data, id, isShow } = props.show;

    const initialValues = modal == "edit_role" ? data : modal == "delete" ? { id: id } : RolesModel;

    const validateSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng nhập tên quyền"),
    });

    if (modal == "edit_role" || modal == "add_role") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>{modal == "add_role" ? "Thêm quyền" : "Cập nhật quyền"}</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={
                        modal == "add_role"
                            ? (value, e) => {
                                  dispatchs(handleSubmit(value, e));
                              }
                            : (value, e) => {
                                  dispatchs(handleUpdate(value, e));
                              }
                    }
                >
                    {(formikProps) => {
                        const { values, errors, touched } = formikProps;
                        return (
                            <Form>
                                <ModalBody>
                                    <FastField
                                        name="name"
                                        component={InputField}
                                        label="Tên quyền"
                                        placeholder="Nhập tên quyền ..."
                                    />
                                    <FastField
                                        name="description"
                                        component={InputField}
                                        label="Mô tả"
                                        placeholder="Nhập mô tả quyền ..."
                                    />
                                </ModalBody>

                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        {modal == "add_role" ? "Thêm mới" : "Cập nhật"}
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
    } else if (modal == "delete") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Xóa quyền</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(value) => {
                        dispatchs(handleDelete(value));
                    }}
                >
                    {(formikProps) => {
                        const { values, errors, touched } = formikProps;
                        return (
                            <Form>
                                <ModalBody>Bạn có thực sự muốn xóa?</ModalBody>
                                <ModalFooter>
                                    <Button color="danger" type="submit" name="id">
                                        Xóa
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

RolesModal.propTypes = {
    modal: PropTypes.bool,
};

RolesModal.defaultProps = {
    modal: false,
};

export default RolesModal;
