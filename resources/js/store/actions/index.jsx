import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";

export const authLogin = (payload) => ({
    type: ActionTypes.AUTH_LOGIN,
    payload,
});

export const authLogout = () => ({
    type: ActionTypes.AUTH_LOGOUT,
});

export const authCheck = () => ({
    type: ActionTypes.AUTH_CHECK,
});

export const handleSearch = (value, path) => (dispatchs) => {
    dispatchs(search(value, path));
};

export const handlePageChange =
    (pageNumber = 1, path) =>
    (dispatchs) => {
        dispatchs(pageChange(pageNumber, path));
    };

const pageChange = (pageNumber, path) => ({
    type: path,
    payload: pageNumber,
});

const search = (e, path) => ({
    type: path,
    payload: e.target.value,
});

const bidding = (value, type) => ({
    type: type,
    payload: value,
});

const inputChange = (name, value, type) => ({
    type: type,
    payload: {
        name,
        value,
    },
});

const selectChange = (name, value, type) => ({
    type: type,
    payload: {
        name,
        value,
    },
});

export const hanldeBidding = (model, id, type) => (dispatchs) => {
    ServiceCrud.instance
        .show(model, id)
        .then((response) => {
            dispatchs(bidding(response.data, type));
        })
        .catch((error) => {
            console.log(error);
        });
};

export const handleInputChange = (name, value, type) => (dispatchs) => {
    dispatchs(inputChange(name, value, type));
};

export const handleSelectChange = (name, value, type) => (dispatchs) => {
    dispatchs(selectChange(name, value, type));
};

const imageChange = (data, type) => ({
    type: type,
    payload: data,
});

export const handleImageChange = (data, type) => (dispatchs) => {
    dispatchs(imageChange(data, type));
};
