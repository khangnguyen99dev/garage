import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
import queryString from "query-string";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { info } from "react-notification-system-redux";
import moment from "moment";

const api = "customers";

const getCustomers = (data, total) => ({
    type: ActionTypes.GET_PAGING_CUSTOMERS,
    payload: {
        data,
        total,
    },
});

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_CUSTOMERS,
    payload: data,
});

const addCustomer = (data) => ({
    type: ActionTypes.ADD_CUSTOMERS,
    payload: data,
});

const updateCustomer = () => ({
    type: ActionTypes.UPDATE_CUSTOMERS,
});

const deleteCustomer = () => ({
    type: ActionTypes.DELETE_CUSTOMERS,
});

const showModalRepair = (data) => ({
    type: ActionTypes.SHOW_MODAL_REPAIR_VOTES,
    payload: data,
});

export const getPaging = () => (dispatchs, getState) => {
    const params = getState().Customers.params;
    ServiceCrud.instance
        .getAll(api, queryString.stringify(params))
        .then((response) => {
            const { data, total } = response.data;
            if (total !== params.total) {
                dispatchs(getCustomers(data, total));
            } else {
                dispatchs(getCustomers(data));
            }
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

export const handleShow = (e) => (dispatchs, getState) => {
    const { key, modal } = e.target.dataset;
    const show = getState().Customers.show.isShow;
    const repair = getState().RepairVotes.show;
    switch (modal) {
        case "add_customer":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                })
            );
            break;
        case "edit_customer":
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
        case "customer_payment":
            ServiceCrud.instance
                .show("customer-payment-repair", key)
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
        case "collect_vote":
            ServiceCrud.instance
                .show("repair-votes", key)
                .then((response) => {
                    const { data } = response;
                    const money = parseInt(data.total_price) - parseInt(data.paymented);
                    dispatchs(
                        showModalRepair({
                            isShow: !repair.isShow,
                            modal: modal,
                            data: Object.assign(data, {
                                money: money,
                                owed: money,
                                collect_date: moment(new Date()).format("YYYY-MM-DDThh:mm"),
                            }),
                            dataModal: {
                                services: [],
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
                .show("collect-votes", key)
                .then((response) => {
                    const { data } = response;
                    dispatchs(
                        showModalRepair({
                            isShow: !repair.isShow,
                            modal: modal,
                            data: data,
                            dataModal: {
                                services: [],
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
                    addCustomer({
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
                dispatchs(updateCustomer());
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
                dispatchs(deleteCustomer());
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
