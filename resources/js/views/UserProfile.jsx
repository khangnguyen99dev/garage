import FileField from "@/custom-fields/FileField";
import InputGroupField from "@/custom-fields/InputGroupField";
import SelectFields from "@/custom-fields/SelectFields";
import { phoneRegExp } from "@/utils/constants";
import { DATA_GENDER } from "@/utils/constants";
import { FastField, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    Col,
    Container,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
} from "reactstrap";

import { getUser, handleUpdateProfileUser } from "@/store/actions/ClientsAction";
import * as Yup from "yup";
import PageSpinner from "@/components/PageSpinner";

function UserProfile() {
    const dispatchs = useDispatch();
    const state = useSelector((state) => state);

    const auth = state.Auth;
    const props = state.Clients;

    useEffect(() => {
        dispatchs(getUser());
    }, [props.load]);

    const initialValues = props.dataUser;

    const validateSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng nhập họ và tên!"),
        phone: Yup.string()
            .matches(phoneRegExp, "Số điện thoại không đúng!")
            .min(10, "Số điện thoại không đúng!")
            .max(10, "Số điện thoại không đúng!")
            .required("Vui lòng nhập số điện thoại!"),
        gender: Yup.string().required("Vui lòng chọn giới tính!"),
        address: Yup.string().required("Vui lòng nhập địa chỉ!"),
        email: Yup.string().email("Trường này phải là email").nullable(true),
    });

    const { selectedFiles } = props.dataUser;

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

    if (initialValues.name.length > 0) {
        return (
            <div className="section profile-content">
                <Container>
                    <div className="owner">
                        <div className="avatar">
                            {renderPhotos(selectedFiles, auth.user.avatar)}
                        </div>
                        <div className="name">
                            <h4 className="title">
                                {auth.user.name} <br />
                            </h4>
                            <h6 className="description">Điện thoại: {auth.user.phone}</h6>
                        </div>
                    </div>
                    <Row>
                        <Col md="2"></Col>
                        <Col md="8">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validateSchema}
                                onSubmit={(value, e) =>
                                    dispatchs(handleUpdateProfileUser(value, e))
                                }
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
                                                    <label>Ảnh đại diện</label>
                                                    <FastField
                                                        name="avatar"
                                                        component={FileField}
                                                        type="file"
                                                        placeholder="Chọn ảnh ..."
                                                        action="IMAGE_CHANGE_PROFILE_CLIENTS"
                                                        data={selectedFiles}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <label>Email</label>
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
                                                {/* <Col md="6">
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
                                                </Col> */}
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <label>Số tài khoản</label>
                                                    <InputGroup>
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="fa fa-credit-card"></i>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <FastField
                                                            name="account_number"
                                                            component={InputGroupField}
                                                            label="Số tài khoản"
                                                            placeholder="Nhập số tài khoản ..."
                                                        />
                                                    </InputGroup>
                                                </Col>
                                                <Col md="6">
                                                    <label>Tên ngân hàng</label>
                                                    <InputGroup>
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="fa fa-cc-visa"></i>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <FastField
                                                            name="bank_name"
                                                            component={InputGroupField}
                                                            label="Tên ngân hàng"
                                                            placeholder="Nhập tên ngân hàng ..."
                                                        />
                                                    </InputGroup>
                                                </Col>
                                            </Row>
                                            {/* <Row> */}
                                            {/* <Col md="6">
                                                    <label>Mã số thuế</label>
                                                    <InputGroup>
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="fa fa-qrcode"></i>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <FastField
                                                            name="tax_code"
                                                            component={InputGroupField}
                                                            label="Mã số thuế"
                                                            placeholder="Nhập mã số thuế ..."
                                                        />
                                                    </InputGroup>
                                                </Col> */}
                                            {/* </Row> */}
                                            <label>Địa chỉ</label>{" "}
                                            <label style={{ color: "red" }}>(*)</label>
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
                                                    <Button
                                                        className="btn-fill"
                                                        color="danger"
                                                        size="lg"
                                                        type="submit"
                                                    >
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
                </Container>
            </div>
        );
    } else {
        return <PageSpinner />;
    }
}

export default UserProfile;
