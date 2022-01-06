import {
    GET_PAGING_CUSTOMER_TYPES,
    PAGE_CHANGE_CUSTOMER_TYPES,
    SEARCH_CUSTOMER_TYPES,
    SHOW_MODAL_CUSTOMER_TYPES,
    ADD_CUSTOMER_TYPES,
    UPDATE_CUSTOMER_TYPES,
    DELETE_CUSTOMER_TYPES
} from "../action-types";


const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: '',
        fieldsearch: 'name,description',
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

const CustomerTypes = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_CUSTOMER_TYPES:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false
            }
        case PAGE_CHANGE_CUSTOMER_TYPES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload
                }
            }
        case SEARCH_CUSTOMER_TYPES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload
                }
            }
        case SHOW_MODAL_CUSTOMER_TYPES:
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
        case ADD_CUSTOMER_TYPES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                },
                load: !state.load
            }
        case UPDATE_CUSTOMER_TYPES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow
                },
                load: !state.load
            }
        case DELETE_CUSTOMER_TYPES:
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

export default CustomerTypes;