import {
    SHOW_MODAL_CLIENTS,
    GET_PAGING_CAR_CLIENTS,
    ADD_CAR_CLIENTS,
    UPDATE_CAR_CLIENTS,
    DELETE_CAR_CLIENTS,
    IMAGE_CHANGE_PROFILE_CLIENTS,
    GET_USER_PROFILES,
    UPDATE_PROFILE_USERS,
    RESET_DATA_USERS,
    GET_HISTORY_REPAIR_CLIENTS,
    GET_SERVICE_DETAILS,
    GET_NEW_DETAILS,
    GET_BOOKING_REPAIRS,
    RELOAD_BOOKING_REPAIR_CLIENTS,
    SET_FEEDBACK_CLIENTS,
    CHANGE_RATING_CLIENTS,
} from "../action-types";

const defaultDataUser = {
    name: "",
    number_car: "",
    avatar: "",
    phone: "",
    email: "",
    km_into: "",
    repair_date: "",
    car_condition: "",
    gender: "",
    address: "",
    selectedFiles: [],
};

const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: "",
        fieldsearch: "number_car,province,car_brands.name",
    },
    dataCars: [],
    dataUser: defaultDataUser,
    dataHistoryRepairs: [],
    dataServiceDetail: {},
    dataNewDetail: {},
    dataBookingRepair: [],
    dataFeedback: {},
    show: {
        id: "",
        modal: "",
        isShow: false,
        data: {},
    },
    load: false,
};

const Clients = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_CAR_CLIENTS:
            return {
                ...state,
                dataCars: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
            };
        case ADD_CAR_CLIENTS:
            return {
                ...state,
                load: !state.load,
            };
        case UPDATE_CAR_CLIENTS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case DELETE_CAR_CLIENTS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case SHOW_MODAL_CLIENTS:
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
        case IMAGE_CHANGE_PROFILE_CLIENTS:
            return {
                ...state,
                dataUser: {
                    ...state.dataUser,
                    selectedFiles: payload,
                },
            };
        case GET_USER_PROFILES:
            return {
                ...state,
                dataUser: payload,
            };
        case UPDATE_PROFILE_USERS:
            return {
                ...state,
                load: !state.load,
            };
        case RESET_DATA_USERS:
            return {
                ...state,
                dataUser: defaultDataUser,
            };
        case GET_HISTORY_REPAIR_CLIENTS:
            return {
                ...state,
                dataHistoryRepairs: payload,
            };
        case GET_SERVICE_DETAILS:
            return {
                ...state,
                dataServiceDetail: payload,
            };
        case GET_NEW_DETAILS:
            return {
                ...state,
                dataNewDetail: payload,
            };
        case GET_BOOKING_REPAIRS:
            return {
                ...state,
                dataBookingRepair: payload,
            };
        case RELOAD_BOOKING_REPAIR_CLIENTS:
            return {
                ...state,
                load: !state.load,
                show: {
                    ...state.show,
                    isShow: false,
                },
            };
        case SET_FEEDBACK_CLIENTS:
            return {
                ...state,
                dataFeedback: payload,
            };
        case CHANGE_RATING_CLIENTS:
            return {
                ...state,
                dataFeedback: {
                    ...state.dataFeedback,
                    [payload.name]: payload.value,
                },
            };
        default:
            return state;
    }
};

export default Clients;
