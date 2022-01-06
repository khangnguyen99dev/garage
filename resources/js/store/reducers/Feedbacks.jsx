import {
    GET_PAGING_FEEDBACKS,
    PAGE_CHANGE_FEEDBACKS,
    SEARCH_FEEDBACKS,
    SHOW_MODAL_FEEDBACKS,
    FILLTER_DATE_FEEDBACKS,
    CHANGE_STAR_FEEDBACKS,
    RESET_FILLTER,
    CLEAR_DATE_FEEDBACKS,
} from "../action-types";

const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: "",
        fieldsearch: "customers.name,number_car,content",
        fillterDate: "",
        fillterStar: "",
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

const Feedbacks = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_FEEDBACKS:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false,
            };
        case PAGE_CHANGE_FEEDBACKS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload,
                },
            };
        case SEARCH_FEEDBACKS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload,
                },
            };
        case SHOW_MODAL_FEEDBACKS:
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
        case FILLTER_DATE_FEEDBACKS:
            return {
                ...state,
                params: {
                    ...state.params,
                    fillterDate: payload,
                },
            };
        case CHANGE_STAR_FEEDBACKS:
            return {
                ...state,
                params: {
                    ...state.params,
                    fillterStar: payload,
                },
            };
        case RESET_FILLTER:
            return {
                ...state,
                params: {
                    ...state.params,
                    search: "",
                    fillterDate: "",
                    fillterStar: "",
                    per_page: 5,
                },
            };
        case CLEAR_DATE_FEEDBACKS:
            return {
                ...state,
                params: {
                    ...state.params,
                    fillterDate: "",
                },
            };
        default:
            return state;
    }
};

export default Feedbacks;
