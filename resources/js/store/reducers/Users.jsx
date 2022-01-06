import {
    GET_PAGING_USERS,
    PAGE_CHANGE_USERS,
    SEARCH_USERS,
    SHOW_MODAL_USERS,
    ADD_USERS,
    UPDATE_USERS,
    DELETE_USERS,
    IMAGE_CHANGE_USERS,
    ADD_CUSTOM_ROLES,
    GET_USER_INFO,
    IMAGE_CHANGE_USER_INFO,
    UPDATE_USER_INFO,
} from "../action-types";

const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: "",
        fieldsearch: "users.name,roles.name,email,phone",
    },
    data: [],
    userInfo: {
        name: "",
    },
    isLoading: true,
    show: {
        id: "",
        modal: "",
        isShow: false,
        data: {},
        selectedFiles: [],
        roles: [],
    },
    load: false,
};

const Users = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_USERS:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false,
            };
        case PAGE_CHANGE_USERS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload,
                },
            };
        case SEARCH_USERS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload,
                },
            };
        case SHOW_MODAL_USERS:
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
        case ADD_USERS:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                },
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                    roles: [],
                },
                load: !state.load,
            };
        case UPDATE_USERS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                    roles: [],
                },
                load: !state.load,
            };
        case DELETE_USERS:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case IMAGE_CHANGE_USERS:
            return {
                ...state,
                show: {
                    ...state.show,
                    selectedFiles: payload,
                },
            };
        case ADD_CUSTOM_ROLES:
            return {
                ...state,
                show: {
                    ...state.show,
                    roles: payload,
                },
            };
        case GET_USER_INFO:
            return {
                ...state,
                userInfo: payload,
            };
        case IMAGE_CHANGE_USER_INFO:
            return {
                ...state,
                show: {
                    ...state.show,
                    selectedFiles: payload,
                },
            };
        case UPDATE_USER_INFO:
            return {
                ...state,
                load: !state.load,
            };
        default:
            return state;
    }
};

export default Users;
