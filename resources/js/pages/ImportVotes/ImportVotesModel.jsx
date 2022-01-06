import moment from "moment";
const ImportVotesModel = {
    supplier_id: "",
    user_id: "",
    import_date: "",
    vote_date: moment(new Date()).format("YYYY-MM-DDThh:mm"),
    total_price: "",
    payment: 0,
};
export default ImportVotesModel;
