import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
import queryString from "query-string";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { info } from "react-notification-system-redux";

const api = "roles";

const getRoles = (data, total) => ({
    type: ActionTypes.GET_PAGING_ROLES,
    payload: {
        data,
        total,
    },
});

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_ROLES,
    payload: data,
});

const addRole = () => ({
    type: ActionTypes.ADD_ROLES,
});

const updateRole = () => ({
    type: ActionTypes.UPDATE_ROLES,
});

const deleteRole = () => ({
    type: ActionTypes.DELETE_ROLES,
});

export const getPaging = () => (dispatchs, getState) => {
    const params = getState().Roles.params;
    ServiceCrud.instance
        .getAll(api, queryString.stringify(params))
        .then((response) => {
            const { data, total } = response.data;
            if (total !== params.total) {
                dispatchs(getRoles(data, total));
            } else {
                dispatchs(getRoles(data));
            }
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

const showDefaultRoleModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_DEFAULT_ROLES,
    payload: data,
});

export const handleShow = (e) => (dispatchs, getState) => {
    const { key, modal } = e.target.dataset;
    const show = getState().Roles.show.isShow;
    const defaultRole = getState().DefaultRoles.show;
    switch (modal) {
        case "add_role":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                })
            );
            break;
        case "edit_role":
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
        case "add_default_role":
            ServiceCrud.instance
                .getAll("menus")
                .then((response) => {
                    const { data } = response;
                    dispatchs(
                        showDefaultRoleModal({
                            isShow: !defaultRole.isShow,
                            modal: modal,
                            data: data,
                            id: key,
                        })
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
            break;
        case "edit_default_role":
            ServiceCrud.instance
                .getAll("menus")
                .then((response) => {
                    const { data } = response;
                    return data;
                })
                .then((data) => {
                    ServiceCrud.instance
                        .show("roles", key)
                        .then((response) => {
                            const { menus } = response.data;
                            dispatchs(
                                showDefaultRoleModal({
                                    isShow: !defaultRole.isShow,
                                    modal: modal,
                                    data: data,
                                    menus: menus,
                                    id: key,
                                })
                            );
                        })
                        .catch((error) => {
                            console.log(error);
                        });
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
                dispatchs(addRole());
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
                dispatchs(updateRole());
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
                dispatchs(deleteRole());
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
