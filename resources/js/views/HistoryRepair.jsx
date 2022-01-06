import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPagingHistoryRepair, handleShow } from "@/store/actions/ClientsAction";
import { Badge, Button, Card, CardBody, CardHeader, Col, Container, Row, Table } from "reactstrap";
import NumberFormat from "react-number-format";
import moment from "moment";
import { BsEyeFill } from "react-icons/bs";
import { GiStarsStack } from "react-icons/gi";
import { parseInt } from "lodash";
import _ from "lodash";
import { Link, NavLink } from "react-router-dom";
import { FaRegGrinStars } from "react-icons/fa";

function HistoryRepair() {
    const dispatchs = useDispatch();

    const auth = useSelector((state) => state.Auth);

    const props = useSelector((state) => state.Clients);

    useEffect(() => {
        dispatchs(getPagingHistoryRepair());
    }, [props.load]);

    const renderStatus = (key) => {
        switch (key) {
            case "4":
                return <Badge color="warning">Còn nợ</Badge>;
            case "5":
                return <Badge color="success">Đã hoàn thành</Badge>;
            default:
                return <Badge color="danger">Chưa xác định</Badge>;
        }
    };

    const renderButton = (data, id) => {
        if (!_.isEmpty(data)) {
            return (
                <Button
                    className="btn btn-secondary btn-sm"
                    data-key={id}
                    data-modal="show_feedback"
                    onClick={(e) => dispatchs(handleShow(e))}
                    title="Xem đánh giá"
                >
                    <FaRegGrinStars />
                </Button>
            );
        } else {
            return (
                <NavLink to={"/feedback/" + id} tag={Link}>
                    <Button className="btn btn-success btn-sm" title="Đánh giá">
                        <GiStarsStack />
                    </Button>
                </NavLink>
            );
        }
    };

    return (
        <div className="section profile-content">
            <Container>
                <div className="owner">
                    <div className="avatar">
                        <div className="avatar-uploader__avatar ">
                            <div
                                className="img-circle img-no-padding img-responsive avatar-uploader__avatar-image "
                                style={{
                                    backgroundImage: `url(
                                    ${
                                        auth.user.avatar
                                            ? "../" + auth.user.avatar
                                            : require("@/assets/img/users/default_avatar.jpg")
                                                  .default
                                    }
                                )`,
                                }}
                            ></div>
                        </div>
                    </div>
                    <div className="name">
                        <h4 className="title">
                            {auth.user.name} <br />
                        </h4>
                        <h6 className="description">{auth.user.phone}</h6>
                    </div>
                </div>
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <CardHeader>Lịch sử sửa chữa</CardHeader>
                            <CardBody>
                                <Table hover responsive className="text-center">
                                    <thead>
                                        <tr>
                                            <th>Xe</th>
                                            <th>Ngày sửa chữa</th>
                                            <th>NV. Kỹ Thuật</th>
                                            <th>Giảm giá</th>
                                            <th>Tổng tiền</th>
                                            <th>Còn nợ</th>
                                            <th>Trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    {props.dataHistoryRepairs.length > 0 ? (
                                        <tbody>
                                            {props.dataHistoryRepairs &&
                                                props.dataHistoryRepairs.map(
                                                    (history_repair, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td scope="row">
                                                                    {history_repair.number_car}
                                                                </td>
                                                                <td>
                                                                    {moment(
                                                                        new Date(
                                                                            history_repair.repair_date
                                                                        )
                                                                    ).format("DD/MM/YYYY h:mm")}
                                                                </td>
                                                                <td>{history_repair.name}</td>
                                                                <td>{history_repair.discount} %</td>
                                                                <td>
                                                                    <NumberFormat
                                                                        value={
                                                                            history_repair.total_price
                                                                        }
                                                                        displayType={"text"}
                                                                        thousandSeparator={true}
                                                                    />
                                                                    ₫
                                                                </td>
                                                                <td>
                                                                    <NumberFormat
                                                                        value={
                                                                            parseInt(
                                                                                history_repair.total_price
                                                                            ) -
                                                                            parseInt(
                                                                                history_repair.paymented
                                                                            )
                                                                        }
                                                                        displayType={"text"}
                                                                        thousandSeparator={true}
                                                                    />
                                                                    ₫
                                                                </td>
                                                                <td>
                                                                    {renderStatus(
                                                                        history_repair.status
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {renderButton(
                                                                        history_repair.feed_backs,
                                                                        history_repair.id
                                                                    )}{" "}
                                                                    <Button
                                                                        data-key={
                                                                            history_repair.receive_vote_id
                                                                        }
                                                                        title="Chi tiết sửa chữa"
                                                                        data-modal="history_repair"
                                                                        onClick={(e) =>
                                                                            dispatchs(handleShow(e))
                                                                        }
                                                                        className="btn btn-info btn-sm"
                                                                    >
                                                                        <BsEyeFill />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td colSpan={8}>Không có dữ liệu!</td>
                                            </tr>
                                        </tbody>
                                    )}
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default HistoryRepair;
