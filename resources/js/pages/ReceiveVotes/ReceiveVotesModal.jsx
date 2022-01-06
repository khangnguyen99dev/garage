import React from "react";
import PropTypes from "prop-types";
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { Formik, Form, FastField } from "formik";
import InputField from "@/custom-fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import {
    handleShow,
    handleSubmit,
    handleUpdate,
    handleDelete,
} from "@/store/actions/ReceiveVotesAction";
import ReceiveVotesModel from "./ReceiveVotesModel";
import SelectField from "@/custom-fields/SelectField";
import SelectFields from "@/custom-fields/SelectFields";
import InputFields from "@/custom-fields/InputFields";
import { DATA_RECEIVE_VOTES, DATA_RECEIVE_VOTES_2, DATA_RECEIVE_VOTES_3 } from "@/utils/constants";
import { FaCarSide } from "react-icons/fa";
import * as Yup from "yup";
import moment from "moment";

function ReceiveVotesModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.ReceiveVotes);

    const { modal, data, id, isShow } = props.show;

    const validateSchema = Yup.object().shape({
        number_car_id: Yup.string().required("Vui lòng chọn xe!"),
        receive_date: Yup.date()
            .min(
                moment(new Date()).format("YYYY-MM-DD"),
                "Ngày tiếp nhận phải lớn hơn hoặc bằng ngày hiện tại!"
            )
            .required("Vui lòng chọn ngày tiếp nhận!"),
        status: Yup.string().required("Vui lòng chọn trạng thái!"),
    });

    const validateEditSchema = Yup.object().shape({
        number_car_id: Yup.string().required("Vui lòng chọn xe!"),
        status: Yup.string().required("Vui lòng chọn trạng thái!"),
    });

    if (modal == "add_receiveVote") {
        data.number_car_id = data.number_car_id || "";
        data.receive_date = data.receive_date || moment(new Date()).format("YYYY-MM-DDThh:mm");
        data.status = data.status || "";
        data.car_condition = data.car_condition || "";
        data.km_into = data.km_into || "";
        data.item_in_car = data.item_in_car || "";
        data.note = data.note || "";
        data.require = data.require || "";
    }

    const initialValues =
        (parseInt(id) > 0 && modal == "edit_receiveVote") ||
        modal == "add_price_quote" ||
        modal == "add_receiveVote"
            ? data
            : modal == "delete"
            ? { id: id }
            : ReceiveVotesModel;

    if (modal == "edit_receiveVote" || modal == "add_receiveVote") {
        return (
            <Modal isOpen={isShow} size="xl">
                <ModalHeader>
                    {modal == "add_receiveVote"
                        ? "Xe nhập xưởng"
                        : "Cập nhật thông tin phiếu tiếp nhận"}
                </ModalHeader>
                <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    validationSchema={
                        modal == "add_receiveVote" ? validateSchema : validateEditSchema
                    }
                    onSubmit={
                        modal == "add_receiveVote"
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
                                        <Col xl={6} lg={6} md={12}>
                                            <Row>
                                                <Col xl={10} lg={10} md={10}>
                                                    <FastField
                                                        name="number_car_id"
                                                        component={SelectField}
                                                        label="Xe"
                                                        placeholder="Chọn xe!"
                                                        id="cars:number_car,number_car"
                                                        bidding="BIDDING_RECEIVE_VOTES"
                                                        action="INPUT_CHANGE_RECEIVE_VOTES"
                                                        data={initialValues.cars}
                                                    />
                                                </Col>
                                                <Col xl={2} lg={2} md={2}>
                                                    <div width="100%">
                                                        <label>&nbsp;</label>
                                                    </div>
                                                    <Button
                                                        className="btn-md"
                                                        data-modal="add_car"
                                                        onClick={(e) => dispatchs(handleShow(e))}
                                                    >
                                                        <FaCarSide />
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xl={6} lg={6} md={12}>
                                            <FastField
                                                name="cars.customers.name"
                                                component={InputField}
                                                label="Tên khách hàng"
                                                readonly={true}
                                                placeholder="Tên khách hàng ..."
                                            />
                                        </Col>

                                        <Col xl={6} lg={6} md={12}>
                                            <FastField
                                                name="cars.car_brands.name"
                                                component={InputField}
                                                label="Hãng xe"
                                                readonly={true}
                                                placeholder="Hãng xe ..."
                                            />
                                            <FastField
                                                name="cars.province"
                                                component={InputField}
                                                label="Tỉnh thành"
                                                readonly={true}
                                                placeholder="Tỉnh thành ..."
                                            />
                                            <FastField
                                                name="cars.made_year"
                                                component={InputField}
                                                label="Đời xe"
                                                readonly={true}
                                                placeholder="Đời xe ..."
                                            />
                                        </Col>
                                        <Col xl={6} lg={6} md={12}>
                                            <FastField
                                                name="cars.customers.email"
                                                component={InputField}
                                                label="Email"
                                                readonly={true}
                                                placeholder="Email ..."
                                            />
                                            <FastField
                                                name="cars.customers.phone"
                                                component={InputField}
                                                label="Số điện thoại"
                                                readonly={true}
                                                placeholder="Số điện thoại khách hàng ..."
                                            />
                                            <FastField
                                                name="cars.customers.address"
                                                component={InputField}
                                                label="Địa chỉ"
                                                readonly={true}
                                                placeholder="Địa chỉ khách hàng ..."
                                            />
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xl={6} lg={6} md={12}>
                                            <FastField
                                                name="receive_date"
                                                component={InputFields}
                                                label="Ngày tiếp nhận"
                                                placeholder="Chọn ngày tiếp nhận ..."
                                                type="datetime-local"
                                                action="INPUT_CHANGE_RECEIVE_VOTES"
                                            />
                                            <FastField
                                                name="car_condition"
                                                component={InputFields}
                                                label="Tình trạng xe"
                                                placeholder="Nhập tình trạng xe ..."
                                                action="INPUT_CHANGE_RECEIVE_VOTES"
                                            />
                                            {/* <FastField
                                                name="item_in_car"
                                                component={InputFields}
                                                label="Vật dụng trên xe"
                                                placeholder="Nhập vật dụng trên xe ..."
                                                action="INPUT_CHANGE_RECEIVE_VOTES"
                                            /> */}
                                            <FastField
                                                name="note"
                                                component={InputFields}
                                                label="Ghi chú"
                                                type="textarea"
                                                placeholder="Ghi chú ..."
                                                action="INPUT_CHANGE_RECEIVE_VOTES"
                                            />
                                        </Col>
                                        <Col xl={6} lg={6} md={12}>
                                            {/* <FastField
                                                name="finish_date"
                                                component={InputFields}
                                                label="Ngày dự kiến hoàn thành"
                                                placeholder="Chọn ngày dự kiến hoàn thành ..."
                                                type="datetime-local"
                                                action="INPUT_CHANGE_RECEIVE_VOTES"
                                            /> */}
                                            <FastField
                                                name="km_into"
                                                component={InputFields}
                                                label="Số km vào"
                                                type="number"
                                                placeholder="Nhập số km vào..."
                                                action="INPUT_CHANGE_RECEIVE_VOTES"
                                            />
                                            <FastField
                                                name="status"
                                                component={SelectFields}
                                                label="Trạng thái"
                                                placeholder="Chọn trạng thái"
                                                options={
                                                    data.status && data.status == "2"
                                                        ? DATA_RECEIVE_VOTES_2
                                                        : data.status == "3"
                                                        ? DATA_RECEIVE_VOTES_3
                                                        : DATA_RECEIVE_VOTES
                                                }
                                                action="INPUT_CHANGE_RECEIVE_VOTES"
                                            />
                                            <FastField
                                                name="require"
                                                component={InputFields}
                                                label="Yêu cầu"
                                                type="textarea"
                                                placeholder="Yêu cầu ..."
                                                action="INPUT_CHANGE_RECEIVE_VOTES"
                                            />
                                        </Col>
                                    </Row>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success float-right mr-2" type="submit">
                                        {modal == "add_receiveVote" ? "Thêm mới" : "Cập nhật"}
                                    </Button>
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
                <ModalHeader>Xóa phiếu tiếp nhận</ModalHeader>
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

ReceiveVotesModal.propTypes = {
    modal: PropTypes.bool,
};

ReceiveVotesModal.defaultProps = {
    modal: false,
};

export default ReceiveVotesModal;
