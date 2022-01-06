import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
import queryString from "query-string";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { info } from "react-notification-system-redux";
import * as action from "../../store/actions";
import firebase from "@/views/firebase";
import _ from "lodash";

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_CLIENTS,
    payload: data,
});

export const handleShow = (e) => (dispatchs, getState) => {
    e.preventDefault();
    const { modal, key } = e.target.dataset;
    const show = getState().Clients.show.isShow;
    switch (modal) {
        case "register":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                })
            );
            break;
        case "login":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                })
            );
            break;
        case "add_car":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                })
            );
            break;
        case "edit_car":
            ServiceCrud.instance
                .show("car-profile", key)
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
        case "delete_car":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                    id: key,
                })
            );
            break;
        case "forgot_form_phone":
            dispatchs(
                showModal({
                    isShow: show,
                    modal: modal,
                })
            );
            break;
        case "history_repair":
            ServiceCrud.instance
                .show("repair-detail", key)
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
        case "cancel_booking_repair":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                    id: key,
                })
            );
            break;
        case "show_detail_cancel":
            ServiceCrud.instance
                .show("detail-cancel", key)
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
        case "show_feedback":
            ServiceCrud.instance
                .show("show-feedback", key)
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

export const handleRegister = (values, e) => (dispatchs) => {
    const number = "+84" + values.phone.substring(1);
    const appVerifier = new firebase.auth.RecaptchaVerifier("recaptcha");
    firebase
        .auth()
        .signInWithPhoneNumber(number, appVerifier)
        .then(function (e) {
            var code = prompt("Nhập mã: ");
            if (code === null) return;
            e.confirm(code)
                .then(function (result) {
                    ServiceCrud.instance
                        .create("register", values)
                        .then((response) => {
                            if (response.status == 201) {
                                dispatchs(
                                    showModal({
                                        isShow: true,
                                        modal: "login",
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
                                    message: error.response.data.errors,
                                    autoDismiss: 2,
                                })
                            );
                            dispatchs(
                                showModal({
                                    isShow: false,
                                    modal: "register",
                                })
                            );
                        });
                })
                .catch(function (error) {
                    dispatchs(
                        info({
                            title: <FcHighPriority />,
                            message: "Có lỗi trong quá trình thực hiện!",
                            autoDismiss: 2,
                        })
                    );
                    dispatchs(
                        showModal({
                            isShow: false,
                            modal: "register",
                        })
                    );
                });
        })
        .catch(function (error) {
            dispatchs(
                info({
                    title: <FcHighPriority />,
                    message: "Có lỗi trong quá trình thực hiện!",
                    autoDismiss: 2,
                })
            );
            dispatchs(
                showModal({
                    isShow: false,
                    modal: "register",
                })
            );
        });
};

export const handleLogin = (values) => (dispatchs) => {
    ServiceCrud.instance
        .create("login", values)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(action.authLogin(response.data));
                dispatchs(
                    showModal({
                        isShow: false,
                        modal: "login",
                    })
                );
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: "Đăng nhập thành công!",
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

const resetDataUser = () => ({
    type: ActionTypes.RESET_DATA_USERS,
});

export const handleLogout = (historys) => (dispatchs) => {
    dispatchs(action.authLogout());
    dispatchs(resetDataUser());
    dispatchs(
        info({
            title: <FcOk />,
            message: "Đăng xuất thành công!",
            autoDismiss: 2,
        })
    );
    historys.push("/");
};

const getCars = (data, total) => ({
    type: ActionTypes.GET_PAGING_CAR_CLIENTS,
    payload: {
        data,
        total,
    },
});

export const getPagingCars = () => (dispatchs, getState) => {
    const params = getState().Clients.params;
    ServiceCrud.instance
        .getAll("car-profile", queryString.stringify(params))
        .then((response) => {
            const { data } = response;
            dispatchs(getCars(data));
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

const addCar = (data) => ({
    type: ActionTypes.ADD_CAR_CLIENTS,
    payload: data,
});

export const handleSubmitCar = (values, e) => (dispatchs) => {
    ServiceCrud.instance
        .create("car-profile", values)
        .then((response) => {
            if (response.status == 201) {
                dispatchs(
                    addCar({
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

const updateCar = () => ({
    type: ActionTypes.UPDATE_CAR_CLIENTS,
});

export const handleUpdateCar = (values, e) => (dispatchs, getState) => {
    const number_car = getState().Clients.show.id;
    let { customers, car_brands, sort, mantain_count, ...newData } = values;
    ServiceCrud.instance
        .update("car-profile", number_car, newData)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(updateCar());
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

const deleteCar = () => ({
    type: ActionTypes.DELETE_CAR_CLIENTS,
});

export const handleDeleteCar = (value) => (dispatchs) => {
    ServiceCrud.instance
        .delete("car-profile", value.id)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(deleteCar());
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

const getUserProfile = (data) => ({
    type: ActionTypes.GET_USER_PROFILES,
    payload: data,
});

export const getUser = () => (dispatchs) => {
    ServiceCrud.instance
        .getAll("user-profile")
        .then((response) => {
            const { data } = response;
            data.selectedFiles = [];
            dispatchs(getUserProfile(data));
        })
        .catch((error) => {
            console.log(error);
        });
};

const updateProfileUser = () => ({
    type: ActionTypes.UPDATE_PROFILE_USERS,
});

const updateAvatar = (url) => ({
    type: ActionTypes.UPDATE_AVATAR_USERS,
    payload: url,
});

export const handleUpdateProfileUser = (values) => (dispatchs, getState) => {
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    let newData = new FormData();

    const { owed, id, selectedFiles, created_at, updated_at, status, ...data } = values;

    for (const [key, value] of Object.entries(data)) {
        newData.append(key, value || "");
    }

    ServiceCrud.instance
        .updateForm("user-profile", values.id, newData, config)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(updateProfileUser());
                dispatchs(updateAvatar(response.data.data));

                const { user } = getState().Auth;
                localStorage.setItem("user", JSON.stringify(user));
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

const bookingRepair = () => ({
    type: ActionTypes.RELOAD_BOOKING_REPAIR_CLIENTS,
});

export const Booking = (values, e) => (dispatchs) => {
    ServiceCrud.instance
        .create("bookings", values)
        .then((response) => {
            if (response.status == 201) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(bookingRepair());
                e.resetForm();
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

export const handleAcceptPhone = (values, e) => (dispatchs, getState) => {
    const showClient = getState().Clients.show.isShow;
    const number = "+84" + values.phone.substring(1);
    const appVerifier = new firebase.auth.RecaptchaVerifier("recaptcha");
    firebase
        .auth()
        .signInWithPhoneNumber(number, appVerifier)
        .then(function (e) {
            var code = prompt("Nhập mã: ");
            if (code === null) return;
            e.confirm(code)
                .then(function (result) {
                    dispatchs(
                        showModal({
                            isShow: showClient,
                            modal: "forgot_password",
                            data: { phone: values.phone },
                        })
                    );
                })
                .catch(function (error) {
                    dispatchs(
                        info({
                            title: <FcHighPriority />,
                            message: "Có lỗi trong quá trình thực hiện!",
                            autoDismiss: 2,
                        })
                    );
                    dispatchs(
                        showModal({
                            isShow: false,
                            modal: "login",
                        })
                    );
                });
        })
        .catch(function (error) {
            dispatchs(
                info({
                    title: <FcHighPriority />,
                    message: "Có lỗi trong quá trình thực hiện!",
                    autoDismiss: 2,
                })
            );
            dispatchs(
                showModal({
                    isShow: false,
                    modal: "login",
                })
            );
        });
};

export const handleRepassword = (values, e) => (dispatchs) => {
    ServiceCrud.instance
        .create("re-password", values)
        .then((response) => {
            if (response.status == 200) {
                dispatchs(
                    info({
                        title: <FcOk />,
                        message: response.data.message,
                        autoDismiss: 2,
                    })
                );
                dispatchs(
                    showModal({
                        isShow: true,
                        modal: "login",
                    })
                );
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

const getHistoryRepairs = (data) => ({
    type: ActionTypes.GET_HISTORY_REPAIR_CLIENTS,
    payload: data,
});

export const getPagingHistoryRepair = () => (dispatchs) => {
    ServiceCrud.instance
        .getAll("history-repairs")
        .then((response) => {
            const { data } = response;
            dispatchs(getHistoryRepairs(data));
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

const getServiceDetail = (data) => ({
    type: ActionTypes.GET_SERVICE_DETAILS,
    payload: data,
});

export const handleGetServiceDetail = (id) => (dispatchs) => {
    ServiceCrud.instance
        .show("service-details", id)
        .then((response) => {
            const { data } = response;
            dispatchs(getServiceDetail(data));
        })
        .catch((error) => {
            console.log(error);
        });
};

const getNewDetail = (data) => ({
    type: ActionTypes.GET_NEW_DETAILS,
    payload: data,
});

export const handleGetNewDetail = (slug) => (dispatchs) => {
    ServiceCrud.instance
        .show("new-details", slug)
        .then((response) => {
            const { data } = response;
            dispatchs(getNewDetail(data));
        })
        .catch((error) => {
            console.log(error);
        });
};

const getBookingRepair = (data) => ({
    type: ActionTypes.GET_BOOKING_REPAIRS,
    payload: data,
});

export const handleBookingRepair = () => (dispatchs) => {
    ServiceCrud.instance
        .getAll("booking-repairs")
        .then((response) => {
            const { data } = response;
            dispatchs(getBookingRepair(data));
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

const cancelBookingRepair = () => ({
    type: ActionTypes.RELOAD_BOOKING_REPAIR_CLIENTS,
});

export const handleCancelBookingRepair = (value) => (dispatchs) => {
    ServiceCrud.instance
        .update("cancel-booking-repair", value.id, value)
        .then((response) => {
            dispatchs(cancelBookingRepair());
            dispatchs(
                info({
                    title: <FcOk />,
                    message: response.data.message,
                    autoDismiss: 2,
                })
            );
        })
        .catch((error) => {
            console.log(error);
        });
};

const setFeedback = (data) => ({
    type: ActionTypes.SET_FEEDBACK_CLIENTS,
    payload: data,
});

export const getFeedback = (id, historys) => (dispatchs) => {
    ServiceCrud.instance
        .show("get-feedback", id)
        .then((response) => {
            const { data } = response;
            if (_.isEmpty(data)) {
                dispatchs(action.authLogout());
                historys.push("/");
            } else {
                dispatchs(setFeedback(Object.assign(data, { rating: 5 })));
            }
        })
        .catch((error) => {
            console.log(error);
            dispatchs(action.authLogout());
            historys.push("/");
        });
};

const changeRating = (value, name) => ({
    type: ActionTypes.CHANGE_RATING_CLIENTS,
    payload: { value, name },
});

export const handleChangeRating = (value, name) => (dispatchs) => {
    dispatchs(changeRating(value, name));
};

export const changePass = (values, e) => (dispatchs) => {
    ServiceCrud.instance
        .create("change-password", values)
        .then((response) => {
            dispatchs(
                info({
                    title: <FcOk />,
                    message: response.data.message,
                    autoDismiss: 2,
                })
            );
            e.resetForm();
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
