import React from "react";
import logo from "./logo.jpg";
import NumberFormat from "react-number-format";
import moment from "moment";

class ReportPDF extends React.Component {
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
                                        Báo cáo thống kê
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="card-body">
                        <div className="table-responsive-sm">
                            <table className="table table-striped">
                                <thead>
                                    <tr className="text-center">
                                        <th>STT</th>
                                        <th>Khách hàng</th>
                                        <th>Tổng tiền</th>
                                        <th>Địa chỉ</th>
                                        <th>NV. Kỹ Thuật</th>
                                        <th>Hãng xe</th>
                                        <th>Loại DV</th>
                                        <th>Danh mục</th>
                                        <th>Nhà cung cấp</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                {data.length > 0 ? (
                                    <tbody>
                                        {data &&
                                            data.map((report, index) => {
                                                return (
                                                    <tr key={index} className="text-center">
                                                        <td scope="row">{report["STT"]}</td>
                                                        <td>{report["Khách hàng"]}</td>

                                                        <td>
                                                            <NumberFormat
                                                                value={report["Tổng tiền"]}
                                                                displayType={"text"}
                                                                thousandSeparator={true}
                                                            />
                                                            ₫
                                                        </td>
                                                        <td>{report["Địa chỉ"]}</td>
                                                        <td>{report["NV. Kỹ Thuật"]}</td>
                                                        <td>{report["Hãng xe"]}</td>
                                                        <td>{report["Loại DV"]}</td>
                                                        <td>{report["Danh mục"]}</td>
                                                        <td>{report["Nhà cung cấp"]}</td>
                                                        <td>{report["Trạng thái"]}</td>
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

export default React.memo(ReportPDF);
