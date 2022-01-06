import InputGroupField from "@/custom-fields/InputGroupField";
import SelectFields from "@/custom-fields/SelectFields";
import { DATA_GENDER } from "@/utils/constants";
import { FastField, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { Button, Col, InputGroup, InputGroupAddon, InputGroupText, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import PageSpinner from "@/components/PageSpinner";
import * as Yup from "yup";
import { phoneRegExp } from "@/utils/constants";
import ServiceCrud from "@/services/ServiceCrud";
import _ from "lodash";
import FileField from "@/custom-fields/FileField";
import { handleUpdateSetting } from "@/store/actions/UsersAction";

export default function Setting() {
    const dispatchs = useDispatch();
    const state = useSelector((state) => state.Setting);

    const { load } = state;

    useEffect(() => {
        ServiceCrud.instance
            .getAll("setting-info")
            .then((response) => {
                dispatchs({
                    type: "GET_SETTING_INFO",
                    payload: response.data,
                });
            })
            .catch((error) => {});
    }, [load]);

    const validateSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng nhập tên doanh nghiệp!"),
        phone: Yup.string()
            .matches(phoneRegExp, "Số điện thoại không đúng!")
            .min(10, "Số điện thoại không đúng!")
            .max(10, "Số điện thoại không đúng!")
            .required("Vui lòng nhập số điện thoại!"),
        email: Yup.string().email("Trường này phải là email").required("Vui lòng nhập email!"),
        name_represent: Yup.string().required("Vui lòng nhập tên người đại diện!"),
        address: Yup.string().required("Vui lòng nhập địa chỉ!"),
    });

    const renderPhotos = (photo) => {
        return <img className="p-2 image_show" src={photo[0]} alt="" key={photo[0]} />;
    };

    const initialValues = state.data;
    if (!_.isEmpty(initialValues)) {
        const selectedFiles = state.selectFiles || [];

        return (
            <div>
                <Row>
                    <Col md="2"></Col>
                    <Col md="8 mb-5">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validateSchema}
                            onSubmit={(value) => dispatchs(handleUpdateSetting(value))}
                        >
                            {(formikProps) => {
                                return (
                                    <Form className="contact-form">
                                        <Row>
                                            <Col md="6">
                                                <label>Tên doanh nghiệp</label>
                                                <label style={{ color: "red" }}>(*)</label>
                                                <InputGroup>
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="fa fa-building"></i>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <FastField
                                                        name="name"
                                                        component={InputGroupField}
                                                        label="Tên doanh nghiệp"
                                                        placeholder="Nhập tên ..."
                                                    />
                                                </InputGroup>
                                            </Col>
                                            <Col md="6">
                                                <label>Nội dung</label>{" "}
                                                <label style={{ color: "red" }}>(*)</label>
                                                <InputGroup>
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="fa fa-comment"></i>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <FastField
                                                        name="content"
                                                        component={InputGroupField}
                                                        label="Nội dung"
                                                        placeholder="Nhập số nội dung ..."
                                                    />
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <label>Người đại diện</label>
                                                <label style={{ color: "red" }}>(*)</label>
                                                <InputGroup>
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="fa fa-user"></i>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <FastField
                                                        name="name_represent"
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
                                                <label>Website</label>
                                                <label style={{ color: "red" }}>(*)</label>
                                                <InputGroup>
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="fa fa-wikipedia-w"></i>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <FastField
                                                        name="website"
                                                        component={InputGroupField}
                                                        label="Website"
                                                        placeholder="Nhập Website ..."
                                                    />
                                                </InputGroup>
                                            </Col>
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
                                                        name="name_bank"
                                                        component={InputGroupField}
                                                        label="Tên ngân hàng"
                                                        placeholder="Nhập tên ngân hàng ..."
                                                    />
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FastField
                                                    name="logo"
                                                    component={FileField}
                                                    type="file"
                                                    label="Logo doanh nghiệp"
                                                    placeholder="Chọn ảnh ..."
                                                    action="IMAGE_CHANGE_BUSINESS"
                                                    data={selectedFiles}
                                                />
                                                {renderPhotos(selectedFiles)}
                                            </Col>
                                        </Row>
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
