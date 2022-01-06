import React, { useEffect } from "react";
import Page from "@/components/Page";
import PageSpinner from "@/components/PageSpinner";
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import Pagination from "react-js-pagination";
import CustomersModal from "./CustomersModal";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getPaging, handleShow } from "@/store/actions/CustomersAction";
import { handlePageChange } from "@/store/actions";
import NumberFormat from "react-number-format";
import { BsCreditCard } from "react-icons/bs";

function Customers() {
    const pathname = useLocation().pathname.split("/").pop().toUpperCase();

    const path =
        pathname.search("-") > 0
            ? "PAGE_CHANGE_" + pathname.replace("-", "_")
            : "PAGE_CHANGE_" + pathname;

    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Customers);

    useEffect(() => {
        dispatchs(getPaging());
    }, [props.params.page, props.params.total, props.params.search, props.load]);

    return (
        <Page
            title="Khách hàng"
            breadcrumbs={[{ name: "Khách hàng", active: true }]}
            className="customers"
        >
            <CustomersModal />
            <Row>
                <Col>
                    <Card className="mb-3">
                        <CardHeader>Khách hàng</CardHeader>
                        <CardBody>
                            <Button
                                data-modal="add_customer"
                                onClick={(e) => dispatchs(handleShow(e))}
                                className="btn btn-info btn-sm"
                            >
                                Thêm Khách hàng
                            </Button>
                            {props.isLoading ? (
                                <PageSpinner />
                            ) : (
                                <Table hover responsive className="text-center">
                                    <thead>
                                        <tr>
                                            <th>Tên</th>
                                            <th>Điện thoại</th>
                                            <th>Địa chỉ</th>
                                            <th>Loại khách</th>
                                            <th>Còn nợ</th>
                                            <th>Trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    {props.data.length > 0 ? (
                                        <tbody>
                                            {props.data &&
                                                props.data.map((customer, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td scope="row">{customer.name}</td>
                                                            <td>{customer.phone}</td>
                                                            <td>{customer.address}</td>
                                                            <td>{customer.name_cus_type}</td>
                                                            <td>
                                                                {" "}
                                                                <NumberFormat
                                                                    value={customer.owed}
                                                                    displayType={"text"}
                                                                    thousandSeparator={true}
                                                                />
                                                                ₫
                                                            </td>
                                                            <td>
                                                                {customer.status == "active" ? (
                                                                    <Badge color="success">
                                                                        Hoạt động
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge color="warning">
                                                                        Không hoạt động
                                                                    </Badge>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    data-key={customer.id}
                                                                    data-modal="customer_payment"
                                                                    onClick={(e) =>
                                                                        dispatchs(handleShow(e))
                                                                    }
                                                                    className="btn btn-success btn-sm"
                                                                    title="Thanh toán"
                                                                >
                                                                    <BsCreditCard />
                                                                </Button>
                                                                &nbsp;
                                                                <Button
                                                                    data-key={customer.id}
                                                                    data-modal="edit_customer"
                                                                    onClick={(e) =>
                                                                        dispatchs(handleShow(e))
                                                                    }
                                                                    className="btn btn-warning btn-sm"
                                                                >
                                                                    <BiEdit />
                                                                </Button>{" "}
                                                                &nbsp;
                                                                <Button
                                                                    data-key={customer.id}
                                                                    data-modal="delete"
                                                                    onClick={(e) =>
                                                                        dispatchs(handleShow(e))
                                                                    }
                                                                    className="btn btn-danger btn-sm"
                                                                >
                                                                    <BiTrash />
                                                                </Button>
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
                                </Table>
                            )}
                            <div className="mt-3">
                                <Pagination
                                    firstPageText="Trang đầu"
                                    lastPageText="Trang cuối"
                                    innerClass="pagination justify-content-end"
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    activePage={props.params.page}
                                    itemsCountPerPage={props.params.per_page}
                                    totalItemsCount={props.params.total}
                                    onChange={(pageNumber) => {
                                        dispatchs(handlePageChange(pageNumber, path));
                                    }}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Page>
    );
}

export default Customers;
