import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Formik, Form, FastField } from "formik";
import InputField from "@/custom-fields/InputField";
import CustomerTypesModel from "./CustomerTypesModel";
import { useDispatch, useSelector } from "react-redux";
import {
    handleShow,
    handleSubmit,
    handleUpdate,
    handleDelete,
} from "@/store/actions/CustomerTypesAction";

function CustomerTypesModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.CustomerTypes);

    const { modal, data, id, isShow } = props.show;

    const initialValues =
        parseInt(id) > 0 && modal == "edit_customerType"
            ? data
            : modal == "delete"
            ? { id: id }
            : CustomerTypesModel;

    if (modal == "edit_customerType" || modal == "add_customerType") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>
                    {modal == "add_customerType" ? "Thêm nhóm khách" : "Cập nhật nhóm khách"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    onSubmit={
                        modal == "add_customerType"
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
                                        label="Tên nhóm khách"
                                        placeholder="Nhập tên nhóm khách ..."
                                    />
                                    <FastField
                                        name="description"
                                        component={InputField}
                                        label="Mô tả"
                                        placeholder="Nhập mô tả nhóm khách ..."
                                    />
                                </ModalBody>

                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        {modal == "add_customerType" ? "Thêm mới" : "Cập nhật"}
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
                <ModalHeader>Xóa nhà cung cấp</ModalHeader>
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

CustomerTypesModal.propTypes = {
    modal: PropTypes.bool,
};

CustomerTypesModal.defaultProps = {
    modal: false,
};

export default CustomerTypesModal;
