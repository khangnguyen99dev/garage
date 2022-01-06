import React from "react";
import PropTypes from "prop-types";
import {
    Button,
    Col,
    Container,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
} from "reactstrap";
import { Formik, Form, FastField } from "formik";
import InputField from "@/custom-fields/InputField";
import { BookingsModel } from "./BookingsModel";
import { useDispatch, useSelector } from "react-redux";
import {
    handleShow,
    acceptReceiveVote,
    handleCancelReceiveVote,
} from "@/store/actions/BookingsAction";
import * as Yup from "yup";
import moment from "moment";

function BookingsModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Bookings);

    const { modal, data, isShow, id } = props.show;

    const initialValues =
        modal == "accept_receiveVote"
            ? data
            : modal == "cancel_receiveVote"
            ? { id: id, note: "" }
            : BookingsModel;

    if (modal == "accept_receiveVote") {
        data.receive_date = moment(new Date()).format("YYYY-MM-DDThh:mm");
    }

    const validateSchema =
        modal == "accept_receiveVote"
            ? Yup.object().shape({
                  receive_date: Yup.date()
                      .min(
                          moment(data.receive_date).format("YYYY-MM-DD"),
                          "Ngày tiếp nhận phải lớn hơn hoặc bằng ngày hiện tại!"
                      )
                      .required("Vui lòng chọn ngày tiếp nhận!"),
                  repair_date: Yup.date()
                      .min(
                          moment(data.receive_date).format("YYYY-MM-DD[T]hh:mm"),
                          "Ngày đăng ký phải lớn hơn ngày tiếp nhận!"
                      )
                      .required("Vui lòng chọn ngày yêu cầu!"),
              })
            : Yup.object().shape({
                  note: Yup.string().required("Vui lòng nhập lý do hủy!"),
              });

    if (modal == "accept_receiveVote") {
        return (
            <Modal isOpen={isShow} size="lg">
                <ModalHeader>Duyệt yêu cầu</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={(values) => dispatchs(acceptReceiveVote(values))}
                >
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <Row>
                                        <Col md="6">
                                            <FastField
                                                name="cars.customers.name"
                                                component={InputField}
                                                label="Khách hàng"
                                                placeholder="Chọn khách hàng ..."
                                                readonly={true}
                                            />
                                        </Col>
                                        <Col md="6">
                                            <FastField
                                                name="cars.number_car"
                                                component={InputField}
                                                label="Biển số xe"
                                                placeholder="Biển số xe ..."
                                                readonly={true}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6">
                                            <FastField
                                                name="receive_date"
                                                component={InputField}
                                                label="Ngày tiếp nhận"
                                                placeholder="Chọn ngày tiếp nhận ..."
                                                type="datetime-local"
                                            />
                                        </Col>
                                        <Col md="6">
                                            <FastField
                                                name="repair_date"
                                                component={InputField}
                                                label="Ngày yêu cầu"
                                                placeholder="Ngày yêu cầu ..."
                                                type="datetime-local"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6">
                                            <FastField
                                                name="note"
                                                component={InputField}
                                                label="Ghi chú"
                                                type="textarea"
                                                placeholder="Ghi chú ..."
                                            />
                                        </Col>
                                        <Col md="6">
                                            <FastField
                                                name="car_condition"
                                                component={InputField}
                                                label="Tình trạng xe"
                                                type="textarea"
                                                placeholder="Tình trạng xe ..."
                                                readonly={true}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Container>
                                            <Col md="6" className="ml-2">
                                                <div className="mt-2">
                                                    <FastField
                                                        name="send_sms"
                                                        component={InputField}
                                                        type="checkbox"
                                                    />
                                                </div>

                                                <label htmlFor="send_sms">Gửi tin nhắn</label>
                                            </Col>
                                        </Container>
                                    </Row>
                                </ModalBody>

                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        Xác nhận
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
    } else if (modal == "cancel_receiveVote") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Hủy yêu cầu</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={(values) => dispatchs(handleCancelReceiveVote(values))}
                >
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <FastField
                                        name="note"
                                        component={InputField}
                                        label="Lý do"
                                        type="textarea"
                                        placeholder="Lý do ..."
                                    />
                                    <Row>
                                        <Container>
                                            <Col md="6" className="ml-2">
                                                <div className="mt-2">
                                                    <FastField
                                                        name="send_sms"
                                                        component={InputField}
                                                        type="checkbox"
                                                    />
                                                </div>

                                                <label htmlFor="send_sms">Gửi tin nhắn</label>
                                            </Col>
                                        </Container>
                                    </Row>
                                </ModalBody>

                                <ModalFooter>
                                    <Button color="danger" type="submit">
                                        Hủy yêu cầu
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

BookingsModal.propTypes = {
    modal: PropTypes.bool,
};

BookingsModal.defaultProps = {
    modal: false,
};

export default BookingsModal;
