import {
    ADD_EXPORT_VOTES,
    GET_PAGING_EXPORT_VOTES,
    PAGE_CHANGE_EXPORT_VOTES,
    SEARCH_EXPORT_VOTES,
    SHOW_MODAL_EXPORT_VOTES,
    UPDATE_EXPORT_VOTES,
    DELETE_EXPORT_VOTES,
    EDIT_EXPORT_PRODUCTS,
    DELETE_EXPORT_PRODUCTS,
    CONFIRM_EXPORT,
    FILLTER_DATE_EXPORT_VOTES,
    RESET_FILLTER,
    CHANGE_ROW_EXPORT_VOTES,
    CHANGE_STATUS_EXPORT_VOTES,
    CLEAR_DATE_EXPORT_VOTES,
} from "../action-types";

const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: "",
        fieldsearch: "customers.name,number_car,users.name,export_votes.note",
        fillterDate: "",
        status: "",
    },
    data: [],
    isLoading: true,
    show: {
        id: "",
        modal: "",
        isShow: false,
        data: {},
        dataModal: {
            products: [],
            services: [],
        },
        total_price: 0,
        discount: 0,
    },
    load: false,
};

const ExportVotes = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_EXPORT_VOTES:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false,
            };
        case PAGE_CHANGE_EXPORT_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload,
                },
            };
        case SEARCH_EXPORT_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload,
                },
            };
        case SHOW_MODAL_EXPORT_VOTES:
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
        case ADD_EXPORT_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
            };
        case UPDATE_EXPORT_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case DELETE_EXPORT_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case EDIT_EXPORT_PRODUCTS:
            const editListProducts = [...state.show.dataModal.products];
            const indexEditProduct = editListProducts.findIndex(
                (option) => option.product_id === parseInt(payload.data.product_id)
            );
            if (indexEditProduct >= 0 && indexEditProduct !== payload.index) {
                editListProducts[payload.index] = payload.data;
                editListProducts.splice(indexEditProduct, 1);
            } else {
                editListProducts[payload.index] = payload.data;
            }
            return {
                ...state,
                show: {
                    ...state.show,
                    dataModal: {
                        ...state.show.dataModal,
                        products: editListProducts,
                    },
                },
            };
        case DELETE_EXPORT_PRODUCTS:
            const deleteProducts = [...state.show.dataModal.products];
            const listProducts = deleteProducts.filter(
                (option) => option.product_id !== parseInt(payload.id)
            );
            return {
                ...state,
                show: {
                    ...state.show,
                    dataModal: {
                        ...state.show.dataModal,
                        products: listProducts,
                    },
                },
            };
        case CONFIRM_EXPORT:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case FILLTER_DATE_EXPORT_VOTES:
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
        case CHANGE_ROW_EXPORT_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    per_page: parseInt(payload),
                },
            };
        case CHANGE_STATUS_EXPORT_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    status: payload,
                },
            };
        case CLEAR_DATE_EXPORT_VOTES:
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

export default ExportVotes;
