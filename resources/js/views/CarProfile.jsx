import React, { useEffect } from "react";
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Table } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getPagingCars, handleShow } from "@/store/actions/ClientsAction";
import { BiEdit, BiTrash } from "react-icons/bi";
import CarProfileModal from "./CarProfileModal";

function CarProfile() {
    const dispatchs = useDispatch();

    const auth = useSelector((state) => state.Auth);

    const props = useSelector((state) => state.Clients);

    useEffect(() => {
        dispatchs(getPagingCars());
    }, [props.params.page, props.params.total, props.params.search, props.load]);

    return (
        <div className="section profile-content">
            <CarProfileModal />
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
                            <CardHeader>Thông tin xe</CardHeader>
                            <CardBody>
                                <Button
                                    data-modal="add_car"
                                    onClick={(e) => dispatchs(handleShow(e))}
                                    className="btn btn-info btn-sm"
                                >
                                    Thêm xe
                                </Button>
                                <Table hover responsive className="text-center">
                                    <thead>
                                        <tr>
                                            <th>Biển số</th>
                                            <th>Hãng xe</th>
                                            <th>Đời xe</th>
                                            <th>Tỉnh thành</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    {props.dataCars.length > 0 ? (
                                        <tbody>
                                            {props.dataCars &&
                                                props.dataCars.map((car, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td scope="row">{car.number_car}</td>
                                                            <td>{car.name_car_brand}</td>
                                                            <td>{car.made_year}</td>
                                                            <td>{car.province}</td>
                                                            <td>
                                                                <Button
                                                                    data-key={car.number_car}
                                                                    data-modal="edit_car"
                                                                    onClick={(e) =>
                                                                        dispatchs(handleShow(e))
                                                                    }
                                                                    className="btn btn-warning btn-sm"
                                                                >
                                                                    <BiEdit />
                                                                </Button>{" "}
                                                                &nbsp;
                                                                <Button
                                                                    data-key={car.number_car}
                                                                    data-modal="delete_car"
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
                                                <td colSpan={6}>Không có dữ liệu!</td>
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

export default CarProfile;
