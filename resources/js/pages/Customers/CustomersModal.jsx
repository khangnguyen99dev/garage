import React from "react";
import PropTypes from "prop-types";
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap";
import { Formik, Form, FastField } from "formik";
import InputField from "@/custom-fields/InputField";
import CustomersModel from "./CustomersModel";
import SelectField from "@/custom-fields/SelectField";
import SelectFields from "@/custom-fields/SelectFields";
import { DATA_OPTION, DATA_GENDER } from "@/utils/constants";
import {
    handleShow,
    handleSubmit,
    handleUpdate,
    handleDelete,
} from "@/store/actions/CustomersAction";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { phoneRegExp } from "@/utils/constants";
import NumberFormat from "react-number-format";
import moment from "moment";
import { BsCreditCard } from "react-icons/bs";
import RepairVotesModal from "../RepairVotes/RepairVotesModal";
import { AiFillPrinter } from "react-icons/ai";

function CustomersModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Customers);

    const { modal, data, id, isShow } = props.show;

    const initialValues =
        (parseInt(id) > 0 && modal == "edit_customer") || modal == "customer_payment"
            ? data
            : modal == "delete"
            ? { id: id }
            : CustomersModel;

    const validateSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng nhập tên khách hàng!"),
        phone: Yup.string()
            .matches(phoneRegExp, "Số điện thoại không đúng!")
            .min(10, "Số điện thoại không đúng!")
            .max(10, "Số điện thoại không đúng!")
            .required("Vui lòng nhập số điện thoại!"),
        address: Yup.string().required("Vui lòng nhập địa chỉ!"),
        gender: Yup.string().required("Vui lòng chọn giới tính!"),
        customer_type_id: Yup.string().required("Vui lòng chọn nhóm khách!"),
    });

    const renderButton = (key, id) => {
        if (key == "3" || key == "4") {
            return (
                <Button
                    data-key={id}
                    data-modal="collect_vote"
                    onClick={(e) => dispatchs(handleShow(e))}
                    title="Thanh toán"
                    className="btn btn-info btn-sm"
                >
                    <BsCreditCard />
                </Button>
            );
        } else {
            return <></>;
        }
    };

    if (modal == "edit_customer" || modal == "add_customer") {
        return (
            <Modal isOpen={isShow} size="lg">
                <ModalHeader>
                    {modal == "add_customer" ? "Thêm khách hàng" : "Cập nhật khách hàng"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={
                        modal == "add_customer"
                            ? (value, e) => {
                                  dispatchs(handleSubmit(value, e));
                              }
                            : (value, e) => {
                                  dispatchs(handleUpdate(value, e));
                              }
                    }
                >
                    {(formikProps) => {
                        const { values, errors, touched } = formikProps;
                        return (
                            <Form>
                                <ModalBody>
                                    <Row>
                                        <Col md={6}>
                                            <FastField
                                                name="name"
                                                component={InputField}
                                                label="Tên"
                                                placeholder="Nhập tên khách hàng..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FastField
                                                name="phone"
                                                component={InputField}
                                                label="Điện thoại"
                                                placeholder="Nhập điện thoại khách hàng ..."
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FastField
                                                name="address"
                                                component={InputField}
                                                label="Địa chỉ"
                                                placeholder="Nhập địa chỉ khách hàng..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FastField
                                                name="email"
                                                component={InputField}
                                                label="Email"
                                                placeholder="Nhập Email khách hàng ..."
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FastField
                                                name="account_number"
                                                component={InputField}
                                                label="Số tài khoản"
                                                placeholder="Nhập Số tài khoản khách hàng..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FastField
                                                name="bank_name"
                                                component={InputField}
                                                label="Tên ngân hàng"
                                                placeholder="Nhập tên ngân hàng khách hàng ..."
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FastField
                                                name="tax_code"
                                                component={InputField}
                                                label="Mã số thuế"
                                                placeholder="Nhập mã số thuế khách hàng..."
                                                className="sm"
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FastField
                                                name="gender"
                                                component={SelectFields}
                                                label="Giới tính"
                                                placeholder="Chọn giới tính!"
                                                options={DATA_GENDER}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FastField
                                                name="status"
                                                component={SelectFields}
                                                label="Trạng thái"
                                                placeholder="Chọn trạng thái!"
                                                options={DATA_OPTION}
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FastField
                                                name="customer_type_id"
                                                component={SelectField}
                                                label="Nhóm khách"
                                                placeholder="Chọn nhóm khách!"
                                                id="customer-types:id,name"
                                                data={initialValues.customer_types}
                                            />
                                        </Col>
                                    </Row>
                                </ModalBody>

                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        {modal == "add_customer" ? "Thêm mới" : "Cập nhật"}
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
    } else if (modal == "customer_payment") {
        return (
            <Modal isOpen={isShow} size="xl">
                <ModalHeader>Thanh toán tiền nợ</ModalHeader>
                <RepairVotesModal />
                <Formik initialValues={initialValues}>
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <Table hover responsive className="text-center">
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Kỹ thuật</th>
                                                <th>Tổng tiền</th>
                                                <th>Đã trả</th>
                                                <th>Còn nợ</th>
                                                <th>Ngày sửa chữa</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        {data.length > 0 ? (
                                            <tbody>
                                                {data &&
                                                    data.map((repairVote, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{repairVote.name}</td>
                                                                <td>
                                                                    <NumberFormat
                                                                        value={
                                                                            repairVote.total_price
                                                                        }
                                                                        displayType={"text"}
                                                                        thousandSeparator={true}
                                                                    />
                                                                    ₫
                                                                </td>
                                                                <td>
                                                                    <NumberFormat
                                                                        value={repairVote.paymented}
                                                                        displayType={"text"}
                                                                        thousandSeparator={true}
                                                                    />
                                                                    ₫
                                                                </td>
                                                                <td>
                                                                    <NumberFormat
                                                                        value={
                                                                            parseInt(
                                                                                repairVote.total_price
                                                                            ) -
                                                                            parseInt(
                                                                                repairVote.paymented
                                                                            )
                                                                        }
                                                                        displayType={"text"}
                                                                        thousandSeparator={true}
                                                                    />
                                                                    ₫
                                                                </td>
                                                                <td>
                                                                    {moment(
                                                                        new Date(
                                                                            repairVote.repair_date
                                                                        )
                                                                    ).format("DD/MM/YYYY h:mm")}
                                                                </td>

                                                                <td>
                                                                    {repairVote.status != "3" && (
                                                                        <Button
                                                                            data-key={repairVote.id}
                                                                            data-modal="show_print_payment"
                                                                            onClick={(e) =>
                                                                                dispatchs(
                                                                                    handleShow(e)
                                                                                )
                                                                            }
                                                                            className="btn btn-primary btn-sm"
                                                                            title="Thanh toán"
                                                                        >
                                                                            <AiFillPrinter />
                                                                        </Button>
                                                                    )}
                                                                    &nbsp;
                                                                    {renderButton(
                                                                        repairVote.status,
                                                                        repairVote.receive_vote_id
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        ) : (
                                            <tbody>
                                                <tr>
                                                    <td colSpan={7}>Không có dữ liệu!</td>
                                                </tr>
                                            </tbody>
                                        )}
                                    </Table>
                                </ModalBody>
                                <ModalFooter>
                                    <div className="total_price p-2">
                                        <b>
                                            Tổng nợ :{" "}
                                            <NumberFormat
                                                value={data.reduce(
                                                    (n, { total_price, paymented }) =>
                                                        parseInt(n) +
                                                        (parseInt(total_price) -
                                                            parseInt(paymented)),
                                                    0
                                                )}
                                                displayType={"text"}
                                                thousandSeparator={true}
                                            />
                                            ₫
                                        </b>
                                    </div>
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
                <ModalHeader>Xóa nhà cung cấp</ModalHeader>
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

CustomersModal.propTypes = {
    modal: PropTypes.bool,
};

CustomersModal.defaultProps = {
    modal: false,
};

export default CustomersModal;
