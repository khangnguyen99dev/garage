import {
    GET_PAGING_NEWS,
    PAGE_CHANGE_NEWS,
    SEARCH_NEWS,
    SHOW_MODAL_NEWS,
    ADD_NEWS,
    UPDATE_NEWS,
    DELETE_NEWS,
    IMAGE_CHANGE_NEWS,
} from "../action-types";

const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: "",
        fieldsearch: "name",
    },
    data: [],
    isLoading: true,
    show: {
        id: "",
        modal: "",
        isShow: false,
        data: {},
        selectedFiles: [],
    },
    load: false,
};

const News = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_NEWS:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false,
            };
        case PAGE_CHANGE_NEWS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload,
                },
            };
        case SEARCH_NEWS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload,
                },
            };
        case SHOW_MODAL_NEWS:
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
        case ADD_NEWS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                },
                show: {
                    ...state.show,
                    isShow: false,
                },
                load: !state.load,
            };
        case UPDATE_NEWS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case DELETE_NEWS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case IMAGE_CHANGE_NEWS:
            return {
                ...state,
                show: {
                    ...state.show,
                    selectedFiles: payload,
                },
            };
        default:
            return state;
    }
};

export default News;
