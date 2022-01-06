import React, { useEffect } from "react";
import Page from "@/components/Page";
import PageSpinner from "@/components/PageSpinner";
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import Pagination from "react-js-pagination";
import ProductsModal from "./ProductsModal";
import { BiEdit, BiTrash } from "react-icons/bi";
import { getPaging, handleShow } from "@/store/actions/ProductsAction";
import { handlePageChange } from "@/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import NumberFormat from "react-number-format";

function Products() {
    const pathname = useLocation().pathname.split("/").pop().toUpperCase();

    const path =
        pathname.search("-") > 0
            ? "PAGE_CHANGE_" + pathname.replace("-", "_")
            : "PAGE_CHANGE_" + pathname;

    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Products);

    useEffect(() => {
        dispatchs(getPaging());
    }, [props.params.page, props.params.total, props.params.search, props.load]);

    return (
        <Page
            title="Phụ tùng"
            breadcrumbs={[{ name: "Phụ tùng", active: true }]}
            className="Products"
        >
            <ProductsModal />
            <Row>
                <Col>
                    <Card className="mb-3">
                        <CardHeader>Phụ tùng</CardHeader>
                        <CardBody>
                            {/* <Button
                                data-modal="add_product"
                                onClick={(e) => dispatchs(handleShow(e))}
                                className="btn btn-info btn-sm"
                            >
                                Thêm phụ tùng
                            </Button> */}
                            {props.isLoading ? (
                                <PageSpinner />
                            ) : (
                                <Table hover responsive className="text-center">
                                    <thead>
                                        <tr>
                                            <th>Tên</th>
                                            <th>Ảnh</th>
                                            <th>Số lượng</th>
                                            <th>Giá</th>
                                            <th>Loại</th>
                                            <th>Trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    {props.data.length > 0 ? (
                                        <tbody>
                                            {props.data &&
                                                props.data.map((product, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td style={{ maxWidth: 200 }}>
                                                                {product.name}
                                                            </td>
                                                            <td>
                                                                <img
                                                                    src={"../" + product.image}
                                                                    alt={product.name}
                                                                    className="image_show"
                                                                />
                                                            </td>
                                                            <td>{product.quantity}</td>
                                                            <td>
                                                                <NumberFormat
                                                                    value={product.price}
                                                                    displayType={"text"}
                                                                    thousandSeparator={true}
                                                                />
                                                                ₫
                                                            </td>
                                                            <td>{product.name_product_type}</td>
                                                            <td>
                                                                {product.status == "active" ? (
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
                                                                    data-key={product.id}
                                                                    data-modal="edit_product"
                                                                    onClick={(e) =>
                                                                        dispatchs(handleShow(e))
                                                                    }
                                                                    className="btn btn-warning btn-sm"
                                                                >
                                                                    <BiEdit />
                                                                </Button>{" "}
                                                                &nbsp;
                                                                <Button
                                                                    data-key={product.id}
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

export default Products;
