import React from "react";
import logo from "./logo.jpg";
import NumberFormat from "react-number-format";
import moment from "moment";

class ImportVotesPDF extends React.Component {
    render() {
        const { data } = this.props;
        const image = {
            width: "200x",
            height: "200px",
        };

        return (
            <div className="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12 padding">
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <td className="center">
                                            <img src={logo} alt="logo" style={image} />
                                        </td>
                                        <td className="pt-5">
                                            <h1>GARAGE AN KHANG</h1>
                                            <div>
                                                ĐƯỜNG 3/2 - QUẬN NINH KIỀU - THÀNH PHỐ CẦN THƠ
                                            </div>
                                            <div>Điện thoại: 0911904945</div>
                                            <div>Email: kaneshop@gmail.com</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <table className="table table-borderless" style={{ margin: 0, padding: 0 }}>
                        <tbody>
                            <tr>
                                <td className="text-center" style={{ padding: 0 }}>
                                    <p style={{ fontSize: "40px", fontWeight: 500 }}>
                                        PHIẾU NHẬP HÀNG
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="card-body">
                        <div className="row">
                            <table className="table table-borderless">
                                <thead>
                                    <tr>
                                        <th className="center">Thông tin khách hàng</th>
                                        <th className="center">Thông tin sửa chữa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="center">Mã phiếu : {data.import_code}</td>
                                        <td className="center">
                                            Nhân viên lập phiếu : {data.employee}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="left strong">
                                            Nhà cung cấp : {data.name_supplier}
                                        </td>
                                        <td className="center">
                                            Ngày lập phiếu :{" "}
                                            {moment(new Date(data.payment_date)).format(
                                                "h:mmp, DD/MM/YYYY"
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="table-responsive-sm">
                            <table className="table table-striped">
                                <thead>
                                    <tr className="text-center">
                                        <th>STT</th>
                                        <th>Phụ tùng</th>
                                        <th>Số lượng nhập</th>
                                        <th>Đơn vị</th>
                                        <th>Giá nhập</th>
                                        <th>Giá bán</th>
                                    </tr>
                                </thead>
                                {data.products.length > 0 ? (
                                    <tbody>
                                        {data.products &&
                                            data.products.map((product, index) => {
                                                return (
                                                    <tr key={index} className="text-center">
                                                        <td scope="row">{index + 1}</td>
                                                        <td>{product.name}</td>
                                                        <td>{product.pivot.quantity}</td>
                                                        <td>{product.unit}</td>
                                                        <td>
                                                            <NumberFormat
                                                                value={product.pivot.import_price}
                                                                displayType={"text"}
                                                                thousandSeparator={true}
                                                            />
                                                            ₫
                                                        </td>
                                                        <td>
                                                            <NumberFormat
                                                                value={product.pivot.price}
                                                                displayType={"text"}
                                                                thousandSeparator={true}
                                                            />
                                                            ₫
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                ) : (
                                    <tbody>
                                        <tr>
                                            <td colSpan={7}>Không có dữ liệu!</td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                        </div>
                        <div className="row">
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <td>
                                            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                        </td>
                                        <td className="center">
                                            <strong>
                                                Tổng cộng :{" "}
                                                <NumberFormat
                                                    value={data.total_price}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                />
                                                ₫
                                            </strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="center"></td>
                                        <td className="center">
                                            <strong>
                                                Chi trả:{" "}
                                                <NumberFormat
                                                    value={data.money}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                />
                                                ₫
                                            </strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="row">
                            <table
                                className="table table-borderless"
                                style={{ margin: "0 0 100px 0" }}
                            >
                                <tbody>
                                    <tr>
                                        <td className="text-center">
                                            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                        </td>
                                        <td className="text-center">Nhân viên</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="row">
                            <table className="table table-borderless mb-3">
                                <tbody>
                                    <tr>
                                        <td className="text-center">
                                            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                        </td>
                                        <td className="text-center">
                                            &emsp;&emsp;Ký và ghi gõ họ tên
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="card-footer bg-white">
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <td className="text-center">
                                        <strong>Garage An Khang</strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="mb-0"></p>
                        <p className="mb-0"></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default ImportVotesPDF;
