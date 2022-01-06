export const NOTIFICATION_SYSTEM_STYLE = {
    NotificationItem: {
        DefaultStyle: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            borderRadius: "4px",
            fontSize: "14px",
        },

        success: {
            borderTop: 0,
            backgroundColor: "#45b649",
            WebkitBoxShadow: 0,
            MozBoxShadow: 0,
            boxShadow: 0,
        },

        error: {
            borderTop: 0,
            backgroundColor: "#f85032",
            WebkitBoxShadow: 0,
            MozBoxShadow: 0,
            boxShadow: 0,
        },

        warning: {
            borderTop: 0,
            backgroundColor: "#ffd700",
            WebkitBoxShadow: 0,
            MozBoxShadow: 0,
            boxShadow: 0,
        },

        info: {
            borderTop: 0,
            background: "linear-gradient(to right, #6a82fb, #fc5c7d)",
            WebkitBoxShadow: 0,
            MozBoxShadow: 0,
            boxShadow: 0,
        },
    },

    Title: {
        DefaultStyle: {
            margin: 0,
            padding: 0,
            paddingRight: 5,
            color: "#fff",
            display: "inline-flex",
            fontSize: 20,
            fontWeight: "bold",
            // left: '15px',
            // position: 'absolute',
            // top: '50%',
        },
    },

    MessageWrapper: {
        DefaultStyle: {
            display: "block",
            color: "#fff",
            width: "100%",
        },
    },

    Dismiss: {
        DefaultStyle: {
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "inherit",
            fontSize: 20,
            color: "#f2f2f2",
            position: "relative",
            margin: 0,
            padding: 0,
            background: "none",
            borderRadius: 0,
            opacity: 1,
            width: 20,
            height: 20,
            textAlign: "initial",
            float: "none",
            top: "unset",
            right: "unset",
            lineHeight: "inherit",
        },
    },

    Action: {
        DefaultStyle: {
            background: "#fff",
            borderRadius: "2px",
            padding: "6px 20px",
            fontWeight: "bold",
            margin: "10px 0 0 0",
            border: 0,
        },

        success: {
            backgroundColor: "#45b649",
            color: "#fff",
        },

        error: {
            backgroundColor: "#f85032",
            color: "#fff",
        },

        warning: {
            backgroundColor: "#ffd700",
            color: "#fff",
        },

        info: {
            backgroundColor: "#00c9ff",
            color: "#fff",
        },
    },

    ActionWrapper: {
        DefaultStyle: {
            margin: 0,
            padding: 0,
        },
    },
};

export const DATA_OPTION = [
    { value: "active", label: "Kích hoạt" },
    { value: "deactive", label: "Ẩn" },
];

export const DATA_GENDER = [
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
    { value: "other", label: "Khác" },
];

export const DATA_RECEIVE_VOTES = [
    { value: "0", label: "Chờ xử lý" },
    { value: "1", label: "Đã tiếp nhận" },
];

export const DATA_RECEIVE_VOTES_2 = [
    { value: "0", label: "Chờ xử lý" },
    { value: "1", label: "Đã tiếp nhận" },
    { value: "2", label: "Đang xử lý" },
];

export const DATA_RECEIVE_VOTES_3 = [
    { value: "0", label: "Chờ xử lý" },
    { value: "1", label: "Đã tiếp nhận" },
    { value: "2", label: "Đang xử lý" },
    { value: "3", label: "Đã hoàn thành" },
];

export const DATA_REPAIR_VOTES = [
    { value: "0", label: "Chờ xác nhận" },
    { value: "1", label: "Chờ xuất kho" },
    { value: "2", label: "Chờ sửa chữa" },
    { value: "3", label: "Chờ thanh toán" },
    { value: "4", label: "Đã thanh toán" },
];

export const phoneRegExp = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
