import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
import queryString from "query-string";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { info } from "react-notification-system-redux";
import moment from "moment";

const api = "suppliers";

const getSuppliers = (data, total) => ({
    type: ActionTypes.GET_PAGING_SUPPLIERS,
    payload: {
        data,
        total,
    },
});

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_SUPPLIERS,
    payload: data,
});

const addSupplier = (data) => ({
    type: ActionTypes.ADD_SUPPLIERS,
    payload: data,
});

const updateSupplier = () => ({
    type: ActionTypes.UPDATE_SUPPLIERS,
});

const deleteSupplier = () => ({
    type: ActionTypes.DELETE_SUPPLIERS,
});

export const getPaging = () => (dispatchs, getState) => {
    const params = getState().Suppliers.params;
    ServiceCrud.instance
        .getAll(api, queryString.stringify(params))
        .then((response) => {
            const { data, total } = response.data;
            if (total !== params.total) {
                dispatchs(getSuppliers(data, total));
            } else {
                dispatchs(getSuppliers(data));
            }
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

const showModalImportVote = (data) => ({
    type: ActionTypes.SHOW_MODAL_IMPORT_VOTES,
    payload: data,
});

export const handleShow = (e) => (dispatchs, getState) => {
    const { key, modal } = e.target.dataset;
    const show = getState().Suppliers.show.isShow;
    const importVote = getState().ImportVotes.show;
    switch (modal) {
        case "add_supplier":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                })
            );
            break;
        case "edit_supplier":
            ServiceCrud.instance
                .show(api, key)
                .then((response) => {
                    dispatchs(
                        showModal({
                            isShow: !show,
                            modal: modal,
                            data: response.data,
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
        case "show_supplier_payment":
            ServiceCrud.instance
                .show("show-supplier-payment", key)
                .then((response) => {
                    dispatchs(
                        showModal({
                            isShow: !show,
                            modal: modal,
                            data: response.data,
                        })
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
            break;
        case "supplier_payment":
            ServiceCrud.instance
                .show("supplier-payment", key)
                .then((response) => {
                    const { data } = response;
                    const money = parseInt(data.total_price) - parseInt(data.payment);
                    dispatchs(
                        showModalImportVote({
                            isShow: !importVote.isShow,
                            modal: modal,
                            data: Object.assign(data, {
                                owed: money,
                                money: money,
                                payment_date: moment(new Date()).format("YYYY-MM-DDThh:mm"),
                            }),
                            dataModal: {
                                products: [],
                            },
                        })
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
            break;
        case "show_print_payment":
            ServiceCrud.instance
                .show("payment-votes", key)
                .then((response) => {
                    const { data } = response;
                    dispatchs(
                        showModalImportVote({
                            isShow: !importVote.isShow,
                            modal: modal,
                            data: data,
                            dataModal: {
                                products: [],
                            },
                        })
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
            break;
        default:
            dispatchs(showModal(!show));
            break;
    }
};

export const handleSubmit = (data, e) => (dispatchs) => {
    ServiceCrud.instance
        .create(api, data)
        .then((response) => {
            if (response.status == 201) {
                dispatchs(
                    addSupplier({
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
                    message: "Có lỗi trong quá trình thục hiện!",
                    autoDismiss: 2,
                })
            );
        });
};

export const handleUpdate = (values) => (dispatchs) => {
    ServiceCrud.instance
        .update(api, values.id, values)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(updateSupplier());
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
                dispatchs(deleteSupplier());
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
