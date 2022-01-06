import Page from "@/components/Page";
import InputField from "@/custom-fields/InputField";
import InputFields from "@/custom-fields/InputFields";
import SelectField from "@/custom-fields/SelectField";
import SelectFields from "@/custom-fields/SelectFields";
import { DATA_RECEIVE_VOTES } from "@/utils/constants";
import { FastField, Form, Formik } from "formik";
import React from "react";
import { FaCarSide } from "react-icons/fa";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import CarsModal from "../Cars/CarsModal";
import { handleShow, handleSubmit } from "@/store/actions/ReceiveVotesAction";
import { useDispatch, useSelector } from "react-redux";
function ReceiveVotesAdd() {
    const dispatchs = useDispatch();
    const initialValues = useSelector((state) => state.ReceiveVotes.show.data);

    return (
        <Page
            title="Xe nhập xưởng"
            breadcrumbs={[{ name: "Tiếp nhận xe / Xe nhập xưởng", active: true }]}
            className="Receive-votes"
        >
            <Card>
                <CardHeader>Xe nhập xưởng</CardHeader>
                <CardBody>
                    <Formik
                        enableReinitialize={true}
                        initialValues={initialValues}
                        onSubmit={(value, e) => {
                            dispatchs(handleSubmit(value, e));
                        }}
                    >
                        {(formikProps) => {
                            const { values, errors, touched } = formikProps;
                            return (
                                <Form>
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
                                                name="finish_date"
                                                component={InputFields}
                                                label="Hạn giao xe"
                                                placeholder="Chọn hạng giao xe ..."
                                                type="datetime-local"
                                                action="INPUT_CHANGE_RECEIVE_VOTES"
                                            />
                                            <FastField
                                                name="km_into"
                                                component={InputFields}
                                                label="Số km vào"
                                                placeholder="Nhập số km vào..."
                                                action="INPUT_CHANGE_RECEIVE_VOTES"
                                            />
                                            <FastField
                                                name="item_in_car"
                                                component={InputFields}
                                                label="Vật dụng trên xe"
                                                placeholder="Nhập vật dụng trên xe ..."
                                                action="INPUT_CHANGE_RECEIVE_VOTES"
                                            />
                                        </Col>
                                        <Col xl={6} lg={6} md={12}>
                                            <FastField
                                                name="car_condition"
                                                component={InputFields}
                                                label="Tình trạng xe"
                                                placeholder="Nhập tình trạng xe ..."
                                                action="INPUT_CHANGE_RECEIVE_VOTES"
                                            />
                                            <FastField
                                                name="note"
                                                component={InputFields}
                                                label="Ghi chú"
                                                placeholder="Ghi chú ..."
                                                action="INPUT_CHANGE_RECEIVE_VOTES"
                                            />
                                            <FastField
                                                name="require"
                                                component={InputFields}
                                                label="Yêu cầu"
                                                placeholder="Yêu cầu ..."
                                                action="INPUT_CHANGE_RECEIVE_VOTES"
                                            />
                                            <FastField
                                                name="status"
                                                component={SelectFields}
                                                label="Trạng thái"
                                                placeholder="Chọn trạng thái"
                                                options={DATA_RECEIVE_VOTES}
                                                action="INPUT_CHANGE_RECEIVE_VOTES"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xl={12} lg={12} md={12} className="clearfix">
                                            <Button
                                                color="secondary float-right"
                                                type="reset"
                                                onClick={() =>
                                                    dispatchs({
                                                        type: "RESET_FORM_RECEIVE_VOTES",
                                                    })
                                                }
                                            >
                                                Làm mới
                                            </Button>
                                            <Button color="success float-right mr-2" type="submit">
                                                Thêm mới
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            );
                        }}
                    </Formik>
                </CardBody>
            </Card>
            <CarsModal />
        </Page>
    );
}

export default ReceiveVotesAdd;
