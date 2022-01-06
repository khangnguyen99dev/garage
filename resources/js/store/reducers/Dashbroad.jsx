import {
    GET_DASHBROAD,
    FILLTER_DATE_DASHBROAD,
    CHANGE_DATE_DASHBROAD,
    SHOW_MODAL_DASHBOARD,
    MULTI_CHANGE_DASHBOARD,
    MULTI_FOCUS_DASHBOARD,
    CHANGE_ADDRESS_DASHBOARD,
    SET_DATA_VIEWER_DASHBOARD,
    CLEAR_DATE_DASHBOARD,
    CLEAR_FILLTER_DASHBOARD,
} from "../action-types";

const initialState = {
    fillter: {
        car_brands: [],
        categories: [],
        customers: [],
        employee_technical: [],
        service_types: [],
        status: [{ value: "3", label: "Đã hoàn thành" }],
        suppliers: [],
        date_range: [],
        address: "",
    },
    dataFillter: {
        data_car_brands: [],
        data_categories: [],
        data_customers: [],
        data_employee_technical: [],
        data_service_types: [],
        data_status: [
            // { value: "0", label: "Chờ xử lý" },
            // { value: "1", label: "Đã tiếp nhận" },
            { value: "2", label: "Đang xử lý" },
            { value: "3", label: "Đã hoàn thành" },
            // { value: "4", label: "Đã hủy" },
        ],
        data_suppliers: [],
        data_address: "",
    },
    data: [],
    viewers: [],
    show: {
        id: "",
        modal: "",
        isShow: false,
        data: {},
    },
    received: {
        count_received: 0,
        date_received: "Tổng tiếp nhận",
    },
    finished: {
        count_finished: 0,
        date_finished: "Tổng hoàn thành",
    },
    order_pending: {
        count_order_pending: 0,
        date_order_pending: "Tổng chờ duyệt",
    },
    total_revenue: {
        count_total_revenue: 0,
        date_total_revenue: "Tổng doanh thu",
    },
    line: {
        data: {
            labels: [],
            datasets: [],
        },
        options: {
            responsive: true,
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: "Chart.js Line Chart - Stacked Area",
            },
            tooltips: {
                intersect: false,
                mode: "nearest",
            },
            hover: {
                mode: "index",
            },
            scales: {
                xAxes: [
                    {
                        scaleLabel: {
                            display: false,
                            labelString: "Month",
                        },
                        gridLines: {
                            display: false,
                        },
                    },
                ],
                yAxes: [
                    {
                        stacked: true,
                        scaleLabel: {
                            display: false,
                            labelString: "Value",
                        },
                        gridLines: {
                            display: false,
                        },
                    },
                ],
            },
        },
    },
};

const Dashboard = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_DASHBROAD:
            return {
                ...state,
                received: {
                    ...state.received,
                    count_received: payload.count_received,
                },
                finished: {
                    ...state.finished,
                    count_finished: payload.count_finished,
                },
                total_revenue: {
                    ...state.total_revenue,
                    count_total_revenue: payload.count_total_revenue,
                },
                order_pending: {
                    ...state.order_pending,
                    count_order_pending: payload.count_order_pending,
                },
                line: {
                    ...state.line,
                    data: {
                        ...state.line.data,
                        labels: payload.arr_date,
                        datasets: [
                            {
                                label: "Số tiền",
                                borderColor: "#6a82fb",
                                backgroundColor: "#6a82fb",
                                data: payload.arr_money,
                            },
                        ],
                    },
                },
                data: payload.data,
            };
        case FILLTER_DATE_DASHBROAD:
            return {
                ...state,
                fillter: {
                    ...state.fillter,
                    date_range: payload,
                },
            };
        case CHANGE_DATE_DASHBROAD:
            return {
                ...state,
                received: {
                    ...state.received,
                    date_received: payload,
                },
                finished: {
                    ...state.finished,
                    date_finished: payload,
                },
                total_revenue: {
                    ...state.total_revenue,
                    date_total_revenue: payload,
                },
                order_pending: {
                    ...state.order_pending,
                    date_order_pending: payload,
                },
            };
        case SHOW_MODAL_DASHBOARD:
            if (payload.modal) {
                return {
                    ...state,
                    show: payload,
                };
            } else {
                return {
                    ...state,
                    show: {
                        ...state.show,
                        isShow: payload,
                    },
                };
            }
        case MULTI_CHANGE_DASHBOARD:
            return {
                ...state,
                fillter: {
                    ...state.fillter,
                    [payload.key]: payload.value,
                },
            };
        case MULTI_FOCUS_DASHBOARD:
            return {
                ...state,
                dataFillter: {
                    ...state.dataFillter,
                    [payload.key]: payload.data,
                },
            };
        case CHANGE_ADDRESS_DASHBOARD:
            return {
                ...state,
                fillter: {
                    ...state.fillter,
                    address: payload,
                },
            };
        case SET_DATA_VIEWER_DASHBOARD:
            return {
                ...state,
                viewers: payload,
            };
        case CLEAR_DATE_DASHBOARD:
            return {
                ...state,
                fillter: {
                    ...state.fillter,
                    date_range: [],
                },
            };
        case CLEAR_FILLTER_DASHBOARD:
            return {
                ...state,
                fillter: {
                    ...state.fillter,
                    car_brands: [],
                    categories: [],
                    customers: [],
                    employee_technical: [],
                    service_types: [],
                    status: [],
                    suppliers: [],
                    date_range: [],
                    address: "",
                },
            };
        default:
            return state;
    }
};

export default Dashboard;
