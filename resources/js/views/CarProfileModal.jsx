import React from "react";
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { FastField, Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
    handleShow,
    handleSubmitCar,
    handleUpdateCar,
    handleDeleteCar,
} from "@/store/actions/ClientsAction";
import InputField from "@/custom-fields/InputField";
import SelectField from "@/custom-fields/SelectField";

function CarProfileModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Clients);

    const { modal, data, id, isShow } = props.show;

    const initialValues =
        parseInt(id) > 0 && modal == "edit_car"
            ? data
            : modal == "delete_car"
            ? { id: id }
            : {
                  number_car: "",
                  car_brand_id: "",
                  made_year: "",
                  frame_number: "",
                  color: "",
                  machine_number: "",
                  province: "",
                  description: "",
              };

    const validateCarSchema = Yup.object().shape({
        number_car: Yup.string().required("Vui lòng nhập tên hãng xe!"),
        province: Yup.string().required("Vui lòng nhập tỉnh thành!"),
        car_brand_id: Yup.number().required("Vui lòng chọn hãng xe!"),
    });

    if (modal == "add_car" || modal == "edit_car") {
        return (
            <Modal isOpen={isShow} size="lg">
                <ModalHeader>{modal == "add_car" ? "Thêm xe" : "Cập nhật xe"}</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateCarSchema}
                    onSubmit={
                        modal == "add_car"
                            ? (value, e) => {
                                  dispatchs(handleSubmitCar(value, e));
                              }
                            : (value, e) => {
                                  dispatchs(handleUpdateCar(value, e));
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
                                                id="car-brand-clients:id,name"
                                                data={initialValues.car_brands}
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FastField
                                                name="description"
                                                component={InputField}
                                                // type="textarea"
                                                label="Mô tả"
                                                placeholder="Nhập mô tả xe..."
                                            />
                                        </Col>
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
            </Modal>
        );
    } else if (modal == "delete_car") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Xóa xe</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(value) => {
                        dispatchs(handleDeleteCar(value));
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

export default CarProfileModal;
