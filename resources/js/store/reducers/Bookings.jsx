import {
    GET_PAGING_BOOKINGS,
    PAGE_CHANGE_BOOKINGS,
    SEARCH_BOOKINGS,
    SHOW_MODAL_BOOKINGS,
    ACCEPT_BOOKINGS,
    FILLTER_DATE_BOOKING_VOTES,
    RESET_FILLTER,
    CHANGE_ROW_BOOKING_VOTES,
    CANCEL_RECEIVE_VOTES,
} from "../action-types";

const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: "",
        fieldsearch: "number_car,customers.name",
        fillterDate: "",
    },
    data: [],
    isLoading: true,
    show: {
        id: "",
        modal: "",
        isShow: false,
        data: {
            id: "",
            number_car_id: "",
            user_id: "",
            receive_date: "",
            km_into: "",
            item_in_car: "",
            car_condition: "",
            note: "",
            require: "",
            status: "",
        },
    },
    load: false,
};

const Bookings = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_BOOKINGS:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false,
            };
        case PAGE_CHANGE_BOOKINGS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload,
                },
            };
        case SEARCH_BOOKINGS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload,
                },
            };
        case SHOW_MODAL_BOOKINGS:
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
        case ACCEPT_BOOKINGS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: false,
                },
                load: !state.load,
            };
        case FILLTER_DATE_BOOKING_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    fillterDate: payload,
                },
            };
        case RESET_FILLTER:
            return {
                ...state,
                params: {
                    ...state.params,
                    search: "",
                    fillterDate: "",
                    per_page: 5,
                },
            };
        case CHANGE_ROW_BOOKING_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    per_page: parseInt(payload),
                },
            };
        case CANCEL_RECEIVE_VOTES:
            return {
                ...state,
                load: !state.load,
                show: {
                    ...state.show,
                    isShow: false,
                },
            };
        default:
            return state;
    }
};

export default Bookings;
