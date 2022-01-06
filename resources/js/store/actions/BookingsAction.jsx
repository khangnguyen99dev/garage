import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
import queryString from "query-string";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { info } from "react-notification-system-redux";
import moment from "moment";

const api = "bookings";

const getBookings = (data, total) => ({
    type: ActionTypes.GET_PAGING_BOOKINGS,
    payload: {
        data,
        total,
    },
});

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_BOOKINGS,
    payload: data,
});

export const getPaging = () => (dispatchs, getState) => {
    const params = getState().Bookings.params;
    ServiceCrud.instance
        .getAll(api, queryString.stringify(params))
        .then((response) => {
            const { data, total } = response.data;
            if (total !== params.total) {
                dispatchs(getBookings(data, total));
            } else {
                dispatchs(getBookings(data));
            }
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

export const handleShow = (e) => (dispatchs, getState) => {
    const { modal, key } = e.target.dataset;
    const show = getState().Bookings.show.isShow;
    switch (modal) {
        case "accept_receiveVote":
            ServiceCrud.instance
                .show("receive-votes", key)
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
        case "cancel_receiveVote":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                    id: key,
                })
            );
        default:
            dispatchs(showModal(!show));
            break;
    }
};

const acceptBooking = () => ({
    type: ActionTypes.ACCEPT_BOOKINGS,
});

export const acceptReceiveVote = (values) => (dispatchs) => {
    const data = {
        receive_date: values.receive_date,
        repair_date: values.repair_date,
        note: values.note,
        send_sms: values.send_sms,
    };

    ServiceCrud.instance
        .update("accept-receive-vote", values.id, data)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(acceptBooking());
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
    type: ActionTypes.FILLTER_DATE_BOOKING_VOTES,
    payload: start + "," + end,
});

const changeRow = (value) => ({
    type: ActionTypes.CHANGE_ROW_BOOKING_VOTES,
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

const cancelReceiveVote = () => ({
    type: ActionTypes.CANCEL_RECEIVE_VOTES,
});

export const handleCancelReceiveVote = (values) => (dispatchs) => {
    ServiceCrud.instance
        .update("cancel-receive-vote", values.id, values)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(cancelReceiveVote());
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
