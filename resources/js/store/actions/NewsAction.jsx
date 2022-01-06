import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
import queryString from "query-string";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { info } from "react-notification-system-redux";

const api = "news";

const getNews = (data, total) => ({
    type: ActionTypes.GET_PAGING_NEWS,
    payload: {
        data,
        total,
    },
});

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_NEWS,
    payload: data,
});

const addNew = () => ({
    type: ActionTypes.ADD_NEWS,
});

const updateNew = () => ({
    type: ActionTypes.UPDATE_NEWS,
});

const deleteNew = () => ({
    type: ActionTypes.DELETE_NEWS,
});

export const getPaging = () => (dispatchs, getState) => {
    const params = getState().News.params;
    ServiceCrud.instance
        .getAll(api, queryString.stringify(params))
        .then((response) => {
            const { data, total } = response.data;
            if (total !== params.total) {
                dispatchs(getNews(data, total));
            } else {
                dispatchs(getNews(data));
            }
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

export const getNewClients = () => (dispatchs) => {
    ServiceCrud.instance
        .getAll("new-clients")
        .then((response) => {
            const { data } = response;
            dispatchs(getNews(data));
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

export const handleShow = (e) => (dispatchs, getState) => {
    const { key, modal } = e.target.dataset;
    const show = getState().News.show.isShow;
    switch (modal) {
        case "add_new":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                    selectedFiles: [],
                })
            );
            break;
        case "edit_new":
            ServiceCrud.instance
                .show(api, key)
                .then((response) => {
                    dispatchs(
                        showModal({
                            isShow: !show,
                            modal: modal,
                            data: response.data,
                            id: key,
                            selectedFiles: ["../" + response.data.image],
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
                dispatchs(addNew());
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
    let newData = new FormData();

    for (const [key, value] of Object.entries(values)) {
        newData.append(key, value);
    }
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    ServiceCrud.instance
        .updateForm(api, values.id, newData, config)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(updateNew());
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
                dispatchs(deleteNew());
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
