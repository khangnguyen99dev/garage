import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
import queryString from "query-string";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { info } from "react-notification-system-redux";

const api = "users";

const getUsers = (data, total) => ({
    type: ActionTypes.GET_PAGING_USERS,
    payload: {
        data,
        total,
    },
});

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_USERS,
    payload: data,
});

const addUser = () => ({
    type: ActionTypes.ADD_USERS,
});

const updateUser = () => ({
    type: ActionTypes.UPDATE_USERS,
});

const deleteUser = () => ({
    type: ActionTypes.DELETE_USERS,
});

const showCustomRoleModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_CUSTOM_ROLES,
    payload: data,
});

export const getPaging = () => (dispatchs, getState) => {
    const params = getState().Users.params;
    ServiceCrud.instance
        .getAll(api, queryString.stringify(params))
        .then((response) => {
            const { data, total } = response.data;
            if (total !== params.total) {
                dispatchs(getUsers(data, total));
            } else {
                dispatchs(getUsers(data));
            }
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

export const handleShow = (e) => (dispatchs, getState) => {
    const { key, modal } = e.target.dataset;
    const show = getState().Users.show;
    const customRole = getState().CustomRoles.show;
    switch (modal) {
        case "add_user":
            dispatchs(
                showModal({
                    isShow: !show.isShow,
                    modal: modal,
                    selectedFiles: [],
                    roles: [],
                })
            );
            break;
        case "edit_user":
            ServiceCrud.instance
                .show(api, key)
                .then((response) => {
                    const { data } = response;
                    dispatchs(
                        showModal({
                            isShow: !show.isShow,
                            modal: modal,
                            data: data,
                            id: key,
                            selectedFiles: ["../" + data.avatar],
                            roles: data.custom_roles_menu
                                ? data.custom_roles_menu.map((item) => item.menu_id)
                                : [],
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
                })
            );
            break;
        case "add_custom_role":
            ServiceCrud.instance
                .getAll("menus")
                .then((response) => {
                    const { data } = response;
                    dispatchs(
                        showCustomRoleModal({
                            isShow: !customRole.isShow,
                            modal: modal,
                            data: data,
                            id: key,
                            roles: show.roles,
                        })
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
            break;
        case "edit_custom_role":
            ServiceCrud.instance
                .getAll("menus")
                .then((response) => {
                    const { data } = response;
                    dispatchs(
                        showCustomRoleModal({
                            isShow: !customRole.isShow,
                            modal: modal,
                            data: data,
                            id: key,
                            roles: show.roles,
                        })
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
            break;
        default:
            dispatchs(showModal(!show.isShow));
            break;
    }
};

export const handleSubmit = (data, e) => (dispatchs, getState) => {
    const customRoles = getState().Users.show.roles;
    if (data.roles == "custom_role") {
        data.custom_roles = customRoles;
    } else {
        data.custom_roles = [];
    }
    let newData = new FormData();

    for (const [key, value] of Object.entries(data)) {
        newData.append(key, value);
    }
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    ServiceCrud.instance
        .create(api, newData, config)
        .then((response) => {
            if (response.status == 201) {
                dispatchs(addUser());
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

export const handleUpdate = (values) => (dispatchs, getState) => {
    let { roles, menus, default_menu, custom_roles_menu, ...data } = values;
    const role_menus = getState().Users.show.roles;
    data.role_menus = role_menus;

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    let newData = new FormData();

    for (const [key, value] of Object.entries(data)) {
        newData.append(key, value);
    }

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
                dispatchs(updateUser());
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
                dispatchs(deleteUser());
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

const getUserInfo = (data) => ({
    type: ActionTypes.GET_USER_INFO,
    payload: data,
});

export const handleGetUserInfo = (id) => (dispatchs) => {
    ServiceCrud.instance
        .show(api, id)
        .then((response) => {
            const { data } = response;
            dispatchs(getUserInfo(data));
        })
        .catch((error) => {
            console.log(error);
        });
};

const updateInfo = () => ({
    type: ActionTypes.UPDATE_USER_INFO,
});

const updateAvatar = (url) => ({
    type: ActionTypes.UPDATE_AVATAR_USERS,
    payload: url,
});

export const handleUpdateInfo = (values) => (dispatchs) => {
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    let newData = new FormData();

    const data = {
        name: values.name,
        phone: values.phone,
        email: values.email,
        gender: values.gender,
        avatar: values.avatar,
        address: values.address,
    };

    for (const [key, value] of Object.entries(data)) {
        newData.append(key, value);
    }

    ServiceCrud.instance
        .updateForm("update-info", values.id, newData, config)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(updateInfo());
                dispatchs(updateAvatar(response.data.data));
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

const updateBusinessInfo = () => ({
    type: ActionTypes.UPDATE_BUSINESS_INFO,
});

export const handleUpdateSetting = (values) => (dispatchs) => {
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    let newData = new FormData();

    for (const [key, value] of Object.entries(values)) {
        newData.append(key, value);
    }

    ServiceCrud.instance
        .updateForm("update-business-info", values.id, newData, config)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(updateBusinessInfo());
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
