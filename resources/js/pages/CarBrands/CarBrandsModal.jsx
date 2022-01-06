import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Formik, Form, FastField } from "formik";
import InputField from "@/custom-fields/InputField";
import CarBrandsModel from "./CarBrandsModel";
import { DATA_OPTION } from "@/utils/constants";
import SelectFields from "@/custom-fields/SelectFields";
import { useDispatch, useSelector } from "react-redux";
import {
    handleShow,
    handleSubmit,
    handleUpdate,
    handleDelete,
} from "@/store/actions/CarBrandsAction";
import * as Yup from "yup";

function CarBrands() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.CarBrands);

    const { modal, data, id, isShow } = props.show;

    const initialValues =
        parseInt(id) > 0 && modal == "edit_carBrand"
            ? data
            : modal == "delete"
            ? { id: id }
            : CarBrandsModel;

    const validateSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng nhập tên hãng xe!"),
        status: Yup.string().required("Vui lòng chọn trạng thái!"),
    });

    if (modal == "edit_carBrand" || modal == "add_carBrand") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>
                    {modal == "add_carBrand" ? "Thêm hãng xe" : "Cập nhật hãng xe"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={
                        modal == "add_carBrand"
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
                                        label="Tên hãng xe"
                                        placeholder="Nhập tên hãng xe ..."
                                    />
                                    <FastField
                                        name="description"
                                        component={InputField}
                                        type="textarea"
                                        label="Mô tả"
                                        placeholder="Nhập mô tả hãng xe ..."
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
                                        {modal == "add_carBrand" ? "Thêm mới" : "Cập nhật"}
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
                <ModalHeader>Xóa hãng xe</ModalHeader>
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

CarBrands.propTypes = {
    modal: PropTypes.bool,
};

CarBrands.defaultProps = {
    modal: false,
};

export default CarBrands;
