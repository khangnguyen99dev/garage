import {
    GET_PAGING_PRODUCT_TYPES,
    PAGE_CHANGE_PRODUCT_TYPES,
    SEARCH_PRODUCT_TYPES,
    SHOW_MODAL_PRODUCT_TYPES,
    ADD_PRODUCT_TYPES,
    UPDATE_PRODUCT_TYPES,
    DELETE_PRODUCT_TYPES
} from "../action-types";


const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: '',
        fieldsearch: 'product_types.name,product_types.description,categories.name',
    },
    data: [],
    isLoading: true,
    show: {
        id: '',
        modal: '',
        isShow: false,
        data: {}
    },
    load: false
}

const ProductTypes = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_PRODUCT_TYPES:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false
            }
        case PAGE_CHANGE_PRODUCT_TYPES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload
                }
            }
        case SEARCH_PRODUCT_TYPES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload
                }
            }
        case SHOW_MODAL_PRODUCT_TYPES:
            if (payload.modal) {
                return {
                    ...state,
                    show: payload
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
        case ADD_PRODUCT_TYPES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                },
                load: !state.load
            }
        case UPDATE_PRODUCT_TYPES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow
                },
                load: !state.load
            }
        case DELETE_PRODUCT_TYPES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow
                },
                load: !state.load
            }
        default:
            return state;
    }
};

export default ProductTypes;