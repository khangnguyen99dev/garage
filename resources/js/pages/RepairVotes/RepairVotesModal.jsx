import {
    Button,
    Col,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table,
} from "reactstrap";
import {
    handleShow,
    handleDelete,
    handleTotal,
    handleSubmitRepairVote,
    handleDiscountChange,
    handleUpdate,
    handleAcceptRepair,
    handleCollectVote,
} from "@/store/actions/RepairVotesAction";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Formik, Form, FastField } from "formik";
import { useDispatch, useSelector } from "react-redux";
import ReceiveVotesModel from "../ReceiveVotes/ReceiveVotesModel";
import InputFields from "@/custom-fields/InputFields";
import { FaPlus } from "react-icons/fa";
import ServicesModal from "../Services/ServicesModal";
import ProductsModal from "../Products/ProductsModal";
import { BiEdit, BiTrash } from "react-icons/bi";
import NumberFormat from "react-number-format";
import InputField from "@/custom-fields/InputField";
import SelectField from "@/custom-fields/SelectField";
import * as Yup from "yup";
import moment from "moment";
import NumberFormatInput from "@/custom-fields/NumberFormat";
import InputGroupField from "@/custom-fields/InputGroupField";
import { AiFillPrinter } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import ServiceCrud from "@/services/ServiceCrud";
import InvoicesPDF from "../PrintPDF/InvoicesPDF";
import { useLocation } from "react-router";

function RepairVotesModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.RepairVotes);

    const { modal, data, id, isShow } = props.show;

    const { services, products } = props.show.dataModal;

    const { total_price, discount } = props.show;

    const param = useLocation().pathname.split("/").pop();

    useEffect(() => {
        dispatchs(handleTotal());
    }, [services, products, discount]);

    if (modal == "add_price_quote") {
        data.repair_date = data.repair_date || moment(new Date()).format("YYYY-MM-DDThh:mm");
        data.user_id = "";
    }

    if (modal == "add_collect_vote") {
        data.collect_date = moment(new Date()).format("YYYY-MM-DDThh:mm");
    }

    const initialValues =
        (parseInt(id) > 0 && modal == "add_price_quote") ||
        modal == "edit_repairVote" ||
        modal == "add_collect_vote" ||
        modal == "collect_vote"
            ? data
            : modal == "delete" || modal == "accept_repair"
            ? { id: id }
            : ReceiveVotesModel;

    const validateSchema = Yup.object().shape({
        repair_date: Yup.date()
            .min(
                moment(new Date()).format("YYYY-MM-DD"),
                "Ngày sửa chữa phải lớn hơn hoặc bằng ngày hiện tại!"
            )
            .required("Vui lòng nhập ngày sửa chữa"),
        expecte_date: Yup.date()
            .min(
                moment(modal == "add_vote_price" ? data.repair_date : new Date()).format(
                    "YYYY-MM-DDThh:mm"
                ),
                "Ngày dự kiến hoàn thành phải lớn hơn ngày sửa chữa!"
            )
            .required("Vui lòng chọn ngày dự kiến hoàn thành"),
        user_id: Yup.number().required("Vui lòng chọn nhân viên kỹ thuật!"),
    });

    const validateEditSchema = Yup.object().shape({
        repair_date: Yup.date().required("Vui lòng nhập ngày sửa chữa"),
        user_id: Yup.number().required("Vui lòng chọn nhân viên kỹ thuật!"),
    });

    const validateCollectVoteSchema =
        modal == "collect_vote" || modal == "add_collect_vote"
            ? Yup.object().shape({
                  collect_date: Yup.date()
                      .min(
                          moment(new Date()).format("YYYY-MM-DD[T]hh:mm"),
                          "Ngày sửa chữa phải lớn hơn hoặc bằng ngày hiện tại!"
                      )
                      .required("Vui lòng nhập ngày sửa chữa"),
                  money: Yup.number()
                      .min(0, "Số tiền trả phải lớn hơn 0!")
                      .max(
                          parseInt(data.total_price) - parseInt(data.paymented),
                          "Số tiền trả không được lớn hơn số tiền nợ!"
                      )
                      .required("Vui lòng nhập số tiền!"),
              })
            : {};

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const [dataPrint, setDataPrint] = useState({
        users: {
            name: "",
        },
        cars: {
            number_car: "",
            customers: {
                name: "",
                phone: "",
            },
        },
        collect_date: "",
        money: 0,
        repair_votes: {
            products: [],
            services: [],
            total_price: 0,
            discount: 0,
            paymented: 0,
            repair_date: "",
        },
    });

    const handlePrintInvoice = async (e) => {
        const { key } = e.target.dataset;
        await ServiceCrud.instance
            .show("print-invoice", key)
            .then((response) => {
                const { data } = response;
                setDataPrint(data);
                document.title =
                    "HD_" + data.number_car_id + moment(new Date()).format("_DD_MM_YY");
            })
            .catch((error) => {
                console.log("Error: " + error);
            });
        handlePrint();
    };

    if (modal == "add_price_quote" || modal == "edit_repairVote") {
        return (
            <Modal isOpen={isShow} size="xl">
                <ModalHeader>
                    {modal == "add_price_quote" ? "Lập phiếu sửa chữa" : "Chỉnh sửa phiếu sửa chữa"}
                </ModalHeader>
                <ServicesModal />
                <ProductsModal />
                <Formik
                    initialValues={initialValues}
                    validationSchema={
                        modal == "add_price_quote" ? validateSchema : validateEditSchema
                    }
                    onSubmit={
                        modal == "add_price_quote"
                            ? (value) => dispatchs(handleSubmitRepairVote(value))
                            : (value) => dispatchs(handleUpdate(value))
                    }
                >
                    {(formikProps) => {
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
                                                name="repair_date"
                                                component={InputField}
                                                label="Ngày sửa chữa"
                                                type="datetime-local"
                                                placeholder="Ngày sửa chữa ..."
                                            />
                                            <FastField
                                                name="user_id"
                                                component={SelectField}
                                                label="Nhân viên kỹ thuật"
                                                placeholder="Nhân viên kỹ thuật ..."
                                                id="employee-technical:id,name"
                                                data={initialValues.users}
                                            />
                                        </Col>
                                        <Col md="6">
                                            <FastField
                                                name="cars.customers.address"
                                                component={InputFields}
                                                label="Địa chỉ"
                                                placeholder="Địa chỉ ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="cars.customers.phone"
                                                component={InputFields}
                                                label="Số điện thoại"
                                                placeholder="Số điện thoại ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="require"
                                                component={InputFields}
                                                label="Yêu cầu"
                                                placeholder="Yêu cầu ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="expecte_date"
                                                component={InputField}
                                                label="Dự kiến hoàn thành"
                                                type="datetime-local"
                                                placeholder="Ngày dự kiến hoàn thành ..."
                                            />
                                        </Col>
                                    </Row>
                                    <Col md="12">
                                        <Button
                                            color="success"
                                            type="button"
                                            className="btn-sm float-right"
                                            data-modal="add_repair_product"
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
                                                                            data-modal="edit_repair_product"
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
                                                                            data-modal="delete_repair_product"
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
                                    <Col md="12">
                                        <Button
                                            color="success"
                                            type="button"
                                            className="btn-sm float-right"
                                            data-modal="add_repair_service"
                                            onClick={(e) => {
                                                dispatchs(handleShow(e));
                                            }}
                                        >
                                            <FaPlus />
                                        </Button>
                                        <Table hover responsive className="text-center">
                                            <thead>
                                                <tr>
                                                    <th>Dịch vụ</th>
                                                    <th>Giá</th>
                                                    <th>Ghi chú</th>
                                                    <th>Hành động</th>
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
                                                                    <td>
                                                                        <Button
                                                                            data-key={
                                                                                service.service_id
                                                                            }
                                                                            data-modal="edit_repair_service"
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
                                                                                service.service_id
                                                                            }
                                                                            data-modal="delete_repair_service"
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
                                            <InputGroup>
                                                <Input
                                                    name="discount"
                                                    placeholder="Giảm giá ..."
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.5"
                                                    value={discount}
                                                    onChange={(e) =>
                                                        dispatchs(
                                                            handleDiscountChange(e.target.value)
                                                        )
                                                    }
                                                />
                                                <InputGroupAddon addonType="append">
                                                    %
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </Col>
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
                                    <Button color="success" type="submit" name="id">
                                        {modal == "add_price_quote"
                                            ? "Lập phiếu"
                                            : "Cập nhật phiếu"}
                                    </Button>{" "}
                                    <Button
                                        color="secondary"
                                        type="button"
                                        data-modal="add_price_quote"
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
    } else if (modal == "accept_repair") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Xác nhận sửa chữa</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(value) => {
                        dispatchs(handleAcceptRepair(value));
                    }}
                >
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>Bạn có chắc chắn xe đã được sửa chữa xong?</ModalBody>
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
    } else if (modal == "add_collect_vote" || modal == "collect_vote") {
        return (
            <Modal isOpen={isShow} size="lg">
                <ModalHeader>Thanh toán</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateCollectVoteSchema}
                    onSubmit={(value) => {
                        dispatchs(handleCollectVote(value, param));
                    }}
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
                                                placeholder="Nhập tên khách hàng ..."
                                                readonly={true}
                                            />
                                        </Col>
                                        <Col md="6">
                                            <FastField
                                                name="cars.number_car"
                                                component={InputField}
                                                label="Biển số xe"
                                                placeholder="Nhập biển số xe ..."
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
                                        {modal == "add_collect_vote" && (
                                            <Col md="3">
                                                <label>Giảm giá</label>
                                                <InputGroup>
                                                    <FastField
                                                        name="discount"
                                                        component={InputGroupField}
                                                        label="Giảm giá"
                                                        placeholder="0"
                                                        readonly={true}
                                                    />
                                                    <InputGroupAddon addonType="append">
                                                        <InputGroupText>%</InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </Col>
                                        )}
                                        {modal == "collect_vote" && (
                                            <Col md="6">
                                                <FastField
                                                    name="owed"
                                                    component={NumberFormatInput}
                                                    label="Số tiền còn nợ"
                                                    placeholder="Nhập số tiền còn nợ ..."
                                                    readonly={true}
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                    <Row>
                                        <Col md="6">
                                            <FastField
                                                name="collect_date"
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
                    <InvoicesPDF ref={componentRef} data={dataPrint} />
                </div>
                <Formik initialValues={initialValues}>
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
                                        {data.user_collects.length > 0 ? (
                                            <tbody>
                                                {data &&
                                                    data.user_collects.map((collectVote, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{collectVote.name}</td>
                                                                <td>
                                                                    <NumberFormat
                                                                        value={
                                                                            collectVote.pivot.money
                                                                        }
                                                                        displayType={"text"}
                                                                        thousandSeparator={true}
                                                                    />
                                                                    ₫
                                                                </td>
                                                                <td>
                                                                    {moment(
                                                                        new Date(
                                                                            collectVote.pivot.collect_date
                                                                        )
                                                                    ).format("DD/MM/YYYY h:mm")}
                                                                </td>

                                                                <td>
                                                                    <Button
                                                                        data-key={
                                                                            collectVote.pivot.id
                                                                        }
                                                                        data-modal="print_invoice"
                                                                        onClick={(e) =>
                                                                            handlePrintInvoice(e)
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
                                    {/* <Col md="6" lg="6"> */}
                                    <div className="total_price p-2">
                                        <b>
                                            Tổng tiền :{" "}
                                            <NumberFormat
                                                value={data.total_price}
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

RepairVotesModal.propTypes = {
    modal: PropTypes.bool,
};

RepairVotesModal.defaultProps = {
    modal: false,
};

export default RepairVotesModal;
