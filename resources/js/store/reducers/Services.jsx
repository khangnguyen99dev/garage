import RepairServicesModel from "@/pages/Services/RepairServicesModel";
import {
    GET_PAGING_SERVICES,
    PAGE_CHANGE_SERVICES,
    SEARCH_SERVICES,
    SHOW_MODAL_SERVICES,
    ADD_SERVICES,
    UPDATE_SERVICES,
    DELETE_SERVICES,
    BIDDING_SERVICES,
    RESET_REPAIR_SERVICES,
    IMAGE_CHANGE_SERVICES,
} from "../action-types";

const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: "",
        fieldsearch: "services.name,service_types.name,price",
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

const Services = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_SERVICES:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false,
            };
        case PAGE_CHANGE_SERVICES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload,
                },
            };
        case SEARCH_SERVICES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload,
                },
            };
        case SHOW_MODAL_SERVICES:
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
        case ADD_SERVICES:
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
        case UPDATE_SERVICES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case DELETE_SERVICES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case BIDDING_SERVICES:
            return {
                ...state,
                show: {
                    ...state.show,
                    data: payload,
                },
            };
        case RESET_REPAIR_SERVICES:
            return {
                ...state,
                show: {
                    ...state.show,
                    data: RepairServicesModel,
                },
            };
        case IMAGE_CHANGE_SERVICES:
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

export default Services;
