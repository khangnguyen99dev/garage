import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Formik, Form, FastField } from "formik";
import NewsModel from "./NewsModel";
import InputField from "@/custom-fields/InputField";
import { useDispatch, useSelector } from "react-redux";
import { handleShow, handleSubmit, handleUpdate, handleDelete } from "@/store/actions/NewsAction";
import * as Yup from "yup";
import { CKEditor } from "ckeditor4-react";
import SelectFields from "@/custom-fields/SelectFields";
import { DATA_OPTION } from "@/utils/constants";
import FileField from "@/custom-fields/FileField";

function NewsModal() {
    const dispatchs = useDispatch();

    const props = useSelector((state) => state.News);

    const { modal, data, id, isShow, selectedFiles } = props.show;

    const initialValues = modal == "edit_new" ? data : modal == "delete" ? { id: id } : NewsModel;

    const validateSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng nhập tên tin tức"),
        description: Yup.string().required("Vui lòng nhập mô tả"),
    });

    const renderPhotos = (photo) => {
        return <img className="p-2 image_show" src={photo[0]} alt="" key={photo[0]} />;
    };

    if (modal == "edit_new" || modal == "add_new") {
        return (
            <Modal isOpen={isShow} size="lg">
                <ModalHeader>
                    {modal == "add_new" ? "Thêm tin tức" : "Cập nhật tin tức"}
                </ModalHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validateSchema}
                    onSubmit={
                        modal == "add_new"
                            ? (value, e) => {
                                  dispatchs(handleSubmit(value, e));
                              }
                            : (value, e) => {
                                  dispatchs(handleUpdate(value, e));
                              }
                    }
                >
                    {(formikProps) => {
                        const { values, setFieldValue } = formikProps;
                        return (
                            <Form>
                                <ModalBody>
                                    <FastField
                                        name="name"
                                        component={InputField}
                                        label="Tên tin tức"
                                        placeholder="Nhập tên tin tức ..."
                                    />
                                    <FastField
                                        name="image"
                                        component={FileField}
                                        type="file"
                                        label="Ảnh dịch vụ"
                                        placeholder="Chọn ảnh ..."
                                        action="IMAGE_CHANGE_NEWS"
                                        data={selectedFiles}
                                    />
                                    {renderPhotos(selectedFiles)}
                                    <FastField
                                        name="description"
                                        component={InputField}
                                        type="textarea"
                                        label="Mô tả"
                                        placeholder="Nhập mô tả tin tức ..."
                                    />
                                    <CKEditor
                                        name="content"
                                        initData={values.content || <p>Nội dung dịch vụ</p>}
                                        onChange={(e) =>
                                            setFieldValue("content", e.editor.getData())
                                        }
                                    />
                                    <FastField
                                        name="status"
                                        component={SelectFields}
                                        label="Trạng thái"
                                        placeholder="Chọn trạng thái!"
                                        options={DATA_OPTION}
                                    />
                                </ModalBody>

                                <ModalFooter>
                                    <Button color="success" type="submit">
                                        {modal == "add_new" ? "Thêm mới" : "Cập nhật"}
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
                <ModalHeader>Xóa tin tức</ModalHeader>
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

NewsModal.propTypes = {
    modal: PropTypes.bool,
};

NewsModal.defaultProps = {
    modal: false,
};

export default NewsModal;
