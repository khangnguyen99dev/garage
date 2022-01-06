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
import { BiEdit, BiTrash } from "react-icons/bi";
import { IoMdPricetags } from "react-icons/io";
import moment from "moment";
import {
    getPaging,
    handleShow,
    handleChangeRow,
    onDateChanges,
    handleChangeStatus,
    handleClearDate,
} from "@/store/actions/ReceiveVotesAction";
import { handlePageChange } from "@/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import ReceiveVotesModal from "./ReceiveVotesModal";
import CarsModal from "../Cars/CarsModal";
import RepairVotesModal from "../RepairVotes/RepairVotesModal";
import RangePicker from "react-range-picker";
import { AiOutlineClear } from "react-icons/ai";

function ReceiveVotes() {
    const pathname = useLocation().pathname.split("/").pop().toUpperCase();

    const path =
        pathname.search("-") > 0
            ? "PAGE_CHANGE_" + pathname.replace("-", "_")
            : "PAGE_CHANGE_" + pathname;

    const dispatchs = useDispatch();

    const props = useSelector((state) => state.ReceiveVotes);

    const { page, per_page, fillterDate, total, search, status } = props.params;

    useEffect(() => {
        dispatchs(getPaging());
    }, [page, per_page, fillterDate, total, search, status, props.load]);

    const renderStatus = (key) => {
        switch (key) {
            case "0":
                return <Badge color="warning">Chờ xử lý</Badge>;
            case "1":
                return <Badge color="info">Đã tiếp nhận</Badge>;
            case "2":
                return <Badge color="warning">Đang xử lý</Badge>;
            case "3":
                return <Badge color="success">Đã hoàn thành</Badge>;
            case "4":
                return <Badge color="danger">Đã hủy</Badge>;
            default:
                return <Badge color="danger">Chưa xác định</Badge>;
        }
    };

    return (
        <Page
            title="Danh sách"
            breadcrumbs={[{ name: "Tiếp nhận xe", active: true }]}
            className="customerTypes"
        >
            <ReceiveVotesModal />
            <RepairVotesModal />
            <CarsModal />

            <Row>
                <Col>
                    <Card className="mb-3">
                        <CardHeader>Tiếp nhận xe</CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="3">
                                    <Button
                                        data-modal="add_receiveVote"
                                        onClick={(e) => dispatchs(handleShow(e))}
                                        className="btn btn-info btn-md"
                                    >
                                        Xe nhập xưởng
                                    </Button>
                                </Col>
                                <Col md="9">
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
                                                        {/* <option value="0">Chờ xử lý</option> */}
                                                        <option value="1">Đã tiếp nhận</option>
                                                        <option value="2">Đang xử lý</option>
                                                        <option value="3">Đã hoàn thành</option>
                                                        <option value="4">Đã hủy</option>
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
                                            <th>Ngày tiếp nhận</th>
                                            <th>Biển số</th>
                                            <th>NV. Lập phiếu</th>
                                            <th>Trạng thái</th>
                                            <th>Yêu cầu</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    {props.data.length > 0 ? (
                                        <tbody>
                                            {props.data &&
                                                props.data.map((receiveVote, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td scope="row">
                                                                {receiveVote.name_cus}
                                                            </td>
                                                            <td>
                                                                {moment(
                                                                    new Date(
                                                                        receiveVote.receive_date
                                                                    )
                                                                ).format("DD/MM/YYYY h:mm")}
                                                            </td>
                                                            <td>{receiveVote.number_car}</td>
                                                            <td>{receiveVote.name_emp}</td>
                                                            <td>
                                                                {renderStatus(receiveVote.status)}
                                                            </td>
                                                            <td>{receiveVote.require}</td>
                                                            <td>
                                                                {receiveVote.status == "1" ? (
                                                                    <Button
                                                                        data-key={receiveVote.id}
                                                                        title="Báo giá"
                                                                        data-modal="add_price_quote"
                                                                        onClick={(e) =>
                                                                            dispatchs(handleShow(e))
                                                                        }
                                                                        className="btn btn-info btn-sm"
                                                                    >
                                                                        <IoMdPricetags />
                                                                    </Button>
                                                                ) : (
                                                                    ""
                                                                )}
                                                                &nbsp;
                                                                {receiveVote.status != "3" && (
                                                                    <Button
                                                                        data-key={receiveVote.id}
                                                                        data-modal="edit_receiveVote"
                                                                        onClick={(e) =>
                                                                            dispatchs(handleShow(e))
                                                                        }
                                                                        className="btn btn-warning btn-sm"
                                                                    >
                                                                        <BiEdit />
                                                                    </Button>
                                                                )}{" "}
                                                                &nbsp;
                                                                <Button
                                                                    data-key={receiveVote.id}
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

export default ReceiveVotes;
