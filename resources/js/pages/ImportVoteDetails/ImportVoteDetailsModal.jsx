import React from "react";
import PropTypes from "prop-types";
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { Formik, Form, FastField } from "formik";
import ImportVoteDetailsModel from "./ImportVoteDetailsModel";
import InputField from "@/custom-fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import {
    handleShow,
    handleSubmit,
    handleUpdate,
    handleDelete,
} from "@/store/actions/ImportVoteDetailsAction";
import { FaPlus } from "react-icons/fa";
import ProductsModal from "../Products/ProductsModal";
import SelectField from "@/custom-fields/SelectField";
import NumberFormatInput from "@/custom-fields/NumberFormat";
import * as Yup from "yup";

function ImportVoteDetailsModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.ImportVoteDetails);

    const { modal, data, id, isShow } = props.show;

    const initialValues =
        modal == "edit_import_vote_detail"
            ? data
            : modal == "add_import_vote_detail" && data !== undefined
            ? data
            : modal == "delete" || modal == "delete_import_vote_detail"
            ? { id: id }
            : ImportVoteDetailsModel;

    const validateSchema = Yup.object().shape({
        id: Yup.number().required("Vui lòng chọn phụ tùng!"),
        qty: Yup.number()
            .min(1, "Số lượng phải lớn hơn hoặc bằng 1!")
            .required("Vui lòng nhập số lượng!"),
        import_price: Yup.number()
            .moreThan(0, "Giá bán nhập phải là số dương!")
            .required("Vui lòng nhập giá nhập!"),
        price: Yup.number()
            .moreThan(0, "Giá bán phải là số dương!")
            .required("Vui lòng nhập giá bán!"),
    });

    if (modal == "edit_import_vote_detail" || modal == "add_import_vote_detail") {
        return (
            <Modal isOpen={isShow}>
                <ProductsModal />
                <ModalHeader>
                    {modal == "add_import_vote_detail" ? "Nhập phụ tùng" : "Cập nhật nhập phụ tùng"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    enableReinitialize={true}
                    onSubmit={
                        modal == "add_import_vote_detail"
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
                                        <Col xl={10} lg={10} md={10}>
                                            <FastField
                                                name="id"
                                                component={SelectField}
                                                label="Phụ tùng"
                                                placeholder="Chọn phụ tùng"
                                                id="products:id,name"
                                                bidding="BIDDING_IMPORT_VOTE_DETAILS"
                                                data={initialValues}
                                            />
                                        </Col>
                                        <Col xl={2} lg={2} md={2}>
                                            <div width="100%">
                                                <label>&nbsp;</label>
                                            </div>
                                            <Button
                                                color="success"
                                                className="btn-md"
                                                data-modal="add_product"
                                                onClick={(e) => dispatchs(handleShow(e))}
                                            >
                                                <FaPlus />
                                            </Button>
                                        </Col>
                                    </Row>
                                    <FastField
                                        name="qty"
                                        component={InputField}
                                        type="number"
                                        label="Số lượng"
                                        placeholder="Nhập số lượng ..."
                                    />
                                    <FastField
                                        name="import_price"
                                        component={NumberFormatInput}
                                        label="Giá nhập"
                                        placeholder="Nhập giá nhập ..."
                                    />
                                    <FastField
                                        name="price"
                                        component={NumberFormatInput}
                                        label="Giá bán"
                                        placeholder="Nhập giá bán ..."
                                    />
                                </ModalBody>

                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        {modal == "add_import_vote_detail"
                                            ? "Thêm mới"
                                            : "Cập nhật"}
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
    } else if (modal == "delete" || modal == "delete_import_vote_detail") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Xóa phiếu nhập hàng</ModalHeader>
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

ImportVoteDetailsModal.propTypes = {
    modal: PropTypes.bool,
};

ImportVoteDetailsModal.defaultProps = {
    modal: false,
};

export default ImportVoteDetailsModal;
