import {
    GET_PAGING_IMPORT_VOTES,
    PAGE_CHANGE_IMPORT_VOTES,
    SEARCH_IMPORT_VOTES,
    SHOW_MODAL_IMPORT_VOTES,
    ADD_IMPORT_VOTES,
    UPDATE_IMPORT_VOTES,
    DELETE_IMPORT_VOTES,
    ADD_IMPORT_DETAIL_PRODUCTS,
    EDIT_IMPORT_DETAIL_PRODUCTS,
    DELETE_IMPORT_DETAIL_PRODUCTS,
    TOTAL_IMPORT_DETAIL_PRODUCTS,
    RELOAD_IMPORT_DETAIL_PRODUCTS,
    CONFIRM_IMPORT,
    FILLTER_DATE_IMPORT_VOTES,
    RESET_FILLTER,
    CHANGE_ROW_IMPORT_VOTES,
    ADD_PAYMENT_VOTES,
    IMAGE_CHANGE_IMPORTS,
    CLEAR_DATE_IMPORT_VOTES,
} from "../action-types";

const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: "",
        fieldsearch: "import_code,total_price,payment,users.name,suppliers.name",
        fillterDate: "",
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
        },
        total_price: 0,
        selectedFiles: [],
    },
    load: false,
};

const ImportVotes = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_IMPORT_VOTES:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false,
            };
        case PAGE_CHANGE_IMPORT_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload,
                },
            };
        case SEARCH_IMPORT_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload,
                },
            };
        case SHOW_MODAL_IMPORT_VOTES:
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
        case ADD_IMPORT_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                },
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case UPDATE_IMPORT_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case DELETE_IMPORT_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case ADD_IMPORT_DETAIL_PRODUCTS:
            const addListProducts = [...state.show.dataModal.products];
            const indexAddProduct = addListProducts.findIndex(
                (option) => option.product_id === parseInt(payload.product_id)
            );
            if (indexAddProduct >= 0) {
                addListProducts[indexAddProduct] = payload;
            } else {
                addListProducts.push(payload);
            }
            return {
                ...state,
                show: {
                    ...state.show,
                    dataModal: {
                        ...state.show.dataModal,
                        products: addListProducts,
                    },
                },
            };
        case EDIT_IMPORT_DETAIL_PRODUCTS:
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
        case DELETE_IMPORT_DETAIL_PRODUCTS:
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
        case TOTAL_IMPORT_DETAIL_PRODUCTS:
            return {
                ...state,
                show: {
                    ...state.show,
                    total_price: payload,
                },
            };
        case RELOAD_IMPORT_DETAIL_PRODUCTS:
            return {
                ...state,
                load: !state.load,
            };
        case CONFIRM_IMPORT:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case FILLTER_DATE_IMPORT_VOTES:
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
                },
            };
        case CHANGE_ROW_IMPORT_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    per_page: parseInt(payload),
                },
            };
        case ADD_PAYMENT_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case IMAGE_CHANGE_IMPORTS:
            return {
                ...state,
                show: {
                    ...state.show,
                    selectedFiles: payload,
                },
            };
        case CLEAR_DATE_IMPORT_VOTES:
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

export default ImportVotes;
