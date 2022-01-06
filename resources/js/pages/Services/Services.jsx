import React, { useEffect } from "react";
import Page from "@/components/Page";
import PageSpinner from "@/components/PageSpinner";
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import Pagination from "react-js-pagination";
import ServicesModal from "./ServicesModal";
import { BiEdit, BiTrash } from "react-icons/bi";
import { getPaging, handleShow } from "@/store/actions/ServicesAction";
import { handlePageChange } from "@/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import NumberFormat from "react-number-format";

function Services() {
    const pathname = useLocation().pathname.split("/").pop().toUpperCase();

    const path =
        pathname.search("-") > 0
            ? "PAGE_CHANGE_" + pathname.replace("-", "_")
            : "PAGE_CHANGE_" + pathname;

    const dispatchs = useDispatch();

    const props = useSelector((state) => state.Services);

    useEffect(() => {
        dispatchs(getPaging());
    }, [props.params.page, props.params.total, props.params.search, props.load]);

    return (
        <Page
            title="Dịch vụ"
            breadcrumbs={[{ name: "Dịch vụ", active: true }]}
            className="Services"
        >
            <ServicesModal />
            <Row>
                <Col>
                    <Card className="mb-3">
                        <CardHeader>Dịch vụ</CardHeader>
                        <CardBody>
                            <Button
                                data-modal="add_service"
                                onClick={(e) => dispatchs(handleShow(e))}
                                className="btn btn-info btn-sm"
                            >
                                Thêm Dịch vụ
                            </Button>
                            {props.isLoading ? (
                                <PageSpinner />
                            ) : (
                                <Table hover responsive className="text-center">
                                    <thead>
                                        <tr>
                                            <th>Dịch vụ</th>
                                            <th>Ảnh</th>
                                            <th>Giá</th>
                                            <th>Loại dịch vụ</th>
                                            <th>Trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    {props.data.length > 0 ? (
                                        <tbody>
                                            {props.data &&
                                                props.data.map((service, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td scope="row">{service.name}</td>
                                                            <td>
                                                                <img
                                                                    src={"../" + service.image}
                                                                    alt={service.name}
                                                                    className="image_show"
                                                                />
                                                            </td>
                                                            <td>
                                                                <NumberFormat
                                                                    value={service.price}
                                                                    displayType={"text"}
                                                                    thousandSeparator={true}
                                                                />
                                                                ₫
                                                            </td>
                                                            <td>{service.name_service_type}</td>
                                                            <td>
                                                                {service.status == "active" ? (
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
                                                                    data-key={service.id}
                                                                    data-modal="edit_service"
                                                                    onClick={(e) =>
                                                                        dispatchs(handleShow(e))
                                                                    }
                                                                    className="btn btn-warning btn-sm"
                                                                >
                                                                    <BiEdit />
                                                                </Button>{" "}
                                                                &nbsp;
                                                                <Button
                                                                    data-key={service.id}
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
                                                <td colSpan={6}>Không có dữ liệu!</td>
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

export default Services;
