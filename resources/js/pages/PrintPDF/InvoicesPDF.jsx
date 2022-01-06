import React from "react";
import logo from "./logo.jpg";
import NumberFormat from "react-number-format";
import moment from "moment";

class InvoicesPDF extends React.Component {
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
                                        HÓA ĐƠN THANH TOÁN
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
                                        <td className="center">
                                            Khách hàng : {data.cars.customers.name}
                                        </td>
                                        <td className="center">
                                            Nhân viên lập hóa đơn : {data.users.name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="left strong">
                                            Biển số : {data.cars.number_car}
                                        </td>
                                        <td className="center">
                                            Ngày lập hóa đơn :{" "}
                                            {moment(new Date(data.collect_date)).format(
                                                "h:mmp, DD/MM/YYYY"
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="center">
                                            Điện thoại: {data.cars.customers.phone}
                                        </td>
                                        <td className="left strong">
                                            Ngày sửa chữa :{" "}
                                            {moment(new Date(data.repair_votes.repair_date)).format(
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
                                        <th>Số lượng</th>
                                        <th>Đơn vị</th>
                                        <th>Giá</th>
                                    </tr>
                                </thead>
                                {data.repair_votes.products.length > 0 ? (
                                    <tbody>
                                        {data.repair_votes.products &&
                                            data.repair_votes.products.map((product, index) => {
                                                return (
                                                    <tr key={index} className="text-center">
                                                        <td scope="row">{index + 1}</td>
                                                        <td>{product.name}</td>
                                                        <td>{product.pivot.quantity}</td>
                                                        <td>{product.unit}</td>
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

                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th className="text-center">STT</th>
                                        <th className="text-center">Dịch vụ</th>
                                        <th className="text-center">Giá</th>
                                        <th className="text-center">Ghi chú</th>
                                    </tr>
                                </thead>
                                {data.repair_votes.services.length > 0 ? (
                                    <tbody>
                                        {data.repair_votes.services &&
                                            data.repair_votes.services.map((service, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td scope="row" className="text-center">
                                                            {index + 1}
                                                        </td>
                                                        <td className="text-center">
                                                            {service.name}
                                                        </td>
                                                        <td className="text-center">
                                                            <NumberFormat
                                                                value={service.pivot.price}
                                                                displayType={"text"}
                                                                thousandSeparator={true}
                                                            />
                                                            ₫
                                                        </td>
                                                        <td className="text-center">
                                                            {service.pivot.note}
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
                                                Tổng tiền :{" "}
                                                <NumberFormat
                                                    value={data.repair_votes.total_price}
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
                                            <strong>Giảm: {data.repair_votes.discount} %</strong>
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
                                    <tr>
                                        <td className="center"></td>
                                        <td className="center">
                                            <strong>
                                                Còn nợ:{" "}
                                                <NumberFormat
                                                    value={
                                                        data.repair_votes.total_price -
                                                        data.repair_votes.paymented
                                                    }
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
                                        <td className="text-center"> Khách hàng</td>

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
                                            &nbsp;&nbsp;&emsp;&emsp;Ký và ghi gõ họ tên
                                        </td>
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

export default InvoicesPDF;
