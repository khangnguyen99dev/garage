import { SHOW_MODAL_CUSTOM_ROLES, ADD_CUSTOM_ROLES, SET_CHECK_CUSTOM_ROLES } from "../action-types";

const initialState = {
    show: {
        id: "",
        modal: "",
        isShow: false,
        data: {},
        menus: {},
        roles: [],
    },
};

const CustomRoles = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case SHOW_MODAL_CUSTOM_ROLES:
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
        case ADD_CUSTOM_ROLES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
            };
        case SET_CHECK_CUSTOM_ROLES:
            let arr = [];

            if (payload) {
                arr = state.show.data.map(({ id }) => id);
            }

            return {
                ...state,
                show: {
                    ...state.show,
                    roles: arr,
                },
            };
        default:
            return state;
    }
};

export default CustomRoles;
