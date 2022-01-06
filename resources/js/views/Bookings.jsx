import React, { useEffect } from "react";
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
    Table,
} from "reactstrap";
import { FastField, Form, Formik } from "formik";
import InputGroupField from "@/custom-fields/InputGroupField";
import * as Yup from "yup";
import moment from "moment";
import SelectField from "@/custom-fields/SelectField";
import { Booking, handleBookingRepair, handleShow } from "@/store/actions/ClientsAction";
import { useDispatch, useSelector } from "react-redux";
import { BsEyeFill } from "react-icons/bs";

function Bookings() {
    const initialValues = {
        number_car_id: "",
        km_into: "",
        repair_date: "",
        require: "",
        car_condition: "",
    };

    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Clients);

    const { load } = props;
    useEffect(() => {
        dispatchs(handleBookingRepair());
    }, [load]);

    const renderStatus = (key) => {
        switch (key) {
            case "0":
                return <Badge color="warning">Chờ duyệt</Badge>;
            case "4":
                return <Badge color="danger">Đã hủy</Badge>;
            default:
                return <Badge color="danger">Chưa xác định</Badge>;
        }
    };

    const validateSchema = Yup.object().shape({
        number_car_id: Yup.string().required("Vui lòng nhập biển số xe!"),
        repair_date: Yup.date()
            .min(
                moment().startOf("days").add(8, "hours"),
                "Ngày sửa chữa phải lớn 8h sáng hôm nay!"
            )
            .required("Vui lòng chọn ngày sửa chữa!"),

        car_condition: Yup.string().required("Vui lòng nhập tình trạng xe!"),
    });

    return (
        <>
            <div className="main">
                <div className="section landing-section">
                    <Container>
                        <Row>
                            <Col className="ml-auto mr-auto" md="8">
                                <h2 className="text-center">Đăng ký sửa chữa</h2>
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validateSchema}
                                    onSubmit={(value, e) => dispatchs(Booking(value, e))}
                                >
                                    {(formikProps) => {
                                        return (
                                            <Form className="contact-form">
                                                <Row>
                                                    <Col md="6">
                                                        <label>Biển số xe</label>{" "}
                                                        <label style={{ color: "red" }}>(*)</label>
                                                        <FastField
                                                            name="number_car_id"
                                                            component={SelectField}
                                                            placeholder="Chọn biển số xe ..."
                                                            id="car-profile:number_car,number_car"
                                                        />
                                                    </Col>
                                                    <Col md="6">
                                                        <label>Thời gian yêu cầu</label>{" "}
                                                        <label style={{ color: "red" }}>(*)</label>
                                                        <FastField
                                                            name="repair_date"
                                                            component={InputGroupField}
                                                            type="datetime-local"
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="6">
                                                        <label>Số km đã chạy</label>{" "}
                                                        <InputGroup>
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                    <i className="fa fa-truck"></i>
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <FastField
                                                                name="km_into"
                                                                component={InputGroupField}
                                                                label="Số km đã đi"
                                                                placeholder="Nhập số km đã đi ..."
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                    <Col md="6">
                                                        <label>Yêu cầu</label>{" "}
                                                        <InputGroup>
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                    <i className="fa fa-comments"></i>
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <FastField
                                                                name="require"
                                                                component={InputGroupField}
                                                                label="Yêu cầu"
                                                                placeholder="Nhập yêu cầu ..."
                                                            />
                                                        </InputGroup>
                                                    </Col>
                                                </Row>
                                                <label>Tình trạng xe</label>
                                                <label style={{ color: "red" }}>(*)</label>
                                                <FastField
                                                    name="car_condition"
                                                    component={InputGroupField}
                                                    type="textarea"
                                                    label="Tình trạng xe"
                                                    placeholder="Nhập tình trạng xe ..."
                                                />
                                                <Row>
                                                    <Col className="ml-auto mr-auto" md="4">
                                                        <Button
                                                            className="btn-fill"
                                                            color="danger"
                                                            size="lg"
                                                            type="submit"
                                                        >
                                                            Gửi yêu cầu
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        );
                                    }}
                                </Formik>
                                <div id="recaptcha"></div>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Card className="mb-3">
                                    <CardHeader>Đăng ký sửa chữa</CardHeader>
                                    <CardBody>
                                        <Table hover responsive className="text-center">
                                            <thead>
                                                <tr>
                                                    <th>Xe</th>
                                                    <th>Ngày yêu cầu</th>
                                                    <th>Yêu cầu</th>
                                                    <th>Trạng thái</th>
                                                    <th>Hành động</th>
                                                </tr>
                                            </thead>
                                            {props.dataBookingRepair.length > 0 ? (
                                                <tbody>
                                                    {props.dataBookingRepair &&
                                                        props.dataBookingRepair.map(
                                                            (booking_repair, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td scope="row">
                                                                            {
                                                                                booking_repair.number_car
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {moment(
                                                                                booking_repair.repair_date
                                                                            ).format(
                                                                                "hh:mm DD/MM/YYYY"
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {booking_repair.require}
                                                                        </td>
                                                                        <td>
                                                                            {renderStatus(
                                                                                booking_repair.status
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {booking_repair.status ==
                                                                                "0" && (
                                                                                <Button
                                                                                    data-key={
                                                                                        booking_repair.id
                                                                                    }
                                                                                    data-modal="cancel_booking_repair"
                                                                                    onClick={(e) =>
                                                                                        dispatchs(
                                                                                            handleShow(
                                                                                                e
                                                                                            )
                                                                                        )
                                                                                    }
                                                                                    className="btn btn-danger btn-sm"
                                                                                >
                                                                                    Hủy
                                                                                </Button>
                                                                            )}

                                                                            {booking_repair.status ==
                                                                                "4" && (
                                                                                <Button
                                                                                    data-key={
                                                                                        booking_repair.id
                                                                                    }
                                                                                    data-modal="show_detail_cancel"
                                                                                    onClick={(e) =>
                                                                                        dispatchs(
                                                                                            handleShow(
                                                                                                e
                                                                                            )
                                                                                        )
                                                                                    }
                                                                                    className="btn btn-info btn-sm"
                                                                                >
                                                                                    <BsEyeFill />
                                                                                </Button>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
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
            </div>
        </>
    );
}

export default Bookings;
