import React, { useEffect } from "react";
import Page from "@/components/Page";
import PageSpinner from "@/components/PageSpinner";
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Row, Table } from "reactstrap";
import Pagination from "react-js-pagination";
import { BsFillEyeFill } from "react-icons/bs";
import {
    getPaging,
    handleShow,
    onDateChanges,
    handleChangeStar,
    handleClearDate,
} from "@/store/actions/FeedbacksAction";
import { handlePageChange } from "@/store/actions";
import { useDispatch, useSelector } from "react-redux";
import StarRatings from "react-star-ratings";
import { useLocation } from "react-router";
import moment from "moment";
import FeedbacksModal from "./FeedbacksModal";
import RangePicker from "react-range-picker";
import { AiOutlineClear } from "react-icons/ai";

function Feedbacks() {
    const pathname = useLocation().pathname.split("/").pop().toUpperCase();

    const path =
        pathname.search("-") > 0
            ? "PAGE_CHANGE_" + pathname.replace("-", "_")
            : "PAGE_CHANGE_" + pathname;

    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Feedbacks);

    const { page, per_page, fillterDate, total, search, fillterStar } = props.params;

    useEffect(() => {
        dispatchs(getPaging());
    }, [page, per_page, fillterDate, total, search, fillterStar, props.load]);

    return (
        <Page
            title="Phản hồi"
            breadcrumbs={[{ name: "Phản hồi", active: true }]}
            className="Feedbacks"
        >
            <FeedbacksModal />
            <Row>
                <Col>
                    <Card className="mb-3">
                        <CardHeader>Phản hồi</CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="6"></Col>
                                <Col>
                                    <Row>
                                        <Col className="text-center" md="9">
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
                                        <Col md="3">
                                            <FormGroup>
                                                <Input
                                                    className="form-control-md"
                                                    type="select"
                                                    name="select"
                                                    onChange={(e) => dispatchs(handleChangeStar(e))}
                                                >
                                                    <option value="">Số sao</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {props.isLoading ? (
                                <PageSpinner />
                            ) : (
                                <Table hover responsive className="text-center">
                                    <thead>
                                        <tr>
                                            <th>Khách hàng</th>
                                            <th>Số xe</th>
                                            <th>Ngày sửa chữa</th>
                                            <th>Số sao</th>
                                            <th>Nội dung</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    {props.data.length > 0 ? (
                                        <tbody>
                                            {props.data &&
                                                props.data.map((feedback, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td scope="row">{feedback.name_cus}</td>
                                                            <td>{feedback.number_car}</td>
                                                            <td>
                                                                {moment(
                                                                    feedback.repair_date
                                                                ).format("hh:mm DD/MM/YYYY")}
                                                            </td>
                                                            <td>
                                                                <StarRatings
                                                                    rating={feedback.rating}
                                                                    starDimension="15px"
                                                                    starSpacing="1px"
                                                                    starRatedColor="rgb(230, 67, 47)"
                                                                    numberOfStars={5}
                                                                    name="rating"
                                                                />
                                                            </td>
                                                            <td>{feedback.content}</td>
                                                            <td>
                                                                <Button
                                                                    data-key={feedback.id}
                                                                    data-modal="show_detail_feedback"
                                                                    title="Xem chi tiết"
                                                                    onClick={(e) =>
                                                                        dispatchs(handleShow(e))
                                                                    }
                                                                    className="btn btn-info btn-sm"
                                                                >
                                                                    <BsFillEyeFill />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td colSpan={6}>Không có dữ liệu!</td>
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

export default Feedbacks;
