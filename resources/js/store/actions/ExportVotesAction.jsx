import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
import queryString from "query-string";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { info } from "react-notification-system-redux";
import moment from "moment";

const api = "export-votes";

const getExportVotes = (data, total) => ({
    type: ActionTypes.GET_PAGING_EXPORT_VOTES,
    payload: {
        data,
        total,
    },
});

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_EXPORT_VOTES,
    payload: data,
});

const addExportVote = () => ({
    type: ActionTypes.ADD_EXPORT_VOTES,
});

const updateExportVote = () => ({
    type: ActionTypes.UPDATE_EXPORT_VOTES,
});

const deleteExportVote = () => ({
    type: ActionTypes.DELETE_EXPORT_VOTES,
});

const showExportProduct = (data) => ({
    type: ActionTypes.SHOW_MODAL_PRODUCTS,
    payload: data,
});

export const getPaging = () => (dispatchs, getState) => {
    const params = getState().ExportVotes.params;
    ServiceCrud.instance
        .getAll(api, queryString.stringify(params))
        .then((response) => {
            const { data, total } = response.data;
            if (total !== params.total) {
                dispatchs(getExportVotes(data, total));
            } else {
                dispatchs(getExportVotes(data));
            }
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

export const handleShow = (e) => (dispatchs, getState) => {
    const { key, modal } = e.target.dataset;
    const show = getState().ExportVotes.show;
    const product = getState().Products.show;
    switch (modal) {
        case "add_export_vote":
            dispatchs(
                showModal({
                    isShow: !show.isShow,
                    modal: modal,
                })
            );
            break;
        case "edit_export_vote":
            ServiceCrud.instance
                .show(api, key)
                .then((response) => {
                    const { data } = response;
                    let products = [];
                    data.products.map((value) => {
                        products.push({
                            product_id: value.id,
                            name: value.name,
                            price: value.pivot.price,
                            quantity: value.pivot.quantity,
                            id: value.pivot.id,
                        });
                    });
                    dispatchs(
                        showModal({
                            isShow: !show.isShow,
                            modal: modal,
                            data: data,
                            dataModal: {
                                products: products,
                            },
                            id: key,
                        })
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
            break;
        case "edit_export_product":
            const selectedProduct = show.dataModal.products.find(
                (option) => option.product_id === parseInt(key)
            );
            const indexProduct = show.dataModal.products.findIndex(
                (option) => option.product_id === parseInt(key)
            );
            dispatchs(
                showExportProduct({
                    isShow: !product.isShow,
                    modal: modal,
                    data: {
                        id: selectedProduct.product_id,
                        name: selectedProduct.name,
                        price: selectedProduct.price,
                        qty: selectedProduct.quantity,
                        key: selectedProduct.id || "",
                    },
                    id: indexProduct,
                })
            );
            break;
        case "delete":
            dispatchs(
                showModal({
                    isShow: !show.isShow,
                    modal: modal,
                    id: key,
                    dataModal: {
                        services: [],
                        products: [],
                    },
                })
            );
            break;
        case "delete_export_product":
            dispatchs(
                showExportProduct({
                    isShow: !product.isShow,
                    modal: modal,
                    id: key,
                })
            );
            break;
        case "confirm_export_product":
            dispatchs(
                showModal({
                    isShow: !show.isShow,
                    modal: modal,
                    id: key,
                    dataModal: {
                        services: [],
                        products: [],
                    },
                })
            );
            break;
        default:
            dispatchs(showModal(!show));
            break;
    }
};

const reloadRepairVote = () => ({
    type: ActionTypes.RELOAD_REPAIR_VOTES,
});

export const handleSubmit = (data) => (dispatchs) => {
    const newData = (({ vote_date, note, products }) => ({ vote_date, note, products }))(data);

    const products = [];

    newData.products.map((value) => {
        products.push({
            product_id: value.id,
            quantity: value.pivot.quantity,
            price: value.pivot.price,
        });
    });

    newData.repair_vote_id = data.id;

    newData.products = products;

    ServiceCrud.instance
        .create(api, newData)
        .then((response) => {
            if (response.status == 201) {
                dispatchs(addExportVote());
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(reloadRepairVote());
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
    const newData = (({ vote_date, note }) => ({ vote_date, note }))(values);
    const { products } = getState().ExportVotes.show.dataModal;
    newData.products = products;

    ServiceCrud.instance
        .update(api, values.id, newData)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(updateExportVote());
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
                dispatchs(deleteExportVote());
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

const confirmExport = () => ({
    type: ActionTypes.CONFIRM_EXPORT,
});

export const handleConfirmExport = (value) => (dispatchs) => {
    ServiceCrud.instance
        .edit(api, value.id)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(confirmExport());
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

const fillterDate = (start, end) => ({
    type: ActionTypes.FILLTER_DATE_EXPORT_VOTES,
    payload: start + "," + end,
});

const changeRow = (value) => ({
    type: ActionTypes.CHANGE_ROW_EXPORT_VOTES,
    payload: value,
});

export const handleChangeRow = (e) => (dispatchs) => {
    dispatchs(changeRow(e.target.value));
};

export const onDateChanges = (start, end) => (dispatchs) => {
    if (end !== undefined) {
        dispatchs(
            fillterDate(moment(start).format("YYYY-MM-DD"), moment(end).format("YYYY-MM-DD"))
        );
    }
};

const changeStatus = (value) => ({
    type: ActionTypes.CHANGE_STATUS_EXPORT_VOTES,
    payload: value,
});

export const handleChangeStatus = (e) => (dispatchs) => {
    dispatchs(changeStatus(e.target.value));
};

const clearDate = () => ({
    type: ActionTypes.CLEAR_DATE_EXPORT_VOTES,
});

export const handleClearDate = () => (dispatchs) => {
    dispatchs(clearDate());
};
