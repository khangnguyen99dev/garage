import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Formik, Form, FastField } from "formik";
import InputField from "@/custom-fields/InputField";
import ServicesModel from "./ServicesModel";
import { useDispatch, useSelector } from "react-redux";
import {
    handleShow,
    handleSubmit,
    handleUpdate,
    handleDelete,
    handleAddRepairService,
    handleDeleteRepairService,
    handleEditRepairService,
} from "@/store/actions/ServicesAction";
import SelectFields from "@/custom-fields/SelectFields";
import { DATA_OPTION } from "@/utils/constants";
import RepairServicesModel from "./RepairServicesModel";
import SelectField from "@/custom-fields/SelectField";
import NumberFormatInput from "@/custom-fields/NumberFormat";
import * as Yup from "yup";
import FileField from "@/custom-fields/FileField";
import { CKEditor } from "ckeditor4-react";

function ServicesModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Services);

    const { modal, data, id, isShow, selectedFiles } = props.show;

    const initialValues =
        parseInt(id) > 0 && modal == "edit_service"
            ? data
            : modal == "delete" || modal == "delete_repair_service"
            ? { id: id }
            : modal == "add_repair_service" && data !== undefined
            ? data
            : modal == "add_repair_service"
            ? RepairServicesModel
            : modal == "edit_repair_service"
            ? data
            : ServicesModel;

    const validateSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng nhập tên dịch vụ!"),
        price: Yup.number()
            .moreThan(0, "Giá dịch vụ phải là số dương!")
            .required("Vui lòng nhập giá!"),
        service_type_id: Yup.number().required("Vui lòng chọn loại dịch vụ!"),
    });

    const validateServiceSchema = Yup.object().shape({
        id: Yup.number().required("Vui lòng chọn dịch vụ!"),
        price: Yup.number()
            .moreThan(0, "Giá dịch vụ phải là số dương!")
            .required("Vui lòng nhập giá!"),
    });

    const renderPhotos = (photo) => {
        return <img className="p-2 image_show" src={photo[0]} alt="" key={photo[0]} />;
    };

    if (modal == "edit_service" || modal == "add_service") {
        return (
            <Modal isOpen={isShow} size="xl">
                <ModalHeader>
                    {modal == "add_service" ? "Thêm dịch vụ" : "Cập nhật dịch vụ"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={
                        modal == "add_service"
                            ? (value, e) => {
                                  dispatchs(handleSubmit(value, e));
                              }
                            : (value, e) => {
                                  dispatchs(handleUpdate(value, e));
                              }
                    }
                >
                    {(formikProps) => {
                        const { values, setFieldValue } = formikProps;
                        return (
                            <Form>
                                <ModalBody>
                                    <FastField
                                        name="name"
                                        component={InputField}
                                        label="Tên dịch vụ"
                                        placeholder="Nhập tên dịch vụ ..."
                                    />
                                    <FastField
                                        name="price"
                                        component={NumberFormatInput}
                                        type="number"
                                        label="Giá dịch vụ"
                                        placeholder="Nhập Giá dịch vụ ..."
                                        data={initialValues.cars}
                                    />
                                    <FastField
                                        name="image"
                                        component={FileField}
                                        type="file"
                                        label="Ảnh dịch vụ"
                                        placeholder="Chọn ảnh ..."
                                        action="IMAGE_CHANGE_SERVICES"
                                        data={selectedFiles}
                                    />
                                    {renderPhotos(selectedFiles)}
                                    <FastField
                                        name="service_type_id"
                                        component={SelectField}
                                        label="Loại dịch vụ"
                                        placeholder="Chọn loại dịch vụ"
                                        id="service-types:id,name"
                                        data={initialValues.service_types}
                                    />
                                    <FastField
                                        name="description"
                                        component={InputField}
                                        type="textarea"
                                        label="Mô tả"
                                        placeholder="Nhập mô tả dịch vụ ..."
                                    />
                                    <CKEditor
                                        name="content"
                                        initData={values.content || <p>Nội dung dịch vụ</p>}
                                        onChange={(e) =>
                                            setFieldValue("content", e.editor.getData())
                                        }
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
                                        {modal == "add_service" ? "Thêm mới" : "Cập nhật"}
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
    } else if (modal == "add_repair_service" || modal == "edit_repair_service") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>
                    {modal == "add_repair_service"
                        ? "Thêm dịch vụ sửa chữa"
                        : "Chỉnh sữa dịch vụ sửa chữa"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateServiceSchema}
                    enableReinitialize={true}
                    onSubmit={
                        modal == "add_repair_service"
                            ? (value) => {
                                  dispatchs(handleAddRepairService(value));
                              }
                            : (value) => {
                                  dispatchs(handleEditRepairService(value));
                              }
                    }
                >
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <FastField
                                        name="id"
                                        component={SelectField}
                                        label="Dịch vụ"
                                        placeholder="Dịch vụ ..."
                                        id="services:id,name"
                                        bidding="BIDDING_SERVICES"
                                        data={initialValues}
                                    />
                                    <FastField
                                        name="price"
                                        component={NumberFormatInput}
                                        type="number"
                                        label="Giá dịch vụ"
                                        placeholder="Giá dịch vụ ..."
                                    />
                                    <FastField
                                        name="note"
                                        component={InputField}
                                        type="textarea"
                                        label="Ghi chú"
                                        placeholder="Ghi chú ..."
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" type="submit" name="index">
                                        {modal == "add_repair_service" ? "Thêm mới" : "Cập nhật"}
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
    } else if (modal == "delete" || modal == "delete_repair_service") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>
                    {modal == "delete" ? "Xóa dịch vụ" : "Xoá dịch vụ sửa chữa"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    onSubmit={
                        modal == "delete"
                            ? (value) => {
                                  dispatchs(handleDelete(value));
                              }
                            : (value) => {
                                  dispatchs(handleDeleteRepairService(value));
                              }
                    }
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

ServicesModal.propTypes = {
    modal: PropTypes.bool,
};

ServicesModal.defaultProps = {
    modal: false,
};

export default ServicesModal;
