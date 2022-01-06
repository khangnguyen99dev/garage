import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
import queryString from "query-string";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { info } from "react-notification-system-redux";

const api = "products";

const getProducts = (data, total) => ({
    type: ActionTypes.GET_PAGING_PRODUCTS,
    payload: {
        data,
        total,
    },
});

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_PRODUCTS,
    payload: data,
});

const addProduct = (data) => ({
    type: ActionTypes.ADD_PRODUCTS,
    payload: data,
});

const updateProduct = () => ({
    type: ActionTypes.UPDATE_PRODUCTS,
});

const deleteProduct = () => ({
    type: ActionTypes.DELETE_PRODUCTS,
});

export const getPaging = () => (dispatchs, getState) => {
    const params = getState().Products.params;
    ServiceCrud.instance
        .getAll(api, queryString.stringify(params))
        .then((response) => {
            const { data, total } = response.data;
            if (total !== params.total) {
                dispatchs(getProducts(data, total));
            } else {
                dispatchs(getProducts(data));
            }
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

export const handleShow = (e) => (dispatchs, getState) => {
    const { key, modal } = e.target.dataset;
    const show = getState().Products.show.isShow;

    switch (modal) {
        case "add_product":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                    selectedFiles: [],
                })
            );
            break;
        case "edit_product":
            ServiceCrud.instance
                .show(api, key)
                .then((response) => {
                    dispatchs(
                        showModal({
                            isShow: !show,
                            modal: modal,
                            data: response.data,
                            selectedFiles: ["../" + response.data.image],
                            id: key,
                        })
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
            break;
        case "delete":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                    id: key,
                })
            );
            break;
        default:
            dispatchs(showModal(!show));
            break;
    }
};

export const handleSubmit = (data, e) => (dispatchs) => {
    let newData = new FormData();
    for (const [key, value] of Object.entries(data)) {
        newData.append(key, value);
    }
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    ServiceCrud.instance
        .create(api, newData, config)
        .then((response) => {
            if (response.status == 201) {
                dispatchs(
                    addProduct({
                        page: 1,
                        total: 1,
                    })
                );
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                e.resetForm();
            }
        })
        .catch((error) => {
            dispatchs(
                info({
                    title: <FcHighPriority />,
                    message: error.response.data.errors,
                    autoDismiss: 2,
                })
            );
        });
};

export const handleUpdate = (values) => (dispatchs, getState) => {
    const id = getState().Products.show.id;

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    let newData = new FormData();

    let { suppliers, product_types, ...data } = values;

    for (const [key, value] of Object.entries(data)) {
        newData.append(key, value);
    }

    ServiceCrud.instance
        .updateForm(api, id, newData, config)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(updateProduct());
            }
        })
        .catch((error) => {
            dispatchs(
                info({
                    title: <FcHighPriority />,
                    message: "Có lỗi trong quá trình thục hiện!",
                    autoDismiss: 2,
                })
            );
        });
};

export const handleDelete = (value) => (dispatchs) => {
    ServiceCrud.instance
        .delete(api, value.id)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(deleteProduct());
            }
        })
        .catch((error) => {
            dispatchs(
                info({
                    title: <FcHighPriority />,
                    message: "Có lỗi trong quá trình thục hiện!",
                    autoDismiss: 2,
                })
            );
        });
};

const addRepairProduct = (data) => ({
    type: ActionTypes.ADD_REPAIR_PRODUCTS,
    payload: data,
});

const resetRepairProduct = () => ({
    type: ActionTypes.RESET_REPAIR_PRODUCTS,
});

export const handleAddRepairProduct = (data) => (dispatchs) => {
    const values = {
        product_id: data.id,
        name: data.name,
        quantity: data.qty,
        price: data.price,
    };
    dispatchs(addRepairProduct(values));
    dispatchs(
        info({
            title: <FcOk />,
            message: "Thêm phụ tùng sửa chữa thành công!",
            autoDismiss: 2,
        })
    );
    dispatchs(resetRepairProduct());
};

const editRepairProduct = (data, index) => ({
    type: ActionTypes.EDIT_REPAIR_PRODUCTS,
    payload: {
        data,
        index,
    },
});

const editExportProduct = (data, index) => ({
    type: ActionTypes.EDIT_EXPORT_PRODUCTS,
    payload: {
        data,
        index,
    },
});

export const handleEditRepairProduct = (data) => (dispatchs, getState) => {
    const show = getState().Products.show;
    const values = {
        product_id: data.id,
        name: data.name,
        quantity: data.qty,
        price: data.price,
        id: data.key || "",
    };
    dispatchs(editRepairProduct(values, show.id));
    dispatchs(
        info({
            title: <FcOk />,
            message: "Sửa phụ tùng sửa chữa thành công!",
            autoDismiss: 2,
        })
    );
    dispatchs(showModal(!show.isShow));
};

export const handleEditExportProduct = (data) => (dispatchs, getState) => {
    const show = getState().Products.show;
    const values = {
        product_id: data.id,
        name: data.name,
        quantity: data.qty,
        price: data.price,
        id: data.key || "",
    };
    dispatchs(editExportProduct(values, show.id));
    dispatchs(
        info({
            title: <FcOk />,
            message: "Sửa phụ tùng sửa chữa thành công!",
            autoDismiss: 2,
        })
    );
    dispatchs(showModal(!show.isShow));
};

const deleteRepairProduct = (data) => ({
    type: ActionTypes.DELETE_REPAIR_PRODUCTS,
    payload: data,
});

export const handleDeleteRepairProduct = (value) => (dispatchs, getState) => {
    const show = getState().Products.show.isShow;
    dispatchs(deleteRepairProduct(value));
    dispatchs(
        info({
            title: <FcOk />,
            message: "Xóa phụ tùng sửa chữa thành công!",
            autoDismiss: 2,
        })
    );
    dispatchs(showModal(!show));
};

const deleteExportProduct = (data) => ({
    type: ActionTypes.DELETE_EXPORT_PRODUCTS,
    payload: data,
});

export const handleDeleteExportProduct = (value) => (dispatchs, getState) => {
    const show = getState().Products.show.isShow;
    dispatchs(deleteExportProduct(value));
    dispatchs(
        info({
            title: <FcOk />,
            message: "Xóa phụ tùng sửa chữa thành công!",
            autoDismiss: 2,
        })
    );
    dispatchs(showModal(!show));
};
