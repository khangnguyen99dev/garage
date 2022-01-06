import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
import queryString from "query-string";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { info } from "react-notification-system-redux";
import moment from "moment";

const api = "receive-votes";

const getReceiveVotes = (data, total) => ({
    type: ActionTypes.GET_PAGING_RECEIVE_VOTES,
    payload: {
        data,
        total,
    },
});

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_RECEIVE_VOTES,
    payload: data,
});

const showModalPriceQuote = (data) => ({
    type: ActionTypes.SHOW_MODAL_REPAIR_VOTES,
    payload: data,
});

const showModalCar = (data) => ({
    type: ActionTypes.SHOW_MODAL_CARS,
    payload: data,
});

const addReceiveVote = (data) => ({
    type: ActionTypes.ADD_RECEIVE_VOTES,
    payload: data,
});

const updateReceiveVote = () => ({
    type: ActionTypes.UPDATE_RECEIVE_VOTES,
});

const deleteReceiveVote = () => ({
    type: ActionTypes.DELETE_RECEIVE_VOTES,
});

export const getPaging = () => (dispatchs, getState) => {
    const params = getState().ReceiveVotes.params;
    ServiceCrud.instance
        .getAll(api, queryString.stringify(params))
        .then((response) => {
            const { data, total } = response.data;
            if (total !== params.total) {
                dispatchs(getReceiveVotes(data, total));
            } else {
                dispatchs(getReceiveVotes(data));
            }
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

export const handleShow = (e) => (dispatchs, getState) => {
    const { modal, key } = e.target.dataset;
    const show = getState().ReceiveVotes.show.isShow;
    const carmodal = getState().Cars.show.isShow;
    switch (modal) {
        case "add_car":
            dispatchs(
                showModalCar({
                    isShow: !carmodal,
                    modal: modal,
                })
            );
            break;
        case "add_receiveVote":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                    data: {},
                })
            );
            break;
        case "edit_receiveVote":
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
        case "add_price_quote":
            ServiceCrud.instance
                .show(api, key)
                .then((response) => {
                    dispatchs(
                        showModalPriceQuote({
                            isShow: !show,
                            modal: modal,
                            data: Object.assign(response.data, { expecte_date: "" }),
                            id: key,
                            dataModal: {
                                services: [],
                                products: [],
                            },
                            total_price: 0,
                            discount: 0,
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

export const handleSubmit = (data) => (dispatchs) => {
    let { cars, ...newdata } = data;
    ServiceCrud.instance
        .create(api, newdata)
        .then((response) => {
            if (response.status == 201) {
                dispatchs(
                    addReceiveVote({
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
    let { cars, ...newdata } = values;
    ServiceCrud.instance
        .update(api, newdata.id, newdata)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(updateReceiveVote());
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
                dispatchs(deleteReceiveVote());
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

const fillterDate = (start, end) => ({
    type: ActionTypes.FILLTER_DATE_RECEIVE_VOTES,
    payload: start + "," + end,
});

const changeRow = (value) => ({
    type: ActionTypes.CHANGE_ROW_RECEIVE_VOTES,
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
    type: ActionTypes.CHANGE_STATUS_RECEIVE_VOTES,
    payload: value,
});

export const handleChangeStatus = (e) => (dispatchs) => {
    dispatchs(changeStatus(e.target.value));
};

const clearDate = () => ({
    type: ActionTypes.CLEAR_DATE_RECEIVE_VOTES,
});

export const handleClearDate = () => (dispatchs) => {
    dispatchs(clearDate());
};
