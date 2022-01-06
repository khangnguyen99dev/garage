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
import moment from "moment";
import {
    getPaging,
    handleShow,
    onDateChanges,
    handleChangeRow,
} from "@/store/actions/BookingsAction";
import { handlePageChange } from "@/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import BookingsModal from "./BookingsModal";
import RangePicker from "react-range-picker";

function Bookings() {
    const pathname = useLocation().pathname.split("/").pop().toUpperCase();

    const path =
        pathname.search("-") > 0
            ? "PAGE_CHANGE_" + pathname.replace("-", "_")
            : "PAGE_CHANGE_" + pathname;

    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Bookings);

    const { page, per_page, fillterDate, total, search } = props.params;

    useEffect(() => {
        dispatchs(getPaging());
    }, [page, per_page, fillterDate, total, search, props.load]);

    return (
        <Page
            title="Danh sách"
            breadcrumbs={[{ name: "Đăng ký sửa chữa", active: true }]}
            className="customerTypes"
        >
            <BookingsModal />
            <Row>
                <Col>
                    <Card className="mb-3">
                        <CardHeader>Đăng ký sửa chữa</CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="5"> </Col>
                                <Col>
                                    <div className="date-picker-end">
                                        <Row>
                                            <Col>
                                                <RangePicker
                                                    placeholderText="Từ ngày / Đến ngày"
                                                    onDateSelected={(start, end) =>
                                                        dispatchs(onDateChanges(start, end))
                                                    }
                                                />
                                            </Col>
                                            <Col>
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
                                            <th>Ngày yêu cầu</th>
                                            <th>Biển số</th>
                                            <th>Tình trạng</th>
                                            <th>Yêu cầu</th>
                                            <th>Trạng thái</th>
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
                                                                        receiveVote.repair_date
                                                                    )
                                                                ).format("DD/MM/YYYY h:mm")}
                                                            </td>
                                                            <td>{receiveVote.number_car}</td>
                                                            <td>{receiveVote.car_condition}</td>
                                                            <td>{receiveVote.require}</td>
                                                            <td>
                                                                {receiveVote.status == 0 && (
                                                                    <Badge color="warning">
                                                                        Chờ duyệt
                                                                    </Badge>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    data-key={receiveVote.id}
                                                                    data-modal="accept_receiveVote"
                                                                    onClick={(e) =>
                                                                        dispatchs(handleShow(e))
                                                                    }
                                                                    className="btn btn-info btn-sm"
                                                                >
                                                                    Duyệt
                                                                </Button>
                                                                &nbsp;
                                                                <Button
                                                                    data-key={receiveVote.id}
                                                                    data-modal="cancel_receiveVote"
                                                                    onClick={(e) =>
                                                                        dispatchs(handleShow(e))
                                                                    }
                                                                    className="btn btn-danger btn-sm"
                                                                >
                                                                    Hủy
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

export default Bookings;
