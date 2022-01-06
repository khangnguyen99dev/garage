import React, { useEffect, useRef, useState } from "react";
import Page from "@/components/Page";
import PageSpinner from "@/components/PageSpinner";
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    FormGroup,
    Input,
    Row,
    Table,
} from "reactstrap";
import Pagination from "react-js-pagination";
import { BiEdit, BiTask, BiTrash } from "react-icons/bi";
import {
    getPaging,
    handleShow,
    onDateChanges,
    handleChangeRow,
    handleChangeStatus,
    handleClearDate,
} from "@/store/actions/RepairVotesAction";
import { handlePageChange } from "@/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import QuotePricePDF from "../PrintPDF/QuotePricePDF";
import { useReactToPrint } from "react-to-print";
import ServiceCrud from "@/services/ServiceCrud";
import { AiFillPrinter, AiOutlineClear } from "react-icons/ai";
import { FaCalendarCheck } from "react-icons/fa";
import { BsCreditCard } from "react-icons/bs";
import NumberFormat from "react-number-format";
import moment from "moment";
import RepairVotesModal from "./RepairVotesModal";
import ExportVotesModal from "../ExportVotes/ExportVotesModal";
import RangePicker from "react-range-picker";

function RepairVotes() {
    const pathname = useLocation().pathname.split("/").pop().toUpperCase();

    const path =
        pathname.search("-") > 0
            ? "PAGE_CHANGE_" + pathname.replace("-", "_")
            : "PAGE_CHANGE_" + pathname;

    const dispatchs = useDispatch();

    const componentRef = useRef();

    const props = useSelector((state) => state.RepairVotes);

    const { page, per_page, fillterDate, total, search, status } = props.params;

    useEffect(() => {
        dispatchs(getPaging());
    }, [page, per_page, fillterDate, total, search, status, props.load]);

    const renderStatus = (key) => {
        switch (key) {
            case "0":
                return <Badge color="info">Chờ xác nhận</Badge>;
            case "1":
                return <Badge color="warning">Chờ xuất kho</Badge>;
            case "2":
                return <Badge color="warning">Chờ sửa chữa</Badge>;
            case "3":
                return <Badge color="warning">Chờ thanh toán</Badge>;
            case "4":
                return <Badge color="warning">Còn nợ</Badge>;
            case "5":
                return <Badge color="success">Đã thanh toán</Badge>;
            default:
                return <Badge color="danger">Chưa xác định</Badge>;
        }
    };

    const renderButton = (key, id) => {
        switch (key) {
            case "0":
                return (
                    <Button
                        data-key={id}
                        data-modal="add_export_vote"
                        onClick={(e) => dispatchs(handleShow(e))}
                        className="btn btn-info btn-sm"
                        title="Lập phiếu xuất phụ tùng"
                    >
                        <BiTask />
                    </Button>
                );
            case "2":
                return (
                    <Button
                        data-key={id}
                        data-modal="accept_repair"
                        onClick={(e) => dispatchs(handleShow(e))}
                        className="btn btn-primary btn-sm"
                        title="Xác nhận sửa chữa"
                    >
                        <FaCalendarCheck />
                    </Button>
                );
            case "3":
                return (
                    <Button
                        data-key={id}
                        data-modal="add_collect_vote"
                        onClick={(e) => dispatchs(handleShow(e))}
                        className="btn btn-success btn-sm"
                        title="Thanh toán"
                    >
                        <BsCreditCard />
                    </Button>
                );
            case "4":
                return (
                    <Button
                        data-key={id}
                        data-modal="collect_vote"
                        onClick={(e) => dispatchs(handleShow(e))}
                        className="btn btn-success btn-sm"
                        title="Thanh toán"
                    >
                        <BsCreditCard />
                    </Button>
                );
            default:
                break;
        }
    };

    const renderButtonEdit = (status, id) => {
        if (status !== "4" && status !== "5") {
            return (
                <>
                    <Button
                        data-key={id}
                        data-modal="edit_repairVote"
                        onClick={(e) => dispatchs(handleShow(e))}
                        className="btn btn-warning btn-sm"
                    >
                        <BiEdit />
                    </Button>
                    &nbsp;
                </>
            );
        }
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const [data, setData] = useState({
        name: "",
        number_car_id: "",
        address: "",
        repair_date: "",
        users: {
            name: "",
        },
        cars: {
            customers: {
                name: "",
                address: "",
                phone: "",
            },
        },
        services: [],
        products: [],
        discount: 0,
        total_price: 0,
    });

    const [action, setAction] = useState("");

    const handleAPI = async (e, action) => {
        if (action) {
            const { key } = e.target.dataset;
            await ServiceCrud.instance
                .show("repair-votes", key)
                .then((response) => {
                    const { data } = response;
                    setAction(action);
                    setData(data);
                    if (action == "print_repair_order") {
                        document.title =
                            "LSC_" + data.number_car_id + moment(new Date()).format("_DD_MM_YY");
                    } else {
                        document.title =
                            "BG_" + data.number_car_id + moment(new Date()).format("_DD_MM_YY");
                    }
                })
                .catch((error) => {
                    console.log("Error: " + error);
                });
            handlePrint();
        }
    };

    return (
        <Page
            title="Phiếu sửa chữa"
            breadcrumbs={[{ name: "Phiếu sửa chữa", active: true }]}
            className="RepairVotes"
        >
            <div style={{ display: "none" }}>
                <QuotePricePDF ref={componentRef} data={data} action={action} />
            </div>
            <RepairVotesModal />
            <ExportVotesModal />
            <Row>
                <Col>
                    <Card className="mb-3">
                        <CardHeader>Phiếu sửa chữa</CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="5"> </Col>
                                <Col>
                                    <div className="date-picker-end">
                                        <Row>
                                            <Col md="2">
                                                <FormGroup>
                                                    <Input
                                                        type="select"
                                                        name="select"
                                                        onChange={(e) =>
                                                            dispatchs(handleChangeStatus(e))
                                                        }
                                                    >
                                                        <option value="">Tất cả</option>
                                                        <option value="0">Chờ xác nhận</option>
                                                        <option value="1">Chờ xuất kho</option>
                                                        <option value="2">Chờ sửa chữa</option>
                                                        <option value="3">Chờ thanh toán</option>
                                                        <option value="4">Còn nợ</option>
                                                        <option value="5">Đã thanh toán</option>
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col className="text-center">
                                                {fillterDate && (
                                                    <RangePicker
                                                        placeholderText="Từ ngày / Đến ngày"
                                                        defaultValue={{
                                                            startDate: new Date(
                                                                fillterDate.split(",")[0]
                                                            ),
                                                            endDate: new Date(
                                                                fillterDate.split(",")[1]
                                                            ),
                                                        }}
                                                        onDateSelected={(start, end) =>
                                                            dispatchs(onDateChanges(start, end))
                                                        }
                                                    />
                                                )}
                                                {!fillterDate && (
                                                    <RangePicker
                                                        placeholderText="Từ ngày / Đến ngày"
                                                        defaultValue={{
                                                            startDate: null,
                                                            endDate: null,
                                                        }}
                                                        onDateSelected={(start, end) =>
                                                            dispatchs(onDateChanges(start, end))
                                                        }
                                                    />
                                                )}
                                                <Button
                                                    className="btn-md ml-2"
                                                    onClick={() => dispatchs(handleClearDate())}
                                                >
                                                    <AiOutlineClear />
                                                </Button>
                                            </Col>
                                            <Col md="2">
                                                <FormGroup>
                                                    <Input
                                                        className="form-control-md"
                                                        type="select"
                                                        name="select"
                                                        onChange={(e) =>
                                                            dispatchs(handleChangeRow(e))
                                                        }
                                                    >
                                                        <option value="5">5</option>
                                                        <option value="20">20</option>
                                                        <option value="100">100</option>
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                            {props.isLoading ? (
                                <PageSpinner />
                            ) : (
                                <Table hover responsive className="text-center">
                                    <thead>
                                        <tr>
                                            <th>Khách hàng</th>
                                            <th>Biển số</th>
                                            <th>Ngày sửa chữa</th>
                                            <th>NV. Kỹ thuật</th>
                                            <th>Giảm</th>
                                            <th>Tổng tiền</th>
                                            <th>Trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    {props.data.length > 0 ? (
                                        <tbody>
                                            {props.data &&
                                                props.data.map((repairVote, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td scope="row">
                                                                {repairVote.name_cus}
                                                            </td>
                                                            <td>{repairVote.number_car_id}</td>
                                                            <td>
                                                                {moment(
                                                                    new Date(repairVote.repair_date)
                                                                ).format("DD/MM/YYYY h:mm")}
                                                            </td>
                                                            <td>{repairVote.name_emp}</td>
                                                            <td>{repairVote.discount}%</td>
                                                            <td>
                                                                <NumberFormat
                                                                    value={repairVote.total_price}
                                                                    displayType={"text"}
                                                                    thousandSeparator={true}
                                                                />
                                                                ₫
                                                            </td>
                                                            <td>
                                                                {renderStatus(repairVote.status)}
                                                            </td>
                                                            <td>
                                                                {repairVote.status == "4" && (
                                                                    <Button
                                                                        data-key={repairVote.id}
                                                                        data-modal="show_print_payment"
                                                                        onClick={(e) =>
                                                                            dispatchs(handleShow(e))
                                                                        }
                                                                        className="btn btn-primary btn-sm"
                                                                        title="Thanh toán"
                                                                    >
                                                                        <AiFillPrinter />
                                                                    </Button>
                                                                )}
                                                                {repairVote.status == "5" && (
                                                                    <Button
                                                                        data-key={repairVote.id}
                                                                        data-modal="show_print_payment"
                                                                        onClick={(e) =>
                                                                            dispatchs(handleShow(e))
                                                                        }
                                                                        className="btn btn-primary btn-sm"
                                                                        title="Thanh toán"
                                                                    >
                                                                        <AiFillPrinter />
                                                                    </Button>
                                                                )}
                                                                &nbsp;
                                                                {repairVote.status == "4" ||
                                                                repairVote.status == "5" ? (
                                                                    ""
                                                                ) : (
                                                                    <Button
                                                                        data-key={
                                                                            repairVote.receive_vote_id
                                                                        }
                                                                        onClick={
                                                                            repairVote.status == "0"
                                                                                ? (e) =>
                                                                                      handleAPI(
                                                                                          e,
                                                                                          "print_quote_price"
                                                                                      )
                                                                                : (e) =>
                                                                                      handleAPI(
                                                                                          e,
                                                                                          "print_repair_order"
                                                                                      )
                                                                        }
                                                                        className={
                                                                            repairVote.status == "0"
                                                                                ? "btn btn-success btn-sm"
                                                                                : "btn btn-info btn-sm"
                                                                        }
                                                                        title={
                                                                            repairVote.status == "0"
                                                                                ? "In phiếu báo giá"
                                                                                : "In lệnh sửa chữa"
                                                                        }
                                                                    >
                                                                        <AiFillPrinter />
                                                                    </Button>
                                                                )}
                                                                &nbsp;
                                                                {renderButton(
                                                                    repairVote.status,
                                                                    repairVote.status == "0" ||
                                                                        repairVote.status == "3" ||
                                                                        repairVote.status == "4"
                                                                        ? repairVote.receive_vote_id
                                                                        : repairVote.id
                                                                )}
                                                                &nbsp;
                                                                {renderButtonEdit(
                                                                    repairVote.status,
                                                                    repairVote.receive_vote_id
                                                                )}
                                                                <Button
                                                                    data-key={
                                                                        repairVote.receive_vote_id
                                                                    }
                                                                    data-modal="delete"
                                                                    onClick={(e) =>
                                                                        dispatchs(handleShow(e))
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
                                                <td colSpan={8}>Không có dữ liệu!</td>
                                            </tr>
                                        </tbody>
                                    )}
                                </Table>
                            )}
                            <div className="mt-3">
                                <Pagination
                                    firstPageText="Trang đầu"
                                    lastPageText="Trang cuối"
                                    innerClass="pagination justify-content-end"
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    activePage={props.params.page}
                                    itemsCountPerPage={props.params.per_page}
                                    totalItemsCount={props.params.total}
                                    onChange={(pageNumber) => {
                                        dispatchs(handlePageChange(pageNumber, path));
                                    }}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Page>
    );
}

export default RepairVotes;
