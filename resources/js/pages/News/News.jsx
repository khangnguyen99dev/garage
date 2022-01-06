import React, { useEffect } from "react";
import Page from "@/components/Page";
import PageSpinner from "@/components/PageSpinner";
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import Pagination from "react-js-pagination";
import NewsModal from "./NewsModal";
import { BiEdit, BiTrash } from "react-icons/bi";
import { getPaging, handleShow } from "@/store/actions/NewsAction";
import { handlePageChange } from "@/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
function News() {
    const pathname = useLocation().pathname.split("/").pop().toUpperCase();

    const path =
        pathname.search("-") > 0
            ? "PAGE_CHANGE_" + pathname.replace("-", "_")
            : "PAGE_CHANGE_" + pathname;

    const dispatchs = useDispatch();

    const props = useSelector((state) => state.News);

    useEffect(() => {
        dispatchs(getPaging());
    }, [props.params.page, props.params.total, props.params.search, props.load]);

    return (
        <Page title="Tin tức" breadcrumbs={[{ name: "Tin tức", active: true }]} className="News">
            <NewsModal />
            <Row>
                <Col>
                    <Card className="mb-3">
                        <CardHeader>Tin tức</CardHeader>
                        <CardBody>
                            <Button
                                data-modal="add_new"
                                onClick={(e) => dispatchs(handleShow(e))}
                                className="btn btn-info btn-sm"
                            >
                                Thêm tin tức
                            </Button>
                            {props.isLoading ? (
                                <PageSpinner />
                            ) : (
                                <Table hover responsive className="text-center">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên tin tức</th>
                                            <th>Ảnh</th>
                                            <th>Trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    {props.data.length > 0 ? (
                                        <tbody>
                                            {props.data &&
                                                props.data.map((news, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td scope="row">{index + 1}</td>
                                                            <td>{news.name}</td>
                                                            <td>
                                                                <img
                                                                    src={"../" + news.image}
                                                                    alt={news.name}
                                                                    className="image_show"
                                                                />
                                                            </td>
                                                            <td>
                                                                {news.status == "active" ? (
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
                                                                    data-key={news.id}
                                                                    data-modal="edit_new"
                                                                    onClick={(e) =>
                                                                        dispatchs(handleShow(e))
                                                                    }
                                                                    className="btn btn-warning btn-sm"
                                                                >
                                                                    <BiEdit />
                                                                </Button>{" "}
                                                                &nbsp;
                                                                <Button
                                                                    data-key={news.id}
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

export default News;
