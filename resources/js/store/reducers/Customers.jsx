import {
    ADD_CUSTOMERS,
    GET_PAGING_CUSTOMERS,
    PAGE_CHANGE_CUSTOMERS,
    SEARCH_CUSTOMERS,
    SHOW_MODAL_CUSTOMERS,
    UPDATE_CUSTOMERS,
    DELETE_CUSTOMERS,
    RESET_CUSTOMERS,
} from "../action-types";

const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: "",
        fieldsearch: "customers.name,email,address,phone,customer_types.name",
    },
    data: [],
    isLoading: true,
    show: {
        id: "",
        modal: "",
        isShow: false,
        data: {},
    },
    load: false,
};

const Customers = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_CUSTOMERS:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false,
            };
        case PAGE_CHANGE_CUSTOMERS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload,
                },
            };
        case SEARCH_CUSTOMERS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload,
                },
            };
        case SHOW_MODAL_CUSTOMERS:
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
        case ADD_CUSTOMERS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload.page,
                    total: payload.total,
                },
            };
        case UPDATE_CUSTOMERS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case DELETE_CUSTOMERS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case RESET_CUSTOMERS:
            return {
                ...state,
                load: !state.load,
            };
        default:
            return state;
    }
};

export default Customers;
