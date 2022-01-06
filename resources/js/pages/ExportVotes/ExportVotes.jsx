import React, { useEffect, useState, useRef } from "react";
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
import ExportVotesModal from "./ExportVotesModal";
import { BiEdit, BiTrash } from "react-icons/bi";
import { AiFillPrinter, AiOutlineClear } from "react-icons/ai";
import { CgExport } from "react-icons/cg";
import {
    getPaging,
    handleShow,
    onDateChanges,
    handleChangeRow,
    handleChangeStatus,
    handleClearDate,
} from "@/store/actions/ExportVotesAction";
import { handlePageChange } from "@/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import QuotePricePDF from "../PrintPDF/QuotePricePDF";
import ServiceCrud from "@/services/ServiceCrud";
import RangePicker from "react-range-picker";

function ExportVotes() {
    const pathname = useLocation().pathname.split("/").pop().toUpperCase();

    const path =
        pathname.search("-") > 0
            ? "PAGE_CHANGE_" + pathname.replace("-", "_")
            : "PAGE_CHANGE_" + pathname;

    const dispatchs = useDispatch();

    const componentRef = useRef();

    const props = useSelector((state) => state.ExportVotes);

    const { page, per_page, fillterDate, total, search, status } = props.params;

    useEffect(() => {
        dispatchs(getPaging());
    }, [page, per_page, fillterDate, total, search, status, props.load]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const [action, setAction] = useState("");

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

    const handleAPI = async (e, action) => {
        if (action) {
            const { key } = e.target.dataset;
            await ServiceCrud.instance
                .show("repair-votes", key)
                .then((response) => {
                    const { data } = response;
                    setAction(action);
                    setData(data);
                    document.title =
                        "XK_" + data.number_car_id + moment(new Date()).format("_DD_MM_YY");
                })
                .catch((error) => {
                    console.log("Error: " + error);
                });
            handlePrint();
        }
    };

    return (
        <Page
            title="Phiếu xuất kho"
            breadcrumbs={[{ name: "Phiếu xuất kho", active: true }]}
            className="ExportVotes"
        >
            <ExportVotesModal />
            <div style={{ display: "none" }}>
                <QuotePricePDF ref={componentRef} data={data} action={action} />
            </div>
            <Row>
                <Col>
                    <Card className="mb-3">
                        <CardHeader>Phiếu xuất kho</CardHeader>
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
                                                        <option value="0">Chờ xuất kho</option>
                                                        <option value="1">Đã xuất kho</option>
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
                                            <th>NV. Lập phiếu</th>
                                            <th>Ngày lập phiếu</th>
                                            <th>Ghi chú</th>
                                            <th>Trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    {props.data.length > 0 ? (
                                        <tbody>
                                            {props.data &&
                                                props.data.map((exportVote, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{exportVote.name_cus}</td>
                                                            <td>{exportVote.number_car}</td>
                                                            <td>{exportVote.name_emp}</td>
                                                            <td>
                                                                {moment(
                                                                    new Date(exportVote.vote_date)
                                                                ).format("DD/MM/YYYY h:mm")}
                                                            </td>
                                                            <td>{exportVote.note}</td>
                                                            <td>
                                                                {exportVote.status == "0" ? (
                                                                    <Badge color="warning">
                                                                        Chờ xuất kho
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge color="success">
                                                                        Đã xuất kho
                                                                    </Badge>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    data-key={
                                                                        exportVote.receive_vote_id
                                                                    }
                                                                    onClick={(e) =>
                                                                        handleAPI(
                                                                            e,
                                                                            "print_export_vote"
                                                                        )
                                                                    }
                                                                    className="btn btn-success btn-sm"
                                                                    title="In phiếu xuất kho"
                                                                >
                                                                    <AiFillPrinter />
                                                                </Button>
                                                                &nbsp;
                                                                {exportVote.status == "0" && (
                                                                    <Button
                                                                        data-key={exportVote.id}
                                                                        data-modal="confirm_export_product"
                                                                        onClick={(e) =>
                                                                            dispatchs(handleShow(e))
                                                                        }
                                                                        className="btn btn-info btn-sm"
                                                                    >
                                                                        <CgExport />
                                                                    </Button>
                                                                )}{" "}
                                                                &nbsp;
                                                                {exportVote.status != "1" && (
                                                                    <>
                                                                        <Button
                                                                            data-key={exportVote.id}
                                                                            data-modal="edit_export_vote"
                                                                            onClick={(e) =>
                                                                                dispatchs(
                                                                                    handleShow(e)
                                                                                )
                                                                            }
                                                                            className="btn btn-warning btn-sm"
                                                                        >
                                                                            <BiEdit />
                                                                        </Button>
                                                                        &nbsp;
                                                                    </>
                                                                )}
                                                                <Button
                                                                    data-key={exportVote.id}
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
                                                <td colSpan={7}>Không có dữ liệu!</td>
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

export default ExportVotes;
