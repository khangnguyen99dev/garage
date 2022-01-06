import {
    GET_PAGING_REPAIR_VOTES,
    PAGE_CHANGE_REPAIR_VOTES,
    SEARCH_REPAIR_VOTES,
    SHOW_MODAL_REPAIR_VOTES,
    ADD_REPAIR_VOTES,
    UPDATE_REPAIR_VOTES,
    DELETE_REPAIR_VOTES,
    ADD_REPAIR_SERVICES,
    EDIT_REPAIR_SERVICES,
    DELETE_REPAIR_SERVICES,
    ADD_REPAIR_PRODUCTS,
    EDIT_REPAIR_PRODUCTS,
    DELETE_REPAIR_PRODUCTS,
    TOTAL_REPAIR_VOTES,
    DISCOUNT_REPAIR_VOTES,
    RELOAD_REPAIR_VOTES,
    ACCEPT_REPAIR,
    ADD_COLLECT_VOTES,
    FILLTER_DATE_REPAIR_VOTES,
    RESET_FILLTER,
    CHANGE_ROW_REPAIR_VOTES,
    CHANGE_STATUS_REPAIR_VOTES,
    CLEAR_DATE_REPAIR_VOTES,
} from "../action-types";

const initialState = {
    params: {
        page: 1,
        total: 1,
        per_page: 5,
        search: "",
        fieldsearch: "users.name,customers.name,total_price,number_car_id",
        fillterDate: "",
        status: "",
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
            services: [],
        },
        total_price: 0,
        discount: 0,
    },
    load: false,
};

const RepairVotes = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GET_PAGING_REPAIR_VOTES:
            return {
                ...state,
                data: payload.data,
                params: {
                    ...state.params,
                    total: payload.total || state.params.total,
                },
                isLoading: false,
            };
        case PAGE_CHANGE_REPAIR_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: payload,
                },
            };
        case SEARCH_REPAIR_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    search: payload,
                },
            };
        case SHOW_MODAL_REPAIR_VOTES:
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
        case ADD_REPAIR_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
            };
        case UPDATE_REPAIR_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case DELETE_REPAIR_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case ADD_REPAIR_SERVICES:
            const listServices = [...state.show.dataModal.services];
            const index = listServices.findIndex(
                (option) => option.service_id === parseInt(payload.service_id)
            );
            if (index >= 0) {
                listServices[index] = payload;
            } else {
                listServices.push(payload);
            }
            return {
                ...state,
                show: {
                    ...state.show,
                    dataModal: {
                        ...state.show.dataModal,
                        services: listServices,
                    },
                },
            };
        case DELETE_REPAIR_SERVICES:
            const newList = [...state.show.dataModal.services];
            const data = newList.filter((option) => option.service_id !== parseInt(payload.id));
            return {
                ...state,
                show: {
                    ...state.show,
                    dataModal: {
                        ...state.show.dataModal,
                        services: data,
                    },
                },
            };
        case EDIT_REPAIR_SERVICES:
            const newLists = [...state.show.dataModal.services];
            const indexEdit = newLists.findIndex(
                (option) => option.service_id === parseInt(payload.data.service_id)
            );
            if (indexEdit >= 0 && indexEdit !== payload.index) {
                newLists[payload.index] = payload.data;
                newLists.splice(indexEdit, 1);
            } else {
                newLists[payload.index] = payload.data;
            }
            return {
                ...state,
                show: {
                    ...state.show,
                    dataModal: {
                        ...state.show.dataModal,
                        services: newLists,
                    },
                },
            };

        case ADD_REPAIR_PRODUCTS:
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
        case DELETE_REPAIR_PRODUCTS:
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
        case EDIT_REPAIR_PRODUCTS:
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
        case TOTAL_REPAIR_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    total_price: payload,
                },
            };
        case DISCOUNT_REPAIR_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    discount: payload,
                },
            };
        case RELOAD_REPAIR_VOTES:
            return {
                ...state,
                load: !state.load,
            };
        case ACCEPT_REPAIR:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case ADD_COLLECT_VOTES:
            return {
                ...state,
                show: {
                    ...state.show,
                    isShow: !state.show.isShow,
                },
                load: !state.load,
            };
        case FILLTER_DATE_REPAIR_VOTES:
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
                    status: "",
                },
            };
        case CHANGE_ROW_REPAIR_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    page: 1,
                    per_page: parseInt(payload),
                },
            };
        case CHANGE_STATUS_REPAIR_VOTES:
            return {
                ...state,
                params: {
                    ...state.params,
                    status: payload,
                },
            };
        case CLEAR_DATE_REPAIR_VOTES:
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

export default RepairVotes;
