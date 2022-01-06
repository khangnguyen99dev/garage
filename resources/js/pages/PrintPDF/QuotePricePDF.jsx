import React from "react";
import logo from "./logo.jpg";
import NumberFormat from "react-number-format";
import moment from "moment";

class QuotePricePDF extends React.Component {
    render() {
        const { data, action } = this.props;
        const image = {
            width: "200x",
            height: "200px",
        };

        const sum = (services, products) => {
            let totalService = 0;
            let totalProduct = 0;
            if (services.length > 0) {
                totalService = services.reduce(
                    (n, { pivot }) => parseInt(n) + parseInt(pivot.price),
                    0
                );
            }
            if (products.length > 0) {
                totalProduct = products.reduce(
                    (n, { pivot }) =>
                        parseInt(n) + parseInt(pivot.price) * parseInt(pivot.quantity),
                    0
                );
            }

            return totalService + totalProduct;
        };

        const renderServices = (action, data) => {
            if (action == "print_quote_price" || action == "print_repair_order") {
                return (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">STT</th>
                                <th className="text-center">Dịch vụ</th>
                                {action == "print_quote_price" && (
                                    <th className="text-center">Giá</th>
                                )}
                                <th className="text-center">Ghi chú</th>
                            </tr>
                        </thead>
                        {data.length > 0 ? (
                            <tbody>
                                {data &&
                                    data.map((service, index) => {
                                        return (
                                            <tr key={index}>
                                                <td scope="row" className="text-center">
                                                    {index + 1}
                                                </td>
                                                <td className="text-center">{service.name}</td>
                                                {action == "print_quote_price" && (
                                                    <td className="text-center">
                                                        <NumberFormat
                                                            value={service.pivot.price}
                                                            displayType={"text"}
                                                            thousandSeparator={true}
                                                        />
                                                        ₫
                                                    </td>
                                                )}
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
                );
            } else {
                return <div></div>;
            }
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
                                        {action == "print_quote_price"
                                            ? "BÁO GIÁ SỬA CHỮA"
                                            : action == "print_export_vote"
                                            ? "PHIẾU XUẤT KHO"
                                            : "LỆNH SỬA CHỮA"}
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
                                            Họ tên : {data.cars.customers.name}
                                        </td>
                                        <td className="center">Biển số : {data.number_car_id}</td>
                                    </tr>
                                    <tr>
                                        <td className="left strong">
                                            Địa chỉ : {data.cars.customers.address}
                                        </td>
                                        <td className="center">
                                            Ngày sửa chữa :{" "}
                                            {moment(new Date(data.repair_date)).format(
                                                "h:mmp, DD/MM/YYYY"
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="center">
                                            Điện thoại : {data.cars.customers.phone}
                                        </td>
                                        <td className="center">
                                            Nhân viên kỹ thuật : {data.users.name}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="table-responsive-sm">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th className="text-center">STT</th>
                                        <th className="text-center">Phụ tùng</th>
                                        <th className="text-center">Số lượng</th>
                                        <th className="text-center">Đơn vị</th>

                                        {action == "print_quote_price" && (
                                            <th className="text-center">Giá</th>
                                        )}
                                        {action == "print_quote_price" && (
                                            <th className="text-center">Thành tiền</th>
                                        )}
                                    </tr>
                                </thead>
                                {data.products.length > 0 ? (
                                    <tbody>
                                        {data.products &&
                                            data.products.map((product, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td scope="row" className="text-center">
                                                            {index + 1}
                                                        </td>
                                                        <td className="text-center">
                                                            {product.name}
                                                        </td>
                                                        <td className="text-center">
                                                            {product.pivot.quantity}
                                                        </td>
                                                        <td className="text-center">
                                                            {product.unit}
                                                        </td>

                                                        {action == "print_quote_price" && (
                                                            <td className="text-center">
                                                                <NumberFormat
                                                                    value={product.pivot.price}
                                                                    displayType={"text"}
                                                                    thousandSeparator={true}
                                                                />
                                                                ₫
                                                            </td>
                                                        )}
                                                        {action == "print_quote_price" && (
                                                            <td className="text-center">
                                                                <NumberFormat
                                                                    value={
                                                                        parseInt(
                                                                            product.pivot.price
                                                                        ) *
                                                                        parseInt(
                                                                            product.pivot.quantity
                                                                        )
                                                                    }
                                                                    displayType={"text"}
                                                                    thousandSeparator={true}
                                                                />
                                                                ₫
                                                            </td>
                                                        )}
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
                        <div className="table-responsive-sm">
                            {renderServices(action, data.services)}
                        </div>
                        <div className="row">
                            {action == "print_quote_price" && (
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
                                                        value={sum(data.services, data.products)}
                                                        displayType={"text"}
                                                        thousandSeparator={true}
                                                    />
                                                    ₫
                                                </strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="left strong"></td>
                                            <td className="center">
                                                <strong>Giảm : {data.discount}%</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="center"></td>
                                            <td className="center">
                                                <strong>
                                                    Thành tiền:{" "}
                                                    <NumberFormat
                                                        value={data.total_price}
                                                        displayType={"text"}
                                                        thousandSeparator={true}
                                                    />
                                                    ₫
                                                </strong>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <div className="row">
                            <table
                                className="table table-borderless"
                                style={{ margin: "0 0 100px 0" }}
                            >
                                <tbody>
                                    <tr>
                                        {action == "print_quote_price" && (
                                            <td className="text-center"> Khách hàng</td>
                                        )}
                                        {action == "print_repair_order" && (
                                            <td className="text-center">
                                                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                            </td>
                                        )}
                                        {action == "print_export_vote" && (
                                            <td className="text-center">
                                                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                            </td>
                                        )}
                                        <td className="text-center">Nhân viên</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="row">
                            <table className="table table-borderless mb-3">
                                <tbody>
                                    <tr>
                                        {action == "print_quote_price" && (
                                            <td className="text-center">
                                                &nbsp;&nbsp;&emsp;&emsp;Ký và ghi gõ họ tên
                                            </td>
                                        )}
                                        {action == "print_repair_order" && (
                                            <td className="text-center">
                                                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                            </td>
                                        )}
                                        {action == "print_export_vote" && (
                                            <td className="text-center">
                                                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                            </td>
                                        )}
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
                                        <strong>
                                            {action == "print_quote_price"
                                                ? "Garage An Khang hân hạnh phục vụ quý khách!"
                                                : "Garage An Khang"}
                                        </strong>
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

export default QuotePricePDF;
