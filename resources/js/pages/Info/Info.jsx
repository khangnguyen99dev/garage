import FileField from "@/custom-fields/FileField";
import InputGroupField from "@/custom-fields/InputGroupField";
import SelectFields from "@/custom-fields/SelectFields";
import { DATA_GENDER } from "@/utils/constants";
import { FastField, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { Button, Col, InputGroup, InputGroupAddon, InputGroupText, Row } from "reactstrap";
import { handleGetUserInfo, handleUpdateInfo } from "@/store/actions/UsersAction";
import { useDispatch, useSelector } from "react-redux";
import PageSpinner from "@/components/PageSpinner";
import * as Yup from "yup";
import { phoneRegExp } from "@/utils/constants";

export default function Info() {
    const dispatchs = useDispatch();
    const state = useSelector((state) => state.Auth.user);

    const props = useSelector((state) => state.Users);

    const { selectedFiles } = props.show;

    const { load } = props;

    useEffect(() => {
        dispatchs(handleGetUserInfo(state.id));
    }, [load]);

    const validateSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng nhập tên!"),
        phone: Yup.string()
            .matches(phoneRegExp, "Số điện thoại không đúng!")
            .min(10, "Số điện thoại không đúng!")
            .max(10, "Số điện thoại không đúng!")
            .required("Vui lòng nhập số điện thoại!"),
        email: Yup.string().email("Trường này phải là email").required("Vui lòng nhập email!"),
    });

    const renderPhotos = (photo, url) => {
        return (
            <div className="avatar-uploader__avatar ">
                <div
                    className="img-circle img-no-padding img-responsive avatar-uploader__avatar-image "
                    style={{
                        backgroundImage: `url(
                        ${
                            photo[0]
                                ? photo[0]
                                : url
                                ? "../" + url
                                : require("@/assets/img/users/default_avatar.jpg").default
                        }
                    )`,
                    }}
                ></div>
            </div>
        );
    };

    const initialValues = props.userInfo;

    if (initialValues.name.length > 0) {
        return (
            <div>
                <Row>
                    <Col md="2"></Col>
                    <Col md="8 mb-5">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validateSchema}
                            onSubmit={(value, e) => dispatchs(handleUpdateInfo(value, e))}
                        >
                            {(formikProps) => {
                                return (
                                    <Form className="contact-form">
                                        <Row>
                                            <Col md="6">
                                                <label>Họ && Tên </label>
                                                <label style={{ color: "red" }}>(*)</label>
                                                <InputGroup>
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="fa fa-user"></i>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <FastField
                                                        name="name"
                                                        component={InputGroupField}
                                                        label="Họ tên"
                                                        placeholder="Nhập họ tên ..."
                                                    />
                                                </InputGroup>
                                            </Col>
                                            <Col md="6">
                                                <label>Điện thoại</label>{" "}
                                                <label style={{ color: "red" }}>(*)</label>
                                                <InputGroup>
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="fa fa-phone"></i>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <FastField
                                                        name="phone"
                                                        component={InputGroupField}
                                                        label="Số điện thoại"
                                                        placeholder="Nhập số điện thoại ..."
                                                    />
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <label>Email</label>
                                                <label style={{ color: "red" }}>(*)</label>
                                                <InputGroup>
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="fa fa-envelope"></i>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <FastField
                                                        name="email"
                                                        component={InputGroupField}
                                                        label="Email"
                                                        placeholder="Nhập Email ..."
                                                    />
                                                </InputGroup>
                                            </Col>
                                            <Col md="6">
                                                <label>Giới tính</label>{" "}
                                                <label style={{ color: "red" }}>(*)</label>
                                                <FastField
                                                    name="gender"
                                                    component={SelectFields}
                                                    placeholder="Chọn Giới tính!"
                                                    options={DATA_GENDER}
                                                />
                                            </Col>
                                        </Row>
                                        <Col md="6">
                                            <label>Ảnh đại diện</label>
                                            <FastField
                                                name="avatar"
                                                component={FileField}
                                                type="file"
                                                placeholder="Chọn ảnh ..."
                                                action="IMAGE_CHANGE_USER_INFO"
                                                data={selectedFiles}
                                            />
                                            {renderPhotos(selectedFiles, state.avatar)}
                                        </Col>
                                        <label>Địa chỉ</label>{" "}
                                        <FastField
                                            name="address"
                                            component={InputGroupField}
                                            type="textarea"
                                            label="Địa chỉ"
                                            placeholder="Nhập địa chỉ ..."
                                        />
                                        <Row>
                                            <Col
                                                className="ml-auto mr-auto btn-bottom-profile"
                                                md="4"
                                            >
                                                <Button size="lg" type="submit">
                                                    Cập nhật
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </Col>
                </Row>
            </div>
        );
    } else {
        return <PageSpinner />;
    }
}
