import ServiceCrud from "@/services/ServiceCrud";
import * as ActionTypes from "../action-types";
import { info } from "react-notification-system-redux";
import { FcOk } from "react-icons/fc";

const showModal = (data) => ({
    type: ActionTypes.SHOW_MODAL_IMPORT_VOTE_DETAILS,
    payload: data,
});

const showModalProduct = (data) => ({
    type: ActionTypes.SHOW_MODAL_PRODUCTS,
    payload: data,
});

export const handleShow = (e) => (dispatchs, getState) => {
    const { key, modal } = e.target.dataset;
    const show = getState().ImportVotes.show.isShow;
    const product = getState().Products.show;

    switch (modal) {
        case "add_import_vote_detail":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                })
            );
            break;
        case "edit_import_vote":
            ServiceCrud.instance
                .show(api, key)
                .then((response) => {
                    dispatchs(
                        showModal({
                            isShow: !show,
                            modal: modal,
                            data: response.data,
                            id: key,
                        })
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
            break;
        case "delete":
            dispatchs(
                showModal({
                    isShow: !show,
                    modal: modal,
                    id: key,
                })
            );
            break;
        case "add_product":
            dispatchs(
                showModalProduct({
                    isShow: !product.isShow,
                    modal: modal,
                    selectedFiles: [],
                })
            );
            break;
        default:
            dispatchs(showModal(!show));
            break;
    }
};

const addImportDetailProduct = (data) => ({
    type: ActionTypes.ADD_IMPORT_DETAIL_PRODUCTS,
    payload: data,
});

const resetImportDetailProduct = () => ({
    type: ActionTypes.RESET_IMPORT_DETAIL_PRODUCTS,
});

export const handleSubmit = (data, e) => (dispatchs) => {
    const values = {
        product_id: data.id,
        name: data.name,
        quantity: data.qty,
        import_price: data.import_price,
        price: data.price,
    };

    dispatchs(addImportDetailProduct(values));
    dispatchs(
        info({
            title: <FcOk />,
            message: "Thêm phụ tùng thành công!",
            autoDismiss: 2,
        })
    );
    dispatchs(resetImportDetailProduct());
};

const editImportDetailProduct = (data, index) => ({
    type: ActionTypes.EDIT_IMPORT_DETAIL_PRODUCTS,
    payload: {
        data,
        index,
    },
});

export const handleUpdate = (data) => (dispatchs, getState) => {
    const show = getState().ImportVoteDetails.show;
    const values = {
        product_id: data.id,
        name: data.name,
        quantity: data.qty,
        import_price: data.import_price,
        price: data.price,
        id: data.key || "",
    };
    dispatchs(editImportDetailProduct(values, show.id));
    dispatchs(
        info({
            title: <FcOk />,
            message: "Sửa phụ tùng thành công!",
            autoDismiss: 2,
        })
    );
    dispatchs(showModal(!show.isShow));
};

const deleteImportDetailProduct = (data) => ({
    type: ActionTypes.DELETE_IMPORT_DETAIL_PRODUCTS,
    payload: data,
});

export const handleDelete = (value) => (dispatchs, getState) => {
    const show = getState().ImportVoteDetails.show.isShow;
    dispatchs(deleteImportDetailProduct(value));
    dispatchs(
        info({
            title: <FcOk />,
            message: "Xóa phụ tùng thành công!",
            autoDismiss: 2,
        })
    );
    dispatchs(showModal(!show));
};
