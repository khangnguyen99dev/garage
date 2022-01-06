import {
    SHOW_MODAL_IMPORT_VOTE_DETAILS,
    ADD_IMPORT_VOTE_DETAILS,
    UPDATE_IMPORT_VOTE_DETAILS,
    DELETE_IMPORT_VOTE_DETAILS,
    BIDDING_IMPORT_VOTE_DETAILS,
    RESET_IMPORT_DETAIL_PRODUCTS,
} from "../action-types";
import ImportVoteDetailsModel from "@/pages/ImportVoteDetails/ImportVoteDetailsModel";

const initialState = {
    show: {
        id: "",
        modal: "",
        isShow: false,
        data: {},
    },
    load: false,
};

const ImportVoteDetails = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case SHOW_MODAL_IMPORT_VOTE_DETAILS:
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
        case ADD_IMPORT_VOTE_DETAILS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                },
                load: !state.load,
            };
        case UPDATE_IMPORT_VOTE_DETAILS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case DELETE_IMPORT_VOTE_DETAILS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case BIDDING_IMPORT_VOTE_DETAILS:
            return {
                ...state,
                show: {
                    ...state.show,
                    data: payload,
                },
            };
        case RESET_IMPORT_DETAIL_PRODUCTS:
            return {
                ...state,
                show: {
                    ...state.show,
                    data: ImportVoteDetailsModel,
                },
            };
        default:
            return state;
    }
};

export default ImportVoteDetails;
