import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Formik, Form, FastField } from "formik";
import MenusModel from "./MenusModel";
import InputField from "@/custom-fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import { handleShow, handleSubmit, handleUpdate, handleDelete } from "@/store/actions/MenusAction";
import * as Yup from "yup";

function MenusModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Menus);

    const { modal, data, id, isShow } = props.show;

    const initialValues =
        parseInt(id) > 0 && modal == "edit_menu"
            ? data
            : modal == "delete"
            ? { id: id }
            : MenusModel;

    const validateSchema = Yup.object().shape({
        label: Yup.string().required("Vui lòng nhập nhãn!"),
        link: Yup.string().required("Vui lòng nhập liên kết!"),
        sort: Yup.number().required("Vui lòng nhập số thứ tự!"),
    });

    if (modal == "edit_menu" || modal == "add_menu") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>
                    {modal == "add_menu" ? "Thêm chức năng" : "Cập nhật chức năng"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={
                        modal == "add_menu"
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
                                        name="label"
                                        component={InputField}
                                        label="Nhãn"
                                        placeholder="Nhập nhãn ..."
                                    />
                                    <FastField
                                        name="link"
                                        component={InputField}
                                        label="Liên kết"
                                        placeholder="Nhập liên kết ..."
                                    />
                                    <FastField
                                        name="description"
                                        component={InputField}
                                        type="textarea"
                                        label="Mô tả"
                                        placeholder="Nhập mô tả chức năng ..."
                                    />
                                    <FastField
                                        name="icon"
                                        component={InputField}
                                        label="Biểu tượng"
                                        placeholder="Nhập biểu tượng..."
                                    />
                                    <FastField
                                        name="sort"
                                        component={InputField}
                                        type="number"
                                        label="Thứ tự"
                                        placeholder="Nhập số thứ tự ..."
                                    />
                                </ModalBody>

                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        {modal == "add_menu" ? "Thêm mới" : "Cập nhật"}
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
                <ModalHeader>Xóa chức năng</ModalHeader>
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

MenusModal.propTypes = {
    modal: PropTypes.bool,
};

MenusModal.defaultProps = {
    modal: false,
};

export default MenusModal;
