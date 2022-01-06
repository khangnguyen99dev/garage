import {
    ADD_RECEIVE_VOTES,
    GET_PAGING_RECEIVE_VOTES,
    PAGE_CHANGE_RECEIVE_VOTES,
    SEARCH_RECEIVE_VOTES,
    SHOW_MODAL_RECEIVE_VOTES,
    UPDATE_RECEIVE_VOTES,
    DELETE_RECEIVE_VOTES,
    BIDDING_RECEIVE_VOTES,
    INPUT_CHANGE_RECEIVE_VOTES,
    RESET_FORM_RECEIVE_VOTES,
    RELOAD_RECEIVE_VOTES,
    FILLTER_DATE_RECEIVE_VOTES,
    RESET_FILLTER,
    CHANGE_ROW_RECEIVE_VOTES,
    CHANGE_STATUS_RECEIVE_VOTES,
    CLEAR_DATE_RECEIVE_VOTES,
} from "../action-types";

import ReceiveVotesModel from "@/pages/ReceiveVotes/ReceiveVotesModel";

const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: "",
        fieldsearch: "number_car,users.name,customers.name,receive_date",
        fillterDate: "",
        status: "",
    },
    data: [],
    isLoading: true,
    show: {
        id: "",
        modal: "",
        isShow: false,
        data: ReceiveVotesModel,
    },
    load: false,
};

const ReceiveVotes = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_RECEIVE_VOTES:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false,
            };
        case PAGE_CHANGE_RECEIVE_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload,
                },
            };
        case SEARCH_RECEIVE_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload,
                },
            };
        case SHOW_MODAL_RECEIVE_VOTES:
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
        case ADD_RECEIVE_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload.page,
                    total: payload.total,
                },
                show: {
                    ...state.show,
                    data: ReceiveVotesModel,
                },
            };
        case UPDATE_RECEIVE_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                    data: ReceiveVotesModel,
                },
                load: !state.load,
            };
        case DELETE_RECEIVE_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                    data: ReceiveVotesModel,
                },
                load: !state.load,
            };
        case BIDDING_RECEIVE_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    data: {
                        ...state.show.data,
                        cars: payload,
                    },
                },
            };
        case INPUT_CHANGE_RECEIVE_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    data: {
                        ...state.show.data,
                        [payload.name]: payload.value,
                    },
                },
            };
        case RESET_FORM_RECEIVE_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    data: ReceiveVotesModel,
                },
            };
        case RELOAD_RECEIVE_VOTES:
            return {
                ...state,
                load: !state.load,
            };
        case FILLTER_DATE_RECEIVE_VOTES:
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
                    status: "",
                },
            };
        case CHANGE_ROW_RECEIVE_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    per_page: parseInt(payload),
                },
            };
        case CHANGE_STATUS_RECEIVE_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    status: payload,
                },
            };
        case CLEAR_DATE_RECEIVE_VOTES:
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

export default ReceiveVotes;
