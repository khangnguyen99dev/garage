import {
    SHOW_MODAL_DEFAULT_ROLES,
    ADD_DEFAULT_ROLES,
    UPDATE_DEFAULT_ROLES,
    SET_CHECK_DEFAULT_ROLES,
} from "../action-types";

const initialState = {
    show: {
        id: "",
        modal: "",
        isShow: false,
        data: [],
        menus: [],
    },
};

const DefaultRoles = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case SHOW_MODAL_DEFAULT_ROLES:
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
        case ADD_DEFAULT_ROLES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
            };
        case UPDATE_DEFAULT_ROLES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
            };
        case SET_CHECK_DEFAULT_ROLES:
            let arr = [];

            if (payload) {
                state.show.data.map((value) => arr.push({ menu_id: value.id }));
            }

            return {
                ...state,
                show: {
                    ...state.show,
                    menus: arr,
                },
            };
        default:
            return state;
    }
};

export default DefaultRoles;
