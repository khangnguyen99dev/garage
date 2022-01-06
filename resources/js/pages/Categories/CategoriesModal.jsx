import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Formik, Form, FastField } from "formik";
import CategoriesModel from "./CategoriesModel";
import InputField from "@/custom-fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import {
    handleShow,
    handleSubmit,
    handleUpdate,
    handleDelete,
} from "@/store/actions/CategoriesAction";
import * as Yup from "yup";

function CategoriesModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Categories);

    const { modal, data, id, isShow } = props.show;

    const initialValues =
        parseInt(id) > 0 && modal == "edit_category"
            ? data
            : modal == "delete"
            ? { id: id }
            : CategoriesModel;

    const validateSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng nhập tên danh mục!"),
    });

    if (modal == "edit_category" || modal == "add_category") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>
                    {modal == "add_category"
                        ? "Thêm danh mục phụ tùng"
                        : "Cập nhật danh mục phụ tùng"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={
                        modal == "add_category"
                            ? (value, e) => {
                                  dispatchs(handleSubmit(value, e));
                              }
                            : (value, e) => {
                                  dispatchs(handleUpdate(value, e));
                              }
                    }
                >
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <FastField
                                        name="name"
                                        component={InputField}
                                        label="Tên danh mục phụ tùng"
                                        placeholder="Nhập tên danh mục phụ tùng ..."
                                    />
                                    <FastField
                                        name="description"
                                        component={InputField}
                                        type="textarea"
                                        label="Mô tả"
                                        placeholder="Nhập mô tả danh mục phụ tùng ..."
                                    />
                                </ModalBody>

                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        {modal == "add_category" ? "Thêm mới" : "Cập nhật"}
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
                <ModalHeader>Xóa danh mục phụ tùng</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(value) => {
                        dispatchs(handleDelete(value));
                    }}
                >
                    {(formikProps) => {
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

CategoriesModal.propTypes = {
    modal: PropTypes.bool,
};

CategoriesModal.defaultProps = {
    modal: false,
};

export default CategoriesModal;
