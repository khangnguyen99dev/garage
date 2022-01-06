import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
    Button,
    Col,
    FormGroup,
    Input,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table,
} from "reactstrap";
import { Formik, Form, FastField } from "formik";
import ImportVotesModel from "./ImportVotesModel";
import InputField from "@/custom-fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import {
    handleShow,
    handleSubmit,
    handleUpdate,
    handleDelete,
    handleTotal,
    handleConfirmImportVote,
    handlePaymentVote,
} from "@/store/actions/ImportVotesAction";
import { FaPlus } from "react-icons/fa";
import NumberFormat from "react-number-format";
import ImportVoteDetailsModal from "../ImportVoteDetails/ImportVoteDetailsModal";
import { BiEdit, BiTrash } from "react-icons/bi";
import SelectField from "@/custom-fields/SelectField";
import NumberFormatInput from "@/custom-fields/NumberFormat";
import * as Yup from "yup";
import moment from "moment";
import FileField from "@/custom-fields/FileField";
import { AiFillPrinter } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import ServiceCrud from "@/services/ServiceCrud";
import ImportVotesPDF from "../PrintPDF/ImportVotesPDF";
import { useLocation } from "react-router";

function ImportVotesModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.ImportVotes);

    const { modal, data, id, isShow, selectedFiles } = props.show;

    const { products } = props.show.dataModal;

    const { total_price } = props.show;

    const param = useLocation().pathname.split("/").pop();

    const componentRef = useRef();

    const [dataPrint, setDataPrint] = useState({
        name_supplier: "",
        employee: "",
        import_code: "",
        payment_date: "",
        money: "",
        total_price: "",
        products: [],
    });

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handleAPI = async (e) => {
        const { key } = e.target.dataset;
        await ServiceCrud.instance
            .show("print-payment-votes", key)
            .then((response) => {
                const { data } = response;
                setDataPrint(data);
                document.title =
                    "NH_" + data.import_code + moment(data.import_date).format("_DD_MM_YY");
            })
            .catch((error) => {
                console.log("Error: " + error);
            });
        handlePrint();
    };

    const validateSchema = Yup.object().shape({
        supplier_id: Yup.number().required("Vui lòng chọn nhà cung cấp!"),
        // user_id: Yup.number().required("Vui lòng chọn nhân viên lập phiếu!"),
        // payment: Yup.number()
        //     .moreThan(0, "Số tiền chi trả phải là số dương")
        //     .required("Vui lòng nhập số tiền chi trả!"),
        vote_date: Yup.date()
            .min(
                moment(new Date()).format("YYYY-MM-DD"),
                "Ngày lập phiếu lớn hơn hoặc bằng ngày hiện tại!"
            )
            .required("Vui lòng chọn ngày lập phiếu"),
        import_date: Yup.date().required("Vui lòng chọn ngày nhập hàng!"),
    });

    const renderPhotos = (photo) => {
        return <img className="p-2 image_show" src={photo[0]} alt="" key={photo[0]} />;
    };

    useEffect(() => {
        dispatchs(handleTotal());
    }, [products]);

    const initialValues =
        modal == "edit_import_vote" || modal == "supplier_payment"
            ? data
            : modal == "delete" || modal == "confirm_import_vote"
            ? { id: id }
            : ImportVotesModel;

    if (modal == "edit_import_vote" || modal == "add_import_vote") {
        return (
            <Modal isOpen={isShow} size="xl">
                <ImportVoteDetailsModal />
                <ModalHeader>
                    {modal == "add_import_vote"
                        ? "Thêm phiếu nhập hàng"
                        : "Cập nhật phiếu nhập hàng"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={
                        modal == "add_import_vote"
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
                                        <Col md="6">
                                            <FastField
                                                name="supplier_id"
                                                component={SelectField}
                                                label="Nhà cung cấp"
                                                placeholder="Nhà cung cấp ..."
                                                id="suppliers:id,name"
                                                data={initialValues.suppliers}
                                            />
                                            <FastField
                                                name="vote_date"
                                                component={InputField}
                                                type="datetime-local"
                                                label="Ngày lập phiếu"
                                                placeholder="Nhập Ngày lập phiếu ..."
                                            />
                                        </Col>
                                        <Col md="6">
                                            {/* <FastField
                                                name="user_id"
                                                component={SelectField}
                                                label="Nhân viên lập phiếu"
                                                placeholder="Nhân viên lập phiếu ..."
                                                id="users:id,name"
                                                data={initialValues.users}
                                            /> */}
                                            {/* <FastField
                                                name="payment"
                                                component={NumberFormatInput}
                                                label="Thanh toán"
                                                placeholder="Nhập số tiền thanh toán ..."
                                            /> */}
                                            <FormGroup>
                                                <label htmlFor="">Trạng thái</label>
                                                <Input value="Chờ thanh toán" disabled={true} />
                                            </FormGroup>

                                            <FastField
                                                name="import_date"
                                                component={InputField}
                                                type="datetime-local"
                                                label="Ngày nhập hàng"
                                                placeholder="Nhập Ngày nhập hàng ..."
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <FastField
                                                name="image"
                                                component={FileField}
                                                type="file"
                                                label="Ảnh chứng thực / hóa đơn"
                                                placeholder="Chọn ảnh ..."
                                                action="IMAGE_CHANGE_IMPORTS"
                                                data={selectedFiles}
                                            />
                                            {renderPhotos(selectedFiles)}
                                        </Col>
                                    </Row>

                                    <Col md="12">
                                        <Button
                                            color="success"
                                            type="button"
                                            className="btn-sm float-right"
                                            data-modal="add_import_vote_detail"
                                            onClick={(e) => {
                                                dispatchs(handleShow(e));
                                            }}
                                        >
                                            <FaPlus />
                                        </Button>
                                        <Table hover responsive className="text-center">
                                            <thead>
                                                <tr>
                                                    <th>Phụ tùng</th>
                                                    <th>Số lượng</th>
                                                    <th>Giá nhập</th>
                                                    <th>Giá bán</th>
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
                                                                            value={
                                                                                product.import_price
                                                                            }
                                                                            displayType={"text"}
                                                                            thousandSeparator={true}
                                                                        />
                                                                        ₫
                                                                    </td>
                                                                    <td>
                                                                        <NumberFormat
                                                                            value={product.price}
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
                                                                            data-modal="edit_import_vote_detail"
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
                                                                            data-modal="delete_import_vote_detail"
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
                                    <Row className="mr-auto">
                                        <Col md="6" lg="6">
                                            <div className="total_price p-2">
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
                                    <Button color="success" type="submit">
                                        {modal == "add_import_vote" ? "Thêm mới" : "Cập nhật"}
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
                <ModalHeader>Xóa phiếu nhập hàng</ModalHeader>
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
    } else if (modal == "confirm_import_vote") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Xác nhận nhập hàng</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(value) => {
                        dispatchs(handleConfirmImportVote(value));
                    }}
                >
                    {(formikProps) => {
                        const { values, errors, touched } = formikProps;
                        return (
                            <Form>
                                <ModalBody>Bạn chắc chắn phụ tùng đã được nhập?</ModalBody>
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
    } else if (modal == "supplier_payment") {
        return (
            <Modal isOpen={isShow} size="lg">
                <ModalHeader>Thanh toán</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    // validationSchema={validateCollectVoteSchema}
                    onSubmit={(value) => {
                        dispatchs(handlePaymentVote(value, param));
                    }}
                >
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <Row>
                                        <Col md="6">
                                            <FastField
                                                name="suppliers.name"
                                                component={InputField}
                                                label="Công ty"
                                                placeholder="Nhập tên Công ty ..."
                                                readonly={true}
                                            />
                                        </Col>
                                        <Col md="6">
                                            <FastField
                                                name="import_code"
                                                component={InputField}
                                                label="Mã phiếu"
                                                placeholder="Nhập mã phiếu ..."
                                                readonly={true}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6">
                                            <FastField
                                                name="total_price"
                                                component={NumberFormatInput}
                                                label="Tổng tiền"
                                                placeholder="Nhập tổng tiền ..."
                                                readonly={true}
                                            />
                                        </Col>
                                        <Col md="6">
                                            <FastField
                                                name="owed"
                                                component={NumberFormatInput}
                                                label="Số tiền còn nợ"
                                                placeholder="Nhập số tiền còn nợ ..."
                                                readonly={true}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6">
                                            <FastField
                                                name="import_date"
                                                component={InputField}
                                                type="datetime-local"
                                                label="Ngày lập phiếu"
                                                placeholder="Chọn ngày lập phiếu ..."
                                            />
                                        </Col>
                                        <Col md="6">
                                            <FastField
                                                name="money"
                                                component={NumberFormatInput}
                                                label="Số tiền"
                                                placeholder="Nhập số tiền ..."
                                            />
                                        </Col>
                                    </Row>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        Thanh toán
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
    } else if (modal == "show_print_payment") {
        return (
            <Modal isOpen={isShow} size="lg">
                <ModalHeader>In hóa đơn</ModalHeader>
                <div style={{ display: "none" }}>
                    <ImportVotesPDF ref={componentRef} data={dataPrint} />
                </div>
                <Formik>
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <Table hover responsive className="text-center">
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Nhân viên lập hóa đơn</th>
                                                <th>Đã trả</th>
                                                <th>Ngày trả</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        {data.length > 0 ? (
                                            <tbody>
                                                {data &&
                                                    data.map((paymentVote, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{paymentVote.employee}</td>
                                                                <td>
                                                                    <NumberFormat
                                                                        value={paymentVote.money}
                                                                        displayType={"text"}
                                                                        thousandSeparator={true}
                                                                    />
                                                                    ₫
                                                                </td>
                                                                <td>
                                                                    {moment(
                                                                        new Date(
                                                                            paymentVote.payment_date
                                                                        )
                                                                    ).format("DD/MM/YYYY h:mm")}
                                                                </td>

                                                                <td>
                                                                    <Button
                                                                        data-key={paymentVote.id}
                                                                        data-modal="print_invoice"
                                                                        onClick={(e) =>
                                                                            handleAPI(e)
                                                                        }
                                                                        title="In hóa đơn"
                                                                        className="btn btn-info btn-sm"
                                                                    >
                                                                        <AiFillPrinter />
                                                                    </Button>
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
                                            Tổng tiền :{" "}
                                            <NumberFormat
                                                value={data.reduce(
                                                    (n, { money }) => parseInt(n) + parseInt(money),
                                                    0
                                                )}
                                                displayType={"text"}
                                                thousandSeparator={true}
                                            />
                                            ₫
                                        </b>
                                    </div>
                                    {/* </Col> */}
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

ImportVotesModal.propTypes = {
    modal: PropTypes.bool,
};

ImportVotesModal.defaultProps = {
    modal: false,
};

export default ImportVotesModal;
