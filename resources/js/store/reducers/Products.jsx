import {
    GET_PAGING_PRODUCTS,
    PAGE_CHANGE_PRODUCTS,
    SEARCH_PRODUCTS,
    SHOW_MODAL_PRODUCTS,
    ADD_PRODUCTS,
    UPDATE_PRODUCTS,
    DELETE_PRODUCTS,
    IMAGE_CHANGE_PRODUCTS,
    BIDDING_PRODUCTS,
    RESET_REPAIR_PRODUCTS
} from "../action-types";
import RepairProductsModel from "@/pages/Products/RepairProductsModel";

const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: '',
        fieldsearch: 'products.name,product_types.name,products.description,price',
    },
    data: [],
    isLoading: true,
    show: {
        id: '',
        modal: '',
        isShow: false,
        selectedFiles: [],
        data: {}
    },
    load: false
}

const Products = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_PRODUCTS:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false
            }
        case PAGE_CHANGE_PRODUCTS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload
                }
            }
        case SEARCH_PRODUCTS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload
                }
            }
        case SHOW_MODAL_PRODUCTS:
            if (payload.modal) {
                return {
                    ...state,
                    show: payload,
                }
            } else {
                return {
                    ...state,
                    show: {
                        ...state.show,
                        isShow: payload
                    }
                }
            }
        case ADD_PRODUCTS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                },
                show: {
                    ...state.show,
                    selectedFiles: []
                },
                load: !state.load
            }
        case UPDATE_PRODUCTS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow
                },
                load: !state.load
            }
        case DELETE_PRODUCTS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow
                },
                load: !state.load
            }
        case IMAGE_CHANGE_PRODUCTS:
            return {
                ...state,
                show: {
                    ...state.show,
                    selectedFiles: payload
                },
            }
        case BIDDING_PRODUCTS:
            return {
                ...state,
                show: {
                    ...state.show,
                    data: payload
                }
            }
        case RESET_REPAIR_PRODUCTS:
            return {
                ...state,
                show: {
                    ...state.show,
                    data: RepairProductsModel
                }
            }
        default:
            return state;
    }
};

export default Products;