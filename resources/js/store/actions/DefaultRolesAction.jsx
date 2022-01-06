import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
// import queryString from "query-string";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { info } from "react-notification-system-redux";

const api = "default-roles";

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_DEFAULT_ROLES,
    payload: data,
});

const addDefaultRole = () => ({
    type: ActionTypes.ADD_DEFAULT_ROLES,
});

const updateDefaultRole = () => ({
    type: ActionTypes.UPDATE_DEFAULT_ROLES,
});

const resetRoles = () => ({
    type: ActionTypes.RESET_ROLES,
});

export const handleShow = (e) => (dispatchs, getState) => {
    const { key, modal } = e.target.dataset;
    const show = getState().DefaultRoles.show.isShow;
    switch (modal) {
        case "add_DefaultRole":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                })
            );
            break;
        case "edit_DefaultRole":
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
        default:
            dispatchs(showModal(!show));
            break;
    }
};

export const handleSubmit = (data) => (dispatchs) => {
    ServiceCrud.instance
        .create(api, data)
        .then((response) => {
            if (response.status == 201) {
                dispatchs(addDefaultRole());
                dispatchs(resetRoles());
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
                dispatchs(updateDefaultRole());
                dispatchs(resetRoles());
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

const setCheck = (check) => ({
    type: ActionTypes.SET_CHECK_DEFAULT_ROLES,
    payload: check,
});

export const handleSetCheck = (check) => (dispatchs) => {
    dispatchs(setCheck(check));
};
