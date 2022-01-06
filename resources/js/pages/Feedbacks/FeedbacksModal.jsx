import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col, Label } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { handleShow } from "@/store/actions/FeedbacksAction";
import StarRatings from "react-star-ratings";
import NumberFormat from "react-number-format";
import moment from "moment";

function FeedbacksModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Feedbacks);

    const { modal, data, isShow } = props.show;

    if (modal == "show_detail_feedback") {
        return (
            <Modal isOpen={isShow} size="lg">
                <ModalHeader>Thông tin chi tiết</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md="6">
                            <Label className="font-weight-bold">Khách hàng</Label>
                            <p>{data.name_cus}</p>
                        </Col>
                        <Col md="6">
                            <Label className="font-weight-bold">Biển số</Label>
                            <p>{data.number_car}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <Label className="font-weight-bold">Đánh giá</Label>
                            <div className="d-block">
                                <StarRatings
                                    rating={data.rating || 0}
                                    starDimension="15px"
                                    starSpacing="1px"
                                    starRatedColor="rgb(230, 67, 47)"
                                    numberOfStars={5}
                                    name="rating"
                                />
                            </div>
                        </Col>
                        <Col md="6">
                            <Label className="font-weight-bold">Phản hồi</Label>
                            <p>{data.content}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <Label className="font-weight-bold">Tổng tiền</Label>
                            <p>
                                <NumberFormat
                                    value={data.total_price}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                />
                                ₫
                            </p>
                        </Col>
                        <Col md="6">
                            <Label className="font-weight-bold">Giảm giá</Label>
                            <p>{data.discount} %</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <Label className="font-weight-bold">Ngày sửa chữa</Label>
                            <p>{moment(data.repair_date).format("hh:mm DD/MM/YYYY")}</p>
                        </Col>
                        <Col md="6">
                            <Label className="font-weight-bold">Đã thanh toán</Label>
                            <p>
                                <NumberFormat
                                    value={data.paymented}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                />
                                ₫
                            </p>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
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
            </Modal>
        );
    } else {
        return <div></div>;
    }
}

FeedbacksModal.propTypes = {
    modal: PropTypes.bool,
};

FeedbacksModal.defaultProps = {
    modal: false,
};

export default FeedbacksModal;
