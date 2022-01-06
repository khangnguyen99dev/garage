import InputGroupField from "@/custom-fields/InputGroupField";
import { FastField, Form, Formik } from "formik";
import React from "react";
import {
    Button,
    Col,
    Container,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
} from "reactstrap";
import * as Yup from "yup";

import { changePass } from "@/store/actions/ClientsAction";
import { useDispatch } from "react-redux";

export default function ChangePass() {
    const dispatchs = useDispatch();

    const validateSchema = Yup.object().shape({
        password: Yup.string()
            .min(6, "Mật khẩu ít nhất 6 ký tự!")
            .required("Vui lòng nhập mật khẩu cũ!"),
        new_password: Yup.string()
            .min(6, "Mật khẩu ít nhất 6 ký tự!")
            .required("Vui lòng nhập mật khẩu mới!"),
        re_new_password: Yup.string()
            .oneOf([Yup.ref("new_password"), null], "Nhập lại mật khẩu mới không đúng!")
            .required("Vui lòng nhập lại mật khẩu mới!"),
    });

    const initialValues = {
        password: "",
        new_password: "",
        re_new_password: "",
    };
    return (
        <div>
            <Container>
                <Row>
                    <Col className="ml-auto mr-auto" md="5">
                        <h2 className="text-center">Đổi mật khẩu</h2>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validateSchema}
                            onSubmit={(value, e) => dispatchs(changePass(value, e))}
                        >
                            {(formikProps) => {
                                return (
                                    <Form className="contact-form">
                                        <Row className="mt-2">
                                            <label>Mật khẩu cũ</label>{" "}
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="fa fa-unlock-alt"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <FastField
                                                    name="password"
                                                    component={InputGroupField}
                                                    type="password"
                                                    label="Mật khẩu cũ"
                                                    placeholder="Nhập Mật khẩu cũ ..."
                                                />
                                            </InputGroup>
                                            <label>Mật khẩu mới</label>{" "}
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="fa fa-unlock-alt"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <FastField
                                                    name="new_password"
                                                    component={InputGroupField}
                                                    type="password"
                                                    label="Mật khẩu mới"
                                                    placeholder="Nhập mật khẩu mới ..."
                                                />
                                            </InputGroup>
                                            <label>Nhập lại mật khẩu mới</label>{" "}
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="fa fa-retweet"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <FastField
                                                    name="re_new_password"
                                                    component={InputGroupField}
                                                    type="password"
                                                    label="Nhập lại mật khẩu mới"
                                                    placeholder="Nhập lại mật khẩu mới..."
                                                />
                                            </InputGroup>
                                        </Row>
                                        <Row>
                                            <Col className="ml-auto mr-auto mb-4" md="4">
                                                <Button
                                                    className="btn-fill"
                                                    color="danger"
                                                    type="submit"
                                                >
                                                    Đổi mật khẩu
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
