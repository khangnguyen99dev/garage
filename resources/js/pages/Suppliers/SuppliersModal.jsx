import React from "react";
import PropTypes from "prop-types";
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap";
import { Formik, Form, FastField } from "formik";
import InputField from "@/custom-fields/InputField";
import SuppliersModel from "./SuppliersModel";
import { useDispatch, useSelector } from "react-redux";
import {
    handleShow,
    handleSubmit,
    handleUpdate,
    handleDelete,
} from "@/store/actions/SuppliersAction";
import * as Yup from "yup";
import { phoneRegExp } from "@/utils/constants";
import NumberFormat from "react-number-format";
import moment from "moment";
import { BsCreditCard } from "react-icons/bs";
import { AiFillPrinter } from "react-icons/ai";
import ImportVotesModal from "../ImportVotes/ImportVotesModal";

function SuppliersModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Suppliers);

    const { modal, data, id, isShow } = props.show;

    const initialValues =
        (parseInt(id) > 0 && modal == "edit_supplier") || modal == "show_supplier_payment"
            ? data
            : modal == "delete"
            ? { id: id }
            : SuppliersModel;

    const validateSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng nhập tên nhà cung cấp!"),
        phone: Yup.string()
            .matches(phoneRegExp, "Số điện thoại không đúng!")
            .min(10, "Số điện thoại không đúng!")
            .max(10, "Số điện thoại không đúng!")
            .required("Vui lòng nhập số điện thoại!"),
        address: Yup.string().required("Vui lòng nhập địa chỉ!"),
        name_represent: Yup.string().required("Vui lòng nhập tên người đại diện!"),
    });

    const renderButton = (status, id) => {
        if (status == "1" || status == "2") {
            return (
                <Button
                    data-key={id}
                    data-modal="supplier_payment"
                    onClick={(e) => dispatchs(handleShow(e))}
                    className="btn btn-success btn-sm"
                    title="Thanh toán"
                >
                    <BsCreditCard />
                </Button>
            );
        }
    };

    if (modal == "add_supplier" || modal == "edit_supplier") {
        return (
            <Modal isOpen={isShow} size="lg">
                <ModalHeader>
                    {modal == "add_supplier"
                        ? "Thêm nhà cung cấp"
                        : "Cập nhật thông tin nhà cung cấp"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={
                        modal == "add_supplier"
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
                                                placeholder="Nhập tên nhà cung cấp ..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FastField
                                                name="phone"
                                                component={InputField}
                                                label="Điện thoại"
                                                placeholder="Nhập điện thoại nhà cung cấp ..."
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FastField
                                                name="address"
                                                component={InputField}
                                                label="Địa chỉ"
                                                placeholder="Nhập địa chỉ nhà cung cấp ..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FastField
                                                name="email"
                                                component={InputField}
                                                label="Email"
                                                placeholder="Nhập email nhà cung cấp ..."
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FastField
                                                name="website"
                                                component={InputField}
                                                label="Website"
                                                placeholder="Nhập website nhà cung cấp ..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FastField
                                                name="tax_code"
                                                component={InputField}
                                                label="Mã số thuế"
                                                placeholder="Nhập mã số thuế nhà cung cấp ..."
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FastField
                                                name="account_number"
                                                component={InputField}
                                                label="Số tài khoản"
                                                placeholder="Nhập số tài khoản nhà cung cấp ..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FastField
                                                name="bank_name"
                                                component={InputField}
                                                label="Tên ngân hàng"
                                                placeholder="Nhập tên ngân hàng nhà cung cấp ..."
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <FastField
                                                name="name_represent"
                                                component={InputField}
                                                label="Tên người đại diện"
                                                placeholder="Nhập tên người đại diện ..."
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <FastField
                                                name="card_id_rep"
                                                component={InputField}
                                                label="Chứng minh nhân dân"
                                                placeholder="Nhập số CMND người đại diện ..."
                                            />
                                        </Col>
                                    </Row>
                                </ModalBody>

                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        {modal == "add_supplier" ? "Thêm mới" : "Cập nhật"}
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
    } else if (modal == "show_supplier_payment") {
        return (
            <Modal isOpen={isShow} size="xl">
                <ModalHeader>Thanh toán tiền nợ</ModalHeader>
                <ImportVotesModal />
                <Formik initialValues={initialValues}>
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <Table hover responsive className="text-center">
                                        <thead>
                                            <tr>
                                                <th>Mã phiếu</th>
                                                <th>Ngày lập phiếu</th>
                                                <th>Nhân viên</th>
                                                <th>Tổng tiền</th>
                                                <th>Còn nợ</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        {data.length > 0 ? (
                                            <tbody>
                                                {data &&
                                                    data.map((importVote, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{importVote.import_code}</td>
                                                                <td>
                                                                    {moment(
                                                                        new Date(
                                                                            importVote.vote_date
                                                                        )
                                                                    ).format("DD/MM/YYYY h:mm")}
                                                                </td>

                                                                <td>{importVote.employee}</td>
                                                                <td>
                                                                    <NumberFormat
                                                                        value={
                                                                            importVote.total_price
                                                                        }
                                                                        displayType={"text"}
                                                                        thousandSeparator={true}
                                                                    />
                                                                    ₫
                                                                </td>
                                                                <td>
                                                                    <NumberFormat
                                                                        value={
                                                                            parseInt(
                                                                                importVote.total_price
                                                                            ) -
                                                                            parseInt(
                                                                                importVote.payment
                                                                            )
                                                                        }
                                                                        displayType={"text"}
                                                                        thousandSeparator={true}
                                                                    />
                                                                    ₫
                                                                </td>
                                                                <td>
                                                                    <Button
                                                                        data-key={importVote.id}
                                                                        data-modal="show_print_payment"
                                                                        onClick={(e) =>
                                                                            dispatchs(handleShow(e))
                                                                        }
                                                                        className="btn btn-info btn-sm"
                                                                        title="In phiếu nhập hàng"
                                                                    >
                                                                        <AiFillPrinter />
                                                                    </Button>{" "}
                                                                    {renderButton(
                                                                        importVote.status,
                                                                        importVote.id
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
                                                    (n, { total_price, payment }) =>
                                                        parseInt(n) +
                                                        (parseInt(total_price) - parseInt(payment)),
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
    } else {
        return <div></div>;
    }
}

SuppliersModal.propTypes = {
    modal: PropTypes.bool,
};

SuppliersModal.defaultProps = {
    modal: false,
};

export default SuppliersModal;
