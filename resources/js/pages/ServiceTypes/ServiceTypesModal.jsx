import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Formik, Form, FastField } from "formik";
import InputField from "@/custom-fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import {
    handleShow,
    handleSubmit,
    handleUpdate,
    handleDelete,
} from "@/store/actions/ServiceTypesAction";
import ServiceTypesModel from "./ServiceTypesModel";
import SelectFields from "@/custom-fields/SelectFields";
import { DATA_OPTION } from "@/utils/constants";
import * as Yup from "yup";

function ServiceTypesModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.ServiceTypes);

    const { modal, data, id, isShow } = props.show;

    const initialValues =
        parseInt(id) > 0 && modal == "edit_service_type"
            ? data
            : modal == "delete"
            ? { id: id }
            : ServiceTypesModel;

    const validateSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng nhập tên loại dịch vụ!"),
    });

    if (modal == "edit_service_type" || modal == "add_service_type") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>
                    {modal == "add_service_type" ? "Thêm loại dịch vụ" : "Cập nhật loại dịch vụ"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={
                        modal == "add_service_type"
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
                                        label="Tên loại dịch vụ"
                                        placeholder="Nhập tên loại dịch vụ ..."
                                    />
                                    <FastField
                                        name="description"
                                        component={InputField}
                                        type="textarea"
                                        label="Mô tả"
                                        placeholder="Nhập mô tả loại dịch vụ ..."
                                    />
                                    <FastField
                                        name="status"
                                        component={SelectFields}
                                        label="Trạng thái"
                                        placeholder="Chọn trạng thái!"
                                        options={DATA_OPTION}
                                    />
                                </ModalBody>

                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        {modal == "add_service_type" ? "Thêm mới" : "Cập nhật"}
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
                <ModalHeader>Xóa loại dịch vụ</ModalHeader>
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

ServiceTypesModal.propTypes = {
    modal: PropTypes.bool,
};

ServiceTypesModal.defaultProps = {
    modal: false,
};

export default ServiceTypesModal;
