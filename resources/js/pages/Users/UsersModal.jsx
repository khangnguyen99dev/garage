import React from "react";
import PropTypes from "prop-types";
import {
    Button,
    Col,
    FormGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
} from "reactstrap";
import { Formik, Form, FastField, Field } from "formik";
import InputField from "@/custom-fields/InputField";
import UsersModel from "./UsersModel";
import { DATA_OPTION, DATA_GENDER } from "@/utils/constants";
import SelectFields from "@/custom-fields/SelectFields";
import { useDispatch, useSelector } from "react-redux";
import { handleShow, handleSubmit, handleUpdate, handleDelete } from "@/store/actions/UsersAction";
import SelectField from "@/custom-fields/SelectField";
import FileField from "@/custom-fields/FileField";
import CustomRolesModal from "../CustomRoles/CustomRolesModal";
import { phoneRegExp } from "@/utils/constants";
import * as Yup from "yup";
import NumberFormatInput from "@/custom-fields/NumberFormat";

function Users() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Users);

    const { modal, data, id, isShow, selectedFiles } = props.show;

    const initialValues =
        parseInt(id) > 0 && modal == "edit_user"
            ? data
            : modal == "delete"
            ? { id: id }
            : UsersModel;

    const renderPhotos = (photo) => {
        return <img className="p-2 image_show" src={photo[0]} alt="" key={photo[0]} />;
    };

    const object = {
        name: Yup.string().required("Vui lòng nhập tên nhân viên!"),
        phone: Yup.string()
            .matches(phoneRegExp, "Số điện thoại không đúng!")
            .min(10, "Số điện thoại không đúng!")
            .max(10, "Số điện thoại không đúng!")
            .required("Vui lòng nhập số điện thoại!"),
        email: Yup.string().email("Trường này phải là email").required("Vui lòng nhập email!"),
        gender: Yup.string().required("Vui lòng chọn giới tính!"),
        role_id: Yup.string().required("Vui lòng chọn quyền!"),
        salary: Yup.number().moreThan(0, "Mức lương phải là số dương!"),
    };

    const validateSchema = Yup.object().shape(
        modal == "add_user"
            ? Object.assign(object, {
                  password: Yup.string()
                      .min(6, "Vui lòng nhập ít nhất 6 ký tự!")
                      .required("Vui lòng nhập mật khẩu!"),
              })
            : object
    );

    if (modal == "edit_user" || modal == "add_user") {
        return (
            <Modal isOpen={isShow} size="lg">
                <CustomRolesModal />
                <ModalHeader>
                    {modal == "add_user" ? "Thêm nhân viên" : "Cập nhật nhân viên"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={
                        modal == "add_user"
                            ? (value, e) => {
                                  dispatchs(handleSubmit(value, e));
                              }
                            : (value, e) => {
                                  dispatchs(handleUpdate(value, e));
                              }
                    }
                >
                    {(formikProps) => {
                        const { values } = formikProps;
                        return (
                            <Form>
                                <ModalBody>
                                    <Row>
                                        <Col md="6">
                                            <FastField
                                                name="name"
                                                component={InputField}
                                                label="Tên nhân viên"
                                                placeholder="Nhập tên nhân viên ..."
                                            />
                                            <FastField
                                                name="email"
                                                component={InputField}
                                                type="email"
                                                label="Email"
                                                placeholder="Nhập email ..."
                                            />
                                            <FastField
                                                name="gender"
                                                component={SelectFields}
                                                label="Giới tính"
                                                placeholder="Chọn Giới tính!"
                                                options={DATA_GENDER}
                                            />
                                            <FastField
                                                name="salary"
                                                component={NumberFormatInput}
                                                label="Mức lương"
                                                placeholder="Nhập mức lương ..."
                                            />
                                            <FastField
                                                name="avatar"
                                                component={FileField}
                                                type="file"
                                                label="Ảnh đại diện"
                                                placeholder="Chọn ảnh ..."
                                                action="IMAGE_CHANGE_USERS"
                                                data={selectedFiles}
                                            />
                                            {renderPhotos(selectedFiles)}
                                        </Col>
                                        <Col md="6">
                                            <FastField
                                                name="phone"
                                                component={InputField}
                                                label="Số điện thoại"
                                                placeholder="Nhập số điện thoại ..."
                                            />
                                            <FastField
                                                name="password"
                                                component={InputField}
                                                type="password"
                                                readonly={modal == "add_user" ? false : true}
                                                label="Mật khẩu"
                                                placeholder="Nhập mật khẩu ..."
                                            />
                                            <FastField
                                                name="status"
                                                component={SelectFields}
                                                label="Trạng thái"
                                                placeholder="Chọn trạng thái!"
                                                options={DATA_OPTION}
                                            />
                                            <FastField
                                                name="role_id"
                                                component={SelectField}
                                                label="Quyền"
                                                placeholder="Chọn quyền!"
                                                id="roles:id,name"
                                                data={initialValues.roles}
                                            />
                                            <FormGroup>
                                                <Field
                                                    type="radio"
                                                    name={
                                                        modal == "add_user" ? "roles" : "edit_roles"
                                                    }
                                                    value="default_role"
                                                />
                                                <label style={{ paddingLeft: "4px" }}>
                                                    Quyền mặc định
                                                </label>
                                            </FormGroup>
                                            <FormGroup>
                                                <Field
                                                    type="radio"
                                                    name={
                                                        modal == "add_user" ? "roles" : "edit_roles"
                                                    }
                                                    value="custom_role"
                                                />
                                                <label style={{ paddingLeft: "4px" }}>
                                                    {" "}
                                                    Quyền chỉ định
                                                </label>
                                            </FormGroup>
                                            {values.edit_roles == "custom_role" && (
                                                <Button
                                                    data-modal="edit_custom_role"
                                                    onClick={(e) => dispatchs(handleShow(e))}
                                                    className="btn btn-info btn-sm"
                                                >
                                                    Chỉ định quyền
                                                </Button>
                                            )}
                                            {values.roles == "custom_role" && (
                                                <Button
                                                    data-modal="add_custom_role"
                                                    onClick={(e) => dispatchs(handleShow(e))}
                                                    className="btn btn-info btn-sm"
                                                >
                                                    Chỉ định quyền
                                                </Button>
                                            )}
                                        </Col>
                                    </Row>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        {modal == "add_user" ? "Thêm mới" : "Cập nhật"}
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
    } else if (modal == "delete") {
        return (
            <Modal isOpen={isShow}>
                <ModalHeader>Xóa nhân viên</ModalHeader>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(value) => {
                        dispatchs(handleDelete(value));
                    }}
                >
                    {(formikProps) => {
                        const { values, errors, touched } = formikProps;
                        return (
                            <Form>
                                <ModalBody>Bạn có thực sự muốn xóa?</ModalBody>
                                <ModalFooter>
                                    <Button color="danger" type="submit" name="id">
                                        Xóa
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
    } else {
        return <div></div>;
    }
}

Users.propTypes = {
    modal: PropTypes.bool,
};

Users.defaultProps = {
    modal: false,
};

export default Users;
