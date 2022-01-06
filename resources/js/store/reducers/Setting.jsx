import { GET_SETTING_INFO, UPDATE_BUSINESS_INFO, IMAGE_CHANGE_BUSINESS } from "../action-types";

const initialState = {
    data: {},
    selectFiles: [],
    load: false,
};

const Setting = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_SETTING_INFO:
            return {
                ...state,
                data: payload,
                selectFiles: ["../" + payload.logo],
            };
        case UPDATE_BUSINESS_INFO:
            return {
                ...state,
                load: !load,
            };
        case IMAGE_CHANGE_BUSINESS:
            return {
                ...state,
                selectFiles: payload,
            };
        default:
            return state;
    }
};

export default Setting;
