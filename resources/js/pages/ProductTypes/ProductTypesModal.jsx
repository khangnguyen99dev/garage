import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Formik, Form, FastField } from "formik";
import InputField from "@/custom-fields/InputField";
import ProductTypesModel from "./ProductTypesModel";
import { useDispatch, useSelector } from "react-redux";
import {
    handleShow,
    handleSubmit,
    handleUpdate,
    handleDelete,
} from "@/store/actions/ProductTypesAction";
import SelectFields from "@/custom-fields/SelectFields";
import { DATA_OPTION } from "@/utils/constants";
import SelectField from "@/custom-fields/SelectField";
import * as Yup from "yup";

function ProductTypesModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.ProductTypes);

    const { modal, data, id, isShow } = props.show;

    const initialValues =
        parseInt(id) > 0 && modal == "edit_productType"
            ? data
            : modal == "delete"
            ? { id: id }
            : ProductTypesModel;

    const validateSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng nhập tên loại phụ tùng!"),
        category_id: Yup.number().required("Vui lòng chọn danh mục phụ tùng!"),
    });

    if (modal == "edit_productType" || modal == "add_productType") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>
                    {modal == "add_productType" ? "Thêm loại phụ tùng" : "Cập nhật loại phụ tùng"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={
                        modal == "add_productType"
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
                                        label="Tên loại phụ tùng"
                                        placeholder="Nhập tên loại phụ tùng ..."
                                    />
                                    <FastField
                                        name="description"
                                        component={InputField}
                                        type="textarea"
                                        label="Mô tả"
                                        placeholder="Nhập mô tả loại phụ tùng ..."
                                    />
                                    <FastField
                                        name="category_id"
                                        component={SelectField}
                                        label="Danh mục phụ tùng"
                                        placeholder="Danh mục phụ tùng"
                                        id="categories:id,name"
                                        data={initialValues.categories}
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
                                        {modal == "add_productType" ? "Thêm mới" : "Cập nhật"}
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
                <ModalHeader>Xóa loại phụ tùng</ModalHeader>
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

ProductTypesModal.propTypes = {
    modal: PropTypes.bool,
};

ProductTypesModal.defaultProps = {
    modal: false,
};

export default ProductTypesModal;
