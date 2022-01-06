import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
import queryString from "query-string";
import moment from "moment";

const api = "feedbacks";

const getFeedbacks = (data, total) => ({
    type: ActionTypes.GET_PAGING_FEEDBACKS,
    payload: {
        data,
        total,
    },
});

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_FEEDBACKS,
    payload: data,
});

export const getPaging = () => (dispatchs, getState) => {
    const params = getState().Feedbacks.params;
    ServiceCrud.instance
        .getAll(api, queryString.stringify(params))
        .then((response) => {
            const { data, total } = response.data;
            if (total !== params.total) {
                dispatchs(getFeedbacks(data, total));
            } else {
                dispatchs(getFeedbacks(data));
            }
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

export const handleShow = (e) => (dispatchs, getState) => {
    const { key, modal } = e.target.dataset;
    const show = getState().Feedbacks.show.isShow;
    switch (modal) {
        case "show_detail_feedback":
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
        default:
            dispatchs(showModal(!show));
            break;
    }
};

const fillterDate = (start, end) => ({
    type: ActionTypes.FILLTER_DATE_FEEDBACKS,
    payload: start + "," + end,
});

export const onDateChanges = (start, end) => (dispatchs) => {
    if (end !== undefined) {
        dispatchs(
            fillterDate(moment(start).format("YYYY-MM-DD"), moment(end).format("YYYY-MM-DD"))
        );
    }
};

const changeStar = (value) => ({
    type: ActionTypes.CHANGE_STAR_FEEDBACKS,
    payload: value,
});

export const handleChangeStar = (e) => (dispatchs) => {
    dispatchs(changeStar(e.target.value));
};

const clearDate = () => ({
    type: ActionTypes.CLEAR_DATE_FEEDBACKS,
});

export const handleClearDate = () => (dispatchs) => {
    dispatchs(clearDate());
};
