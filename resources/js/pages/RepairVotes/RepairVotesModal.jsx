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
                "Ng??y s???a ch???a ph???i l???n h??n ho???c b???ng ng??y hi???n t???i!"
            )
            .required("Vui l??ng nh???p ng??y s???a ch???a"),
        expecte_date: Yup.date()
            .min(
                moment(modal == "add_vote_price" ? data.repair_date : new Date()).format(
                    "YYYY-MM-DDThh:mm"
                ),
                "Ng??y d??? ki???n ho??n th??nh ph???i l???n h??n ng??y s???a ch???a!"
            )
            .required("Vui l??ng ch???n ng??y d??? ki???n ho??n th??nh"),
        user_id: Yup.number().required("Vui l??ng ch???n nh??n vi??n k??? thu???t!"),
    });

    const validateEditSchema = Yup.object().shape({
        repair_date: Yup.date().required("Vui l??ng nh???p ng??y s???a ch???a"),
        user_id: Yup.number().required("Vui l??ng ch???n nh??n vi??n k??? thu???t!"),
    });

    const validateCollectVoteSchema =
        modal == "collect_vote" || modal == "add_collect_vote"
            ? Yup.object().shape({
                  collect_date: Yup.date()
                      .min(
                          moment(new Date()).format("YYYY-MM-DD[T]hh:mm"),
                          "Ng??y s???a ch???a ph???i l???n h??n ho???c b???ng ng??y hi???n t???i!"
                      )
                      .required("Vui l??ng nh???p ng??y s???a ch???a"),
                  money: Yup.number()
                      .min(0, "S??? ti???n tr??? ph???i l???n h??n 0!")
                      .max(
                          parseInt(data.total_price) - parseInt(data.paymented),
                          "S??? ti???n tr??? kh??ng ???????c l???n h??n s??? ti???n n???!"
                      )
                      .required("Vui l??ng nh???p s??? ti???n!"),
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
                    {modal == "add_price_quote" ? "L???p phi???u s???a ch???a" : "Ch???nh s???a phi???u s???a ch???a"}
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
                                                label="T??n kh??ch h??ng"
                                                placeholder="T??n kh??ch h??ng ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="number_car_id"
                                                component={InputFields}
                                                label="Bi???n s??? xe"
                                                placeholder="Bi???n s??? xe ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="receive_date"
                                                component={InputFields}
                                                label="Ng??y ti???p nh???n"
                                                type="datetime-local"
                                                placeholder="Ng??y ti???p nh???n ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="repair_date"
                                                component={InputField}
                                                label="Ng??y s???a ch???a"
                                                type="datetime-local"
                                                placeholder="Ng??y s???a ch???a ..."
                                            />
                                            <FastField
                                                name="user_id"
                                                component={SelectField}
                                                label="Nh??n vi??n k??? thu???t"
                                                placeholder="Nh??n vi??n k??? thu???t ..."
                                                id="employee-technical:id,name"
                                                data={initialValues.users}
                                            />
                                        </Col>
                                        <Col md="6">
                                            <FastField
                                                name="cars.customers.address"
                                                component={InputFields}
                                                label="?????a ch???"
                                                placeholder="?????a ch??? ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="cars.customers.phone"
                                                component={InputFields}
                                                label="S??? ??i???n tho???i"
                                                placeholder="S??? ??i???n tho???i ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="require"
                                                component={InputFields}
                                                label="Y??u c???u"
                                                placeholder="Y??u c???u ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="expecte_date"
                                                component={InputField}
                                                label="D??? ki???n ho??n th??nh"
                                                type="datetime-local"
                                                placeholder="Ng??y d??? ki???n ho??n th??nh ..."
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
                                                    <th>Ph??? t??ng</th>
                                                    <th>S??? l?????ng</th>
                                                    <th>Gi??</th>
                                                    <th>Th??nh ti???n</th>
                                                    <th>H??nh ?????ng</th>
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
                                                                        ???
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
                                                                        ???
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
                                                        <td colSpan={5}>Kh??ng c?? d??? li???u!</td>
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
                                                    <th>D???ch v???</th>
                                                    <th>Gi??</th>
                                                    <th>Ghi ch??</th>
                                                    <th>H??nh ?????ng</th>
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
                                                                        ???
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
                                                        <td colSpan={5}>Kh??ng c?? d??? li???u!</td>
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
                                                    placeholder="Gi???m gi?? ..."
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
                                                    T???ng ti???n :{" "}
                                                    <NumberFormat
                                                        value={total_price}
                                                        displayType={"text"}
                                                        thousandSeparator={true}
                                                    />
                                                    ???
                                                </b>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Button color="success" type="submit" name="id">
                                        {modal == "add_price_quote"
                                            ? "L???p phi???u"
                                            : "C???p nh???t phi???u"}
                                    </Button>{" "}
                                    <Button
                                        color="secondary"
                                        type="button"
                                        data-modal="add_price_quote"
                                        onClick={(e) => {
                                            dispatchs(handleShow(e));
                                        }}
                                    >
                                        ????ng
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
                <ModalHeader>X??c nh???n s???a ch???a</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(value) => {
                        dispatchs(handleAcceptRepair(value));
                    }}
                >
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>B???n c?? ch???c ch???n xe ???? ???????c s???a ch???a xong?</ModalBody>
                                <ModalFooter>
                                    <Button color="success" type="submit" name="id">
                                        X??c nh???n
                                    </Button>{" "}
                                    <Button
                                        color="secondary"
                                        type="button"
                                        onClick={(e) => {
                                            dispatchs(handleShow(e));
                                        }}
                                    >
                                        ????ng
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
                <ModalHeader>Thanh to??n</ModalHeader>
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
                                                label="Kh??ch h??ng"
                                                placeholder="Nh???p t??n kh??ch h??ng ..."
                                                readonly={true}
                                            />
                                        </Col>
                                        <Col md="6">
                                            <FastField
                                                name="cars.number_car"
                                                component={InputField}
                                                label="Bi???n s??? xe"
                                                placeholder="Nh???p bi???n s??? xe ..."
                                                readonly={true}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6">
                                            <FastField
                                                name="total_price"
                                                component={NumberFormatInput}
                                                label="T???ng ti???n"
                                                placeholder="Nh???p t???ng ti???n ..."
                                                readonly={true}
                                            />
                                        </Col>
                                        {modal == "add_collect_vote" && (
                                            <Col md="3">
                                                <label>Gi???m gi??</label>
                                                <InputGroup>
                                                    <FastField
                                                        name="discount"
                                                        component={InputGroupField}
                                                        label="Gi???m gi??"
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
                                                    label="S??? ti???n c??n n???"
                                                    placeholder="Nh???p s??? ti???n c??n n??? ..."
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
                                                label="Ng??y l???p phi???u"
                                                placeholder="Ch???n ng??y l???p phi???u ..."
                                            />
                                        </Col>
                                        <Col md="6">
                                            <FastField
                                                name="money"
                                                component={NumberFormatInput}
                                                label="S??? ti???n"
                                                placeholder="Nh???p s??? ti???n ..."
                                            />
                                        </Col>
                                    </Row>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        Thanh to??n
                                    </Button>{" "}
                                    <Button
                                        color="secondary"
                                        type="button"
                                        onClick={(e) => {
                                            dispatchs(handleShow(e));
                                        }}
                                    >
                                        ????ng
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
                <ModalHeader>In h??a ????n</ModalHeader>
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
                                                <th>Nh??n vi??n l???p h??a ????n</th>
                                                <th>???? tr???</th>
                                                <th>Ng??y tr???</th>
                                                <th>H??nh ?????ng</th>
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
                                                                    ???
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
                                                                        title="In h??a ????n"
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
                                                    <td colSpan={7}>Kh??ng c?? d??? li???u!</td>
                                                </tr>
                                            </tbody>
                                        )}
                                    </Table>
                                </ModalBody>
                                <ModalFooter>
                                    {/* <Col md="6" lg="6"> */}
                                    <div className="total_price p-2">
                                        <b>
                                            T???ng ti???n :{" "}
                                            <NumberFormat
                                                value={data.total_price}
                                                displayType={"text"}
                                                thousandSeparator={true}
                                            />
                                            ???
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
                                        ????ng
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
                <ModalHeader>X??a phi???u ti???p nh???n</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(value) => {
                        dispatchs(handleDelete(value));
                    }}
                >
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>B???n c?? th???c s??? mu???n x??a?</ModalBody>
                                <ModalFooter>
                                    <Button color="danger" type="submit" name="id">
                                        X??a
                                    </Button>{" "}
                                    <Button
                                        color="secondary"
                                        type="button"
                                        onClick={(e) => {
                                            dispatchs(handleShow(e));
                                        }}
                                    >
                                        ????ng
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
