import React from "react";
import {
    Button,
    Col,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table,
} from "reactstrap";
import { FastField, Form, Formik } from "formik";
import InputGroupField from "@/custom-fields/InputGroupField";
import SelectFields from "@/custom-fields/SelectFields";
import { DATA_GENDER } from "@/utils/constants";
import * as Yup from "yup";
import { phoneRegExp } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
    handleShow,
    handleRegister,
    handleLogin,
    handleAcceptPhone,
    handleRepassword,
    handleCancelBookingRepair,
} from "@/store/actions/ClientsAction";
import NumberFormat from "react-number-format";
import InputFields from "@/custom-fields/InputFields";
import InputField from "@/custom-fields/InputField";
import NumberFormatInput from "@/custom-fields/NumberFormat";
import StarRatings from "react-star-ratings";

function AuthClient() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Clients);

    const { modal, isShow, data, id } = props.show;

    const initialValues =
        modal == "register"
            ? {
                  name: "",
                  phone: "",
                  password: "",
                  gender: "",
                  address: "",
              }
            : modal == "forgot_password" ||
              modal == "history_repair" ||
              modal == "show_detail_cancel" ||
              modal == "show_feedback"
            ? data
            : modal == "cancel_booking_repair"
            ? { id: id }
            : {
                  phone: "",
                  password: "",
              };

    // console.log(initialValues);
    const validateRegisterSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng nhập họ và tên!"),
        phone: Yup.string()
            .matches(phoneRegExp, "Số điện thoại không đúng!")
            .min(10, "Số điện thoại không đúng!")
            .max(10, "Số điện thoại không đúng!")
            .required("Vui lòng nhập số điện thoại!"),
        gender: Yup.string().required("Vui lòng chọn giới tính!"),
        address: Yup.string().required("Vui lòng nhập địa chỉ!"),
        password: Yup.string()
            .min(6, "Mật khẩu ít nhất 6 ký tự!")
            .required("Vui lòng nhập mật khẩu!"),
        re_password: Yup.string()
            .oneOf([Yup.ref("password"), null], "Nhập lại mật khẩu không đúng!")
            .required("Vui lòng nhập lại mật khẩu!"),
        email: Yup.string().email("Trường này phải là email"),
    });

    const validateLoginSchema = Yup.object().shape({
        phone: Yup.string()
            .matches(phoneRegExp, "Số điện thoại không đúng!")
            .min(10, "Số điện thoại không đúng!")
            .max(10, "Số điện thoại không đúng!")
            .required("Vui lòng nhập số điện thoại!"),
        password: Yup.string()
            .min(6, "Mật khẩu ít nhất 6 ký tự!")
            .required("Vui lòng nhập mật khẩu!"),
    });

    const validatePhoneSchema = Yup.object().shape({
        phone: Yup.string()
            .matches(phoneRegExp, "Số điện thoại không đúng!")
            .min(10, "Số điện thoại không đúng!")
            .max(10, "Số điện thoại không đúng!")
            .required("Vui lòng nhập số điện thoại!"),
    });

    const validateRePassSchema = Yup.object().shape({
        password: Yup.string()
            .min(6, "Mật khẩu ít nhất 6 ký tự!")
            .required("Vui lòng nhập mật khẩu!"),
        re_password: Yup.string()
            .oneOf([Yup.ref("password"), null], "Nhập lại mật khẩu không đúng!")
            .required("Vui lòng nhập lại mật khẩu!"),
    });

    const validateCancel = Yup.object().shape({
        note: Yup.string().required("Vui lòng nhập lý do!"),
    });

    if (modal == "register") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Đăng ký</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateRegisterSchema}
                    onSubmit={(value, e) => dispatchs(handleRegister(value, e))}
                >
                    {(formikProps) => {
                        const { errors } = formikProps;
                        return (
                            <Form>
                                <ModalBody>
                                    <Row>
                                        <Col md="6">
                                            <label>Họ && Tên </label>
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
                                            <label>Giới tính</label>{" "}
                                            <FastField
                                                name="gender"
                                                component={SelectFields}
                                                placeholder="Chọn Giới tính!"
                                                options={DATA_GENDER}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6">
                                            <label>Điện thoại</label>{" "}
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
                                        <Col md="6">
                                            <label>Email</label>{" "}
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="fa fa-envelope"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <FastField
                                                    name="email"
                                                    component={InputGroupField}
                                                    type="email"
                                                    label="Email"
                                                    placeholder="Nhập Email ..."
                                                />
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col md="6">
                                            <label>Mật khẩu</label>{" "}
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
                                                    label="Mật khẩu"
                                                    placeholder="Nhập Mật khẩu ..."
                                                />
                                            </InputGroup>
                                        </Col>
                                        <Col md="6">
                                            <label>Nhập lại mật khẩu</label>{" "}
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="fa fa-retweet"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <FastField
                                                    name="re_password"
                                                    component={InputGroupField}
                                                    type="password"
                                                    label="Nhập lại mật khẩu"
                                                    placeholder="Nhập lại mật khẩu ..."
                                                />
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                    <label>Địa chỉ</label>
                                    <FastField
                                        name="address"
                                        component={InputGroupField}
                                        type="textarea"
                                        label="Địa chỉ"
                                        placeholder="Nhập địa chỉ ..."
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        Đăng ký
                                    </Button>{" "}
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
                            </Form>
                        );
                    }}
                </Formik>
                <div id="recaptcha"></div>
            </Modal>
        );
    } else if (modal == "login") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Đăng nhập</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateLoginSchema}
                    onSubmit={(value, e) => dispatchs(handleLogin(value, e))}
                >
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <Row>
                                        <label>Điện thoại</label>{" "}
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
                                    </Row>
                                    <Row>
                                        <label>Mật khẩu</label>{" "}
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
                                                label="Mật khẩu"
                                                placeholder="Nhập Mật khẩu ..."
                                            />
                                        </InputGroup>
                                    </Row>
                                </ModalBody>
                                <ModalFooter>
                                    <a
                                        href=""
                                        data-modal="forgot_form_phone"
                                        onClick={(e) => dispatchs(handleShow(e))}
                                        className="mr-auto"
                                    >
                                        Quên mật khẩu
                                    </a>
                                    <Button color="success" type="submit">
                                        Đăng nhập
                                    </Button>{" "}
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
                            </Form>
                        );
                    }}
                </Formik>
            </Modal>
        );
    } else if (modal == "forgot_form_phone") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Quên mật khẩu</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validatePhoneSchema}
                    onSubmit={(value, e) => dispatchs(handleAcceptPhone(value, e))}
                >
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <Row>
                                        <label>Điện thoại</label>{" "}
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
                                    </Row>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        Xác nhận
                                    </Button>{" "}
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
                            </Form>
                        );
                    }}
                </Formik>
                <div id="recaptcha"></div>
            </Modal>
        );
    } else if (modal == "forgot_password") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Đổi mật khẩu</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateRePassSchema}
                    onSubmit={(value, e) => dispatchs(handleRepassword(value, e))}
                >
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <Row>
                                        <label>Mật khẩu mới</label>{" "}
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fa fa-unlock-alt"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <FastField
                                                name="password"
                                                type="password"
                                                component={InputGroupField}
                                                placeholder="Nhập mật khẩu mới ..."
                                            />
                                        </InputGroup>
                                    </Row>
                                    <Row>
                                        <label>Nhập lại mật khẩu mới</label>{" "}
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fa fa-retweet"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <FastField
                                                name="re_password"
                                                type="password"
                                                component={InputGroupField}
                                                placeholder="Nhập lại mật khẩu mới ..."
                                            />
                                        </InputGroup>
                                    </Row>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" type="submit" name="phone">
                                        Xác nhận
                                    </Button>{" "}
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
                            </Form>
                        );
                    }}
                </Formik>
                <div id="recaptcha"></div>
            </Modal>
        );
    } else if (modal == "history_repair") {
        return (
            <Modal isOpen={isShow} size="lg">
                <ModalHeader>Chi tiết sửa chữa</ModalHeader>
                <Formik initialValues={initialValues}>
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <Row>
                                        <Col md="6">
                                            <FastField
                                                name="cars.customers.name"
                                                component={InputFields}
                                                label="Tên khách hàng"
                                                placeholder="Tên khách hàng ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="receive_date"
                                                component={InputFields}
                                                label="Ngày tiếp nhận"
                                                type="datetime-local"
                                                placeholder="Ngày tiếp nhận ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="discount"
                                                component={InputFields}
                                                label="Giảm giá"
                                                placeholder="0"
                                                readonly={true}
                                            />
                                        </Col>
                                        <Col md="6">
                                            <FastField
                                                name="number_car_id"
                                                component={InputFields}
                                                label="Biển số xe"
                                                placeholder="Biển số xe ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="repair_date"
                                                component={InputField}
                                                label="Ngày sửa chữa"
                                                type="datetime-local"
                                                placeholder="Ngày sửa chữa ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="total_price"
                                                component={NumberFormatInput}
                                                label="Tổng tiền"
                                                placeholder="Tổng tiề"
                                                readonly={true}
                                            />
                                        </Col>
                                    </Row>
                                    {initialValues.products.length > 0 ? (
                                        <Table hover responsive className="text-center">
                                            <thead>
                                                <tr>
                                                    <th>Phụ tùng</th>
                                                    <th>Số lượng</th>
                                                    <th>Giá</th>
                                                    <th>Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {initialValues.products &&
                                                    initialValues.products.map((product, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td scope="row">{product.name}</td>
                                                                <td>{product.pivot.quantity}</td>
                                                                <td>
                                                                    <NumberFormat
                                                                        value={product.pivot.price}
                                                                        displayType={"text"}
                                                                        thousandSeparator={true}
                                                                    />
                                                                    ₫
                                                                </td>
                                                                <td>
                                                                    <NumberFormat
                                                                        value={
                                                                            product.pivot.quantity *
                                                                            product.pivot.price
                                                                        }
                                                                        displayType={"text"}
                                                                        thousandSeparator={true}
                                                                    />
                                                                    ₫
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <div></div>
                                    )}
                                    {initialValues.services.length > 0 ? (
                                        <Table hover responsive className="text-center">
                                            <thead>
                                                <tr>
                                                    <th>Dịch vụ</th>
                                                    <th>Giá</th>
                                                    <th>Ghi chú</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {initialValues.services &&
                                                    initialValues.services.map((service, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td scope="row">{service.name}</td>
                                                                <td>
                                                                    <NumberFormat
                                                                        value={service.price}
                                                                        displayType={"text"}
                                                                        thousandSeparator={true}
                                                                    />
                                                                    ₫
                                                                </td>
                                                                <td>{service.note}</td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <div></div>
                                    )}
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
                            </Form>
                        );
                    }}
                </Formik>
            </Modal>
        );
    } else if (modal == "cancel_booking_repair") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Hủy yêu cầu</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateCancel}
                    onSubmit={(value) => {
                        dispatchs(handleCancelBookingRepair(value));
                    }}
                >
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <FastField
                                        name="note"
                                        component={InputField}
                                        label="Lý do"
                                        type="textarea"
                                        placeholder="Lý do ..."
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" type="submit" name="id">
                                        Hủy
                                    </Button>{" "}
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
                            </Form>
                        );
                    }}
                </Formik>
            </Modal>
        );
    } else if (modal == "show_detail_cancel") {
        return (
            <Modal isOpen={isShow} size="lg">
                <ModalHeader>Chi tiết hủy</ModalHeader>
                <Formik initialValues={initialValues}>
                    {(formikProps) => {
                        return (
                            <Form>
                                <ModalBody>
                                    <Row>
                                        <Col md="6">
                                            <FastField
                                                name="number_car_id"
                                                component={InputFields}
                                                label="Biển số xe"
                                                placeholder="Biển số xe ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="repair_date"
                                                component={InputFields}
                                                label="Ngày yêu cầu"
                                                type="datetime-local"
                                                placeholder="Ngày yêu cầu ..."
                                                readonly={true}
                                            />
                                        </Col>
                                        <Col md="6">
                                            <FastField
                                                name="car_condition"
                                                component={InputFields}
                                                label="Tình trạng xe"
                                                placeholder="Tình trạng xe ..."
                                                readonly={true}
                                            />
                                            <FastField
                                                name="note"
                                                component={InputFields}
                                                label="Lý do hủy"
                                                placeholder="Lý do hủy ..."
                                                readonly={true}
                                            />
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
                            </Form>
                        );
                    }}
                </Formik>
            </Modal>
        );
    } else if (modal == "show_feedback") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Xem đánh giá</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label className="d-block">Đánh giá</Label>
                        <StarRatings
                            rating={initialValues.rating}
                            starDimension="20px"
                            starSpacing="2px"
                            starRatedColor="rgb(230, 67, 47)"
                            numberOfStars={5}
                            name="rating"
                        />
                    </FormGroup>
                    <FormGroup className="mt-2">
                        <Label>Nội dung phản hồi</Label>
                        <Input value={initialValues.content} type="textarea" readOnly={true} />
                    </FormGroup>
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

export default AuthClient;
