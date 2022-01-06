import {
    GET_PAGING_MENUS,
    PAGE_CHANGE_MENUS,
    SEARCH_MENUS,
    SHOW_MODAL_MENUS,
    ADD_MENUS,
    UPDATE_MENUS,
    DELETE_MENUS,
} from "../action-types";


const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: '',
        fieldsearch: 'label,description',
    },
    data: [],
    isLoading: true,
    show: {
        id: '',
        modal: '',
        isShow: false,
        data: {}
    },
    load: false,
    menus: []
}

const Menus = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_MENUS:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false
            }
        case PAGE_CHANGE_MENUS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload
                }
            }
        case SEARCH_MENUS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload
                }
            }
        case SHOW_MODAL_MENUS:
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
        case ADD_MENUS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                },
                load: !state.load
            }
        case UPDATE_MENUS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow
                },
                load: !state.load
            }
        case DELETE_MENUS:
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

export default Menus;