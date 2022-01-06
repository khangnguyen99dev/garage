import React, { useEffect } from "react";
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
import ImportVotesModal from "./ImportVotesModal";
import { BiEdit, BiTrash } from "react-icons/bi";
import { GoCheck } from "react-icons/go";
import {
    getPaging,
    handleShow,
    onDateChanges,
    handleChangeRow,
    handleClearDate,
} from "@/store/actions/ImportVotesAction";
import { handlePageChange } from "@/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import NumberFormat from "react-number-format";
import moment from "moment";
import { AiFillPrinter, AiOutlineClear } from "react-icons/ai";
import RangePicker from "react-range-picker";
import { BsCreditCard } from "react-icons/bs";

function ImportVotes() {
    const pathname = useLocation().pathname.split("/").pop().toUpperCase();

    const path =
        pathname.search("-") > 0
            ? "PAGE_CHANGE_" + pathname.replace("-", "_")
            : "PAGE_CHANGE_" + pathname;

    const dispatchs = useDispatch();

    const props = useSelector((state) => state.ImportVotes);

    const { page, per_page, fillterDate, total, search } = props.params;

    useEffect(() => {
        dispatchs(getPaging());
    }, [page, per_page, fillterDate, total, search, props.load]);

    const renderStatus = (key) => {
        switch (key) {
            case "0":
                return <Badge color="info">Chờ xử lý</Badge>;
            case "1":
                return <Badge color="warning">Chờ thanh toán</Badge>;
            case "2":
                return <Badge color="warning">Còn nợ</Badge>;
            case "3":
                return <Badge color="success">Đã hoàn thành</Badge>;
            default:
                return <Badge color="danger">Chưa xác định</Badge>;
        }
    };

    const renderButtonEdit = (status, id) => {
        if (status !== "2" && status !== "3") {
            return (
                <>
                    <Button
                        data-key={id}
                        data-modal="edit_import_vote"
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

    return (
        <Page
            title="Phiếu nhập hàng"
            breadcrumbs={[{ name: "Phiếu nhập hàng", active: true }]}
            className="ImportVotes"
        >
            <ImportVotesModal />
            <Row>
                <Col>
                    <Card className="mb-3">
                        <CardHeader>Phiếu nhập hàng</CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="3">
                                    <Button
                                        data-modal="add_import_vote"
                                        onClick={(e) => dispatchs(handleShow(e))}
                                        className="btn btn-info btn-sm"
                                    >
                                        Thêm Phiếu nhập hàng
                                    </Button>
                                </Col>
                                <Col>
                                    <div className="date-picker-end">
                                        <Row>
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
                                            <th>Mã phiếu</th>
                                            <th>Ngày lập phiếu</th>
                                            <th>Nhân viên</th>
                                            <th>Nhà cung cấp</th>
                                            <th>Tổng tiền</th>
                                            <th>Đã chi</th>
                                            <th>Trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    {props.data.length > 0 ? (
                                        <tbody>
                                            {props.data &&
                                                props.data.map((import_vote, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td scope="row">
                                                                {import_vote.import_code}
                                                            </td>
                                                            <td>
                                                                {moment(
                                                                    new Date(import_vote.vote_date)
                                                                ).format("DD/MM/YYYY h:mm")}
                                                            </td>
                                                            <td>{import_vote.name_emp}</td>
                                                            <td>{import_vote.name_supplier}</td>
                                                            <td>
                                                                <NumberFormat
                                                                    value={import_vote.total_price}
                                                                    displayType={"text"}
                                                                    thousandSeparator={true}
                                                                />
                                                                ₫
                                                            </td>
                                                            <td>
                                                                <NumberFormat
                                                                    value={import_vote.payment}
                                                                    displayType={"text"}
                                                                    thousandSeparator={true}
                                                                />
                                                                ₫
                                                            </td>
                                                            <td>
                                                                {renderStatus(import_vote.status)}
                                                            </td>
                                                            <td>
                                                                {import_vote.status == 0 && (
                                                                    <Button
                                                                        data-key={import_vote.id}
                                                                        data-modal="confirm_import_vote"
                                                                        onClick={(e) =>
                                                                            dispatchs(handleShow(e))
                                                                        }
                                                                        className="btn btn-success btn-sm"
                                                                    >
                                                                        <GoCheck />
                                                                    </Button>
                                                                )}{" "}
                                                                &nbsp;
                                                                <Button
                                                                    data-key={import_vote.id}
                                                                    data-modal="show_print_payment"
                                                                    onClick={(e) =>
                                                                        dispatchs(handleShow(e))
                                                                    }
                                                                    className="btn btn-info btn-sm"
                                                                    title="In phiếu nhập hàng"
                                                                >
                                                                    <AiFillPrinter />
                                                                </Button>
                                                                &nbsp;
                                                                {import_vote.status == "1" && (
                                                                    <Button
                                                                        data-key={import_vote.id}
                                                                        data-modal="supplier_payment"
                                                                        onClick={(e) =>
                                                                            dispatchs(handleShow(e))
                                                                        }
                                                                        className="btn btn-success btn-sm"
                                                                        title="Thanh toán"
                                                                    >
                                                                        <BsCreditCard />
                                                                    </Button>
                                                                )}
                                                                {import_vote.status == "2" && (
                                                                    <Button
                                                                        data-key={import_vote.id}
                                                                        data-modal="supplier_payment"
                                                                        onClick={(e) =>
                                                                            dispatchs(handleShow(e))
                                                                        }
                                                                        className="btn btn-success btn-sm"
                                                                        title="Thanh toán"
                                                                    >
                                                                        <BsCreditCard />
                                                                    </Button>
                                                                )}
                                                                &nbsp;
                                                                {renderButtonEdit(
                                                                    import_vote.status,
                                                                    import_vote.id
                                                                )}
                                                                <Button
                                                                    data-key={import_vote.id}
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

export default ImportVotes;
