import {
    ADD_CARS,
    GET_PAGING_CARS,
    PAGE_CHANGE_CARS,
    SEARCH_CARS,
    SHOW_MODAL_CARS,
    UPDATE_CARS,
    DELETE_CARS,
} from "../action-types";

const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: "",
        fieldsearch: "number_car,province,customers.name,car_brands.name",
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

const Cars = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_CARS:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false,
            };
        case PAGE_CHANGE_CARS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload,
                },
            };
        case SEARCH_CARS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload,
                },
            };
        case SHOW_MODAL_CARS:
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
        case ADD_CARS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload.page,
                    total: payload.total,
                },
            };
        case UPDATE_CARS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case DELETE_CARS:
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

export default Cars;
