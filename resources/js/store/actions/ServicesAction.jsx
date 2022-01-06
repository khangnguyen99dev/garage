import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
import queryString from "query-string";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { info } from "react-notification-system-redux";

const api = "services";

const getServices = (data, total) => ({
    type: ActionTypes.GET_PAGING_SERVICES,
    payload: {
        data,
        total,
    },
});

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_SERVICES,
    payload: data,
});

const addService = () => ({
    type: ActionTypes.ADD_SERVICES,
});

const updateService = () => ({
    type: ActionTypes.UPDATE_SERVICES,
});

const deleteService = () => ({
    type: ActionTypes.DELETE_SERVICES,
});

export const getPaging = () => (dispatchs, getState) => {
    const params = getState().Services.params;
    ServiceCrud.instance
        .getAll(api, queryString.stringify(params))
        .then((response) => {
            const { data, total } = response.data;
            if (total !== params.total) {
                dispatchs(getServices(data, total));
            } else {
                dispatchs(getServices(data));
            }
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

export const getServiceClients = () => (dispatchs) => {
    ServiceCrud.instance
        .getAll("service-clients")
        .then((response) => {
            const { data } = response;
            dispatchs(getServices(data));
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

export const handleShow = (e) => (dispatchs, getState) => {
    const { key, modal } = e.target.dataset;
    const show = getState().Services.show.isShow;
    switch (modal) {
        case "add_service":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                    selectedFiles: [],
                })
            );
            break;
        case "edit_service":
            ServiceCrud.instance
                .show(api, key)
                .then((response) => {
                    dispatchs(
                        showModal({
                            isShow: !show,
                            modal: modal,
                            data: response.data,
                            selectedFiles: ["../" + response.data.image],
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
                dispatchs(addService());
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
                dispatchs(updateService());
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
                dispatchs(deleteService());
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

export const handleDeleteRepairService = (value) => (dispatchs, getState) => {
    const show = getState().Services.show.isShow;
    dispatchs(deleteRepairService(value));
    dispatchs(
        info({
            title: <FcOk />,
            message: "Xóa dịch vụ sửa chữa thành công!",
            autoDismiss: 2,
        })
    );
    dispatchs(showModal(!show));
};

const deleteRepairService = (data) => ({
    type: ActionTypes.DELETE_REPAIR_SERVICES,
    payload: data,
});

const addRepairService = (data) => ({
    type: ActionTypes.ADD_REPAIR_SERVICES,
    payload: data,
});

const resetRepairService = () => ({
    type: ActionTypes.RESET_REPAIR_SERVICES,
});

export const handleAddRepairService = (data, e) => (dispatchs) => {
    const values = {
        service_id: data.id,
        name: data.name,
        price: data.price,
        note: data.note,
    };
    dispatchs(addRepairService(values));
    dispatchs(
        info({
            title: <FcOk />,
            message: "Thêm dịch vụ sửa chữa thành công!",
            autoDismiss: 2,
        })
    );
    dispatchs(resetRepairService());
};

const editRepairService = (data, index) => ({
    type: ActionTypes.EDIT_REPAIR_SERVICES,
    payload: {
        data,
        index,
    },
});

export const handleEditRepairService = (data) => (dispatchs, getState) => {
    const show = getState().Services.show;
    const values = {
        service_id: data.id,
        name: data.name,
        price: data.price,
        note: data.note,
        id: data.key || "",
    };
    dispatchs(editRepairService(values, show.id));
    dispatchs(
        info({
            title: <FcOk />,
            message: "Sửa dịch vụ sửa chữa thành công!",
            autoDismiss: 2,
        })
    );
    dispatchs(showModal(!show.isShow));
};
