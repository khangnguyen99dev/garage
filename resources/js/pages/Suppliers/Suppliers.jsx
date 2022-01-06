import React, { useEffect } from "react";
import Page from "@/components/Page";
import PageSpinner from "@/components/PageSpinner";
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import Pagination from "react-js-pagination";
import SuppliersModal from "./SuppliersModal";
import { BiEdit, BiTrash } from "react-icons/bi";
import { getPaging, handleShow } from "@/store/actions/SuppliersAction";
import { handlePageChange } from "@/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import NumberFormat from "react-number-format";
import { BsCreditCard } from "react-icons/bs";

function Suppliers() {
    const pathname = useLocation().pathname.split("/").pop().toUpperCase();

    const path =
        pathname.search("-") > 0
            ? "PAGE_CHANGE_" + pathname.replace("-", "_")
            : "PAGE_CHANGE_" + pathname;

    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Suppliers);

    useEffect(() => {
        dispatchs(getPaging());
    }, [props.params.page, props.params.total, props.params.search, props.load]);

    return (
        <Page
            title="Nhà cung cấp"
            breadcrumbs={[{ name: "Nhà cung cấp", active: true }]}
            className="suppliers"
        >
            <SuppliersModal />
            <Row>
                <Col>
                    <Card className="mb-3">
                        <CardHeader>Nhà cung cấp</CardHeader>
                        <CardBody>
                            <Button
                                data-modal="add_supplier"
                                onClick={(e) => dispatchs(handleShow(e))}
                                className="btn btn-info btn-sm"
                            >
                                Thêm nhà cung cấp
                            </Button>
                            {props.isLoading ? (
                                <PageSpinner />
                            ) : (
                                <Table hover responsive className="text-center">
                                    <thead>
                                        <tr>
                                            <th>Tên công ty</th>
                                            <th>Điện thoại</th>
                                            <th>Địa chỉ</th>
                                            <th>Người đại diện</th>
                                            <th>Nợ đầu</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    {props.data.length > 0 ? (
                                        <tbody>
                                            {props.data &&
                                                props.data.map((supplier, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td scope="row">{supplier.name}</td>
                                                            <td>{supplier.phone}</td>
                                                            <td>{supplier.address}</td>
                                                            <td>{supplier.name_represent}</td>
                                                            <td>
                                                                <NumberFormat
                                                                    value={supplier.first_debt}
                                                                    displayType={"text"}
                                                                    thousandSeparator={true}
                                                                />
                                                                ₫
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    data-key={supplier.id}
                                                                    data-modal="show_supplier_payment"
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
                                                                    data-key={supplier.id}
                                                                    data-modal="edit_supplier"
                                                                    onClick={(e) =>
                                                                        dispatchs(handleShow(e))
                                                                    }
                                                                    className="btn btn-warning btn-sm"
                                                                >
                                                                    <BiEdit />
                                                                </Button>{" "}
                                                                &nbsp;
                                                                <Button
                                                                    data-key={supplier.id}
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
                                                <td colSpan={5}>Không có dữ liệu!</td>
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

export default Suppliers;
