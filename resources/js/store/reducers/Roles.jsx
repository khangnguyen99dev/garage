import {
    GET_PAGING_ROLES,
    PAGE_CHANGE_ROLES,
    SEARCH_ROLES,
    SHOW_MODAL_ROLES,
    ADD_ROLES,
    UPDATE_ROLES,
    DELETE_ROLES,
    RESET_ROLES
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

const Roles = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_ROLES:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false
            }
        case PAGE_CHANGE_ROLES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload
                }
            }
        case SEARCH_ROLES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload
                }
            }
        case SHOW_MODAL_ROLES:
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
        case ADD_ROLES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                },
                load: !state.load
            }
        case UPDATE_ROLES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow
                },
                load: !state.load
            }
        case DELETE_ROLES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow
                },
                load: !state.load
            }
        case RESET_ROLES:
            return {
                ...state,
                load: !state.load
            }
        default:
            return state;
    }
};

export default Roles;