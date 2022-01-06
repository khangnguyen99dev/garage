import React from "react";
import PropTypes from "prop-types";
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { Formik, Form, FastField } from "formik";
import InputField from "@/custom-fields/InputField";
import CarsModel from "./CarsModel";
import SelectField from "@/custom-fields/SelectField";
import { useDispatch, useSelector } from "react-redux";
import { handleShow, handleSubmit, handleUpdate, handleDelete } from "@/store/actions/CarsActions";
import { FaUserPlus } from "react-icons/fa";
import CustomersModal from "../Customers/CustomersModal";
import * as Yup from "yup";

function CarsModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Cars);

    const { modal, data, id, isShow } = props.show;

    const initialValues =
        parseInt(id) > 0 && modal == "edit_car" ? data : modal == "delete" ? { id: id } : CarsModel;

    const validateSchema = Yup.object().shape({
        number_car: Yup.string().required("Vui lòng nhập tên hãng xe!"),
        province: Yup.string().required("Vui lòng nhập tỉnh thành!"),
        car_brand_id: Yup.number().required("Vui lòng chọn hãng xe!"),
        customer_id: Yup.number().required("Vui lòng chọn khách hàng!"),
    });

    if (modal == "edit_car" || modal == "add_car") {
        return (
            <Modal isOpen={isShow} size="lg">
                <ModalHeader>{modal == "add_car" ? "Thêm xe" : "Cập nhật xe"}</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={
                        modal == "add_car"
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
                                    <Row>
                                        <Col md={6}>
                                            <FastField
                                                name="number_car"
                                                component={InputField}
                                                label="Biển số xe"
                                                placeholder="Nhập biển số xe..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FastField
                                                name="made_year"
                                                component={InputField}
                                                label="Năm sản xuất"
                                                placeholder="Nhập năm sản xuất xe ..."
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FastField
                                                name="frame_number"
                                                component={InputField}
                                                label="Số khung"
                                                placeholder="Nhập số khung xe..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FastField
                                                name="machine_number"
                                                component={InputField}
                                                label="Số máy"
                                                placeholder="Nhập số máy xe ..."
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FastField
                                                name="color"
                                                component={InputField}
                                                label="Màu sắc"
                                                placeholder="Nhập màu sắc xe..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FastField
                                                name="province"
                                                component={InputField}
                                                label="Tỉnh thành"
                                                placeholder="Nhập tỉnh thành xe ..."
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FastField
                                                name="car_brand_id"
                                                component={SelectField}
                                                label="Hãng xe"
                                                placeholder="Chọn hãng xe"
                                                id="car-brands:id,name"
                                                data={initialValues.car_brands}
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <Row>
                                                <Col xl={10} lg={10} md={10}>
                                                    <FastField
                                                        name="customer_id"
                                                        component={SelectField}
                                                        label="Khách hàng"
                                                        placeholder="Chọn khách hàng"
                                                        id="customers:id,name"
                                                        data={initialValues.customers}
                                                    />
                                                </Col>
                                                <Col xl={2} lg={2} md={2}>
                                                    <div width="100%">
                                                        <label>&nbsp;</label>
                                                    </div>
                                                    <Button
                                                        className="btn-md"
                                                        data-modal="add_customer"
                                                        onClick={(e) => dispatchs(handleShow(e))}
                                                    >
                                                        <FaUserPlus />
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <FastField
                                            name="description"
                                            component={InputField}
                                            type="textarea"
                                            label="Mô tả"
                                            placeholder="Nhập mô tả xe..."
                                        />
                                    </Row>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        {modal == "add_car" ? "Thêm mới" : "Cập nhật"}
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
                <CustomersModal />
            </Modal>
        );
    } else if (modal == "delete") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Xóa xe</ModalHeader>
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

CarsModal.propTypes = {
    modal: PropTypes.bool,
};

CarsModal.defaultProps = {
    modal: false,
};

export default CarsModal;
