import {
    ADD_SUPPLIERS,
    GET_PAGING_SUPPLIERS,
    PAGE_CHANGE_SUPPLIERS,
    SEARCH_SUPPLIERS,
    SHOW_MODAL_SUPPLIERS,
    UPDATE_SUPPLIERS,
    DELETE_SUPPLIERS,
    RESET_SUPPLIERS,
} from "../action-types";

const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: "",
        fieldsearch: "name,phone,name_represent,email,address",
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

const Suppliers = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_SUPPLIERS:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false,
            };
        case PAGE_CHANGE_SUPPLIERS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload,
                },
            };
        case SEARCH_SUPPLIERS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload,
                },
            };
        case SHOW_MODAL_SUPPLIERS:
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
        case ADD_SUPPLIERS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload.page,
                    total: payload.total,
                },
            };
        case UPDATE_SUPPLIERS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case DELETE_SUPPLIERS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case RESET_SUPPLIERS:
            return {
                ...state,
                load: !state.load,
            };
        default:
            return state;
    }
};

export default Suppliers;
