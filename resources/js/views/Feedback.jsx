import InputGroupField from "@/custom-fields/InputGroupField";
import { FastField, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Button, Col, Container, Row } from "reactstrap";
import { getFeedback, handleChangeRating } from "@/store/actions/ClientsAction";
import NumberFormatInput from "@/custom-fields/NumberFormat";
import StarRatings from "react-star-ratings";
import * as Yup from "yup";
import ServiceCrud from "@/services/ServiceCrud";
import { info } from "react-notification-system-redux";
import { FcOk } from "react-icons/fc";

export default function Feedback() {
    const { id } = useParams();

    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Clients.dataFeedback);

    const historys = useHistory();

    useEffect(() => {
        dispatchs(getFeedback(id, historys));
    }, []);

    const initialValues = props;

    const validateSchema = Yup.object().shape({
        content: Yup.string().required("Vui lòng nhập nội dung phản hồi!"),
    });

    const handleAddFeedback = (values, e) => {
        const data = {
            repair_vote_id: values.id,
            rating: values.rating,
            content: values.content,
        };

        ServiceCrud.instance
            .create("add-feedback", data)
            .then((response) => {
                if (response.status == 201) {
                    dispatchs(
                        info({
                            title: <FcOk />,
                            message: response.data.message,
                            autoDismiss: 2,
                        })
                    );

                    setTimeout(function () {
                        historys.push("/history-repairs");
                    }, 2000);
                }
                e.resetForm();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <div className="main">
                <div className="section landing-section">
                    <Container>
                        <Row>
                            <Col className="ml-auto mr-auto" md="8">
                                <h2 className="text-center">Phản hồi của khách hàng</h2>
                                <Formik
                                    initialValues={initialValues}
                                    enableReinitialize={true}
                                    validationSchema={validateSchema}
                                    onSubmit={(value, e) => handleAddFeedback(value, e)}
                                >
                                    {(formikProps) => {
                                        return (
                                            <Form className="contact-form">
                                                <Row>
                                                    <Col md="6">
                                                        <label>Biển số xe</label>{" "}
                                                        <FastField
                                                            name="number_car"
                                                            component={InputGroupField}
                                                            placeholder="Chọn biển số xe ..."
                                                            readonly={true}
                                                        />
                                                    </Col>
                                                    <Col md="6">
                                                        <label>Ngày sửa chữa</label>{" "}
                                                        <FastField
                                                            name="repair_date"
                                                            component={InputGroupField}
                                                            type="datetime-local"
                                                            readonly={true}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="6">
                                                        <label>Tổng tiền</label>{" "}
                                                        <FastField
                                                            name="total_price"
                                                            component={NumberFormatInput}
                                                            placeholder="Nhập tổng tiền ..."
                                                            readonly={true}
                                                        />
                                                    </Col>
                                                    <Col md="6">
                                                        <label>Nhân viên kỹ thuật</label>{" "}
                                                        <FastField
                                                            name="name_employee"
                                                            component={InputGroupField}
                                                            placeholder="Nhập Nhân viên kỹ thuật ..."
                                                            readonly={true}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <label>
                                                        Đánh giá{"  "}
                                                        <label style={{ color: "red" }}>(*)</label>
                                                    </label>

                                                    <StarRatings
                                                        rating={initialValues.rating}
                                                        starDimension="25px"
                                                        starSpacing="5px"
                                                        starRatedColor="rgb(230, 67, 47)"
                                                        changeRating={(value, name) =>
                                                            dispatchs(
                                                                handleChangeRating(value, name)
                                                            )
                                                        }
                                                        numberOfStars={5}
                                                        name="rating"
                                                    />
                                                </Row>

                                                <label>
                                                    Phản hồi {"  "}{" "}
                                                    <label style={{ color: "red" }}>(*)</label>
                                                </label>

                                                <FastField
                                                    name="content"
                                                    component={InputGroupField}
                                                    type="textarea"
                                                    placeholder="Nhập phản hồi của khách hàng ..."
                                                />
                                                <Row>
                                                    <Col className="ml-auto mr-auto" md="4">
                                                        <Button
                                                            className="btn-fill"
                                                            color="danger"
                                                            size="lg"
                                                            type="submit"
                                                        >
                                                            Gửi phản hồi
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
                    </Container>
                </div>
            </div>
        </div>
    );
}
