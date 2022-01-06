import {
    ADD_CAR_BRANDS,
    GET_PAGING_CAR_BRANDS,
    PAGE_CHANGE_CAR_BRANDS,
    SEARCH_CAR_BRANDS,
    SHOW_MODAL_CAR_BRANDS,
    UPDATE_CAR_BRANDS,
    DELETE_CAR_BRANDS,
} from "../action-types";

const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: "",
        fieldsearch: "name,description",
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

const CarBrands = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_CAR_BRANDS:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false,
            };
        case PAGE_CHANGE_CAR_BRANDS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload,
                },
            };
        case SEARCH_CAR_BRANDS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload,
                },
            };
        case SHOW_MODAL_CAR_BRANDS:
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
        case ADD_CAR_BRANDS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload.page,
                    total: payload.total,
                },
            };
        case UPDATE_CAR_BRANDS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case DELETE_CAR_BRANDS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        default:
            return state;
    }
};

export default CarBrands;
