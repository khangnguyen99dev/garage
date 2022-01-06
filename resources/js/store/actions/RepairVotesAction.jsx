import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
import queryString from "query-string";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { info } from "react-notification-system-redux";
import moment from "moment";

const api = "repair-votes";

const getRepairVotes = (data, total) => ({
    type: ActionTypes.GET_PAGING_REPAIR_VOTES,
    payload: {
        data,
        total,
    },
});

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_REPAIR_VOTES,
    payload: data,
});

const addRepairVote = () => ({
    type: ActionTypes.ADD_REPAIR_VOTES,
});

const showRepairService = (data) => ({
    type: ActionTypes.SHOW_MODAL_SERVICES,
    payload: data,
});

const showRepairProduct = (data) => ({
    type: ActionTypes.SHOW_MODAL_PRODUCTS,
    payload: data,
});

const updateRepairVote = () => ({
    type: ActionTypes.UPDATE_REPAIR_VOTES,
});

const deleteRepairVote = () => ({
    type: ActionTypes.DELETE_REPAIR_VOTES,
});

const showModalExportVote = (data) => ({
    type: ActionTypes.SHOW_MODAL_EXPORT_VOTES,
    payload: data,
});

export const getPaging = () => (dispatchs, getState) => {
    const params = getState().RepairVotes.params;
    ServiceCrud.instance
        .getAll(api, queryString.stringify(params))
        .then((response) => {
            const { data, total } = response.data;
            if (total !== params.total) {
                dispatchs(getRepairVotes(data, total));
            } else {
                dispatchs(getRepairVotes(data));
            }
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

export const handleShow = (e) => (dispatchs, getState) => {
    const { key, modal } = e.target.dataset;
    const show = getState().RepairVotes.show;
    const service = getState().Services.show;
    const product = getState().Products.show;
    switch (modal) {
        case "add_repairVote":
            dispatchs(
                showModal({
                    isShow: !show.isShow,
                    modal: modal,
                })
            );
            break;
        case "edit_repairVote":
            ServiceCrud.instance
                .show(api, key)
                .then((response) => {
                    const { data } = response;
                    let services = [];
                    let products = [];
                    data.services.map((value) => {
                        services.push({
                            service_id: value.id,
                            name: value.name,
                            note: value.pivot.note,
                            price: value.pivot.price,
                            id: value.pivot.id,
                        });
                    });
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
                            id: key,
                            dataModal: {
                                services: services,
                                products: products,
                            },
                            total_price: data.total_price,
                            discount: data.discount,
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
        case "add_repair_service":
            dispatchs(
                showRepairService({
                    isShow: !service.isShow,
                    modal: modal,
                })
            );
            break;
        case "edit_repair_service":
            const selectedOption = show.dataModal.services.find(
                (option) => option.service_id === parseInt(key)
            );
            const index = show.dataModal.services.findIndex(
                (option) => option.service_id === parseInt(key)
            );
            dispatchs(
                showRepairService({
                    isShow: !service.isShow,
                    modal: modal,
                    data: {
                        id: selectedOption.service_id,
                        name: selectedOption.name,
                        note: selectedOption.note,
                        price: selectedOption.price,
                        key: selectedOption.id || "",
                    },
                    id: index,
                })
            );
            break;
        case "delete_repair_service":
            dispatchs(
                showRepairService({
                    isShow: !service.isShow,
                    modal: modal,
                    id: key,
                })
            );
            break;
        case "add_repair_product":
            dispatchs(
                showRepairProduct({
                    isShow: !product.isShow,
                    modal: modal,
                })
            );
            break;
        case "edit_repair_product":
            const selectedProduct = show.dataModal.products.find(
                (option) => option.product_id === parseInt(key)
            );
            const indexProduct = show.dataModal.products.findIndex(
                (option) => option.product_id === parseInt(key)
            );
            dispatchs(
                showRepairProduct({
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
        case "delete_repair_product":
            dispatchs(
                showRepairProduct({
                    isShow: !product.isShow,
                    modal: modal,
                    id: key,
                })
            );
            break;
        case "add_export_vote":
            ServiceCrud.instance
                .show(api, key)
                .then((response) => {
                    const { data } = response;
                    let services = [];
                    let products = [];
                    data.services.map((value) => {
                        services.push({
                            service_id: value.id,
                            name: value.name,
                            note: value.pivot.note,
                            price: value.pivot.price,
                            id: value.pivot.id,
                        });
                    });
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
                        showModalExportVote({
                            isShow: !show.isShow,
                            modal: modal,
                            data: data,
                            id: key,
                            dataModal: {
                                services: services,
                                products: products,
                            },
                            total_price: data.total_price,
                            discount: data.discount,
                        })
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
            break;
        case "accept_repair":
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
        case "add_collect_vote":
            ServiceCrud.instance
                .show("repair-votes", key)
                .then((response) => {
                    const { data } = response;
                    dispatchs(
                        showModal({
                            isShow: !show.isShow,
                            modal: modal,
                            data: Object.assign(data, { money: data.total_price }),
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
        case "collect_vote":
            ServiceCrud.instance
                .show("repair-votes", key)
                .then((response) => {
                    const { data } = response;
                    const money = parseInt(data.total_price) - parseInt(data.paymented);
                    dispatchs(
                        showModal({
                            isShow: !show.isShow,
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
                        showModal({
                            isShow: !show.isShow,
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

export const handleSubmit = (values, e) => (dispatchs) => {
    ServiceCrud.instance
        .create(api, values)
        .then((response) => {
            if (response.status == 201) {
                dispatchs(addRepairVote());
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
    const repairVotes = getState().RepairVotes.show;

    const products = repairVotes.dataModal.products;

    const services = repairVotes.dataModal.services;

    let { cars, users, number_car_id, receive_date, ...newData } = values;

    newData.services = services;

    newData.products = products;

    newData.discount = repairVotes.discount;

    newData.total_price = repairVotes.total_price;

    ServiceCrud.instance
        .update(api, newData.id, newData)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(updateRepairVote());
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
                dispatchs(deleteRepairVote());
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

const total = (data) => ({
    type: ActionTypes.TOTAL_REPAIR_VOTES,
    payload: data,
});

export const handleTotal = () => (dispatchs, getState) => {
    const { services, products } = getState().RepairVotes.show.dataModal;
    const { discount } = getState().RepairVotes.show;
    const totalService = services.reduce((n, { price }) => parseInt(n) + parseInt(price), 0);

    const totalProduct = products.reduce(
        (n, { price, quantity }) => parseInt(n) + parseInt(price) * parseInt(quantity),
        0
    );

    const sum = parseInt(totalService) + parseInt(totalProduct);
    const totalmoney = parseInt(discount) > 0 ? sum - (sum * discount) / 100 : sum;
    dispatchs(total(totalmoney));
};

const reloadReceiveVote = () => ({
    type: ActionTypes.RELOAD_RECEIVE_VOTES,
});

export const handleSubmitRepairVote = (data) => (dispatchs, getState) => {
    const repairVotes = getState().RepairVotes.show;

    const products = repairVotes.dataModal.products;

    const services = repairVotes.dataModal.services;

    if (products.length == 0 && services.length == 0) {
        dispatchs(
            info({
                title: <FcHighPriority />,
                message: "Vui lòng thêm dịch vụ hoặc phụ tùng sửa chữa!",
                autoDismiss: 2,
            })
        );
    } else {
        let values = {
            repair_date: data.repair_date,
            user_id: data.user_id,
            receive_vote_id: data.id,
            expecte_date: data.expecte_date,
            total_price: repairVotes.total_price,
            discount: repairVotes.discount,
            services: services,
            products: products,
        };

        ServiceCrud.instance
            .create(api, values)
            .then((response) => {
                if (response.status == 201) {
                    dispatchs(addRepairVote());
                    dispatchs(
                        info({
                            title: <FcOk />,
                            message: response.data.message,
                            autoDismiss: 2,
                        })
                    );
                    dispatchs(reloadReceiveVote());
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
    }
};

const discountChange = (value) => ({
    type: ActionTypes.DISCOUNT_REPAIR_VOTES,
    payload: value,
});

export const handleDiscountChange = (value) => (dispatchs) => {
    dispatchs(discountChange(value));
};

const acceptRepair = () => ({
    type: ActionTypes.ACCEPT_REPAIR,
});

export const handleAcceptRepair = (value) => (dispatchs) => {
    ServiceCrud.instance
        .edit("accept-repair", value.id)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(acceptRepair());
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

const addCollectVote = () => ({
    type: ActionTypes.ADD_COLLECT_VOTES,
});

const customerCollectVote = (data) => ({
    type: ActionTypes.SHOW_MODAL_CUSTOMERS,
    payload: data,
});

const resetCustomer = () => ({
    type: ActionTypes.RESET_CUSTOMERS,
});

export const handleCollectVote = (values, param) => (dispatchs, getState) => {
    const data = {
        repair_vote_id: values.id,
        collect_date: values.collect_date,
        money: values.money,
    };
    const repair = getState().Customers.show.isShow;
    ServiceCrud.instance
        .create("add-collect-vote", data)
        .then((response) => {
            if (response.status == 201) {
                dispatchs(addCollectVote());
                if (param == "customers") {
                    ServiceCrud.instance
                        .show("customer-payment-repair", values.cars.customers.id)
                        .then((response) => {
                            dispatchs(
                                customerCollectVote({
                                    isShow: repair,
                                    modal: "customer_payment",
                                    data: response.data,
                                })
                            );
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    dispatchs(resetCustomer());
                }
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
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
    type: ActionTypes.FILLTER_DATE_REPAIR_VOTES,
    payload: start + "," + end,
});

const changeRow = (value) => ({
    type: ActionTypes.CHANGE_ROW_REPAIR_VOTES,
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
    type: ActionTypes.CHANGE_STATUS_REPAIR_VOTES,
    payload: value,
});

export const handleChangeStatus = (e) => (dispatchs) => {
    dispatchs(changeStatus(e.target.value));
};

const clearDate = () => ({
    type: ActionTypes.CLEAR_DATE_REPAIR_VOTES,
});

export const handleClearDate = () => (dispatchs) => {
    dispatchs(clearDate());
};
