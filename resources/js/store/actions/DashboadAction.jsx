import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
import moment from "moment";

const getDashbroad = (data) => ({
    type: ActionTypes.GET_DASHBROAD,
    payload: data,
});

const setDataViewer = (data) => ({
    type: ActionTypes.SET_DATA_VIEWER_DASHBOARD,
    payload: data,
});

export const handleGetDashboard = () => (dispatchs, getState) => {
    const { fillter } = getState().Dashboard;

    ServiceCrud.instance
        .create("dashbroad", fillter)
        .then((response) => {
            const { data } = response;
            let arr = [];
            data.data.map((value, index) => {
                arr.push({
                    STT: index + 1,
                    "Khách hàng": value.name_customer,
                    "Ngày sửa chữa": moment(value.repair_date).format("hh:mm DD/MM/YYYYs"),
                    "Tổng tiền": value.total_price,
                    "Địa chỉ": value.address_customer,
                    "NV. Kỹ Thuật": value.name_employee,
                    "Hãng xe": value.name_car_brand,
                    "Loại DV": value.services
                        .filter(
                            (v, i, a) =>
                                a.findIndex((t) => t.name_service_type === v.name_service_type) ===
                                i
                        )
                        .map(function (el) {
                            return el.name_service_type;
                        })
                        .join(" , "),
                    "Danh mục": value.products
                        .filter(
                            (v, i, a) =>
                                a.findIndex((t) => t.name_category === v.name_category) === i
                        )
                        .map(function (el) {
                            return el.name_category;
                        })
                        .join(" , "),
                    "Nhà cung cấp": value.products
                        .filter(
                            (v, i, a) =>
                                a.findIndex((t) => t.name_supplier === v.name_supplier) === i
                        )
                        .map(function (el) {
                            return el.name_supplier;
                        })
                        .join(" , "),
                    "Trạng thái":
                        value.status_receive_vote == "4"
                            ? "Đã hủy"
                            : value.status_receive_vote == "3"
                            ? "Đã hoàn thành"
                            : "Đang xử lý",
                });
            });

            dispatchs(getDashbroad(data));
            dispatchs(showModal(false));

            dispatchs(setDataViewer(arr));
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

const fillterDate = (start, end) => ({
    type: ActionTypes.FILLTER_DATE_DASHBROAD,
    payload: [start, end],
});

export const onDateChanges = (start, end) => (dispatchs) => {
    if (end !== undefined) {
        dispatchs(
            fillterDate(moment(start).format("YYYY-MM-DD"), moment(end).format("YYYY-MM-DD"))
        );
    }
};

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_DASHBOARD,
    payload: data,
});

export const handleShow = (e) => (dispatchs, getState) => {
    const { key, modal } = e.target.dataset;
    const show = getState().Dashboard.show;
    switch (modal) {
        case "fillter":
            dispatchs(
                showModal({
                    isShow: !show.isShow,
                    modal: modal,
                })
            );
            break;
        default:
            dispatchs(showModal(!show));
            break;
    }
};

const multiChange = (value, key) => ({
    type: ActionTypes.MULTI_CHANGE_DASHBOARD,
    payload: { value, key },
});

export const handleMultiChange = (value, key) => (dispatchs) => {
    dispatchs(multiChange(value, key));
};

const multiFocus = (data, key) => ({
    type: ActionTypes.MULTI_FOCUS_DASHBOARD,
    payload: { data, key },
});

export const handleMultiFocus = (e) => (dispatchs) => {
    const api = e.target.id;

    const key = api.replace("-", "_");

    ServiceCrud.instance
        .getAll(api)
        .then((response) => {
            const { data } = response;
            return data;
        })
        .then((data) => {
            let arr = [];
            data.map((value) => {
                arr.push({
                    value: value["id"],
                    label: value["name"],
                });
            });
            dispatchs(multiFocus(arr, "data_" + key));
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
};

const clearDate = () => ({
    type: ActionTypes.CLEAR_DATE_DASHBOARD,
});

export const handleClearDate = () => (dispatchs) => {
    dispatchs(clearDate());
};

const changeInput = (value) => ({
    type: ActionTypes.CHANGE_ADDRESS_DASHBOARD,
    payload: value,
});

export const handleChangeInput = (e) => (dispatchs) => {
    dispatchs(changeInput(e.target.value));
};

const clearFillter = () => ({
    type: ActionTypes.CLEAR_FILLTER_DASHBOARD,
});

export const handleClearFillter = () => (dispatchs) => {
    dispatchs(clearFillter());
};
