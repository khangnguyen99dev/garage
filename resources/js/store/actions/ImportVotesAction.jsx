import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
import queryString from "query-string";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { info } from "react-notification-system-redux";
import moment from "moment";
import { parseInt } from "lodash";

const api = "import-votes";

const getImportVotes = (data, total) => ({
    type: ActionTypes.GET_PAGING_IMPORT_VOTES,
    payload: {
        data,
        total,
    },
});

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_IMPORT_VOTES,
    payload: data,
});

const addImportVote = () => ({
    type: ActionTypes.ADD_IMPORT_VOTES,
});

const updateImportVote = () => ({
    type: ActionTypes.UPDATE_IMPORT_VOTES,
});

const deleteImportVote = () => ({
    type: ActionTypes.DELETE_IMPORT_VOTES,
});

const showModalImportVoteDetail = (data) => ({
    type: ActionTypes.SHOW_MODAL_IMPORT_VOTE_DETAILS,
    payload: data,
});

export const getPaging = () => (dispatchs, getState) => {
    const params = getState().ImportVotes.params;
    ServiceCrud.instance
        .getAll(api, queryString.stringify(params))
        .then((response) => {
            const { data, total } = response.data;
            if (total !== params.total) {
                dispatchs(getImportVotes(data, total));
            } else {
                dispatchs(getImportVotes(data));
            }
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

export const handleShow = (e) => (dispatchs, getState) => {
    const { key, modal } = e.target.dataset;
    const show = getState().ImportVotes.show;
    const importVoteDetail = getState().ImportVoteDetails.show;
    switch (modal) {
        case "add_import_vote":
            dispatchs(
                showModal({
                    isShow: !show.isShow,
                    modal: modal,
                    selectedFiles: [],
                    dataModal: {
                        products: [],
                    },
                })
            );
            break;
        case "edit_import_vote":
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
                            import_price: value.pivot.import_price,
                            quantity: value.pivot.quantity,
                            id: value.pivot.id,
                        });
                    });
                    dispatchs(
                        showModal({
                            isShow: !show.isShow,
                            modal: modal,
                            data: data,
                            selectedFiles: data.image_auth ? ["../" + data.image_auth] : [],
                            dataModal: {
                                products: products,
                            },
                            id: key,
                            total_price: data.total_price,
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
                        products: [],
                    },
                })
            );
            break;
        case "add_import_vote_detail":
            dispatchs(
                showModalImportVoteDetail({
                    isShow: !importVoteDetail.isShow,
                    modal: modal,
                })
            );
            break;
        case "edit_import_vote_detail":
            const selectedProduct = show.dataModal.products.find(
                (option) => option.product_id === parseInt(key)
            );
            const indexProduct = show.dataModal.products.findIndex(
                (option) => option.product_id === parseInt(key)
            );
            dispatchs(
                showModalImportVoteDetail({
                    isShow: !importVoteDetail.isShow,
                    modal: modal,
                    data: {
                        id: selectedProduct.product_id,
                        name: selectedProduct.name,
                        import_price: selectedProduct.import_price,
                        price: selectedProduct.price,
                        qty: selectedProduct.quantity,
                        key: selectedProduct.id || "",
                    },
                    id: indexProduct,
                })
            );
            break;
        case "delete_import_vote_detail":
            dispatchs(
                showModalImportVoteDetail({
                    isShow: !importVoteDetail.isShow,
                    modal: modal,
                    id: key,
                })
            );
            break;
        case "confirm_import_vote":
            dispatchs(
                showModal({
                    isShow: !show.isShow,
                    modal: modal,
                    id: key,
                    dataModal: {
                        products: [],
                    },
                })
            );
            break;
        case "supplier_payment":
            ServiceCrud.instance
                .show("supplier-payment", key)
                .then((response) => {
                    const { data } = response;
                    const money = parseInt(data.total_price) - parseInt(data.payment);
                    dispatchs(
                        showModal({
                            isShow: !show.isShow,
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
                        showModal({
                            isShow: !show.isShow,
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

const reloadImportVote = () => ({
    type: ActionTypes.RELOAD_IMPORT_DETAIL_PRODUCTS,
});

export const handleSubmit = (data, e) => (dispatchs, getState) => {
    const importDetailProduct = getState().ImportVotes.show;
    const { total_price } = importDetailProduct;
    const { products } = importDetailProduct.dataModal;
    if (products.length == 0) {
        dispatchs(
            info({
                title: <FcHighPriority />,
                message: "Vui lòng thêm phụ tùng!",
                autoDismiss: 2,
            })
        );
    } else {
        data.total_price = total_price;
        data.products = products;

        let newData = new FormData();
        for (const [key, value] of Object.entries(data)) {
            if (key == "products") {
                newData.append(key, JSON.stringify(value));
            } else {
                newData.append(key, value);
            }
        }
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        ServiceCrud.instance
            .create(api, newData, config)
            .then((response) => {
                if (response.status == 201) {
                    dispatchs(addImportVote());
                    dispatchs(
                        info({
                            title: <FcOk />,
                            message: response.data.message,
                            autoDismiss: 2,
                        })
                    );
                    dispatchs(reloadImportVote());
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

export const handleUpdate = (values) => (dispatchs, getState) => {
    const importVote = getState().ImportVotes.show;
    const { products } = importVote.dataModal;
    const { total_price } = importVote;
    let data = {
        id: values.id,
        payment: values.payment,
        supplier_id: values.supplier_id,
        total_price: total_price,
        user_id: values.user_id,
        vote_date: values.vote_date,
        import_date: values.import_date,
        products: products,
        image: values.image,
    };

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    let newData = new FormData();

    for (const [key, value] of Object.entries(data)) {
        if (key == "products") {
            newData.append(key, JSON.stringify(value));
        } else {
            newData.append(key, value);
        }
    }

    ServiceCrud.instance
        .updateForm(api, data.id, newData, config)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(updateImportVote());
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
                dispatchs(deleteImportVote());
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
    type: ActionTypes.TOTAL_IMPORT_DETAIL_PRODUCTS,
    payload: data,
});

export const handleTotal = () => (dispatchs, getState) => {
    const { products } = getState().ImportVotes.show.dataModal;
    const totalProduct = products.reduce(
        (n, { import_price, quantity }) =>
            parseInt(n) + parseInt(import_price) * parseInt(quantity),
        0
    );
    dispatchs(total(totalProduct));
};

const confirmImport = () => ({
    type: ActionTypes.CONFIRM_IMPORT,
});

export const handleConfirmImportVote = (value) => (dispatchs) => {
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
                dispatchs(confirmImport());
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
    type: ActionTypes.FILLTER_DATE_IMPORT_VOTES,
    payload: start + "," + end,
});

const changeRow = (value) => ({
    type: ActionTypes.CHANGE_ROW_IMPORT_VOTES,
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

const addPaymentVote = () => ({
    type: ActionTypes.ADD_PAYMENT_VOTES,
});

const showModalSupplier = (data) => ({
    type: ActionTypes.SHOW_MODAL_SUPPLIERS,
    payload: data,
});

const resetSupplier = () => ({
    type: ActionTypes.RESET_SUPPLIERS,
});

export const handlePaymentVote = (values, param) => (dispatchs, getState) => {
    const data = {
        import_vote_id: values.id,
        payment_date: values.payment_date,
        money: values.money,
    };

    const importVote = getState().ImportVotes.show;

    ServiceCrud.instance
        .create("add-payment-vote", data)
        .then((response) => {
            if (response.status == 201) {
                dispatchs(addPaymentVote());
                if (param == "suppliers") {
                    ServiceCrud.instance
                        .show("show-supplier-payment", values.supplier_id)
                        .then((response) => {
                            dispatchs(
                                showModalSupplier({
                                    isShow: importVote.isShow,
                                    modal: "show_supplier_payment",
                                    data: response.data,
                                })
                            );
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    dispatchs(resetSupplier());
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

const clearDate = () => ({
    type: ActionTypes.CLEAR_DATE_IMPORT_VOTES,
});

export const handleClearDate = () => (dispatchs) => {
    dispatchs(clearDate());
};
