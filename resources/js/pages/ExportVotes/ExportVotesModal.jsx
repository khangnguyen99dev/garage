import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap";
import {
    handleShow,
    handleSubmit,
    handleUpdate,
    handleConfirmExport,
    handleDelete,
} from "@/store/actions/ExportVotesAction";
import React from "react";
import PropTypes from "prop-types";
import { Formik, Form, FastField } from "formik";
import { useDispatch, useSelector } from "react-redux";
import ExportVotesModel from "./ExportVotesModel";
import InputFields from "@/custom-fields/InputFields";
import NumberFormat from "react-number-format";
import InputField from "@/custom-fields/InputField";
import { BiEdit, BiTrash } from "react-icons/bi";
import ProductsModal from "../Products/ProductsModal";
import moment from "moment";

function ExportVotesModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.ExportVotes);

    const { modal, data, id, isShow } = props.show;

    const { services, products } = props.show.dataModal;

    const { total_price, discount } = props.show;

    if (modal == "add_export_vote") {
        data.vote_date = moment(new Date()).format("YYYY-MM-DDThh:mm");
    }

    const initialValues =
        (parseInt(id) > 0 && modal == "add_export_vote") || modal == "edit_export_vote"
            ? data
            : modal == "delete" || modal == "confirm_export_product"
            ? { id: id }
            : ExportVotesModel;

    if (modal == "add_export_vote") {
        return (
            <Modal isOpen={isShow} size="xl">
                <ModalHeader>
                    {modal == "add_export_vote"
                        ? "Lập phiếu xuất phụ tùng"
                        : "Chỉnh sửa phiếu xuất phụ tùng"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    onSubmit={
                        modal == "add_export_vote"
                            ? (value) => dispatchs(handleSubmit(value))
                            : (value) => dispatchs(handleUpdate(value))
                    }
                >
                    {(formikProps) => {
                        const { values } = formikProps;
                        return (
                            <Form>
                                <ModalBody>
                                    <Row>
                                        <Col md="6">
                                            <FastField
                                                name="cars.customers.name"
                                                component={InputFields}
                                                label="Tên khách hàng"
                                                placeholder="Tên khách hàng ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="number_car_id"
                                                component={InputFields}
                                                label="Biển số xe"
                                                placeholder="Biển số xe ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="receive_date"
                                                component={InputFields}
                                                label="Ngày tiếp nhận"
                                                type="datetime-local"
                                                placeholder="Ngày tiếp nhận ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="vote_date"
                                                component={InputField}
                                                label="Ngày lập phiếu"
                                                type="datetime-local"
                                            />
                                        </Col>
                                        <Col md="6">
                                            <FastField
                                                name="cars.customers.phone"
                                                component={InputFields}
                                                label="Số điện thoại"
                                                placeholder="Số điện thoại ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="repair_date"
                                                component={InputField}
                                                label="Ngày sửa chữa"
                                                type="datetime-local"
                                                placeholder="Ngày sửa chữa ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="users.name"
                                                component={InputField}
                                                label="Nhân viên kỹ thuật"
                                                placeholder="Nhân viên kỹ thuật ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="note"
                                                component={InputField}
                                                label="Ghi chú"
                                                placeholder="Nhập ghi chú ..."
                                            />
                                        </Col>
                                    </Row>
                                    <Col md="12">
                                        <Table hover responsive className="text-center">
                                            <thead>
                                                <tr>
                                                    <th>Phụ tùng</th>
                                                    <th>Số lượng</th>
                                                    <th>Giá</th>
                                                    <th>Thành tiền</th>
                                                </tr>
                                            </thead>
                                            {products.length > 0 ? (
                                                <tbody>
                                                    {products &&
                                                        products.map((product, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td scope="row">
                                                                        {product.name}
                                                                    </td>
                                                                    <td>{product.quantity}</td>
                                                                    <td>
                                                                        <NumberFormat
                                                                            value={product.price}
                                                                            displayType={"text"}
                                                                            thousandSeparator={true}
                                                                        />
                                                                        ₫
                                                                    </td>
                                                                    <td>
                                                                        <NumberFormat
                                                                            value={
                                                                                product.quantity *
                                                                                product.price
                                                                            }
                                                                            displayType={"text"}
                                                                            thousandSeparator={true}
                                                                        />
                                                                        ₫
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                </tbody>
                                            ) : (
                                                <tbody>
                                                    <tr>
                                                        <td colSpan={5}>Không có dữ liệu!</td>
                                                    </tr>
                                                </tbody>
                                            )}
                                        </Table>
                                    </Col>
                                    <Col md="12">
                                        <Table hover responsive className="text-center">
                                            <thead>
                                                <tr>
                                                    <th>Dịch vụ</th>
                                                    <th>Giá</th>
                                                    <th>Ghi chú</th>
                                                </tr>
                                            </thead>

                                            {services.length > 0 ? (
                                                <tbody>
                                                    {services &&
                                                        services.map((service, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td scope="row">
                                                                        {service.name}
                                                                    </td>
                                                                    <td>
                                                                        <NumberFormat
                                                                            value={service.price}
                                                                            displayType={"text"}
                                                                            thousandSeparator={true}
                                                                        />
                                                                        ₫
                                                                    </td>
                                                                    <td>{service.note}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                </tbody>
                                            ) : (
                                                <tbody>
                                                    <tr>
                                                        <td colSpan={5}>Không có dữ liệu!</td>
                                                    </tr>
                                                </tbody>
                                            )}
                                        </Table>
                                    </Col>
                                    <Row>
                                        <Col md="8"></Col>
                                        <Col md="4" className="mt-2">
                                            <div>
                                                <b>
                                                    Giảm :{" "}
                                                    <NumberFormat
                                                        value={discount}
                                                        displayType={"text"}
                                                        thousandSeparator={true}
                                                    />
                                                    ̀̀%
                                                </b>
                                            </div>
                                            <div>
                                                <b>
                                                    Tổng tiền :{" "}
                                                    <NumberFormat
                                                        value={total_price}
                                                        displayType={"text"}
                                                        thousandSeparator={true}
                                                    />
                                                    ₫
                                                </b>
                                            </div>
                                        </Col>
                                    </Row>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" type="submit" name="id">
                                        {modal == "add_export_vote"
                                            ? "Xác nhận và lập phiếu"
                                            : "Cập nhật phiếu"}
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
    } else if (modal == "edit_export_vote") {
        return (
            <Modal isOpen={isShow} size="xl">
                <ProductsModal />
                <ModalHeader>Chỉnh sửa phiếu xuất phụ tùng</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(value) => dispatchs(handleUpdate(value))}
                >
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <Row>
                                        <Col md="6">
                                            <FastField
                                                name="vote_date"
                                                component={InputField}
                                                label="Ngày lập phiếu"
                                                type="datetime-local"
                                            />
                                        </Col>
                                        <Col md="6">
                                            <FastField
                                                name="note"
                                                component={InputField}
                                                label="Ghi chú"
                                                placeholder="Nhập ghi chú ..."
                                            />
                                        </Col>
                                    </Row>
                                    <Col md="12">
                                        <Table hover responsive className="text-center">
                                            <thead>
                                                <tr>
                                                    <th>Phụ tùng</th>
                                                    <th>Số lượng</th>
                                                    <th>Giá</th>
                                                    <th>Thành tiền</th>
                                                    <th>Hành động</th>
                                                </tr>
                                            </thead>
                                            {products.length > 0 ? (
                                                <tbody>
                                                    {products &&
                                                        products.map((product, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td scope="row">
                                                                        {product.name}
                                                                    </td>
                                                                    <td>{product.quantity}</td>
                                                                    <td>
                                                                        <NumberFormat
                                                                            value={product.price}
                                                                            displayType={"text"}
                                                                            thousandSeparator={true}
                                                                        />
                                                                        ₫
                                                                    </td>
                                                                    <td>
                                                                        <NumberFormat
                                                                            value={
                                                                                product.quantity *
                                                                                product.price
                                                                            }
                                                                            displayType={"text"}
                                                                            thousandSeparator={true}
                                                                        />
                                                                        ₫
                                                                    </td>
                                                                    <td>
                                                                        <Button
                                                                            data-key={
                                                                                product.product_id
                                                                            }
                                                                            data-modal="edit_export_product"
                                                                            onClick={(e) =>
                                                                                dispatchs(
                                                                                    handleShow(e)
                                                                                )
                                                                            }
                                                                            className="btn btn-warning btn-sm"
                                                                        >
                                                                            <BiEdit />
                                                                        </Button>{" "}
                                                                        &nbsp;
                                                                        <Button
                                                                            data-key={
                                                                                product.product_id
                                                                            }
                                                                            data-modal="delete_export_product"
                                                                            onClick={(e) =>
                                                                                dispatchs(
                                                                                    handleShow(e)
                                                                                )
                                                                            }
                                                                            className="btn btn-danger btn-sm"
                                                                        >
                                                                            <BiTrash />
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                </tbody>
                                            ) : (
                                                <tbody>
                                                    <tr>
                                                        <td colSpan={5}>Không có dữ liệu!</td>
                                                    </tr>
                                                </tbody>
                                            )}
                                        </Table>
                                    </Col>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" type="submit" name="id">
                                        Cập nhật phiếu
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
    } else if (modal == "confirm_export_product") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Xác nhận xuất kho phụ tùng</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(value) => {
                        dispatchs(handleConfirmExport(value));
                    }}
                >
                    {(formikProps) => {
                        const { values, errors, touched } = formikProps;
                        return (
                            <Form>
                                <ModalBody>Bạn có chắc chắn phụ tùng đã được xuất kho?</ModalBody>
                                <ModalFooter>
                                    <Button color="success" type="submit" name="id">
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
    } else {
        return <div></div>;
    }
}

ExportVotesModal.propTypes = {
    modal: PropTypes.bool,
};

ExportVotesModal.defaultProps = {
    modal: false,
};

export default ExportVotesModal;
