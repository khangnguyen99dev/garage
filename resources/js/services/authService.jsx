import Http from "../Http";
import * as action from "../store/actions";
import ServiceCrud from "./ServiceCrud";

export function login(credentials) {
    const api = "/api/auth";
    return (dispatch) =>
        new Promise((resolve, reject) => {
            Http.post(`${api}/login`, credentials)
                .then((res) => {
                    dispatch(action.authLogin(res.data));
                    return resolve();
                })
                .catch((err) => {
                    const { status, errors } = err.response.data;
                    const data = {
                        status,
                        errors,
                    };
                    return reject(data);
                });
        });
}

export function register(credentials) {
    return (dispatch) =>
        new Promise((resolve, reject) => {
            Http.post(`${api}/register`, credentials)
                .then((res) => resolve(res.data))
                .catch((err) => {
                    const { status, errors } = err.response.data;
                    const data = {
                        status,
                        errors,
                    };
                    return reject(data);
                });
        });
}

export function resetPassword(credentials) {
    return (dispatch) =>
        new Promise((resolve, reject) => {
            Http.post(`${api}/forgot-password`, credentials)
                .then((res) => resolve(res.data))
                .catch((err) => {
                    const { status, errors } = err.response.data;
                    const data = {
                        status,
                        errors,
                    };
                    return reject(data);
                });
        });
}

export function updatePassword(credentials) {
    return (dispatch) =>
        new Promise((resolve, reject) => {
            Http.post(`${api}/password-reset`, credentials)
                .then((res) => {
                    const { status } = res.data.status;
                    if (status === 202) {
                        const data = {
                            error: res.data.message,
                            status,
                        };
                        return reject(data);
                    }
                    return resolve(res);
                })
                .catch((err) => {
                    const { status, errors } = err.response.data;
                    const data = {
                        status,
                        errors,
                    };
                    return reject(data);
                });
        });
}
