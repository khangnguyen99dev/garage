import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { Formik, Form, FastField } from "formik";
import InputField from "@/custom-fields/InputField";
import ProductsModel from "./ProductsModel";
import SelectField from "@/custom-fields/SelectField";
import { useDispatch, useSelector } from "react-redux";
import {
    handleShow,
    handleSubmit,
    handleUpdate,
    handleDelete,
    handleAddRepairProduct,
    handleEditRepairProduct,
    handleDeleteRepairProduct,
    handleEditExportProduct,
    handleDeleteExportProduct,
} from "@/store/actions/ProductsAction";
import SelectFields from "@/custom-fields/SelectFields";
import FileField from "@/custom-fields/FileField";
import { DATA_OPTION } from "@/utils/constants";
import RepairProductsModel from "./RepairProductsModel";
import NumberFormatInput from "@/custom-fields/NumberFormat";
import * as Yup from "yup";

function ProductsModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Products);

    const { modal, data, id, isShow, selectedFiles } = props.show;

    const initialValues =
        parseInt(id) > 0 && modal == "edit_product"
            ? data
            : modal == "delete" ||
              modal == "delete_repair_product" ||
              modal == "delete_export_product"
            ? { id: id }
            : modal == "add_repair_product" && data !== undefined
            ? data
            : modal == "add_repair_product"
            ? RepairProductsModel
            : modal == "edit_repair_product" || modal == "edit_export_product"
            ? data
            : ProductsModel;

    const validateEditSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng nhập tên phụ tùng!"),
        product_type_id: Yup.number().required("Vui lòng chọn loại phụ tùng!"),
        quantity: Yup.number().required("Vui lòng nhập số lượng!"),
        import_price: Yup.number()
            .moreThan(0, "Giá nhập phải là số dương!")
            .required("Vui lòng nhập giá nhập!"),
        price: Yup.number()
            .moreThan(0, "Giá bán phải là số dương!")
            .required("Vui lòng nhập giá bán!"),
        unit: Yup.string().required("Vui lòng nhập đơn vị tính!"),
        supplier_id: Yup.number().required("Vui lòng chọn nhà cung cấp!"),
    });

    const validateAddSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng nhập tên phụ tùng!"),
        product_type_id: Yup.number().required("Vui lòng chọn loại phụ tùng!"),
        unit: Yup.string().required("Vui lòng nhập đơn vị tính!"),
    });

    const validateRepairProductSchema = Yup.object().shape({
        id: Yup.string().required("Vui lòng chọn phụ tùng sửa chữa!"),
        qty: Yup.number()
            .moreThan(0, "Số lượng phải là số dương!")
            .max(
                data != undefined && data.quantity ? data.quantity : 100,
                data != undefined && data.quantity
                    ? `Số lượng phải nhỏ hơn ${data.quantity}`
                    : "Số lượng phải nhỏ hơn 100"
            )
            .required("Vui lòng nhập số lượng!"),
        price: Yup.number()
            .moreThan(0, "Giá bán phải là số dương!")
            .required("Vui lòng nhập giá bán!"),
    });

    const renderPhotos = (photo) => {
        return <img className="p-2 image_show" src={photo[0]} alt="" key={photo[0]} />;
    };

    if (modal == "edit_product" || modal == "add_product") {
        return (
            <Modal isOpen={isShow} size="lg">
                <ModalHeader>
                    {modal == "add_product" ? "Thêm phụ tùng" : "Cập nhật phụ tùng"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={
                        modal == "add_product" ? validateAddSchema : validateEditSchema
                    }
                    onSubmit={
                        modal == "add_product"
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
                            <Form encType="multipart/form-data">
                                <ModalBody>
                                    <Row>
                                        <Col md={6}>
                                            <FastField
                                                name="name"
                                                component={InputField}
                                                label="Tên phụ tùng"
                                                placeholder="Nhập tên phụ tùng ..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FastField
                                                name="product_type_id"
                                                component={SelectField}
                                                label="Loại phụ tùng"
                                                placeholder="Chọn loại phụ tùng"
                                                id="product-types:id,name"
                                                data={initialValues.product_types}
                                            />
                                        </Col>

                                        {modal == "edit_product" && (
                                            <Col md={6}>
                                                <FastField
                                                    name="quantity"
                                                    component={InputField}
                                                    type="number"
                                                    label="Số lượng"
                                                    placeholder="Nhập số lượng ..."
                                                />
                                            </Col>
                                        )}
                                        {modal == "edit_product" && (
                                            <Col md={6}>
                                                <FastField
                                                    name="status"
                                                    component={SelectFields}
                                                    label="Trạng thái"
                                                    placeholder="Chọn trạng thái!"
                                                    options={DATA_OPTION}
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                    {modal == "edit_product" && (
                                        <Row>
                                            <Col md={6}>
                                                <FastField
                                                    name="import_price"
                                                    component={NumberFormatInput}
                                                    label="Giá nhập"
                                                    placeholder="Nhập giá nhập vào ..."
                                                />
                                            </Col>
                                            <Col md={6}>
                                                <FastField
                                                    name="price"
                                                    component={NumberFormatInput}
                                                    label="Giá bán"
                                                    placeholder="Nhập giá bán ..."
                                                />
                                            </Col>
                                        </Row>
                                    )}
                                    <Row>
                                        <Col md={6}>
                                            <FastField
                                                name="image"
                                                component={FileField}
                                                type="file"
                                                label="Ảnh phụ tùng"
                                                placeholder="Chọn ảnh ..."
                                                action="IMAGE_CHANGE_PRODUCTS"
                                                data={selectedFiles}
                                            />
                                            {renderPhotos(selectedFiles)}
                                        </Col>
                                        <Col md={6}>
                                            <FastField
                                                name="description"
                                                component={InputField}
                                                type="textarea"
                                                label="Mô tả"
                                                placeholder="Nhập mô tả..."
                                                styles={{ height: "120px" }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FastField
                                                name="unit"
                                                component={InputField}
                                                label="Đơn vị tính"
                                                placeholder="Nhập đơn vị tính..."
                                            />
                                        </Col>
                                        {modal == "edit_product" && (
                                            <Col md={6}>
                                                <FastField
                                                    name="supplier_id"
                                                    component={SelectField}
                                                    label="Nhà cung cấp"
                                                    placeholder="Chọn nhà cung cấp"
                                                    id="suppliers:id,name"
                                                    data={initialValues.suppliers}
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        {modal == "add_product" ? "Thêm mới" : "Cập nhật"}
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
    } else if (
        modal == "add_repair_product" ||
        modal == "edit_repair_product" ||
        modal == "edit_export_product"
    ) {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>
                    {modal == "add_repair_product"
                        ? "Thêm phụ tùng sửa chữa"
                        : "Chỉnh sữa phụ tùng sửa chữa"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateRepairProductSchema}
                    enableReinitialize={true}
                    onSubmit={
                        modal == "add_repair_product"
                            ? (value) => {
                                  dispatchs(handleAddRepairProduct(value));
                              }
                            : modal == "edit_export_product"
                            ? (value) => {
                                  dispatchs(handleEditExportProduct(value));
                              }
                            : (value) => {
                                  dispatchs(handleEditRepairProduct(value));
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
                                        label="Phụ tùng"
                                        placeholder="Chọn phụ tùng sửa chữa ..."
                                        id="products:id,name"
                                        bidding="BIDDING_PRODUCTS"
                                        data={initialValues}
                                    />
                                    <Row>
                                        <Col md={modal == "add_repair_product" ? "6" : "12"}>
                                            <FastField
                                                name="qty"
                                                component={InputField}
                                                type="number"
                                                label="Số lượng"
                                                placeholder="Số lượng ..."
                                            />
                                        </Col>
                                        {modal == "add_repair_product" && (
                                            <Col md="6">
                                                <FastField
                                                    name="quantity"
                                                    component={InputField}
                                                    readonly={true}
                                                    label="SL. Tồn"
                                                    placeholder="SL. Tồn ..."
                                                />
                                            </Col>
                                        )}
                                    </Row>

                                    <FastField
                                        name="price"
                                        component={NumberFormatInput}
                                        label="Giá"
                                        placeholder="Giá ..."
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" type="submit" name="index">
                                        {modal == "add_repair_product" ? "Thêm mới" : "Cập nhật"}
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
    } else if (
        modal == "delete" ||
        modal == "delete_repair_product" ||
        modal == "delete_export_product"
    ) {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>
                    {modal == "delete" ? "Xoá phụ tùng" : "Xóa phụ tùng sửa chữa"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    onSubmit={
                        modal == "delete"
                            ? (value) => {
                                  dispatchs(handleDelete(value));
                              }
                            : modal == "delete_export_product"
                            ? (value) => {
                                  dispatchs(handleDeleteExportProduct(value));
                              }
                            : (value) => {
                                  dispatchs(handleDeleteRepairProduct(value));
                              }
                    }
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

ProductsModal.propTypes = {
    modal: PropTypes.bool,
};

ProductsModal.defaultProps = {
    modal: false,
};

export default ProductsModal;
