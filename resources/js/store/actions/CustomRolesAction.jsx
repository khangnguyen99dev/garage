import * as ActionTypes from "../action-types";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { info } from "react-notification-system-redux";

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_CUSTOM_ROLES,
    payload: data,
});

const addCustomRole = (data) => ({
    type: ActionTypes.ADD_CUSTOM_ROLES,
    payload: data,
});

export const handleShow = (e) => (dispatchs, getState) => {
    const { key, modal } = e.target.dataset;
    const show = getState().CustomRoles.show.isShow;
    switch (modal) {
        default:
            dispatchs(showModal(!show));
            break;
    }
};

export const handleSubmit = (data) => (dispatchs, getState) => {
    const show = getState().CustomRoles.show.isShow;
    if (data.roles.length > 0) {
        dispatchs(addCustomRole(data.roles));
        dispatchs(
            info({
                title: <FcOk />,
                message: "Thiết lập quyền thành công!",
                autoDismiss: 2,
            })
        );
        dispatchs(showModal(!show));
    } else {
        dispatchs(
            info({
                title: <FcHighPriority />,
                message: "Vui lòng chọn chức năng!",
                autoDismiss: 2,
            })
        );
    }
};

const setCheck = (check) => ({
    type: ActionTypes.SET_CHECK_CUSTOM_ROLES,
    payload: check,
});

export const handleSetCheck = (check) => (dispatchs) => {
    dispatchs(setCheck(check));
};
